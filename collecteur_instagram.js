/*  ═══════════════════════════════════════════════════════════
    UCI WorldTour Social Dashboard — Collecteur Instagram
    ═══════════════════════════════════════════════════════════
    
    MODE D'EMPLOI :
    1. Ouvrez https://www.instagram.com dans Chrome
    2. Appuyez sur Ctrl+Shift+J (ou Cmd+Option+J sur Mac)
    3. Collez ce script entier dans la console
    4. Appuyez sur Entrée
    5. Attendez ~2-3 minutes (progression affichée)
    6. Un fichier uci_instagram_AAAA-MM.json se télécharge automatiquement
    7. Ouvrez le dashboard HTML et importez ce fichier
    
    ═══════════════════════════════════════════════════════════ */

(async function() {
  const IG_APP_ID = "936619743392459";
  const DELAY = 350; // ms entre chaque requête

  // Tous les comptes Instagram à collecter
  const accounts = [
    // ─── EQUIPES HOMMES ───
    {cat:"team_men",name:"Ineos Grenadiers",ig:"ineosgrenadiers"},
    {cat:"team_men",name:"Team Visma-Lease a Bike",ig:"teamvisma_leaseabike"},
    {cat:"team_men",name:"UAE Emirates XRG",ig:"uae_team_emirates"},
    {cat:"team_men",name:"Movistar",ig:"movistarteam"},
    {cat:"team_men",name:"Lidl-Trek",ig:"lidl_trek"},
    {cat:"team_men",name:"Soudal Quick-Step",ig:"soudalquickstepteam"},
    {cat:"team_men",name:"Red Bull-Bora-Hansgrohe",ig:"redbullborahansgrohe"},
    {cat:"team_men",name:"EF Education-Easy Post",ig:"efprocycling"},
    {cat:"team_men",name:"Alpecin-Premier Tech",ig:"alpecin.premiertech"},
    {cat:"team_men",name:"Decathlon CMA CGM",ig:"decathloncmacgmteam"},
    {cat:"team_men",name:"Groupama-FDJ United",ig:"groupamafdj"},
    {cat:"team_men",name:"Bahrain Victorious",ig:"teambahrainvictorious"},
    {cat:"team_men",name:"Lotto Intermarché",ig:"lotto.cyclingteam"},
    {cat:"team_men",name:"Team Jayco AlUla",ig:"greenedgecycling"},
    {cat:"team_men",name:"Uno-X Mobility",ig:"unoxteam"},
    {cat:"team_men",name:"NSN",ig:"nsncyclingteam"},
    {cat:"team_men",name:"Team Picnic PostNL",ig:"teampicnicpostnl"},
    {cat:"team_men",name:"XDS-Astana",ig:"xds_astana_team"},
    // ─── EQUIPES FEMMES ───
    {cat:"team_women",name:"Team SD Worx-Protime",ig:"teamsdworxprotime"},
    {cat:"team_women",name:"Canyon//SRAM zondacrypto",ig:"wmncycling"},
    {cat:"team_women",name:"Lidl-Trek (W)",ig:"lidl_trek_women"},
    {cat:"team_women",name:"Team Visma | Lease a Bike (W)",ig:"teamvisma_leaseabike_women"},
    {cat:"team_women",name:"Movistar Team (W)",ig:"movistarteamwomen"},
    {cat:"team_women",name:"FDJ United-Suez",ig:"fdj.suez"},
    {cat:"team_women",name:"AG Insurance-Soudal Team",ig:"aginsurancesoudal"},
    {cat:"team_women",name:"UAE Team ADQ",ig:"uaeteamadq"},
    {cat:"team_women",name:"EF Education-Oatly",ig:"efeducationoatly"},
    {cat:"team_women",name:"Human Powered Health",ig:"hphcycling"},
    {cat:"team_women",name:"Fenix-Premier Tech (W)",ig:"fenix.premiertech"},
    // ─── COURSES HOMMES ───
    {cat:"race_men",name:"Tour de France",ig:"letourdefrance"},
    {cat:"race_men",name:"Giro d'Italia",ig:"giroditalia"},
    {cat:"race_men",name:"La Vuelta",ig:"lavuelta"},
    {cat:"race_men",name:"Paris-Roubaix",ig:"parisroubaixcourse"},
    {cat:"race_men",name:"Ronde van Vlaanderen",ig:"rondevanvlaanderen"},
    {cat:"race_men",name:"Milano-Sanremo",ig:"milanosanremo_"},
    {cat:"race_men",name:"Classiques Ardennaises",ig:"classiquesardennes"},
    {cat:"race_men",name:"Il Lombardia",ig:"ilombardia"},
    {cat:"race_men",name:"Strade Bianche",ig:"strade_bianche"},
    {cat:"race_men",name:"Paris-Nice",ig:"parisnicecourse"},
    {cat:"race_men",name:"Tirreno-Adriatico",ig:"tirreno_adriatico"},
    {cat:"race_men",name:"Volta a Catalunya",ig:"voltacatalunya"},
    {cat:"race_men",name:"Itzulia",ig:"ehitzulia"},
    {cat:"race_men",name:"Tour de Romandie",ig:"tourderomandie"},
    {cat:"race_men",name:"Tour Auvergne-Rhône-Alpes",ig:"criteriumdudauphine"},
    {cat:"race_men",name:"Tour de Suisse",ig:"tourdesuisse_official"},
    {cat:"race_men",name:"Tour de Pologne",ig:"tourdepologne"},
    {cat:"race_men",name:"Renewi Tour",ig:"renewitour"},
    {cat:"race_men",name:"Santos Tour Down Under",ig:"tourdownunder"},
    {cat:"race_men",name:"UAE Tour",ig:"theuaetourofficial"},
    {cat:"race_men",name:"Tour of Guangxi",ig:"tourofguangxi"},
    {cat:"race_men",name:"Amstel Gold Race",ig:"amstelgoldrace"},
    {cat:"race_men",name:"Eschborn-Frankfurt",ig:"eschbornfrankfurt"},
    {cat:"race_men",name:"Tour of Bruges",ig:"bruggedepanne"},
    {cat:"race_men",name:"E3 Saxo Classic",ig:"e3_saxoclassic"},
    {cat:"race_men",name:"In Flanders Fields",ig:"inflandersfieldsrace"},
    {cat:"race_men",name:"Dwars door Vlaanderen",ig:"dwarsdoorvlaanderenofficial"},
    {cat:"race_men",name:"Omloop Nieuwsblad",ig:"omloophetnieuwsbladofficial"},
    {cat:"race_men",name:"Copenhagen Sprint",ig:"cphsprint"},
    {cat:"race_men",name:"Clásica San Sebastián",ig:"dklasikoa"},
    {cat:"race_men",name:"Bretagne Classic",ig:"grandprixplouay"},
    {cat:"race_men",name:"GP Cycliste Québec/Montréal",ig:"grandsprixcyclistes"},
    {cat:"race_men",name:"Cadel Evans Road Race",ig:"cadelroadrace"},
    {cat:"race_men",name:"ADAC Cyclassics",ig:"cyclassics"},
    // ─── COURSES FEMMES ───
    {cat:"race_women",name:"Tour de France Femmes",ig:"letourfemmes"},
    {cat:"race_women",name:"Giro d'Italia Women",ig:"giroditaliawomen"},
    {cat:"race_women",name:"Vuelta España Femenina",ig:"lavueltafem"},
    {cat:"race_women",name:"Paris-Roubaix Femmes",ig:"parisroubaix_femmes"},
    {cat:"race_women",name:"Tour of Britain Women",ig:"tourofbritain"},
    {cat:"race_women",name:"Vuelta a Burgos Feminas",ig:"vueltaburgos"},
    {cat:"race_women",name:"Tour of Chongming Island",ig:"tourofchongming"},
    {cat:"race_women",name:"Trofeo Alfredo Binda",ig:"trofeobinda"},
  ];

  // Dédupliquer les usernames (certaines courses partagent des comptes)
  const uniqueUsernames = [...new Set(accounts.map(a => a.ig))];
  
  console.log(`%c🚴 UCI Dashboard — Collecte Instagram démarrée`, "color:#6366f1;font-size:14px;font-weight:bold");
  console.log(`%c${uniqueUsernames.length} comptes uniques à collecter (${accounts.length} entités)`, "color:#64748b");

  const cache = {};
  let ok = 0, fail = 0;

  for (let i = 0; i < uniqueUsernames.length; i++) {
    const username = uniqueUsernames[i];
    const pct = Math.round((i / uniqueUsernames.length) * 100);
    console.log(`%c[${pct}%] @${username} (${i+1}/${uniqueUsernames.length})`, "color:#94a3b8");

    try {
      const resp = await fetch(
        `https://i.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
        { headers: { "x-ig-app-id": IG_APP_ID } }
      );
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      const count = data?.data?.user?.edge_followed_by?.count;
      if (count != null) {
        cache[username] = count;
        ok++;
        console.log(`  ✅ ${count.toLocaleString("fr-FR")} followers`);
      } else {
        cache[username] = null;
        fail++;
        console.log(`  ⚠️ Pas de données`);
      }
    } catch (e) {
      cache[username] = null;
      fail++;
      console.log(`  ❌ Erreur: ${e.message}`);
    }

    await new Promise(r => setTimeout(r, DELAY));
  }

  // Construire le résultat final
  const now = new Date();
  const monthKey = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][now.getMonth()];
  const dateStr = now.toISOString().split("T")[0];

  const result = {
    collected_at: now.toISOString(),
    month: monthKey,
    date: dateStr,
    stats: { total_accounts: uniqueUsernames.length, success: ok, failed: fail },
    data: {}
  };

  for (const a of accounts) {
    const key = a.name + "|" + a.cat;
    result.data[key] = {
      name: a.name,
      cat: a.cat,
      ig_username: a.ig,
      ig_followers: cache[a.ig] ?? null
    };
  }

  // Télécharger le JSON
  const filename = `uci_instagram_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}.json`;
  const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);

  console.log(`%c\n🏁 Collecte terminée !`, "color:#22c55e;font-size:14px;font-weight:bold");
  console.log(`%c✅ ${ok} réussis | ❌ ${fail} échoués`, "color:#22c55e;font-size:12px");
  console.log(`%c📁 Fichier téléchargé : ${filename}`, "color:#6366f1;font-size:12px");
  console.log(`%cOuvrez le dashboard HTML et importez ce fichier.`, "color:#64748b");
})();
