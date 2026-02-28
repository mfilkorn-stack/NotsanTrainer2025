// Entity linking system
function buildEntityMap() {
const map = {};
MEDICATIONS.forEach(m => { map[m.name.toLowerCase()] = { tab:"meds", id:m.id, label:m.name }; });
// Aliases for common medication references
const medAliases = {"epi":"epinephrin","adrenalin":"epinephrin","nitro":"glyceroltrinitrat","nitroglycerin":"glyceroltrinitrat","glucose 40%":"glucose","g40":"glucose","nacl":"vel","vollelektrolytlösung":"vel","vel":"vel","nalbuphin":"nalbuphin","paracetamol":"paracetamol","ibuprofen":"ibuprofen","ipratropiumbromid":"ipratropiumbromid","tranexamsäure":"tranexamsäure","txa":"txa","lidocain":"lidocain","metoprolol":"metoprolol","sauerstoff":"sauerstoff","o2":"sauerstoff","o₂":"sauerstoff","ringer":"vel","ringer-acetat":"vel","sterofundin":"vel","kristalloid":"vel"};
Object.entries(medAliases).forEach(([alias,name])=>{
const m = MEDICATIONS.find(x=>x.name.toLowerCase()===name);
if(m) map[alias] = {tab:"meds",id:m.id,label:m.name};
});
INVASIVE.forEach(m => {
map[m.name.toLowerCase()] = { tab:"invasive", id:m.id, label:m.name };
});
// SAA aliases
const invAliases = {"tourniquet":"tourniquet","beckenschlinge":"beckenschlinge","ega":"ega","extraglottischer atemweg":"ega","cpap":"cpap","niv":"cpap","cpap/niv":"cpap","defibrillation":"defi","manuelle defibrillation":"defi","kardioversion":"kardioversion","schrittmacher":"schrittmacher","externe schrittmacheranlage":"schrittmacher","schrittmachertherapie":"schrittmacher","thoraxentlastungspunktion":"thorax","thoraxpunktion":"thorax","i.v.-zugang":"iv","i.v. zugang":"iv","i.o.-zugang":"io","i.o. zugang":"io","laryngoskopie":"laryngoskopie","magillzange":"laryngoskopie","laryngoskopie/magillzange":"laryngoskopie","lts-d":"ega_ltsd","larynxtubus":"ega_ltsd","larynxmaske":"ega_lma","lma":"ega_lma","i-gel":"ega_igel","igel":"ega_igel","achsengerechte immobilisation":"achsengerecht","immobilisation":"achsengerecht","endobronchiales absaugen":"endobronchial","i.m.-injektion":"im_injektion","i.m. injektion":"im_injektion","intramuskuläre injektion":"im_injektion","intranasale gabe":"in_gabe","intranasale medikamentengabe":"in_gabe","mad":"in_gabe"};
Object.entries(invAliases).forEach(([alias,id])=>{
const m = INVASIVE.find(x=>x.id===id);
if(m) map[alias] = {tab:"invasive",id:m.id,label:m.name};
});
LEITSYMPTOME.forEach(l => { map[l.name.toLowerCase()] = { tab:"leitsymptome", id:l.id, label:l.name }; });
BPR.forEach(b => {
map[b.name.toLowerCase()] = { tab:"bpr", id:b.id, label:b.name };
// Short aliases
const shorts = {"acs":"acs","als":"rea_als","pls":"rea_pls","nls":"rea_nls","post-rosc":"post_rosc"};
if(shorts[b.id]) map[b.id] = {tab:"bpr",id:b.id,label:b.name};
});
// BPR common name aliases
const bprAliases = {"reanimation":"rea_als","anaphylaxie":"anaphylaxie","sepsis":"sepsis","polytrauma":"polytrauma","schlaganfall":"schlaganfall","hypoglykämie":"hypoglyk","bronchialobstruktion":"bronchial","lungenödem":"lungenoedem","kardiales lungenödem":"lungenoedem","hypertensiver notfall":"hypertensiv","krampfanfall":"krampf_erw","bradykardie":"bradykardie","tachykardie":"tachykardie","intoxikation":"intoxikation","hypothermie":"hypothermie","dehydratation":"dehydratation","lungenarterienembolie":"lae","lae":"lae","aortensyndrom":"aortensyndrom","stromunfall":"stromunfall","thermische verletzung":"thermisch","thermische verletzungen":"thermisch","pseudokrupp":"obstruktion_kind","hyperglykämie":"hyperglyk","arterieller verschluss":"art_verschluss","tracheostoma":"tracheostoma"};
Object.entries(bprAliases).forEach(([alias,id])=>{
const b = BPR.find(x=>x.id===id);
if(b && !map[alias]) map[alias] = {tab:"bpr",id:b.id,label:b.name};
});
return map;
}
const ENTITY_MAP = buildEntityMap();
// Sorted by length descending so longer matches are found first
const ENTITY_KEYS = Object.keys(ENTITY_MAP).sort((a,b)=>b.length-a.length);
function LinkedText({text, navigate, style}) {
if(!text || !navigate) return <span style={style}>{text}</span>;
const linkStyle = {color:"#60a5fa",cursor:"pointer",textDecoration:"underline",textDecorationStyle:"dotted",textUnderlineOffset:3,textDecorationColor:"#60a5fa50"};
// Simple word-boundary matching for entities
let result = [];
let remaining = text;
while(remaining.length > 0) {
let bestMatch = null;
let bestIdx = remaining.length;
for(const ek of ENTITY_KEYS) {
const idx = remaining.toLowerCase().indexOf(ek);
if(idx !== -1 && idx < bestIdx) {
bestIdx = idx;
bestMatch = ek;
}
}
if(!bestMatch) { result.push(remaining); break; }
if(bestIdx > 0) result.push(remaining.substring(0, bestIdx));
const matchedText = remaining.substring(bestIdx, bestIdx + bestMatch.length);
result.push({matched: matchedText, entity: ENTITY_MAP[bestMatch]});
remaining = remaining.substring(bestIdx + bestMatch.length);
}
if(result.length <= 1 && typeof result[0] === 'string') return <span style={style}>{text}</span>;
return <span style={style}>{result.map((part,i)=>{
if(typeof part === 'string') return <span key={i}>{part}</span>;
return <span key={i} style={linkStyle} onClick={(e)=>{e.stopPropagation();navigate("reference",part.entity.tab+":"+part.entity.id);}} title={"\u2192 "+part.entity.label}>{part.matched}</span>;
})}</span>;
}
function LinkedBadge({text, navigate, color}) {
const key = text.toLowerCase();
const entity = ENTITY_MAP[key];
const badgeStyle = {display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:(color||"#3b82f6")+"18",color:color||"#3b82f6",letterSpacing:.3};
if(entity && navigate) {
return <span style={{...badgeStyle,cursor:"pointer",textDecoration:"underline",textDecorationStyle:"dotted",textUnderlineOffset:2,textDecorationColor:(color||"#3b82f6")+"60"}} onClick={(e)=>{e.stopPropagation();navigate("reference",`${entity.tab}:${entity.id}`);}} title={`→ ${entity.label}`}>{text}</span>;
}
return <span style={badgeStyle}>{text}</span>;
}
