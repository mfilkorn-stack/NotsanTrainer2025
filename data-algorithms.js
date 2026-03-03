// ═══════════════════════════════════════════════════════
// ALGORITHMEN-TRAINER DATA (34 BPR-Algorithmen)
// ═══════════════════════════════════════════════════════
var ALGORITHM_DATA = [
// ── LEITSYMPTOME ──
{id:"ls_dyspnoe",name:"Dyspnoe",kat:"Leitsymptome",
steps:["Basismaßnahmen","Bedarfsgerechte Sauerstoffgabe","Prüfe: Unzureichende Spontanatmung → Atemwegsmanagement","Prüfe: Inspiratorischer Stridor / Aspiration / Atemwegsverlegung","Prüfe: V.a. Spannungspneumothorax → Thoraxentlastungspunktion","Differentialdiagnosen bedenken und passenden BPR wählen","Ggf. hochdosierte O₂-Gabe / CPAP / NIV je nach DD","Transport"],
decisions:[
{q:"Arterieller Verschluss bestätigt. Medikament?",opts:["ASS 250 mg","Heparin 5.000 I.E. i.v."],correct:1,feedback:"BPR: Heparin 5.000 IE i.v."},
{q:"6-P-Regel kennen?",opts:["Pain, Pallor, Pulselessness, Paralysis, Paresthesia, Prostration","ABCDE"],correct:0,feedback:"6P: Schmerz, Blässe, Pulslosigkeit, Lähmung, Parästhesien, Erschöpfung."},
{q:"Lagerung?",opts:["Bein hochlagern","Tief lagern!"],correct:1,feedback:"Arteriell: Tieflagerung! Hochlagerung nur bei venöser Thrombose."},
{q:"Akute Ischämie seit 4h. Dringlichkeit?",opts:["Termin nächste Woche","Sofort – Revaskularisation innerhalb 6h!"],correct:1,feedback:"Zeitfenster ca. 6h! Sofort Gefäßchirurgie."}
],
gaps:[
{text:"V.a. Spannungspneumothorax → sofortige ___",answer:"Thoraxentlastungspunktion"},
{text:"V.a. COPD: Hyperkapnie führend → ___ O₂-Gabe, SpO₂ ___",answer:"angepasste;88-92%"},
{text:"V.a. Lungenödem: grobblasige RG → hochdosierte O₂-Gabe + ___",answer:"CPAP"}
]},
{id:"ls_blutung",name:"Kritische Blutung",kat:"Leitsymptome",
steps:["Basismaßnahmen (<c>ABCDE)","Manuelle Kompression","Extremitäten: Hochlagerung → Kompressionsverband → Tourniquet","Körperstamm: Hämostyptikum + Packing → Kompressionsverband","Achsengerechte Lagerung/Immobilisation","Ggf. Beckenschlinge","Hypothermieprophylaxe","i.v.-/i.o.-Zugang + bedarfsgerechte VEL","Ggf. permissive Hypotonie bei inneren Blutungen","Tranexamsäure","Ggf. Schmerztherapie","Load-go-treat prüfen"],
decisions:[
{q:"Wo befindet sich die Blutungsquelle?",opts:["Körperstamm → Hämostyptikum + Packing","Extremität → Kompressionsverband/Tourniquet"],correct:1,feedback:"Extremitäten: Hochlagerung → Kompressionsverband → Tourniquet!"},
{q:"Blutung nicht stillbar (intraabdominal). Wie mit RR umgehen?",opts:["Normotonie erzwingen","Permissive Hypotonie akzeptieren"],correct:1,feedback:"BPR: Permissive Hypotonie bei nicht stillbaren Blutungen akzeptabel."},
{q:"Tranexamsäure-Dosierung?",opts:["15 mg/kgKG i.v. (Kurzinfusion 15 min), max. 1000 mg","1 g Bolus, Repetition 1 g"],correct:0,feedback:"SAA: 15 mg/kgKG, max. 1000 mg, Kurzinfusion 15 min. Keine Repetition!"}
],
gaps:[
{text:"Extremitäten-Blutung: Hochlagerung → ___ → Tourniquet",answer:"Kompressionsverband"},
{text:"Tranexamsäure: ___ mg/kgKG i.v., max. ___ mg, keine ___",answer:"15;1000;Repetition"},
{text:"Immer: ___prophylaxe!",answer:"Hypothermie"}
]},
{id:"ls_bewusstlosigkeit",name:"Kurzzeitige Bewusstlosigkeit",kat:"Leitsymptome",
steps:["Basismaßnahmen","Anamnese: Situation, Prodromi, Dauer, Erholung","12-Kanal-EKG","i.v.-Zugang","BZ-Messung","Erweiterte spezifische Anamnese","DD: Synkope, Krampfanfall, Hypoglykämie, Intoxikation","Transport"],
decisions:[
{q:"Patient war kurz bewusstlos, jetzt wach. Prioritäre Untersuchung?",opts:["CT-Anmeldung","12-Kanal-EKG + BZ-Messung"],correct:1,feedback:"BPR: 12-Kanal-EKG + BZ-Messung sind prioritär."},
{q:"BZ 42 mg/dl. Was ist die wahrscheinlichste Ursache?",opts:["Epilepsie","Hypoglykämie → Glucose i.v.!"],correct:1,feedback:"Hypoglykämie häufige Ursache! BZ < 60 mg/dl → Glucose 40% i.v."},
{q:"Patient hatte Zungenbiss und Einnässen. V.a.?",opts:["Vasovagale Synkope","Krampfanfall"],correct:1,feedback:"Zungenbiss (lateral) + Einnässen = typische Hinweise auf Krampfanfall."},
{q:"EKG zeigt AV-Block III°. Zusammenhang?",opts:["Kein Zusammenhang","Kardiale Synkope durch Bradykardie!"],correct:1,feedback:"AV-Block III° → bradykardiebedingte Synkope = Notfall! BPR Bradykardie."}
],
gaps:[
{text:"DD kurzzeitige Bewusstlosigkeit: Synkope, ___, Hypoglykämie, ___",answer:"Krampfanfall;Intoxikation"},
{text:"Unbedingt: 12-Kanal-___ und ___-Messung",answer:"EKG;BZ"}
]},
{id:"ls_brustschmerz",name:"Nichttraumatischer Brustschmerz",kat:"Leitsymptome",
steps:["Basismaßnahmen","12-Kanal-EKG (+ ggf. erweiterte Ableitungen)","i.v.-Zugang","Bedarfsgerechte Sauerstoffgabe","Erweiterte spezifische Anamnese","DD: ACS, Aortensyndrom, LAE, Pneumothorax, Ösophagusruptur","Passenden BPR anwenden","Transport"],
decisions:[
{q:"ST-Hebungen in II, III, aVF. V.a.?",opts:["STEMI → BPR ACS","LAE → BPR LAE"],correct:0,feedback:"ST-Hebungen in II, III, aVF = inferiorer STEMI → BPR ACS!"},
{q:"Reißender, wandernder Schmerz + Blutdruckdifferenz > 20 mmHg. V.a.?",opts:["ACS","Akutes Aortensyndrom"],correct:1,feedback:"Reißend/wandernd + Pulsdifferenz → V.a. Aortensyndrom!"},
{q:"Plötzliche Dyspnoe + atemabhängiger Schmerz + Z.n. OP. V.a.?",opts:["Pneumothorax","Lungenarterienembolie"],correct:1,feedback:"Plötzlich + atemabhängig + Immobilisation → V.a. LAE!"}
],
gaps:[
{text:"DD Brustschmerz: ACS, ___, LAE, ___, Ösophagusruptur",answer:"Aortensyndrom;Pneumothorax"},
{text:"ST-Hebung → V.a. ___ → ASS + Heparin + ___-Klinik",answer:"STEMI;PCI"}
]},
{id:"ls_schmerzen",name:"Schmerzen",kat:"Leitsymptome",
steps:["Basismaßnahmen + OPQRST","Lagerung","NRS-Erhebung","Bei NRS ≥ 3: i.v.-Zugang","Paracetamol oder Ibuprofen","Bei kolikartigen Bauchschmerzen: ggf. Butylscopolamin","Bei NRS ≥ 6: Opioid oder Esketamin/Midazolam","Ggf. Sauerstoffgabe","Ggf. weitere Versorgung"],
decisions:[
{q:"NRS 4. Welches Analgetikum zuerst?",opts:["Fentanyl i.v.","Paracetamol oder Ibuprofen"],correct:1,feedback:"BPR: NRS ≥ 3 → Paracetamol/Ibuprofen. Opioide erst ab NRS ≥ 6!"},
{q:"NRS 8, kolikartige Bauchschmerzen. Kombination?",opts:["Nur Butylscopolamin","Paracetamol/Ibuprofen + Butylscopolamin + Opioid"],correct:1,feedback:"NRS ≥ 6 + Kolik → Paracetamol/Ibuprofen + Butylscopolamin + Opioid."},
{q:"ACS-Brustschmerz NRS 7. Welches Opioid bevorzugt?",opts:["Morphin","Esketamin"],correct:0,feedback:"BPR: Bei ACS-Schmerz → Morphin bevorzugt."}
],
gaps:[
{text:"Analgetika ab NRS ≥ ___. Opioide ab NRS ≥ ___",answer:"3;6"},
{text:"Kolikartige Bauchschmerzen: ggf. ___",answer:"Butylscopolamin"},
{text:"ACS-Schmerz bevorzugt: ___",answer:"Morphin"}
]},
{id:"ls_schock",name:"Schock",kat:"Leitsymptome",
steps:["Basismaßnahmen","Schock-Zeichen erkennen (RRsyst < 90, verlängerte Rekap, Blässe)","DD: Trauma → BPR Polytrauma/Blutung","DD: Kardiogen → BPR Brustschmerz","DD: Anaphylaxie → BPR Anaphylaxie","DD: Sepsis → BPR Sepsis","DD: Dehydratation → BPR Dehydratation","Bedarfsgerechte Therapie, i.v.-Zugang, VEL","Re-Evaluation ABCDE","Transport"],
decisions:[
{q:"Schock nach Trauma. Welcher BPR?",opts:["Sepsis","Polytrauma / Kritische Blutung"],correct:1,feedback:"Trauma + Schock → BPR Polytrauma/Blutung!"},
{q:"Schock + Urtikaria + Stridor. Welcher BPR?",opts:["Anaphylaxie","Sepsis"],correct:0,feedback:"Schock + Urtikaria + Stridor = anaphylaktischer Schock!"},
{q:"Schock + Fieber + Petechien + AF 28. V.a.?",opts:["Dehydratation","Sepsis"],correct:1,feedback:"Schock + Fieber + Petechien → septischer Schock!"}
],
gaps:[
{text:"Schock-Zeichen: RRsyst < ___ mmHg, verlängerte ___",answer:"90;Rekapillarisierungszeit"},
{text:"Schock-DD: Trauma → ___ → Anaphylaxie → ___ → Dehydratation",answer:"kardiogen;Sepsis"}
]},
{id:"ls_neuro",name:"Zentrales neurologisches Defizit",kat:"Leitsymptome",
steps:["Basismaßnahmen","Neurologische Untersuchung: WASB, GCS, Pupillen","BE-FAST-Test","BZ-Messung","12-Kanal-EKG","i.v.-Zugang","Passenden BPR wählen (Schlaganfall, Krampfanfall, Hypoglykämie, Intoxikation)","Symptombeginn dokumentieren!","Transport"],
decisions:[
{q:"BE-FAST pathologisch + Symptombeginn vor 90 min. Welcher BPR?",opts:["Schlaganfall → Stroke Unit!","Krampfanfall"],correct:0,feedback:"BE-FAST + = V.a. Schlaganfall → Stroke Unit!"},
{q:"BZ-Messung vor Transport – warum?",opts:["Nur Routine","Hypoglykämie ist häufigster Stroke Mimic!"],correct:1,feedback:"BZ obligat! Hypoglykämie imitiert Schlaganfall komplett."},
{q:"GCS 8. Konsequenz?",opts:["Oberkörper 30° reicht","Atemwegssicherung erwägen!"],correct:1,feedback:"GCS ≤ 8 → Schutzreflexe gefährdet → Atemwegssicherung!"},
{q:"RR 200/110 bei Schlaganfall. Senken?",opts:["Ja, auf 120/80","Nein – < 220 tolerieren"],correct:1,feedback:"Permissive Hypertonie. Erst ab > 220 mmHg senken."}
],
gaps:[
{text:"Schlaganfall-Screening: ___-FAST-Test",answer:"BE"},
{text:"Unbedingt dokumentieren: ___beginn!",answer:"Symptom"}
]},
// ── KRANKHEITSBILDER ──
{id:"anaphylaxie",name:"Anaphylaxie",kat:"Krankheitsbilder",
steps:["Allergenexposition stoppen","Kreislaufstillstand? → BPR Reanimation","Basismaßnahmen","A-/B-/C-/D-Problem (Grad II/III) → Epinephrin i.m.!","Bedarfsgerechte Sauerstoffgabe","Bei Stridor: Epinephrin-Vernebelung","Bei bronchialer Obstruktion: Salbutamol-Vernebelung","i.v.-Zugang","Vollelektrolytlösung i.v.","Dimetinden i.v.","Prednisolon i.v.","Keine Stabilisierung → Repetition Epinephrin i.m. alle 5 min","Transport"],
decisions:[
{q:"Anaphylaxie Grad II. Erste Medikamentengabe?",opts:["Epinephrin i.m.!","Prednisolon i.v."],correct:0,feedback:"Epinephrin i.m. ist das ERSTE und WICHTIGSTE Medikament ab Grad II!"},
{q:"Epinephrin i.m. Dosis Erwachsene?",opts:["0,5 mg i.m.","0,3 mg i.m."],correct:0,feedback:"SAA: Erw > 12 J: 0,5 mg. Kinder 6-12 J: 0,3 mg. Kinder < 6 J: 0,15 mg."},
{q:"Zusätzlich inspiratorischer Stridor. Was tun?",opts:["Epinephrin-Vernebelung (4 mg)","Salbutamol-Vernebelung"],correct:0,feedback:"Stridor → Epinephrin-Vernebelung! Salbutamol nur bei bronchialer Obstruktion."},
{q:"Keine Stabilisierung nach Epinephrin i.m. Nächster Schritt?",opts:["Abwarten","Repetition Epinephrin i.m. alle 5 min"],correct:1,feedback:"BPR: Repetition Epinephrin i.m. alle 5 Minuten!"}
],
gaps:[
{text:"Epinephrin i.m. Erw: ___ mg, Kinder 6-12 J: ___ mg, < 6 J: ___ mg",answer:"0,5;0,3;0,15"},
{text:"Reihenfolge: 1. ___ i.m., 2. O₂, 3. VEL, 4. ___ i.v., 5. ___ i.v.",answer:"Epinephrin;Dimetinden;Prednisolon"},
{text:"Prednisolon Anaphylaxie > 12 J: ___ mg i.v.",answer:"250"}
]},
{id:"acs",name:"Akutes Koronarsyndrom",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","O₂ nur bei Hypoxie/Dyspnoe (Ziel-SpO₂ 94-96%)","i.v.-Zugang","12-Kanal-EKG + ggf. erweiterte Ableitungen","Ggf. Therapie Rhythmusstörungen","EKG telemetrisch an PCI-Klinik","Ggf. Schmerztherapie (Morphin)","STEMI/OMI/NSTE-ACS → ASS + Heparin","Transport PCI-Klinik, möglichst direkt HKL"],
decisions:[
{q:"SpO₂ 97%. Sauerstoff geben?",opts:["Nein – keine routinemäßige O₂ bei SpO₂ > 90%","Ja – immer bei ACS"],correct:0,feedback:"BPR: Keine routinemäßige O₂ bei SpO₂ > 90%!"},
{q:"STEMI bestätigt. Welche Medikamente?",opts:["Nur ASS","ASS + Heparin"],correct:1,feedback:"BPR: STEMI/OMI → ASS + Heparin!"},
{q:"ASS-Dosis?",opts:["250 mg i.v.","500 mg i.v."],correct:0,feedback:"SAA: 250 mg langsam i.v. (oder 200 mg oral)."}
],
gaps:[
{text:"O₂ bei ACS: Keine Gabe bei SpO₂ > ___%. Ziel: ___",answer:"90;94-96%"},
{text:"ASS: ___ mg i.v., Heparin: ___ I.E. i.v.",answer:"250;5.000"},
{text:"Transport: ___-Klinik, direkt ins ___",answer:"PCI;HKL"}
]},
{id:"schlaganfall",name:"Schlaganfall",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","i.v.-Zugang","Atemstörung → Atemwege sichern, Ziel-SpO₂ 94-98%","RRsyst > 220 und/oder RRdiast > 120 → Urapidil i.v.","RRsyst < 120 → VEL i.v.","BZ < 60 mg/dl → BPR Hypoglykämie","Temperatur > 38°C → physikalische Senkung","Transport Stroke Unit"],
decisions:[
{q:"Schlaganfall, RR 195/105. Urapidil?",opts:["Ja","Nein – erst ab > 220/120!"],correct:1,feedback:"BPR: Urapidil erst bei RRsyst > 220 und/oder RRdiast > 120!"},
{q:"Ziel-RR nach Urapidil?",opts:["Nicht unter 180 mmHg","120 mmHg"],correct:0,feedback:"SAA: Moderate Senkung, nicht < 180 mmHg!"},
{q:"BZ 45 mg/dl. Was tun?",opts:["Glucose → BPR Hypoglykämie!","Ignorieren"],correct:0,feedback:"BZ < 60 → BPR Hypoglykämie! Hypoglykämie imitiert Schlaganfall-Symptome."}
],
gaps:[
{text:"Urapidil ab RRsyst > ___ und/oder RRdiast > ___",answer:"220;120"},
{text:"Moderate Senkung, nicht unter ___",answer:"180"},
{text:"Ziel-SpO₂ bei Atemstörung: ___",answer:"94-98%"}
]},
{id:"bradykardie",name:"Instabile Bradykardie",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","12-Kanal-EKG","Bedarfsgerechte O₂-Gabe","Instabilitätszeichen prüfen","i.v.-Zugang","Asystoliegefahr prüfen","Atropingabe","HF steigt nicht → Epinephringabe","HF steigt nicht + Bewusstseinsstörung → Schrittmacher"],
decisions:[
{q:"HF 38, Patient beschwerdefrei. Instabil?",opts:["Nicht zwingend – Zeichen prüfen!","Ja, sofort Atropin"],correct:0,feedback:"Nicht jeder mit Bradykardie ist instabil! Instabilitätszeichen prüfen."},
{q:"Atropin-Dosis?",opts:["0,5 mg i.v., Rep nach 3-5 min, max. 3 mg","1 mg einmalig"],correct:0,feedback:"SAA: 0,5 mg i.v., Rep nach 3-5 min, max. 3 mg."},
{q:"Atropin wirkungslos. Nächster Schritt?",opts:["Epinephrin","Mehr Atropin"],correct:0,feedback:"Nach Atropin-Versagen → Epinephrin!"}
],
gaps:[
{text:"Atropin: ___ mg i.v., Rep nach ___ min, max. ___ mg",answer:"0,5;3-5;3"},
{text:"Asystoliegefahr: AV-Block ___° Mobitz, AV-Block ___° + breiter QRS, Pausen > ___ sek",answer:"II;III;3"},
{text:"Ultima ratio: ___therapie",answer:"Schrittmacher"}
]},
{id:"tachykardie",name:"Instabile Tachykardie",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","12-Kanal-EKG","Bedarfsgerechte O₂-Gabe","i.v.-Zugang","Reversible Ursachen prüfen","Instabilitätszeichen prüfen","Bewusstlosigkeit → Kardioversion!","Keine Bewusstlosigkeit → NA für med. Therapie","Transport"],
decisions:[
{q:"Tachykardie + Bewusstlosigkeit. Was tun?",opts:["Kardioversion!","NA rufen und warten"],correct:0,feedback:"Instabile Tachykardie + Bewusstlosigkeit → Kardioversion!"},
{q:"Schmalkomplex, regelmäßig, stabil. Erster Versuch?",opts:["Kardioversion","Vagusmanöver"],correct:1,feedback:"Stabile SVT: zuerst Vagusmanöver."},
{q:"Breitkomplex-Tachykardie = ?",opts:["SVT mit Schenkelblock","VT bis zum Gegenbeweis!"],correct:1,feedback:"Breitkomplex = VT bis Gegenbeweis!"},
{q:"Kardioversion: Welcher Modus?",opts:["Unsynchronisiert","Synchronisiert!"],correct:1,feedback:"Kardioversion = synchronisiert! Unsync nur bei pulsloser VT/VF."}
],
gaps:[
{text:"Instabile Tachykardie + Bewusstlosigkeit → ___!",answer:"Kardioversion"},
{text:"Reversible Ursachen: ___, Hypovolämie, ___",answer:"Hyperkaliämie;Hypoglykämie"}
]},
{id:"hypoglyk",name:"Hypoglykämie",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","BZ < 60 mg/dl bestätigen","Wach + schluckfähig? → Orale Glucose","Nicht wach → Ggf. Glucagon i.m./i.n.","i.v.-Zugang","i.v.-Gabe Glucose","BZ-Kontrolle nach 5 min (i.v.) / 10 min (oral)","BZ > 90 mg/dl? Nein → Repetition","Transport"],
decisions:[
{q:"BZ 42, Patient wach, schluckt. Was tun?",opts:["Orale Glucose","Sofort i.v.-Glucose"],correct:0,feedback:"BPR: Wach + schluckfähig → orale Glucose. Kontrolle nach 10 min."},
{q:"BZ 35, bewusstlos, kein i.v.-Zugang. Was tun?",opts:["Auf NA warten","Glucagon i.m. oder intranasal"],correct:1,feedback:"Bewusstlos + kein i.v. → Glucagon! 1 mg i.m. (>25 kg) oder 3 mg intranasal (ab 4 J)."},
{q:"Glucose i.v. Dosis Erwachsene?",opts:["40 g i.v.","8-10 g i.v."],correct:1,feedback:"SAA: 8-10 g Glucose i.v. bei Erwachsenen."}
],
gaps:[
{text:"Hypoglykämie: BZ < ___ mg/dl (___ mmol/l)",answer:"60;3,3"},
{text:"Glucose i.v. Erw: ___-___ g",answer:"8;10"},
{text:"Glucagon Erw > 25 kg: ___ mg i.m.",answer:"1"},
{text:"BZ-Kontrolle: ___ min (i.v.), ___ min (oral), Ziel > ___ mg/dl",answer:"5;10;90"}
]},
{id:"hyperglyk",name:"Hyperglykämie",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","Kritische BZ-Erhöhung bestätigen","i.v.-Zugang","Vollelektrolytlösung i.v.","Temperaturmessung","12-Kanal-EKG","Erweiterte Anamnese","Transport"],
decisions:[
{q:"BZ 280, somnolent. Kritisch?",opts:["Ja – > 250 + Symptome = kritisch","Nein – erst ab 400"],correct:0,feedback:"Kritisch ab > 250 mg/dl MIT Allgemeinsymptomen."},
{q:"Kussmaul-Atmung bedeutet?",opts:["Azidose-Kompensation","Obstruktiv"],correct:0,feedback:"Kussmaul = respiratorische Azidose-Kompensation bei DKA."},
{q:"Insulin präklinisch?",opts:["NEIN – Hypokaliämie-Gefahr!","Ja"],correct:0,feedback:"Kein Insulin präklinisch! Kaliumverschiebung gefährlich."},
{q:"Primäre Therapie?",opts:["Insulin","VEL i.v."],correct:1,feedback:"VEL = primäre präklinische Maßnahme. Kein Insulin!"}
],
gaps:[
{text:"Kritisch Erw: > ___ mg/dl, Kind: > ___ mg/dl",answer:"250;200"},
{text:"Therapie: VEL i.v. + ___-EKG + ___messung",answer:"12-Kanal;Temperatur"}
]},
{id:"bronchial",name:"Bronchialobstruktion",kat:"Krankheitsbilder",
steps:["Symptomatische Tachykardie? → Vorsicht mit ß-Mimetika!","Alter > 6 J: Salbutamol-Vernebelung","Alter 4-6 J: Salbutamol-Vernebelung","Alter < 4 J: Epinephrin-Vernebelung","Keine Besserung → Ipratropiumbromid","O₂ anpassen (Asthma vs. COPD)","i.v.-Zugang + Prednisolon i.v.","Keine Besserung → Erwäge NIV","Transport"],
decisions:[
{q:"3-jähriges Kind mit Bronchialobstruktion. Vernebelung?",opts:["Epinephrin (< 4 Jahre!)","Salbutamol"],correct:0,feedback:"BPR: < 4 J → Epinephrin! Salbutamol erst ab 4 J."},
{q:"COPD-Patient: SpO₂-Ziel?",opts:["> 96%","88-92%"],correct:1,feedback:"BPR COPD: Angepasste O₂, SpO₂ 88-92%!"},
{q:"Salbutamol ohne Besserung. Nächster Schritt?",opts:["Ipratropiumbromid","Sofort NIV"],correct:0,feedback:"BPR: Nach Salbutamol → Ipratropiumbromid, dann Prednisolon, dann NIV."}
],
gaps:[
{text:"Salbutamol > 12 J: ___ mg, 4-12 J: ___ mg. < 4 J: ___-Vernebelung",answer:"2,5;1,25;Epinephrin"},
{text:"COPD: SpO₂ ___%. Asthma: > ___% anstreben",answer:"88-92;92"},
{text:"Prednisolon Bronchialobstruktion > 12 J: ___ mg i.v.",answer:"80"}
]},
{id:"lungenoedem",name:"Kardiales Lungenödem",kat:"Krankheitsbilder",
steps:["Sauerstoffgabe","CPAP!","i.v.-Zugang","12-Kanal-EKG","Glyceroltrinitrat sublingual","Furosemid i.v.","Keine Besserung → NIV","Verschlechterung → Atemwegsmanagement","Transport"],
decisions:[
{q:"Lungenödem: Welche Maßnahme hat besondere Bedeutung?",opts:["Flachlagerung","CPAP → PEEP!"],correct:1,feedback:"BPR: CPAP hat besondere Bedeutung! PEEP senkt Druck im Lungenkreislauf."},
{q:"Glyceroltrinitrat-Dosis?",opts:["3 Hübe sofort","1 Hub (0,4 mg) sublingual, Rep nach 5 min"],correct:1,feedback:"SAA: 1x 0,4 mg sublingual, einmalige Rep nach 5 min."},
{q:"Furosemid-Dosis?",opts:["40 mg Bolus","20 mg i.v., Rep nach 15 min"],correct:1,feedback:"SAA: 20 mg langsam i.v., Rep nach 15 min."}
],
gaps:[
{text:"CPAP Lungenödem: FiO₂ ___, PEEP: ___ mbar, PS: ___ mbar",answer:"1,0;5;0"},
{text:"Glyceroltrinitrat: ___ Hub (___ mg) sublingual",answer:"1;0,4"},
{text:"Furosemid: ___ mg i.v., Rep nach ___ min",answer:"20;15"}
]},
{id:"lae",name:"Lungenarterienembolie",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","Bedarfsgerechte O₂-Gabe","Erwäge NIV","12-Kanal-EKG","Venöser Zugang","Erweiterte Anamnese","Wells-Score ≥ 5?","sPESI ≥ 1?","Heparin 5.000 I.E. i.v.","Weitere Versorgung, Transport"],
decisions:[
{q:"Wells 6, sPESI 2. Heparin?",opts:["Nein","Ja – Wells ≥ 5 + sPESI ≥ 1 → Heparin!"],correct:1,feedback:"Wells ≥ 5 + sPESI ≥ 1 → Heparin 5.000 IE i.v."},
{q:"Typische LAE-Trias?",opts:["Dyspnoe + Thoraxschmerz + Tachykardie","Fieber + Husten + Auswurf"],correct:0,feedback:"Klassische Trias plus Immobilisation in Anamnese."},
{q:"LAE + instabil (RR 70/40). Maßnahme?",opts:["Nur Heparin","Heparin + VEL + O₂, Lyse erwägen!"],correct:1,feedback:"Instabile LAE: Lyse erwägen!"},
{q:"Kreislaufstillstand bei LAE?",opts:["Normale CPR","CPR + Lyse, mind. 60-90 min!"],correct:1,feedback:"LAE-Stillstand: Lyse unter CPR!"}
],
gaps:[
{text:"Wells-Score: LAE wahrscheinlich ab ≥ ___ Punkte",answer:"5"},
{text:"sPESI: Risiko ab ≥ ___ Punkt(e)",answer:"1"},
{text:"Heparin: ___ I.E. i.v.",answer:"5.000"}
]},
{id:"aortensyndrom",name:"Akutes Aortensyndrom",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","Bedarfsgerechte O₂-Gabe","12-Kanal-EKG","Venöser Zugang","Erweiterte Anamnese + Diagnostik","Load-go-and-treat Strategie","Ggf. Schmerztherapie","RRsyst > 140 → Urapidil i.v.","Transport"],
decisions:[
{q:"V.a. Aortensyndrom, RR 185/100. Urapidil?",opts:["Nein – erst ab 220","Ja – ab > 140!"],correct:1,feedback:"RR-Senkung auf < 140 mmHg."},
{q:"Typischer Schmerzcharakter?",opts:["Dumpf","Vernichtungsschmerz, reißend, wandernd"],correct:1,feedback:"Vernichtungsschmerz, reißend, in Rücken wandernd."},
{q:"RR-Differenz > 20 mmHg. Bedeutung?",opts:["Normal","V.a. Aortendissektion!"],correct:1,feedback:"Seitendifferenz = Alarmsignal! Immer beidseits messen."},
{q:"Analgesie?",opts:["NSAR","Opioide i.v. titriert"],correct:1,feedback:"Starke Schmerzen → Opioide. RR-Senkung lindert mit."}
],
gaps:[
{text:"Urapidil ab RRsyst > ___ (≠ Schlaganfall: > ___)",answer:"140;220"},
{text:"Zielwert: ___-___ mmHg, nicht unter ___",answer:"100;120;80"}
]},
{id:"hypertensiv",name:"Hypertensiver Notfall",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","12-Kanal-EKG","Klinische Symptome prüfen","DD: Lungenödem, ACS, Aortensyndrom, Schlaganfall","Ggf. Dauertherapie vorziehen","O₂-Gabe, i.v.-Zugang","Urapidil i.v.","Transport"],
decisions:[
{q:"RR 240/130 + feuchte RGs + Dyspnoe. BPR?",opts:["Lungenödem","Hypertensiver Notfall allgemein"],correct:0,feedback:"Feuchte RGs + Dyspnoe = Lungenödem vorrangig!"},
{q:"Max. RR-Senkung 1. Stunde?",opts:["20-25% des Ausgangswerts","Auf 120/80"],correct:0,feedback:"Max. 20-25%! Zu schnell → zerebrale Minderperfusion."},
{q:"Urapidil-Wirkweise?",opts:["Alpha-1-Blocker","Betablocker"],correct:0,feedback:"Alpha-1-Antagonist + zentral 5-HT1A. Gut steuerbar."},
{q:"Welche Organe gefährdet?",opts:["Nur Leber","Gehirn, Herz, Nieren, Augen"],correct:1,feedback:"Enzephalopathie, Lungenödem, Nierenversagen, Retinopathie."}
],
gaps:[
{text:"Definition: RRsyst > ___",answer:"220"},
{text:"Urapidil: ___ mg i.v., max. ___ mg",answer:"5;25"}
]},
{id:"hypothermie",name:"Hypothermie",kat:"Krankheitsbilder",
steps:["Rettung aus Kälte","Stadium bestimmen (I-IV)","Stadium I: Warme Umgebung, trockene Kleidung","Stadium II/III: Immobilisation, Wärmeerhalt","Stadium IV: BPR Reanimation","Basismaßnahmen, O₂-Gabe","Ggf. EGA","Erwäge aktive Wiedererwärmung","Ggf. i.v.-Zugang + gewärmte VEL","Transport"],
decisions:[
{q:"Stadium II (32-28°C). Merkmale?",opts:["Bewusstsein beeinträchtigt, KEIN Frieren","Bewusstseinsklar, frierend"],correct:0,feedback:"Stadium II: Bewusstsein beeinträchtigt, Muskelrigidität."},
{q:"Stadium III (< 28°C). Gefahr?",opts:["Nur Müdigkeit","VF bei Manipulation!"],correct:1,feedback:"VF durch Bewegung! Sanft transportieren."},
{q:"Herzstillstand + Hypothermie. CPR?",opts:["Früh abbrechen","Bis Wiedererwärmung! Not dead until warm and dead"],correct:1,feedback:"Neuroprotektiv! Prolongierte CPR sinnvoll."},
{q:"Präklinische Wärmemaßnahme?",opts:["Heiße Bäder","Passiver Wärmeerhalt (Isolation, Rettungsdecke)"],correct:1,feedback:"Passiv! Nasse Kleidung weg, Rettungsdecke. Afterdrop vermeiden!"}
],
gaps:[
{text:"Stadien: I=___°C, II=___°C, III=___°C, IV=unter ___°C",answer:"35-32;32-28;28-24;24"},
{text:"Stadium I: bewusstseinsklar, ___. Stadium II: beeinträchtigt, ohne ___",answer:"frierend;Frieren"}
]},
{id:"krampf_erw",name:"Krampfanfall Erwachsene",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","Krampf beendet? → Postiktal","Nein → Status epilepticus","i.v.-Zugang wenn möglich","Midazolam i.v./nasal/buccal/i.m.","1. Durchgang: beendet?","Nein → Repetition","Immer noch? → Versorgung mit NA","Transport"],
decisions:[
{q:"Krampf seit 7 min, kein i.v. Was tun?",opts:["Warten auf i.v.","Midazolam nasal/buccal/i.m.!"],correct:1,feedback:"Nicht warten! Midazolam sofort alternativ."},
{q:"Status epilepticus ab wann?",opts:["Ab 30 min","≥ 5 min!"],correct:1,feedback:"≥ 5 min oder ≥ 2 Anfälle ohne Bewusstseinswiedererlangung."},
{q:"Postiktal. Was prüfen?",opts:["BZ + SpO₂ + Atemwege + Seitenlage","Nur EKG"],correct:0,feedback:"BZ, SpO₂, Atemwege sichern, Seitenlage."},
{q:"Nach Midazolam. Worauf achten?",opts:["Atemdepression! Monitoring!","Keine Nebenwirkungen"],correct:0,feedback:"Benzodiazepine → Atemdepression möglich!"}
],
gaps:[
{text:"Status epilepticus: > ___ min",answer:"5"},
{text:"Midazolam Erw i.v.: ___ mg/kgKG, max. ___ mg",answer:"0,1;20"},
{text:"Midazolam nasal: ___ mg pro Nasenloch",answer:"5"}
]},
{id:"krampf_kind",name:"Krampfanfall Kind",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","Krampf beendet? → Postiktal","Nein → Status epilepticus","i.v.-Zugang wenn möglich","Midazolam buccal/nasal/i.v.","1. Durchgang: beendet?","Repetition (ab > 10 kgKG)","Bei Fieberkrampf: Fiebersenkung","Transport"],
decisions:[
{q:"2J krampft. Midazolam buccal?",opts:["5 mg (1-4 J)","10 mg"],correct:0,feedback:"SAA: Midazolam buccal 1-4 J: 5 mg."},
{q:"Fieberkrampf. Zusätzlich?",opts:["Antiepileptikum","Fiebersenkung (Paracetamol/Ibuprofen)"],correct:1,feedback:"Fiebersenkung bei Fieberkrampf!"},
{q:"Fieberkrampf. Meningitis?",opts:["Ausgeschlossen","Ausschließen! Nackensteifigkeit, Fontanelle"],correct:1,feedback:"Meningitis aktiv ausschließen!"},
{q:"Säugling: Zuckungen + Apnoe. Krampf?",opts:["Normal","Ja! Subtile Säuglingskrämpfe!"],correct:1,feedback:"Säuglingskrämpfe oft subtil!"}
],
gaps:[
{text:"Midazolam buccal: 3-11 Mo: ___ mg, 1-4 J: ___ mg, 5-9 J: ___ mg",answer:"2,5;5;7,5"},
{text:"Repetition erst ab > ___ kgKG",answer:"10"}
]},
{id:"sepsis",name:"Sepsis",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","Dehydratation als Ursache unwahrscheinlich?","Sepsis wahrscheinlichste Ursache?","qSOFA ≥ 2 und/oder NEWS2 ≥ 5?","O₂-Gabe (Ziel-SpO₂ 92-96%)","Venöser Zugang","VEL (Ziel-MAP ≥ 65 mmHg)","Voranmeldung","Transport"],
decisions:[
{q:"qSOFA-Kriterien?",opts:["AF > 22, RRsys < 100, GCS < 15","HF > 100, Fieber, Leukozytose"],correct:0,feedback:"qSOFA: AF > 22 (1P), RRsys < 100 (1P), GCS < 15 (1P)."},
{q:"Ziel-SpO₂ Sepsis?",opts:["92-96%","94-98%"],correct:0,feedback:"BPR Sepsis: Ziel-SpO₂ 92-96%."},
{q:"Volumen-Ziel?",opts:["MAP ≥ 65 mmHg","RRsyst ≥ 120"],correct:0,feedback:"BPR: Ziel-MAP ≥ 65 mmHg."}
],
gaps:[
{text:"qSOFA: AF > ___, RRsys < ___, GCS < ___",answer:"22;100;15"},
{text:"Sepsis: SpO₂ ___%, MAP ≥ ___ mmHg",answer:"92-96;65"},
{text:"Therapie ab qSOFA ≥ ___ und/oder NEWS2 ≥ ___",answer:"2;5"}
]},
{id:"polytrauma",name:"Polytrauma",kat:"Krankheitsbilder",
steps:["Einsatzstelle/Sicherheit","Ersteinschätzung","<c>: Critical Bleeding → Kompression, Tourniquet","A: Airway + HWS → Atemwegsmanagement","B: Breathing → O₂, ggf. Thoraxentlastung","C: Circulation → Zugang, VEL, Beckenschlinge","D: Disability → GCS, Pupillen","E: Exposure → Wärmeerhalt, Schmerztherapie","Tranexamsäure bei Indikation","Load-go-treat","Transport Traumazentrum"],
decisions:[
{q:"Polytrauma: Was ZUERST?",opts:["<c> Critical Bleeding!","A: Airway"],correct:0,feedback:"<c>ABCDE! Zuerst kritische Blutung stillen!"},
{q:"SpO₂ 86%, rechts kein AG, Hautemphysem. Was tun?",opts:["Mehr O₂","Thoraxentlastungspunktion!"],correct:1,feedback:"V.a. Spannungspneu → sofortige Entlastungspunktion!"},
{q:"Instabiles Becken. Maßnahme?",opts:["Nur Vakuummatratze","Beckenschlinge"],correct:1,feedback:"Instabiles Becken → Beckenschlinge!"}
],
gaps:[
{text:"Schema: ___ABCDE",answer:"<c>"},
{text:"TXA: ___ mg/kgKG, max. ___ mg, innerhalb ___ h",answer:"15;1000;3"},
{text:"Schockraum: RRsyst < ___, HF > ___, SpO₂ < ___, GCS ≤ ___",answer:"90;120;90;12"}
]},
{id:"thermisch",name:"Thermische Verletzung",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","Kühlung beenden! Keine aktive Kühlung!","i.v.-Zugang","VEL i.v.","Ggf. Schmerztherapie","Wärmeerhalt!","VKOF abschätzen","Steriles Abdecken (trocken!)","Transport"],
decisions:[
{q:"RD aktiv kühlen?",opts:["Ja, 10 min","NEIN! Kühlung beenden!"],correct:1,feedback:"RD kühlt NICHT aktiv! Hypothermiegefahr!"},
{q:"KOF abschätzen?",opts:["9er-Regel oder Handflächenregel","Nur schätzen"],correct:0,feedback:"9er-Regel: Kopf 9%, Arm 9%, Bein 18%, Rumpf 18%."},
{q:"Verbrennung > 15% KOF Erw. Volumen?",opts:["Nicht nötig","VEL i.v.! Schock droht"],correct:1,feedback:"Ab 15% (Erw) / 10% (Kind): VEL indiziert!"},
{q:"Analgesie bei Verbrennung?",opts:["Nicht nötig","Starke Analgesie! Opioide/Esketamin"],correct:1,feedback:"Extrem schmerzhaft! Frühzeitige Analgesie."}
],
gaps:[
{text:"Keine aktive ___ durch RD!",answer:"Kühlung"},
{text:"Volumen: Erw max. ___ l/h, Kind max. ___ ml/kgKG/h",answer:"1;10"},
{text:"Keine ___-Gabe!",answer:"Cortison"}
]},
{id:"intoxikation",name:"Intoxikation",kat:"Krankheitsbilder",
steps:["Eigenschutz!","Giftexposition beenden","Basismaßnahmen","Venöser Zugang","Opioides Toxidrom? → Primäre Maßnahmen, dann Naloxon","CO-Intoxikation? → O₂ FiO₂ 1,0, ggf. CPAP","Material asservieren, Giftnotrufzentrale","Symptomorientierte Therapie","Transport"],
decisions:[
{q:"Miosis + Bradypnoe. V.a. Opiat. Sofort Naloxon?",opts:["NEIN! Atemwege + O₂ + Beatmung zuerst!","Ja, Bolus"],correct:0,feedback:"ABC vor D! Atemwege zuerst."},
{q:"Universelles Antidot?",opts:["Aktivkohle","Gibt es NICHT – Basismaßnahmen!"],correct:1,feedback:"Kein universelles Antidot! ABCDE + symptomatisch."},
{q:"Mydriasis + Tachy + Agitation. V.a.?",opts:["Opiate","Sympathomimetika (Kokain, Amphetamine)"],correct:1,feedback:"Sympathomimetisches Toxidrom."},
{q:"Bewusstloser Intoxikierter. Lagerung?",opts:["Rückenlage","Stabile Seitenlage!"],correct:1,feedback:"Seitenlage! Aspirationsgefahr."}
],
gaps:[
{text:"Opioid-Toxidrom: ___, Bradypnoe, Hypotonie",answer:"Miosis"},
{text:"Naloxon: ___ mg fraktioniert, alle ___ min",answer:"0,1;2"},
{text:"CO-Intoxikation: FiO₂ ___",answer:"1,0"}
]},
{id:"fk_aspiration",name:"Fremdkörperaspiration",kat:"Krankheitsbilder",
steps:["Effektiver Husten → Zum Husten auffordern!","Ineffektiv → 5 Rückenschläge","Weiterhin ineffektiv → 5 Oberbauchkompressionen","Bewusstlosigkeit → CPR!","Atemwegsmanagement unter Sicht (Laryngoskopie/Magill)"],
decisions:[
{q:"Patient hustet kräftig. Was tun?",opts:["Sofort Heimlich","Zum Husten auffordern!"],correct:1,feedback:"Effektiver Husten = leichtgradig. Husten lassen!"},
{q:"Husten ineffektiv. Nächster Schritt?",opts:["Abwarten","5 Rückenschläge + 5 Heimlich"],correct:1,feedback:"Schwergradig! Rückenschläge → Heimlich im Wechsel."},
{q:"Patient bewusstlos. Was jetzt?",opts:["Weitere Heimlich-Manöver","CPR beginnen!"],correct:1,feedback:"Bewusstlos → CPR! Unter Laryngoskopie FK suchen."},
{q:"Heimlich bei Säugling < 1 J?",opts:["Ja","NEIN! Rückenschläge + Thoraxkompressionen"],correct:1,feedback:"Heimlich beim Säugling kontraindiziert!"}
],
gaps:[
{text:"Reihenfolge: Husten → 5 ___ → 5 ___",answer:"Rückenschläge;Oberbauchkompressionen"},
{text:"Bei Bewusstlosigkeit: ___!",answer:"CPR"}
]},
{id:"obstruktion_kind",name:"Obstruktion obere Atemwege Kind",kat:"Krankheitsbilder",
steps:["Schweregrad beurteilen","Leicht → Zum Husten auffordern","Schwer, Säugling: 5 Rückenschläge + 5 Thoraxkompressionen","Schwer, Kleinkind: 5 Rückenschläge + 5 Oberbauchkompressionen","Bewusstlosigkeit → CPR!","Pseudokrupp: Prednisolon 100 mg rectal"],
decisions:[
{q:"Säugling + FK + kein Husten. Was tun?",opts:["Heimlich","5 Rückenschläge + 5 Thoraxkompressionen"],correct:1,feedback:"Säugling: KEIN Heimlich!"},
{q:"Kind: Stridor + bellender Husten + Fieber. V.a.?",opts:["Fremdkörper","Pseudokrupp"],correct:1,feedback:"Bellender Husten + Stridor + 1-5 J = Pseudokrupp."},
{q:"Pseudokrupp: Erstmaßnahme?",opts:["Antibiotika","Prednisolon Supp. + beruhigen + kühle Luft"],correct:1,feedback:"Prednisolon 100 mg Supp. + beruhigen + kühle Luft."},
{q:"Speichelfluss + hohes Fieber + Schluckstörung. V.a.?",opts:["Pseudokrupp","Epiglottitis! KEIN Mundspatel!"],correct:1,feedback:"Epiglottitis: Keine Manipulation! Sitzend, sofort Transport."}
],
gaps:[
{text:"Säugling: 5 ___ + 5 ___ (KEINE Oberbauchkompressionen!)",answer:"Rückenschläge;Thoraxkompressionen"},
{text:"Pseudokrupp: ___ ___ mg rectal",answer:"Prednisolon;100"}
]},
{id:"stromunfall",name:"Stromunfall",kat:"Krankheitsbilder",
steps:["Eigenschutz! Stromkreis unterbrechen!","Kreislaufstillstand → Reanimation","Basismaßnahmen","O₂-Gabe","i.v.-Zugang","12-Kanal-EKG + Monitoring","Verletzungen versorgen","Schmerztherapie","Transport"],
decisions:[
{q:"Erste Maßnahme?",opts:["CPR","Eigenschutz! Strom aus!"],correct:1,feedback:"EIGENSCHUTZ! Stromquelle unterbrechen!"},
{q:"Niederspannung, beschwerdefrei. EKG?",opts:["Nicht nötig","Ja – immer obligat!"],correct:1,feedback:"EKG bei JEDEM Stromunfall! Verzögerte Rhythmusstörungen."},
{q:"Hochspannung > 1000V. Besonderheit?",opts:["Nur Hautbrand","Innere Schäden! Rhabdomyolyse, Kompartment"],correct:1,feedback:"Unsichtbare Gewebeschäden möglich!"},
{q:"Stromunfall + Kreislaufstillstand?",opts:["Hoffnungslos","Sofort CPR – gute Prognose!"],correct:1,feedback:"Oft junge Patienten + VF → Defi. Gute Prognose!"}
],
gaps:[
{text:"Erste Maßnahme: ___ unterbrechen!",answer:"Stromkreis"},
{text:"12-Kanal-___ + kontinuierliches ___",answer:"EKG;Monitoring"}
]},
{id:"dehydratation",name:"Dehydratation",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","Ursache erfragen","i.v.-Zugang","VEL i.v.","Ggf. Dimenhydrinat bei Erbrechen","Re-Evaluation","Transport"],
decisions:[
{q:"Schwere Dehydratation + Erbrechen. Antiemetikum?",opts:["Dimenhydrinat","Ondansetron"],correct:1,feedback:"Ondansetron bei Kindern bevorzugt."},
{q:"Kind 10 kg, schwer dehydriert. Bolus?",opts:["VEL 20 ml/kgKG = 200 ml","VEL 500 ml"],correct:0,feedback:"Kind: VEL 20 ml/kgKG."},
{q:"Stehende Hautfalten + eingesunkene Fontanelle?",opts:["Leicht","Schwere Dehydratation!"],correct:1,feedback:"Klassische Zeichen schwerer Dehydratation."},
{q:"i.v.-Zugang bei Kind wann?",opts:["Immer","Erbrechen, Bewusstseinsstörung, Schock"],correct:1,feedback:"i.v. bei: schwerem Erbrechen, Schock, Bewusstseinseintrübung."}
],
gaps:[
{text:"Dimenhydrinat Erw: ___ mg i.v.",answer:"62"}
]},
{id:"geburt",name:"Geburtsbegleitung",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","Anamnese: SSW, Mehrlinge, Komplikationen","Geburt begleiten","Abnabeln (frühestens nach 1 min)","Erstversorgung Neugeborenes","Mutter: Uterusmassage, Wärmeerhalt","Transport"],
decisions:[
{q:"Nabelschnur pulsiert. Abnabeln?",opts:["Frühestens nach 1 min","Sofort"],correct:0,feedback:"Spätes Abnabeln bei vitalem Neugeborenem."},
{q:"Neugeborenes schlaff. Erste Maßnahme?",opts:["Abtrocknen + Stimulieren + Wärme","Intubation"],correct:0,feedback:"NLS: Abtrocknen + Stimulation + Wärme."},
{q:"Nabelschnurvorfall! Was tun?",opts:["Abwarten","Becken hoch + Kompression verhindern + Notsectio!"],correct:1,feedback:"Becken hoch, Kompression verhindern. Notfall!"},
{q:"Postpartale Blutung > 500 ml?",opts:["Normal","Uterusmassage + VEL + Transport!"],correct:1,feedback:"Atonische Nachblutung = Notfall! Uterusmassage + Volumen."}
],
gaps:[
{text:"Abnabeln frühestens nach ___ min(ute)",answer:"1"},
{text:"Neugeborenes: ___, Wärmeerhalt, Stimulation",answer:"Abtrocknen"}
]},
{id:"a_problem_erw",name:"A-Problem Erwachsene",kat:"Krankheitsbilder",
steps:["Inspektion Mundhöhle","FK/Sekret → Absaugen/Entfernen","Esmarch-Handgriff / Guedel / Wendl","Ggf. EGA/Laryngoskopie","O₂-Gabe","Ggf. Beatmung"],
decisions:[
{q:"Bewusstlos, Schnarchen. Erste Maßnahme?",opts:["EGA sofort","Esmarch + Guedel/Wendl"],correct:1,feedback:"Esmarch + Hilfsmittel ZUERST."},
{q:"Basis nicht ausreichend. Nächster Schritt?",opts:["Koniotomie","EGA einlegen"],correct:1,feedback:"Stufe: Basis → EGA → Intubation → chirurgisch."},
{q:"EGA liegt, keine Thoraxexkursion?",opts:["Weitermachen","Lagekontrolle! Cuff? Druck?"],correct:1,feedback:"Kapnographie, Auskultation, ggf. repositionieren."},
{q:"Wann Koniotomie?",opts:["Bei jeder Bewusstlosigkeit","Nur Cannot-intubate-cannot-oxygenate!"],correct:1,feedback:"Ultima Ratio wenn ALLE Methoden versagen."}
],
gaps:[
{text:"Reihenfolge: Inspektion → Absaugen → ___ → ggf. EGA",answer:"Esmarch-Handgriff"}
]},
{id:"tracheostoma",name:"Verlegtes Tracheostoma",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","Inspektion Tracheostoma","Kanüle entfernen","Absaugen","Ersatzkanüle oder Beatmung über Stoma","O₂-Gabe"],
decisions:[
{q:"Tracheostomiert + Atemnot. Erste Maßnahme?",opts:["Orale Intubation","Aufsätze entfernen + Kanüle raus + Absaugen"],correct:1,feedback:"Algorithmus: Aufsätze → Innenkanüle → Absaugen."},
{q:"Absaugen erfolglos. Nächster Schritt?",opts:["Oral intubieren","Kanüle komplett entfernen!"],correct:1,feedback:"Kanüle raus! Beutel-Stoma oder neue Kanüle."},
{q:"Laryngektomiert. Mund-zu-Mund möglich?",opts:["Ja","NEIN! NUR über Stoma!"],correct:1,feedback:"Kehlkopf fehlt! NUR Stoma-Beatmung."},
{q:"Intakter Kehlkopf, Kanüle raus. Beatmung?",opts:["Nur Stoma","Stoma ODER Mund/Nase möglich!"],correct:1,feedback:"Intakter Kehlkopf = Mund/Nase als Fallback."}
],
gaps:[
{text:"Reihenfolge: Inspektion → ___ entfernen → ___",answer:"Kanüle;Absaugen"}
]},
{id:"art_verschluss",name:"Arterieller Verschluss",kat:"Krankheitsbilder",
steps:["Basismaßnahmen","6P-Diagnostik","i.v.-Zugang","Heparin 5.000 I.E. i.v.","Schmerztherapie","Wattepolsterung + Tieflagerung","Transport"],
decisions:[
{q:"Arterieller Verschluss. Medikament?",opts:["ASS","Heparin 5.000 IE i.v."],correct:1,feedback:"Heparin 5.000 IE i.v."},
{q:"6-P-Regel?",opts:["Pain, Pallor, Pulselessness, Paralysis, Paresthesia, Prostration","ABCDE"],correct:0,feedback:"Schmerz, Blässe, Pulslosigkeit, Lähmung, Parästhesien, Erschöpfung."},
{q:"Lagerung?",opts:["Bein hoch","Tief lagern!"],correct:1,feedback:"Arteriell: Tieflagerung! Hochlagerung nur venös."},
{q:"Akute Ischämie 4h. Dringlichkeit?",opts:["Nächste Woche","Sofort – Revaskularisation < 6h!"],correct:1,feedback:"Zeitfenster 6h! Sofort Gefäßchirurgie."}
],
gaps:[
{text:"6P: Pain, Pallor, ___, Paresthesia, ___, Prostration",answer:"Pulselessness;Paralysis"},
{text:"Heparin: ___ I.E. i.v.",answer:"5.000"}
]},
// ── RECHTLICHE GRUNDLAGEN ──
{id:"aufklaerung",name:"Aufklärung",kat:"Rechtliche Grundlagen",
steps:["Notwendigkeit einer invasiven Maßnahme/Medikamentengabe prüfen","Indikation/Kontraindikation gemäß SAA/BPR","Durchführbarkeit: Maßnahme beherrschen, technisch/örtlich/zeitlich umsetzbar","Einwilligungsfähigkeit prüfen","Nicht einwilligungsfähig → mutmaßlicher Pat.-Wille","Einwilligungsfähig → situationsgerechte Aufklärung","Aufklärungsinhalt: Grund, Qualifikation, Nutzen, Risiken, Alternativen, Nachteile einer Ablehnung","Einwilligung → Durchführung gemäß SAA/BPR","Ablehnung → NA-Alarmierung / Kontakt TNA","Dokumentation"],
decisions:[
{q:"Patient ist ansprechbar, GCS 15, orientiert. Sie möchten einen i.v.-Zugang legen. Was tun Sie zuerst?",opts:["Zugang sofort legen – Zeitdruck","Situationsgerechte Aufklärung durchführen"],correct:1,feedback:"BPR: Bei einwilligungsfähigen Pat. IMMER erst aufklären, dann Einwilligung einholen."},
{q:"Patient ist bewusstlos (GCS 3). Sie müssen einen EGA einlegen. Brauchen Sie eine Einwilligung?",opts:["Ja, Angehörige müssen erst zustimmen","Nein, es gilt der mutmaßliche Pat.-Wille"],correct:1,feedback:"BPR: Bei nicht einwilligungsfähigen Pat. gilt der mutmaßliche Pat.-Wille. Versorgung gemäß SAA/BPR."},
{q:"Was gehört NICHT zur situationsgerechten Aufklärung?",opts:["Erläuterung von Nutzen und Risiken","Garantie eines komplikationslosen Verlaufs"],correct:1,feedback:"Eine Garantie kann nie gegeben werden. Aufklärung umfasst: Grund, Qualifikation, Nutzen, Risiken, Alternativen, Nachteile einer Ablehnung."},
{q:"Patient lehnt die Maßnahme durch Sie als NotSan ab. Was tun?",opts:["Maßnahme trotzdem durchführen – medizinisch indiziert","Akzeptieren und NA-Alarmierung / Kontakt TNA"],correct:1,feedback:"BPR: Lehnt der Pat. die Durchführung durch nichtärztliches Personal ab, ist dies zu akzeptieren. NA/TNA hinzuziehen."},
{q:"Was droht bei mangelhafter Dokumentation der Aufklärung?",opts:["Keine Konsequenzen im Rettungsdienst","Sorgfaltspflichtverletzung mit Beweislastumkehr"],correct:1,feedback:"BPR: Verstoß gegen Befunderhebungs-/Dokumentationspflicht = Sorgfaltspflichtverletzung, kann zur Beweislastumkehr im Gerichtsverfahren führen."}
],
gaps:[
{text:"Aufklärung erfolgt durch den ___ Mitarbeitenden vor Ort",answer:"höchstqualifizierten"},
{text:"Bei Bewusstlosen gilt der ___ Pat.-Wille",answer:"mutmaßliche"},
{text:"Pat. lehnt Maßnahme ab → ___-Alarmierung oder Kontakt ___",answer:"NA;TNA"}
]},
{id:"einwilligungsfaehigkeit",name:"Einwilligungsfähigkeit",kat:"Rechtliche Grundlagen",
steps:["Selbstbestimmungsrecht: Bindungswirkung des freien Pat.-Willens","4 Kriterien: Informationsverständnis, -verarbeitung, Bewertung, Bestimmbarkeit","Psychische Ursachen prüfen: Delir, Demenz, Schizophrenie, Manie, Depression, Suizidalität","Somatische Ursachen prüfen: GCS < 15, Desorientierung, Alkohol/Drogen/Medikamente, Krampfanfall, Hypoglykämie","Sondersituation Minderjährige: < 14 J. nicht einwilligungsfähig, > 16 J. oft schon","Eltern/Sorgeberechtigte entscheiden bei nicht einwilligungsfähigen Minderjährigen"],
decisions:[
{q:"Patient riecht stark nach Alkohol, GCS 14, zeitlich desorientiert. Einwilligungsfähig?",opts:["Ja – er kann noch sprechen","Nein – GCS < 15 + Desorientierung + Alkohol"],correct:1,feedback:"BPR: GCS < 15, zeitliche Desorientierung und erhebliche Alkoholbeeinträchtigung = somatische Ursachen für fehlende Einwilligungsfähigkeit."},
{q:"15-jährige Jugendliche mit Bauchschmerzen, orientiert, verständig. Eltern nicht erreichbar. Einwilligungsfähig?",opts:["Nein – unter 18 = nie einwilligungsfähig","Möglich – Einzelfallprüfung, > 14 J., reif und verständig"],correct:1,feedback:"BPR: Keine feste Altersgrenze. Ab 14-16 Jahren im Einzelfall prüfen. Alter, Reife und Schwere der Erkrankung berücksichtigen."},
{q:"Welches Kriterium gehört NICHT zu den 4 Aspekten der Einwilligungsfähigkeit?",opts:["Informationsverständnis","Körperliche Belastbarkeit"],correct:1,feedback:"Die 4 Aspekte: Informationsverständnis, Informationsverarbeitung, Bewertung erhaltener Informationen, Bestimmbarkeit des eigenen Willens."},
{q:"Patient hat eine bekannte Demenz, ist aber aktuell orientiert und versteht die Aufklärung. Einwilligungsfähig?",opts:["Nein – Demenz = grundsätzlich nicht einwilligungsfähig","Ja – aktuelle Situation entscheidend, alle 4 Kriterien erfüllt"],correct:1,feedback:"BPR: Entscheidend ist die aktuelle Fähigkeit. Wenn alle 4 Kriterien erfüllt sind, ist der Pat. trotz Grunderkrankung einwilligungsfähig."}
],
gaps:[
{text:"4 Kriterien: Informations___, Informations___, ___ erhaltener Informationen, ___ des eigenen Willens",answer:"verständnis;verarbeitung;Bewertung;Bestimmbarkeit"},
{text:"Somatisch: GCS < ___, Beeinträchtigung durch ___/___/Arzneimittel",answer:"15;Alkohol;Drogen"},
{text:"Kinder < ___ Jahre: nicht einwilligungsfähig. Jugendliche > ___ Jahre: oft schon",answer:"14;16"}
]},
{id:"transportverweigerung",name:"Behandlungs-/Transportverweigerung",kat:"Rechtliche Grundlagen",
steps:["Pat. lehnt Behandlung/Transport ab","Behandlungspflichtigkeit einschätzen: hoch vs. niedrig","Einwilligungsfähigkeit prüfen","Hohe Pflichtigkeit + nicht einwilligungsfähig → NA, ggf. Zwangsbehandlung","Hohe Pflichtigkeit + einwilligungsfähig → verschärfte Aufklärung + NA","Niedrige Pflichtigkeit + einwilligungsfähig → verschärfte Aufklärung + Angehörige","Niedrige Pflichtigkeit + nicht einwilligungsfähig → NA/TNA + gesetzl. Vertreter","Verweigerung: Formblatt, Zeugen, Kopie beim Pat.","Angemessene Hilfe sicherstellen: 112, 116 117, Hausarzt","Ausführliche Dokumentation"],
decisions:[
{q:"70-jährige Patientin mit V.a. Apoplex (Hemiparese, Aphasie) verweigert Transport. Wie stufen Sie die Behandlungspflichtigkeit ein?",opts:["Niedrig – sie ist wach","Hoch – manifeste ABCDE-Problematik (D-Problem)"],correct:1,feedback:"BPR: Neurologisches Defizit = manifeste ABCDE-Problematik (D-Problem). Hohe Behandlungspflichtigkeit!"},
{q:"Gleiche Patientin: Sie ist orientiert, GCS 15, versteht die Aufklärung. Was tun Sie?",opts:["Transport erzwingen – rechtfertigender Notstand","Verschärfte Aufklärung + NA hinzuziehen"],correct:1,feedback:"BPR: Bei hoher Behandlungspflichtigkeit + einwilligungsfähig → verschärfte Aufklärung und NA hinzuziehen."},
{q:"30-Jähriger nach Synkope, jetzt beschwerdefrei, GCS 15, alle Vitale normal. Verweigert Transport. Behandlungspflichtigkeit?",opts:["Hoch – Synkope könnte sich wiederholen","Eher niedrig – keine manifeste ABCDE-Problematik"],correct:1,feedback:"BPR: Aktuell keine manifeste ABCDE-Problematik und nicht sicher davon auszugehen → eher niedrige Behandlungspflichtigkeit."},
{q:"Patient verweigert – welche Hilfsangebote müssen Sie sicherstellen?",opts:["Keine – Patient hat selbst entschieden","Notruf 112, ärztl. Notdienst 116 117, Hausarzt"],correct:1,feedback:"BPR: Angemessene Hilfe sicherstellen: erneuter Notruf 112, ärztlicher Notdienst (KV) 116 117, Hausarzt."},
{q:"Wer muss bei einer Transportverweigerung IMMER unterschreiben?",opts:["Nur der Patient selbst unter allen Umständen","Zeugenunterschriften der Besatzung – ausnahmslos"],correct:1,feedback:"BPR: Zeugenunterschriften der Besatzung sind ausnahmslos zu leisten. Die Pat.-Unterschrift ist empfehlenswert, aber nicht zwingend erforderlich."}
],
gaps:[
{text:"Hohe Behandlungspflichtigkeit: manifeste ___-Problematik",answer:"ABCDE"},
{text:"§ ___ StGB: rechtfertigender Notstand",answer:"34"},
{text:"Angemessene Hilfe: Notruf ___, KV ___, ___",answer:"112;116 117;Hausarzt"},
{text:"Verschärfte Aufklärung: in ___ Worten die gravierenden negativen ___",answer:"klaren;Auswirkungen"}
]}
];
// ═══════════════════════════════════════════════════════
// ENTITY LINKING SYSTEM
// ═══════════════════════════════════════════════════════
