// Entity linking system
function buildEntityMap() {
var map = {};
MEDICATIONS.forEach(m => { map[m.name.toLowerCase()] = { tab:"meds", id:m.id, label:m.name }; });
// Aliases for common medication references
var medAliases = {"epi":"epinephrin","adrenalin":"epinephrin","nitro":"glyceroltrinitrat","nitroglycerin":"glyceroltrinitrat","glucose 40%":"glucose","g40":"glucose","nacl":"vel","vollelektrolytlösung":"vel","vel":"vel","nalbuphin":"nalbuphin","paracetamol":"paracetamol","ibuprofen":"ibuprofen","ipratropiumbromid":"ipratropiumbromid","tranexamsäure":"tranexamsäure","txa":"txa","lidocain":"lidocain","metoprolol":"metoprolol","sauerstoff":"sauerstoff","o2":"sauerstoff","o₂":"sauerstoff","ringer":"vel","ringer-acetat":"vel","sterofundin":"vel","kristalloid":"vel"};
Object.entries(medAliases).forEach(([alias,name])=>{
const m = MEDICATIONS.find(x=>x.name.toLowerCase()===name);
if(m) map[alias] = {tab:"meds",id:m.id,label:m.name};
});
INVASIVE.forEach(m => {
map[m.name.toLowerCase()] = { tab:"invasive", id:m.id, label:m.name };
});
// SAA aliases
var invAliases = {"tourniquet":"tourniquet","beckenschlinge":"beckenschlinge","ega":"ega","extraglottischer atemweg":"ega","cpap":"cpap","niv":"cpap","cpap/niv":"cpap","defibrillation":"defi","manuelle defibrillation":"defi","kardioversion":"kardioversion","schrittmacher":"schrittmacher","externe schrittmacheranlage":"schrittmacher","schrittmachertherapie":"schrittmacher","thoraxentlastungspunktion":"thorax","thoraxpunktion":"thorax","i.v.-zugang":"iv","i.v. zugang":"iv","i.o.-zugang":"io","i.o. zugang":"io","laryngoskopie":"laryngoskopie","magillzange":"laryngoskopie","laryngoskopie/magillzange":"laryngoskopie","lts-d":"ega_ltsd","larynxtubus":"ega_ltsd","larynxmaske":"ega_lma","lma":"ega_lma","i-gel":"ega_igel","igel":"ega_igel","achsengerechte immobilisation":"achsengerecht","immobilisation":"achsengerecht","endobronchiales absaugen":"endobronchial","i.m.-injektion":"im_injektion","i.m. injektion":"im_injektion","intramuskuläre injektion":"im_injektion","intranasale gabe":"in_gabe","intranasale medikamentengabe":"in_gabe","mad":"in_gabe"};
Object.entries(invAliases).forEach(([alias,id])=>{
const m = INVASIVE.find(x=>x.id===id);
if(m) map[alias] = {tab:"invasive",id:m.id,label:m.name};
});
LEITSYMPTOME.forEach(l => { map[l.name.toLowerCase()] = { tab:"leitsymptome", id:l.id, label:l.name }; });
BPR.forEach(b => {
map[b.name.toLowerCase()] = { tab:"bpr", id:b.id, label:b.name };
// Short aliases
var shorts = {"acs":"acs","als":"rea_als","pls":"rea_pls","nls":"rea_nls","post-rosc":"post_rosc"};
if(shorts[b.id]) map[b.id] = {tab:"bpr",id:b.id,label:b.name};
});
// BPR common name aliases
var bprAliases = {"reanimation":"rea_als","anaphylaxie":"anaphylaxie","sepsis":"sepsis","polytrauma":"polytrauma","schlaganfall":"schlaganfall","hypoglykämie":"hypoglyk","bronchialobstruktion":"bronchial","lungenödem":"lungenoedem","kardiales lungenödem":"lungenoedem","hypertensiver notfall":"hypertensiv","krampfanfall":"krampf_erw","bradykardie":"bradykardie","tachykardie":"tachykardie","intoxikation":"intoxikation","hypothermie":"hypothermie","dehydratation":"dehydratation","lungenarterienembolie":"lae","lae":"lae","aortensyndrom":"aortensyndrom","stromunfall":"stromunfall","thermische verletzung":"thermisch","thermische verletzungen":"thermisch","pseudokrupp":"obstruktion_kind","hyperglykämie":"hyperglyk","arterieller verschluss":"art_verschluss","tracheostoma":"tracheostoma"};
Object.entries(bprAliases).forEach(([alias,id])=>{
const b = BPR.find(x=>x.id===id);
if(b && !map[alias]) map[alias] = {tab:"bpr",id:b.id,label:b.name};
});
return map;
}
var ENTITY_MAP = buildEntityMap();
// Sorted by length descending so longer matches are found first
var ENTITY_KEYS = Object.keys(ENTITY_MAP).sort((a,b)=>b.length-a.length);
