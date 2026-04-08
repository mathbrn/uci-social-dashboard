#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
UCI Dashboard — Tracker Server
================================
Petit serveur HTTP local qui permet au dashboard UCI (hébergé sur
GitHub Pages) de déclencher à distance l'exécution d'instagram_tracker.py.

Architecture :
    [Dashboard GitHub Pages]
        │ fetch POST
        ▼
    [tracker_server.py sur localhost:8765]  ← VOUS ÊTES ICI
        │ subprocess / import
        ▼
    [instagram_tracker.py]
        │
        ▼
    [Gist public GitHub]

Endpoints :
    GET  /status                → {"status":"ok","version":"..."}
    POST /scrape/instagram      → {"job_id":"..."}
    GET  /jobs/{job_id}         → {"logs":[...],"done":bool,"result":{...}}
    OPTIONS *                   → préflight CORS

Usage :
    python tracker_server.py
    (laisse tourner en arrière-plan)

Le serveur autorise uniquement les requêtes venant de :
  - https://mathbrn.github.io  (dashboard en production)
  - http://localhost:*          (développement local)

Configuration (variables d'environnement) :
    UCI_GIST_ID    — ID du Gist public du dashboard
    UCI_GIST_TOKEN — PAT GitHub avec scope `gist`
    UCI_PORT       — port d'écoute (défaut : 8765)

Ces variables seront transmises au tracker lors de son exécution.
"""

import json
import os
import subprocess
import sys
import threading
import time
import uuid
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

SCRIPT_DIR = Path(__file__).resolve().parent
TRACKER_PATH = SCRIPT_DIR / "instagram_tracker.py"
PORT = int(os.environ.get("UCI_PORT", "8765"))
VERSION = "1.0.0"

ALLOWED_ORIGINS = {
    "https://mathbrn.github.io",
    "http://localhost",
    "http://127.0.0.1",
    "null",  # file:// pour tests locaux
}

# Dict global des jobs en cours / terminés
# { job_id: {"logs": [...], "done": bool, "ok": bool|None, "started_at": str, "ended_at": str|None} }
JOBS = {}
JOBS_LOCK = threading.Lock()

# Nombre max de jobs conservés en mémoire
MAX_JOBS = 20


# ═══════════════════════════════════════════════════════════════════
# Exécution du tracker en arrière-plan
# ═══════════════════════════════════════════════════════════════════

def run_tracker_job(job_id):
    """
    Lance instagram_tracker.py en sous-processus et capture stdout
    ligne par ligne dans JOBS[job_id]["logs"].
    """
    cmd = [sys.executable, "-u", str(TRACKER_PATH)]
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONUNBUFFERED"] = "1"

    try:
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            cwd=str(SCRIPT_DIR),
            env=env,
            text=True,
            bufsize=1,
            encoding="utf-8",
            errors="replace",
        )
    except Exception as e:
        with JOBS_LOCK:
            JOBS[job_id]["logs"].append(f"❌ Échec du lancement : {e}")
            JOBS[job_id]["done"] = True
            JOBS[job_id]["ok"] = False
            JOBS[job_id]["ended_at"] = datetime.now().isoformat()
        return

    for line in proc.stdout:
        line = line.rstrip("\n")
        if line:
            with JOBS_LOCK:
                JOBS[job_id]["logs"].append(line)

    proc.wait()
    with JOBS_LOCK:
        JOBS[job_id]["done"] = True
        JOBS[job_id]["ok"] = proc.returncode == 0
        JOBS[job_id]["ended_at"] = datetime.now().isoformat()


def cleanup_old_jobs():
    """Supprime les anciens jobs pour éviter de saturer la mémoire."""
    with JOBS_LOCK:
        if len(JOBS) <= MAX_JOBS:
            return
        # Trier par started_at, garder les MAX_JOBS plus récents
        sorted_ids = sorted(JOBS.keys(), key=lambda k: JOBS[k]["started_at"])
        for jid in sorted_ids[:-MAX_JOBS]:
            del JOBS[jid]


# ═══════════════════════════════════════════════════════════════════
# HTTP Handler
# ═══════════════════════════════════════════════════════════════════

class TrackerHandler(BaseHTTPRequestHandler):
    # Supprime les logs par défaut du http.server (trop verbeux)
    def log_message(self, format, *args):
        sys.stdout.write(f"[{datetime.now().strftime('%H:%M:%S')}] {format % args}\n")

    def _cors_headers(self):
        origin = self.headers.get("Origin", "")
        # Autorise les origines connues
        allowed = False
        for allowed_origin in ALLOWED_ORIGINS:
            if origin == allowed_origin or origin.startswith(allowed_origin + ":"):
                allowed = True
                break
        self.send_header("Access-Control-Allow-Origin", origin if allowed else "https://mathbrn.github.io")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")

    def _send_json(self, obj, status=200):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self._cors_headers()
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/" or path == "/status":
            self._send_json({
                "status": "ok",
                "version": VERSION,
                "tracker_found": TRACKER_PATH.exists(),
                "gist_configured": bool(os.environ.get("UCI_GIST_ID") and os.environ.get("UCI_GIST_TOKEN")),
                "jobs_in_memory": len(JOBS),
            })
            return

        if path.startswith("/jobs/"):
            job_id = path.split("/", 2)[2]
            with JOBS_LOCK:
                job = JOBS.get(job_id)
                if not job:
                    self._send_json({"error": "Job introuvable"}, status=404)
                    return
                # Copie pour éviter les races
                resp = {
                    "logs": list(job["logs"]),
                    "done": job["done"],
                    "ok": job["ok"],
                    "started_at": job["started_at"],
                    "ended_at": job["ended_at"],
                }
            self._send_json(resp)
            return

        self._send_json({"error": "Not found"}, status=404)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/scrape/instagram":
            if not TRACKER_PATH.exists():
                self._send_json(
                    {"error": f"instagram_tracker.py introuvable dans {SCRIPT_DIR}"},
                    status=500,
                )
                return

            # Créer un nouveau job
            job_id = uuid.uuid4().hex[:12]
            with JOBS_LOCK:
                JOBS[job_id] = {
                    "logs": [f"🚀 Job {job_id} lancé à {datetime.now().strftime('%H:%M:%S')}"],
                    "done": False,
                    "ok": None,
                    "started_at": datetime.now().isoformat(),
                    "ended_at": None,
                }

            threading.Thread(target=run_tracker_job, args=(job_id,), daemon=True).start()
            cleanup_old_jobs()
            self._send_json({"job_id": job_id, "status": "started"})
            return

        self._send_json({"error": "Not found"}, status=404)


# ═══════════════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════════════

def main():
    print("=" * 60)
    print(f"🚴  UCI Tracker Server v{VERSION}")
    print("=" * 60)
    print(f"📂 Répertoire            : {SCRIPT_DIR}")
    print(f"🐍 Tracker Python        : {TRACKER_PATH.name} ({'✅' if TRACKER_PATH.exists() else '❌ MANQUANT'})")
    print(f"🌐 URL locale            : http://127.0.0.1:{PORT}")
    print(f"📡 Endpoints             : GET /status  ·  POST /scrape/instagram  ·  GET /jobs/<id>")
    gist_id = os.environ.get("UCI_GIST_ID", "")
    gist_token = bool(os.environ.get("UCI_GIST_TOKEN", ""))
    print(f"☁️  Gist ID               : {gist_id or '(non défini)'}")
    print(f"🔑 PAT GitHub            : {'défini ✅' if gist_token else '(non défini)'}")
    print("=" * 60)
    print("✨ Serveur prêt. Ouvrez le dashboard et cliquez sur Instagram.")
    print("   (Ctrl+C pour arrêter.)")
    print()

    try:
        httpd = ThreadingHTTPServer(("127.0.0.1", PORT), TrackerHandler)
    except OSError as e:
        print(f"❌ Impossible d'écouter sur 127.0.0.1:{PORT} — {e}")
        print("   Un autre serveur utilise peut-être ce port. Changez-le via UCI_PORT=xxxx.")
        sys.exit(1)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n⏹  Arrêt demandé.")
        httpd.shutdown()


if __name__ == "__main__":
    main()
