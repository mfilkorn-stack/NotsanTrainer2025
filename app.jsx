var { useState, useEffect, useCallback, useMemo, useRef } = React;

function useDebounce(value, delay) {
const [debounced, setDebounced] = useState(value);
useEffect(() => {
const t = setTimeout(() => setDebounced(value), delay);
return () => clearTimeout(t);
}, [value, delay]);
return debounced;
}

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


// ═══════════════════════════════════════════════════════
// SVG ICON SYSTEM
// ═══════════════════════════════════════════════════════
const ICON_PATHS = {
  home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1",
  book: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  brain: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  folder: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
  clipboard: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  pill: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z||M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  syringe: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  stethoscope: "M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125V4.5M6.75 21a3.75 3.75 0 003.75-3.75V8.25M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072",
  heartPulse: "M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 19.657l-8.828-8.829a4 4 0 010-5.656z",
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0z||M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  ear: "M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z",
  activity: "M3 12h4l3-9 4 18 3-9h4",
  neurology: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
  hand: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11",
  megaphone: "M10 34V26M42 6v12M10 18h4l20 12V6L14 18h-4z||M10 18v8",
  wrench: "M11.42 15.17l-4.655 4.655a2.122 2.122 0 01-3-3L8.42 12.17m2.999 3.001L19.5 7.125M13.5 4.5L21 12m0 0l-7.5 7.5M3 21L12 12",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  target: "M12 8V4m0 4a4 4 0 100 8 4 4 0 000-8zm-8 4H0m4 0a8 8 0 1016 0 8 8 0 00-16 0zm20 0h-4",
  award: "M12 15l-3.5 2 1-3.8L6 10.5l3.9-.3L12 6.5l2.1 3.7 3.9.3-3 2.7 1 3.8z||M12 15v7",
  check: "M5 13l4 4L19 7",
  alertTriangle: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  thermometer: "M14.121 14.121A3 3 0 109.88 9.88m4.242 4.242L9.88 9.88m4.242 4.242L6.343 6.343",
  users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  zap: "M13 10V3L4 14h7v7l9-11h-7z",
  lung: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3",
  arrowLeft: "M10 19l-7-7m0 0l7-7m-7 7h18",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  play: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z||M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  refresh: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  crosshair: "M12 2v4m0 12v4M2 12h4m12 0h4m-5 0a3 3 0 11-6 0 3 3 0 016 0zm5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  bone: "M15 12a3 3 0 11-6 0 3 3 0 016 0z||M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2L12 21l3.5-2L19 21z",
  chevronRight: "M9 5l7 7-7 7",
  ambulance: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0",
  graduationCap: "M12 14l9-5-9-5-9 5 9 5z||M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z||M12 14l-9-5v7",
};

const Icon = ({name, size=20, color="currentColor", strokeWidth=1.8, style:s}) => {
  const pathData = ICON_PATHS[name];
  if (!pathData) return null;
  const paths = pathData.split("||");
  // Special handling for activity (line path)
  if (name === "activity") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,...s}}>
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    );
  }
  if (name === "layers") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,...s}}>
        <polygon points="12,2 2,7 12,12 22,7"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/>
      </svg>
    );
  }
  if (name === "zap") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,...s}}>
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,...s}}>
      {paths.map((d,i) => <path key={i} d={d}/>)}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════
// LOGO COMPONENT (Star of Life inspired)
// ═══════════════════════════════════════════════════════
const Logo = ({size=40}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{flexShrink:0}}>
    <defs>
      <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444"/>
        <stop offset="100%" stopColor="#f97316"/>
      </linearGradient>
      <linearGradient id="logoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.95"/>
        <stop offset="100%" stopColor="#fde8e8" stopOpacity="0.9"/>
      </linearGradient>
      <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ef4444" floodOpacity="0.3"/>
      </filter>
    </defs>
    <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#logoGrad1)" filter="url(#logoShadow)"/>
    <rect x="8" y="8" width="84" height="84" rx="18" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
    {/* Star of Life - 6 pointed */}
    <g transform="translate(50,50)">
      {[0,60,120,180,240,300].map((a,i) => (
        <rect key={i} x="-5" y="-30" width="10" height="60" rx="3" fill="url(#logoGrad2)" transform={`rotate(${a})`} opacity="0.92"/>
      ))}
      <circle cx="0" cy="0" r="12" fill="url(#logoGrad1)" stroke="url(#logoGrad2)" strokeWidth="2.5"/>
      {/* Pulse line inside circle */}
      <polyline points="-8,0 -4,0 -2,-6 2,6 4,0 8,0" fill="none" stroke="url(#logoGrad2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

const LogoLarge = ({size=80}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{flexShrink:0}}>
    <defs>
      <linearGradient id="logoLg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444"/>
        <stop offset="50%" stopColor="#dc2626"/>
        <stop offset="100%" stopColor="#f97316"/>
      </linearGradient>
      <linearGradient id="logoLg2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff"/>
        <stop offset="100%" stopColor="#fef2f2"/>
      </linearGradient>
      <filter id="glowLg" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feFlood floodColor="#ef4444" floodOpacity="0.25"/>
        <feComposite in2="blur" operator="in"/>
        <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect x="6" y="6" width="108" height="108" rx="28" fill="url(#logoLg1)" filter="url(#glowLg)"/>
    <rect x="10" y="10" width="100" height="100" rx="24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
    <g transform="translate(60,60)">
      {[0,60,120,180,240,300].map((a,i) => (
        <rect key={i} x="-6.5" y="-36" width="13" height="72" rx="4" fill="url(#logoLg2)" transform={`rotate(${a})`} opacity="0.9"/>
      ))}
      <circle cx="0" cy="0" r="15" fill="url(#logoLg1)" stroke="url(#logoLg2)" strokeWidth="3"/>
      <polyline points="-10,0 -5,0 -2.5,-8 2.5,8 5,0 10,0" fill="none" stroke="url(#logoLg2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);

// ═══════════════════════════════════════════════════════
// STYLES (CSS-in-JS)
// ═══════════════════════════════════════════════════════
const COLORS = {
bg: "#06080f",
bgSubtle: "#0c1019",
card: "#0f1525",
cardHover: "#151d33",
cardElevated: "#131b30",
accent: "#ef4444",
accentGlow: "rgba(239,68,68,0.15)",
accentDark: "#b91c1c",
blue: "#3b82f6",
blueGlow: "rgba(59,130,246,0.15)",
green: "#22c55e",
greenGlow: "rgba(34,197,94,0.15)",
yellow: "#eab308",
yellowGlow: "rgba(234,179,8,0.15)",
orange: "#f97316",
purple: "#a855f7",
text: "#f1f5f9",
textMuted: "#94a3b8",
textDim: "#4a5568",
border: "#1a2236",
borderLight: "#243049",
};
const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{background:${COLORS.bg};color:${COLORS.text};font-family:'Outfit',system-ui,sans-serif;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:${COLORS.borderLight};border-radius:10px;}
@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
@keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes glow{0%,100%{box-shadow:0 0 5px ${COLORS.accent}40}50%{box-shadow:0 0 20px ${COLORS.accent}60}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes shake{0%,100%{transform:translateX(0)}15%,45%,75%{transform:translateX(-6px)}30%,60%,90%{transform:translateX(6px)}}
@keyframes correctPop{0%{transform:scale(1)}40%{transform:scale(1.03)}100%{transform:scale(1)}}
@keyframes wrongFlash{0%{opacity:1}50%{opacity:.7}100%{opacity:1}}
@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(120px) rotate(720deg);opacity:0}}
@keyframes scoreReveal{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
@keyframes checkDraw{0%{stroke-dashoffset:24}100%{stroke-dashoffset:0}}
.shake-anim{animation:shake .5s ease-in-out;}
.correct-pop{animation:correctPop .4s ease-out;}
.wrong-flash{animation:wrongFlash .4s ease-out;}
@keyframes floatPulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.05);opacity:1}}
@keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
.fade-in{animation:fadeIn .5s cubic-bezier(.16,1,.3,1) both;}
.card-grid{display:grid;gap:12px;}
.card-grid>*{height:100%;box-sizing:border-box;}
.slide-in{animation:slideIn .35s ease-out both;}
.glass{background:rgba(15,21,37,0.7);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);}
@media(min-width:769px){.bottom-nav{display:none!important;}.desktop-nav{display:flex!important;}}
@media(max-width:768px){.desktop-nav{display:none!important;}.bottom-nav{display:flex!important;}.header-logo-text{font-size:15px!important;}}
`;
// ═══════════════════════════════════════════════════════
// HAPTIC FEEDBACK & MICRO-ANIMATIONS
// ═══════════════════════════════════════════════════════
const haptic = (type) => {
if(!navigator.vibrate) return;
if(type==="success") navigator.vibrate([10,30,10]);
else if(type==="error") navigator.vibrate([50,30,50]);
else if(type==="light") navigator.vibrate(5);
};
function ConfettiBurst({active,color=COLORS.green}) {
if(!active) return null;
const pieces = Array.from({length:18},(_,i)=>({
id:i,
left: 10 + Math.random()*80,
delay: Math.random()*0.3,
duration: 0.6 + Math.random()*0.5,
size: 4 + Math.random()*5,
color: [COLORS.green,"#34d399","#fbbf24","#60a5fa","#a78bfa","#f472b6"][i%6],
rotation: Math.random()*360,
x: (Math.random()-0.5)*120,
}));
return (
<div style={{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",overflow:"hidden",zIndex:10}}>
{pieces.map(p=>(
<div key={p.id} style={{
position:"absolute",top:"40%",left:`${p.left}%`,
width:p.size,height:p.size,borderRadius:p.size>6?2:"50%",
background:p.color,opacity:0,
animation:`confettiFall ${p.duration}s ease-out ${p.delay}s both`,
transform:`rotate(${p.rotation}deg)`,
marginLeft:p.x,
}}/>
))}
</div>
);
}
function ScoreCircle({pct,size=140,strokeWidth=10}) {
const r = (size-strokeWidth)/2;
const circ = 2*Math.PI*r;
const offset = circ - (pct/100)*circ;
const color = pct>=80?COLORS.green:pct>=60?COLORS.yellow:COLORS.accent;
return (
<div style={{position:"relative",width:size,height:size,margin:"0 auto",animation:"scoreReveal .7s cubic-bezier(.16,1,.3,1) both"}}>
<svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
<circle cx={size/2} cy={size/2} r={r} fill="none" stroke={COLORS.border} strokeWidth={strokeWidth}/>
<circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
style={{transition:"stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1) .3s"}}/>
</svg>
<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
<div style={{fontSize:size*0.3,fontWeight:800,color,lineHeight:1}}>{pct}%</div>
<div style={{fontSize:size*0.09,color:COLORS.textMuted,fontWeight:500,marginTop:2}}>{pct>=80?"Sehr gut":pct>=60?"Gut":"Üben"}</div>
</div>
</div>
);
}
// ═══════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════
const Badge = ({children,color=COLORS.accent,bg}) => (
<span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,letterSpacing:.3,background:bg||color+"15",color,border:`1px solid ${color}25`,textTransform:"uppercase"}}>{children}</span>
);
const Button = ({children,onClick,variant="primary",size="md",disabled,style:s}) => {
const base = {border:"none",borderRadius:10,fontFamily:"'Outfit',sans-serif",fontWeight:600,cursor:disabled?"not-allowed":"pointer",transition:"all .25s cubic-bezier(.16,1,.3,1)",opacity:disabled?.5:1,display:"inline-flex",alignItems:"center",gap:7,letterSpacing:0.2};
const sizes = {sm:{padding:"7px 15px",fontSize:13},md:{padding:"11px 22px",fontSize:14},lg:{padding:"14px 28px",fontSize:16}};
const variants = {
primary:{background:`linear-gradient(135deg,${COLORS.accent},${COLORS.accentDark})`,color:"#fff",boxShadow:`0 4px 16px ${COLORS.accent}30`},
secondary:{background:COLORS.borderLight,color:COLORS.text},
ghost:{background:"transparent",color:COLORS.textMuted,border:`1px solid ${COLORS.border}`},
success:{background:`linear-gradient(135deg,${COLORS.green},#16a34a)`,color:"#fff",boxShadow:`0 4px 16px ${COLORS.green}30`},
blue:{background:`linear-gradient(135deg,${COLORS.blue},#2563eb)`,color:"#fff",boxShadow:`0 4px 16px ${COLORS.blue}30`},
};
return <button onClick={onClick} disabled={disabled} style={{...base,...sizes[size],...variants[variant],...s}}
onMouseEnter={e=>{if(!disabled){e.target.style.transform="translateY(-2px) scale(1.02)";e.target.style.boxShadow=`0 8px 24px ${(variants[variant].background||"").includes(COLORS.accent)?COLORS.accent:COLORS.blue}40`;}}}
onMouseLeave={e=>{e.target.style.transform="none";e.target.style.boxShadow=variants[variant].boxShadow||"none";}}>{children}</button>;
};
const Card = ({children,style:s,onClick,glow}) => (
<div onClick={onClick} style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:18,padding:24,boxShadow:glow?`0 0 40px ${glow}, inset 0 1px 0 rgba(255,255,255,0.04)`:"0 4px 24px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,0.03)",cursor:onClick?"pointer":"default",transition:"all .35s cubic-bezier(.16,1,.3,1)",position:"relative",overflow:"hidden",boxSizing:"border-box",...s}}
onMouseEnter={e=>{if(onClick){e.currentTarget.style.borderColor=COLORS.accent+"60";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 12px 40px rgba(0,0,0,.5), 0 0 30px ${glow||COLORS.accent+"15"}`;}}}
onMouseLeave={e=>{if(onClick){e.currentTarget.style.borderColor=COLORS.border;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=glow?`0 0 40px ${glow}`:"0 4px 24px rgba(0,0,0,.4)";}}}>{children}</div>
);
const EmptyState = ({text="Keine Ergebnisse",sub="Versuchen Sie einen anderen Suchbegriff.",iconName="search"}) => (
<div style={{textAlign:"center",padding:"48px 20px",color:COLORS.textDim,gridColumn:"1/-1"}}>
<Icon name={iconName} size={40} color={COLORS.textDim} style={{marginBottom:12}}/>
<div style={{fontSize:16,fontWeight:600,color:COLORS.textMuted,marginBottom:6}}>{text}</div>
<div style={{fontSize:13}}>{sub}</div>
</div>
);
function ConfirmModal({open,title,message,onConfirm,onCancel,confirmLabel="Zurücksetzen"}) {
if(!open) return null;
return (
<div onClick={onCancel} style={{position:"fixed",inset:0,zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)"}}>
<div className="fade-in" onClick={e=>e.stopPropagation()} style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:18,padding:28,maxWidth:400,width:"90%",textAlign:"center"}}>
<div style={{fontSize:40,marginBottom:12}}>&#9888;</div>
<h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>{title}</h3>
<p style={{color:COLORS.textMuted,fontSize:14,lineHeight:1.6,marginBottom:24}}>{message}</p>
<div style={{display:"flex",gap:12,justifyContent:"center"}}>
<Button onClick={onCancel} variant="ghost">Abbrechen</Button>
<Button onClick={onConfirm} style={{background:COLORS.accent}}>{confirmLabel}</Button>
</div>
</div>
</div>
);
}
const ProgressBar = ({value,max,color=COLORS.accent,h=8}) => (
<div style={{width:"100%",height:h,background:COLORS.border,borderRadius:h,overflow:"hidden"}}>
<div style={{width:`${Math.min(100,(value/max)*100)}%`,height:"100%",background:`linear-gradient(90deg,${color},${color}cc)`,borderRadius:h,transition:"width .6s cubic-bezier(.16,1,.3,1)",boxShadow:`0 0 12px ${color}40`}}/>
</div>
);
// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
function App() {
const [view, setView] = useState("dashboard");
const [subView, setSubView] = useState(null);
const [stats, setStats] = useState({quizCorrect:0,quizTotal:0,casesCompleted:0,examScores:[],wrongQuestions:[]});
const [loaded, setLoaded] = useState(false);
useEffect(()=>{
(async()=>{
try{var r=localStorage.getItem("notsan-stats");if(r)setStats(JSON.parse(r));}catch(e){}
setLoaded(true);
})();
},[]);
useEffect(()=>{
if(loaded){try{localStorage.setItem("notsan-stats",JSON.stringify(stats));}catch(e){}}
},[stats,loaded]);
const navigate = (v,sub=null)=>{setView(v);setSubView(sub);window.scrollTo({top:0,behavior:'smooth'});};
return (
<div style={{minHeight:"100vh",background:COLORS.bg}}>
<style>{css}</style>
<Header navigate={navigate} current={view}/>
<main style={{maxWidth:1100,margin:"0 auto",padding:"20px 16px 100px"}}>
{view==="dashboard" && <Dashboard stats={stats} navigate={navigate}/>}
{view==="quiz" && <Quiz subView={subView} navigate={navigate} stats={stats} setStats={setStats}/>}
{view==="cases" && <CaseSimulation navigate={navigate} stats={stats} setStats={setStats}/>}
{view==="reference" && <Reference subView={subView} navigate={navigate}/>}
{view==="exam" && <Exam navigate={navigate} stats={stats} setStats={setStats}/>}
{view==="stats" && <Statistics stats={stats} setStats={setStats} navigate={navigate}/>}
</main>
</div>
);
}
// ═══════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════
function Header({navigate,current}) {
const items=[
{id:"dashboard",label:"Dashboard",iconName:"home"},
{id:"reference",label:"Lexikon",iconName:"book"},
{id:"quiz",label:"Quiz",iconName:"brain"},
{id:"cases",label:"Fälle",iconName:"folder"},
{id:"exam",label:"Prüfung",iconName:"graduationCap"},
{id:"stats",label:"Statistik",iconName:"chart"},
];
return(
<React.Fragment>
<header style={{background:"linear-gradient(180deg,rgba(15,21,37,0.95) 0%,rgba(6,8,15,0.98) 100%)",borderBottom:`1px solid ${COLORS.border}`,position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
<div style={{maxWidth:1100,margin:"0 auto",padding:"14px 16px"}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
<div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>navigate("dashboard")}>
<Logo size={38}/>
<div>
<div className="header-logo-text" style={{fontSize:17,fontWeight:700,letterSpacing:-.5,lineHeight:1.1}}>NotSan<span style={{color:COLORS.accent}}>Trainer</span></div>
<div style={{fontSize:10,color:COLORS.textDim,letterSpacing:1,fontWeight:500,textTransform:"uppercase"}}>v{APP_VERSION} · SAA / BPR 2025</div>
</div>
</div>
<nav className="desktop-nav" style={{display:"flex",gap:2,flexWrap:"wrap"}}>
{items.map(i=>(
<button key={i.id} onClick={()=>navigate(i.id)} style={{background:current===i.id?COLORS.accent+"15":"transparent",color:current===i.id?COLORS.accent:COLORS.textMuted,border:"none",borderRadius:10,padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:5,transition:"all .25s",borderBottom:current===i.id?`2px solid ${COLORS.accent}`:"2px solid transparent",letterSpacing:0.2}}>
<Icon name={i.iconName} size={15} color={current===i.id?COLORS.accent:COLORS.textDim}/><span>{i.label}</span>
</button>
))}
</nav>
</div>
</div>
</header>
{/* ── BOTTOM NAV (mobile only) ── */}
<nav className="bottom-nav" style={{display:"none",position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:"rgba(6,8,15,0.92)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderTop:`1px solid ${COLORS.border}`,padding:"6px 4px calc(6px + env(safe-area-inset-bottom, 0px)) 4px",justifyContent:"space-around",alignItems:"center"}}>
{items.map(i=>{
const active = current===i.id;
return(
<button key={i.id} onClick={()=>navigate(i.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"4px 6px",borderRadius:10,minWidth:0,flex:1,transition:"all .2s",position:"relative"}}>
{active && <div style={{position:"absolute",top:-6,left:"50%",transform:"translateX(-50%)",width:20,height:3,borderRadius:2,background:COLORS.accent,boxShadow:`0 0 8px ${COLORS.accent}80`}}/>}
<div style={{width:36,height:36,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",background:active?COLORS.accent+"18":"transparent",transition:"all .25s",transform:active?"scale(1.05)":"scale(1)"}}>
<Icon name={i.iconName} size={20} color={active?COLORS.accent:COLORS.textDim}/>
</div>
<span style={{fontSize:10,fontWeight:active?700:500,color:active?COLORS.accent:COLORS.textDim,letterSpacing:.2,transition:"all .2s",lineHeight:1}}>{i.label}</span>
</button>
);})}
</nav>
</React.Fragment>
);
}
// ═══════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════
function Dashboard({stats,navigate}) {
const pct = stats.quizTotal>0?Math.round(stats.quizCorrect/stats.quizTotal*100):0;
const modules = [
{iconName:"book",title:"Lexikon",desc:`${MEDICATIONS.length+INVASIVE.length+LEITSYMPTOME.length+BPR.length+EKG_DATA.length+SINNHAFT_DATA.length+SCORES_DATA.length+CHECKLISTS_DATA.length+ABCDE_DATA.length} Einträge in 8 Kategorien`,color:COLORS.blue,glow:COLORS.blueGlow,view:"reference"},
{iconName:"brain",title:"Quiz",desc:`${QUIZ_QUESTIONS.length} Fragen in ${[...new Set(QUIZ_QUESTIONS.map(q=>q.cat))].length} Kategorien inkl. Recht & Aufklärung`,color:COLORS.green,glow:COLORS.greenGlow,view:"quiz"},
{iconName:"folder",title:"Fälle",desc:`${CASES.length} Trainingsfälle · ${EXAM_CASES.length} Prüfungsfälle · Algorithmus-Trainer`,color:COLORS.orange,glow:"rgba(249,115,22,0.12)",view:"cases"},
{iconName:"graduationCap",title:"Prüfung",desc:"25 Fragen + 1 Prüfungsfall · 40 min",color:COLORS.accent,glow:COLORS.accentGlow,view:"exam"},
{iconName:"chart",title:"Statistik",desc:"Lernfortschritt & Analyse",color:COLORS.yellow,glow:COLORS.yellowGlow,view:"stats"},
];
return (
<div className="fade-in">
<Card style={{marginBottom:20,background:`linear-gradient(135deg,${COLORS.card},#131b35)`,border:`1px solid ${COLORS.border}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
<div>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
<Icon name="activity" size={16} color={COLORS.textDim}/>
<span style={{fontSize:12,color:COLORS.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:1}}>Dein Lernfortschritt</span>
</div>
<div style={{fontSize:32,fontWeight:800,letterSpacing:-1}}>{stats.quizTotal>0?`${pct}%`:"0%"} <span style={{fontSize:14,fontWeight:500,color:COLORS.textMuted}}>Erfolgsquote</span></div>
</div>
<div style={{display:"flex",gap:28,flexWrap:"wrap"}}>
<div style={{textAlign:"center"}}><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Icon name="check" size={16} color={COLORS.green}/><span style={{fontSize:24,fontWeight:700,color:COLORS.green}}>{stats.quizCorrect}</span></div><div style={{fontSize:11,color:COLORS.textDim,fontWeight:500}}>Richtig</div></div>
<div style={{textAlign:"center"}}><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Icon name="alertTriangle" size={16} color={COLORS.accent}/><span style={{fontSize:24,fontWeight:700,color:COLORS.accent}}>{stats.quizTotal-stats.quizCorrect}</span></div><div style={{fontSize:11,color:COLORS.textDim,fontWeight:500}}>Falsch</div></div>
<div style={{textAlign:"center"}}><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}><Icon name="folder" size={16} color={COLORS.orange}/><span style={{fontSize:24,fontWeight:700,color:COLORS.orange}}>{stats.casesCompleted}</span></div><div style={{fontSize:11,color:COLORS.textDim,fontWeight:500}}>Fälle</div></div>
</div>
</div>
<div style={{marginTop:16}}><ProgressBar value={stats.quizTotal>0?pct:0} max={100} color={pct>=70?COLORS.green:pct>=40?COLORS.yellow:COLORS.accent} h={6}/></div>
</Card>
<div className="card-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
{modules.map((m,i)=>(
<Card key={i} onClick={()=>navigate(m.view)} glow={m.glow} style={{animationDelay:`${i*70}ms`,display:"flex",flexDirection:"column",justifyContent:"flex-start",minHeight:140}} className="fade-in">
<div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:m.color+"08",filter:"blur(20px)"}}/>
<div style={{display:"flex",alignItems:"flex-start",gap:16,position:"relative",flex:1}}>
<div style={{width:50,height:50,borderRadius:14,background:`linear-gradient(135deg,${m.color}20,${m.color}08)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${m.color}20`}}>
<Icon name={m.iconName} size={24} color={m.color}/>
</div>
<div style={{flex:1,minWidth:0}}>
<h3 style={{fontSize:16,fontWeight:700,marginBottom:5,color:m.color}}>{m.title}</h3>
<p style={{fontSize:13,color:COLORS.textMuted,lineHeight:1.6,fontWeight:400,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical"}}>{m.desc}</p>
</div>
</div>

</Card>
))}
</div>
<Card style={{marginTop:28,background:`linear-gradient(135deg,${COLORS.accent}06,${COLORS.card})`}}>
<div style={{display:"flex",alignItems:"flex-start",gap:12}}>
<Icon name="shield" size={18} color={COLORS.textDim} style={{marginTop:1,flexShrink:0}}/>
<div style={{fontSize:12,color:COLORS.textDim,lineHeight:1.9,fontWeight:400}}>
<strong style={{fontWeight:600}}>Quelle:</strong> SAA und BPR 2025 – Standardarbeitsanweisungen und Behandlungspfade im Rettungsdienst · ÄLRD Baden-Württemberg, Brandenburg, Mecklenburg-Vorpommern, Nordrhein-Westfalen, Sachsen, Sachsen-Anhalt · Stand: Juli 2025
</div>
</div>
</Card>
</div>
);
}
// ═══════════════════════════════════════════════════════
// FLASHCARDS
// ═══════════════════════════════════════════════════════
function Quiz({subView,navigate,stats,setStats}) {
const [category, setCategory] = useState(subView||null);
const [questions, setQuestions] = useState([]);
const [qi, setQi] = useState(0);
const [selected, setSelected] = useState(null);
const [score, setScore] = useState(0);
const [done, setDone] = useState(false);
const autoStarted = React.useRef(false);
const isSchwach = (cat) => cat==="schwachstellen"||cat?.startsWith("schwach_");
const startQuiz = (cat) => {
let filtered;
if(cat==="schwachstellen") filtered=QUIZ_QUESTIONS.filter(q=>stats.wrongQuestions.includes(q.id));
else if(cat?.startsWith("schwach_")) {const rc=cat.replace("schwach_","");filtered=QUIZ_QUESTIONS.filter(q=>stats.wrongQuestions.includes(q.id)&&q.cat===rc);}
else filtered=cat==="all"?QUIZ_QUESTIONS:QUIZ_QUESTIONS.filter(q=>q.cat===cat);
const shuffled = [...filtered].sort(()=>Math.random()-.5).slice(0,Math.min(15,filtered.length));
setQuestions(shuffled);setQi(0);setSelected(null);setScore(0);setDone(false);setCategory(cat);
};
React.useEffect(()=>{if(subView&&isSchwach(subView)&&!autoStarted.current){autoStarted.current=true;startQuiz(subView);}},[]);
const answer = (idx) => {
if(selected!==null) return;
setSelected(idx);
const correct = idx===questions[qi].correct;
if(correct) {setScore(s=>s+1);haptic("success");}
else haptic("error");
setStats(s=>{
const wrong = correct?s.wrongQuestions.filter(id=>id!==questions[qi].id):([...s.wrongQuestions,questions[qi].id]);
return{...s,quizCorrect:s.quizCorrect+(correct?1:0),quizTotal:s.quizTotal+1,wrongQuestions:[...new Set(wrong)]};
});
};
const nextQ = ()=>{
if(qi+1>=questions.length){setDone(true);return;}
setQi(qi+1);setSelected(null);
};
if(!category) return (
<div className="fade-in">
<Button onClick={()=>navigate("dashboard")} variant="ghost" size="sm" style={{marginBottom:20}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<h2 style={{fontSize:22,fontWeight:700,marginBottom:20}}> Quiz</h2>
<div className="card-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
{[{id:"Medikamente",label:"Medikamente",count:QUIZ_QUESTIONS.filter(q=>q.cat==="Medikamente").length,color:COLORS.accent,iconName:"pill"},
{id:"Invasive Maßnahmen",label:"Invasive Maßnahmen",count:QUIZ_QUESTIONS.filter(q=>q.cat==="Invasive Maßnahmen").length,color:COLORS.blue,iconName:"syringe"},
{id:"Leitsymptome",label:"Leitsymptome",count:QUIZ_QUESTIONS.filter(q=>q.cat==="Leitsymptome").length,color:COLORS.orange,iconName:"stethoscope"},
{id:"Behandlungspfade",label:"Krankheitsbilder",count:QUIZ_QUESTIONS.filter(q=>q.cat==="Behandlungspfade").length,color:COLORS.green,iconName:"heartPulse"},
{id:"EKG-Befunde",label:"EKG-Befunde",count:QUIZ_QUESTIONS.filter(q=>q.cat==="EKG-Befunde").length,color:"#e11d48",iconName:"activity"},
{id:"Übergabe",label:"Übergabe",count:QUIZ_QUESTIONS.filter(q=>q.cat==="Übergabe").length,color:"#8b5cf6",iconName:"megaphone"},
{id:"Werkzeuge",label:"Werkzeuge",count:QUIZ_QUESTIONS.filter(q=>q.cat==="Werkzeuge").length,color:"#14b8a6",iconName:"wrench"},
{id:"Recht & Aufklärung",label:"Recht & Aufklärung",count:QUIZ_QUESTIONS.filter(q=>q.cat==="Recht & Aufklärung").length,color:"#f59e0b",iconName:"shield"},
{id:"all",label:"Alle Kategorien",count:QUIZ_QUESTIONS.length,color:COLORS.purple,iconName:"layers"},
].concat(stats.wrongQuestions.length>0?[{id:"schwachstellen",label:"Schwachstellen trainieren",count:stats.wrongQuestions.length,color:COLORS.accent,iconName:"target"}]:[]).map(c=>(
<Card key={c.id} onClick={()=>startQuiz(c.id)}>
<div style={{textAlign:"center"}}>
<div style={{fontSize:36,marginBottom:8}}><Icon name={c.iconName} size={18} color={c.color}/></div>
<h3 style={{color:c.color,fontWeight:700}}>{c.label}</h3>
<p style={{color:COLORS.textMuted,fontSize:13}}>{c.count} Fragen</p>
</div>
</Card>
))}
</div>
</div>
);
if(done) {
const pct = Math.round(score/questions.length*100);
const schwachMode = isSchwach(category);
const remaining = schwachMode?QUIZ_QUESTIONS.filter(q=>stats.wrongQuestions.includes(q.id)).length:0;
return (
<div className="fade-in" style={{textAlign:"center",paddingTop:40}}>
<ScoreCircle pct={pct} size={160}/>
<h2 style={{fontSize:28,fontWeight:700,marginTop:20}}>{schwachMode?"Schwachstellen-Training beendet!":"Quiz beendet!"}</h2>
<p style={{color:COLORS.textMuted,marginTop:8}}>{score} von {questions.length} richtig</p>
{schwachMode && score>0 && <p style={{color:COLORS.green,fontSize:14,marginTop:8}}>{score} Schwachstelle{score>1?"n":""} behoben!</p>}
{schwachMode && remaining>0 && <p style={{color:COLORS.textDim,fontSize:13,marginTop:4}}>Noch {remaining} Schwachstelle{remaining>1?"n":""} übrig</p>}
{schwachMode && remaining===0 && <p style={{color:COLORS.green,fontSize:14,marginTop:8,fontWeight:700}}>Alle Schwachstellen behoben!</p>}
<div style={{display:"flex",justifyContent:"center",gap:12,marginTop:24,flexWrap:"wrap"}}>
<Button onClick={()=>setCategory(null)} variant="secondary">Kategorien</Button>
{schwachMode && remaining>0 ? <Button onClick={()=>startQuiz(category)}>Weiter trainieren</Button> : <Button onClick={()=>startQuiz(category)}>Nochmal</Button>}
</div>
</div>
);
}
const q = questions[qi];
return (
<div className="fade-in">
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
<Button onClick={()=>setCategory(null)} variant="ghost" size="sm"><Icon name="arrowLeft" size={14}/> Zurück</Button>
<div style={{display:"flex",alignItems:"center",gap:12}}>
{isSchwach(category) && <Badge color={COLORS.accent}>Schwachstellen</Badge>}
<Badge color={COLORS.blue}>Frage {qi+1}/{questions.length}</Badge>
<Badge color={COLORS.green}>{score} richtig</Badge>
</div>
</div>
<ProgressBar value={qi+1} max={questions.length} color={COLORS.blue} h={4}/>
<Card style={{marginTop:20}}>
<Badge color={COLORS.textMuted}>{q.cat}</Badge>
{q.cat==="EKG-Befunde" && <div style={{marginBottom:12}}><EcgDiagram ekgId={getEkgIdForQuiz(q.id)} compact={true}/></div>}
<h3 style={{fontSize:17,fontWeight:600,margin:"14px 0 20px",lineHeight:1.5}}>{q.q}</h3>
<div style={{display:"flex",flexDirection:"column",gap:10}}>
{q.opts.map((o,i)=>{
let bg=COLORS.bg;let border=COLORS.border;let color=COLORS.text;
let anim="";
if(selected!==null){
if(i===q.correct){bg=COLORS.green+"20";border=COLORS.green;color=COLORS.green;anim="correct-pop";}
else if(i===selected&&i!==q.correct){bg=COLORS.accent+"20";border=COLORS.accent;color=COLORS.accent;anim="shake-anim";}
} else if(selected===null) {bg=COLORS.bg;}
return(
<div key={i} className={anim} onClick={()=>answer(i)} style={{padding:"12px 16px",background:bg,border:`2px solid ${border}`,borderRadius:12,cursor:selected===null?"pointer":"default",transition:"all .2s",color,fontWeight:selected!==null&&i===q.correct?700:400,position:"relative",overflow:"hidden"}}
onMouseEnter={e=>{if(selected===null)e.currentTarget.style.borderColor=COLORS.blue}}
onMouseLeave={e=>{if(selected===null)e.currentTarget.style.borderColor=COLORS.border}}>
<span style={{fontWeight:700,marginRight:10,opacity:.5}}>{String.fromCharCode(65+i)}</span>{o}
{selected===i&&i===q.correct&&<ConfettiBurst active={true}/>}
</div>
);
})}
</div>
{selected!==null && (
<div style={{marginTop:16}}>
{q.explanation && <Card style={{background:COLORS.blue+"10",borderColor:COLORS.blue+"30"}}>
<div style={{fontSize:13,lineHeight:1.6,color:COLORS.textMuted}}>
<strong style={{color:COLORS.blue}}>Erläuterung:</strong> {q.explanation}
</div>
</Card>}
<div style={{marginTop:12,display:"flex",justifyContent:"flex-end"}}>
<Button onClick={nextQ}>{qi+1>=questions.length?"Ergebnis anzeigen":"Nächste Frage →"}</Button>
</div>
</div>
)}
</Card>
</div>
);
}
// ═══════════════════════════════════════════════════════
// CASE SIMULATION
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
// EXAM CASE SIMULATION (Prüfungsfälle)
// ═══════════════════════════════════════════════════════
function ExamCaseSimulation({navigate,stats,setStats,initialRandom}) {
const [caseIdx, setCaseIdx] = useState(initialRandom?Math.floor(Math.random()*EXAM_CASES.length):null);
const [phase, setPhase] = useState("explore"); // explore, diagnose, treat, done
const [revealed, setRevealed] = useState({});
const [diagSelected, setDiagSelected] = useState(null);
const [diagCorrect, setDiagCorrect] = useState(null);
const [treatStep, setTreatStep] = useState(0);
const [treatSelected, setTreatSelected] = useState(null);
const [treatScore, setTreatScore] = useState(0);
const [diagScore, setDiagScore] = useState(0);
const [catFilter, setCatFilter] = useState("all");
const [caseSearch, setCaseSearch] = useState("");
const [algoExercise, setAlgoExercise] = useState(null);
const bprNames = useMemo(()=>{
const map={};
BPR.forEach(b=>map[b.id]=b.name);
LEITSYMPTOME.forEach(l=>map[l.id]=l.name);
return map;
},[]);
const categories = useMemo(()=>{
const cats={};
EXAM_CASES.forEach(c=>{
const name = bprNames[c.bpr]||c.bpr;
if(!cats[c.bpr]) cats[c.bpr]={id:c.bpr,name,count:0};
cats[c.bpr].count++;
});
return Object.values(cats).sort((a,b)=>a.name.localeCompare(b.name));
},[bprNames]);
const debouncedCaseSearch = useDebounce(caseSearch, 250);
const filteredCases = (catFilter==="all" ? EXAM_CASES : EXAM_CASES.filter(c=>c.bpr===catFilter)).filter(c=>{if(!debouncedCaseSearch) return true;const s=debouncedCaseSearch.toLowerCase();return (c.meldung||"").toLowerCase().includes(s)||(bprNames[c.bpr]||"").toLowerCase().includes(s)||(c.ankunft||"").toLowerCase().includes(s);});
const startCase = (idx)=>{
setCaseIdx(idx);setPhase("explore");setRevealed({});setDiagSelected(null);setDiagCorrect(null);
setTreatStep(0);setTreatSelected(null);setTreatScore(0);setDiagScore(0);
};
// ─── CASE LIST ───
if(caseIdx===null) return (
<div className="fade-in">
<Button onClick={()=>navigate("cases")} variant="ghost" size="sm" style={{marginBottom:20}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<h2 style={{fontSize:22,fontWeight:700,marginBottom:4}}> Prüfungsfälle</h2>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:16}}>
<p style={{color:COLORS.textMuted,fontSize:13,margin:0}}>{filteredCases.length} von {EXAM_CASES.length} Prüfungsfällen{debouncedCaseSearch?` für „${debouncedCaseSearch}"`:""}</p>
<Button size="sm" onClick={()=>startCase(Math.floor(Math.random()*EXAM_CASES.length))} style={{background:COLORS.purple,fontSize:12,padding:"6px 14px",whiteSpace:"nowrap"}}> Zufälliger Fall</Button>
</div>
<input value={caseSearch} onChange={e=>setCaseSearch(e.target.value)} placeholder="Fall suchen (Meldung, Krankheitsbild)..." style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1px solid ${COLORS.border}`,background:COLORS.card,color:COLORS.text,fontSize:13,marginBottom:12,outline:"none",boxSizing:"border-box"}}/>
<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
<div onClick={()=>setCatFilter("all")} style={{padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",background:catFilter==="all"?COLORS.purple:COLORS.bg,color:catFilter==="all"?"#fff":COLORS.textMuted,border:`1px solid ${catFilter==="all"?COLORS.purple:COLORS.border}`,transition:"all .2s"}}>
Alle ({EXAM_CASES.length})
</div>
{categories.map(cat=>(
<div key={cat.id} onClick={()=>setCatFilter(cat.id)} style={{padding:"6px 12px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",background:catFilter===cat.id?COLORS.purple:COLORS.bg,color:catFilter===cat.id?"#fff":COLORS.textMuted,border:`1px solid ${catFilter===cat.id?COLORS.purple:COLORS.border}`,transition:"all .2s",whiteSpace:"nowrap"}}>
{cat.name}
</div>
))}
</div>
<div className="card-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
{filteredCases.map((c,i)=>{
const globalIdx = EXAM_CASES.indexOf(c);
return (
<Card key={globalIdx} onClick={()=>startCase(globalIdx)}>
<Badge color={COLORS.purple}>Prüfungsfall {globalIdx+1}</Badge>
<h3 style={{fontSize:15,fontWeight:700,margin:"8px 0 4px"}}> {c.meldung}</h3>
<p style={{fontSize:12,color:COLORS.textDim,marginTop:6}}>Erkundung → Diagnose → Behandlung</p>
</Card>
);
})}
{filteredCases.length===0 && <EmptyState text="Keine Prüfungsfälle gefunden" sub="Passen Sie den Filter oder die Suche an."/>}
</div>
</div>
);
const ec = EXAM_CASES[caseIdx];
if(!ec) return <div className="fade-in"><Button onClick={()=>{setCaseIdx(null);}} variant="ghost" size="sm">← Zurück</Button><p style={{color:COLORS.textMuted,marginTop:16}}>Fall nicht gefunden.</p></div>;
const linkedCase = CASES.find(c=>c.id===ec.caseId);
const treatSteps = linkedCase ? linkedCase.steps : [];
// ─── EXPLORE PHASE ───
if(phase==="explore") {
const exploreCategories = [
{key:"xabcde",iconName:"shield",label:"(x)ABCDE-Schema",color:"#ef4444",
render:()=>(
<div style={{display:"flex",flexDirection:"column",gap:8}}>
{[{k:"c",l:"<C> Kritische Blutung"},{k:"a",l:"A – Atemweg"},{k:"b",l:"B – Breathing"},{k:"c2",l:"C – Circulation"},{k:"d",l:"D – Disability"},{k:"e",l:"E – Exposure"}].map(item=>(
<div key={item.k} style={{background:COLORS.bg,padding:"8px 12px",borderRadius:8,border:`1px solid ${COLORS.border}`}}>
<div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:4}}>{item.l}</div>
<LinkedText text={ec.xabcde[item.k]} navigate={navigate} style={{fontSize:13,color:COLORS.text,lineHeight:1.6}}/>
</div>
))}
</div>
)},
{key:"vitalzeichen",iconName:"heartPulse",label:"Vitalzeichen messen",color:COLORS.blue,
render:()=><div style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}>{ec.findings.vitalzeichen.split("|").map((v,i)=><div key={i} style={{padding:"4px 0",borderBottom:i<ec.findings.vitalzeichen.split("|").length-1?`1px solid ${COLORS.border}`:"none"}}>{v.trim()}</div>)}</div>},
{key:"anamnese",iconName:"clipboard",label:"Anamnese (SAMPLER)",color:COLORS.green,
render:()=><div style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}>{ec.findings.anamnese.split(/(?=[SAMPLE]:)/).map((v,i)=><div key={i} style={{padding:"4px 0"}}><LinkedText text={v.trim()} navigate={navigate}/></div>)}</div>},
{key:"inspektion",iconName:"eye",label:"Inspektion",color:COLORS.yellow,
render:()=><LinkedText text={ec.findings.inspektion} navigate={navigate} style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}/>},
{key:"auskultation",iconName:"ear",label:"Auskultation",color:"#8b5cf6",
render:()=><LinkedText text={ec.findings.auskultation} navigate={navigate} style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}/>},
{key:"ekg",iconName:"activity",label:"12-Kanal-EKG",color:COLORS.accent,
render:()=>{const ekgData=ec.findings.ekgType?EKG_DATA.find(e=>e.id===ec.findings.ekgType):null;return(<div><LinkedText text={ec.findings.ekg} navigate={navigate} style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}/>{ekgData&&ekgData.images&&<div style={{marginTop:12}}><EkgImageViewer images={ekgData.images}/></div>}</div>);}},
{key:"neurologie",iconName:"neurology",label:"Neurologie / Pupillen",color:"#06b6d4",
render:()=><LinkedText text={ec.findings.neurologie} navigate={navigate} style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}/>},
{key:"palpation",iconName:"hand",label:"Palpation / Pulsstatus",color:"#f97316",
render:()=><LinkedText text={ec.findings.palpation} navigate={navigate} style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}/>},
];
if(ec.spezial && phase !== "explore") {
exploreCategories.push({key:"spezial",iconName:"star",label:ec.spezial.name,color:"#eab308",
render:()=><pre style={{fontSize:13,lineHeight:1.8,color:COLORS.text,fontFamily:"'DM Sans',sans-serif",whiteSpace:"pre-wrap"}}>{ec.spezial.result}</pre>});
}
const revealedCount = Object.keys(revealed).length;
const totalCategories = exploreCategories.length;
return (
<div className="fade-in">
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
<Button onClick={()=>setCaseIdx(null)} variant="ghost" size="sm">← Alle Prüfungsfälle</Button>
<Badge color={COLORS.purple}>{revealedCount}/{totalCategories} erkundet</Badge>
</div>
<Card style={{marginBottom:16,background:`linear-gradient(135deg,${COLORS.purple}08,${COLORS.card})`,borderColor:COLORS.purple+"30"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
<Badge color={COLORS.accent}> Einsatzmeldung</Badge>
</div>
<h3 style={{fontSize:17,fontWeight:700,margin:"6px 0",lineHeight:1.4}}>{ec.meldung}</h3>
</Card>
<Card style={{marginBottom:16,background:COLORS.bg,borderColor:COLORS.border}}>
<div style={{fontSize:11,fontWeight:700,color:COLORS.purple,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Eintreffen am Einsatzort</div>
<p style={{fontSize:14,lineHeight:1.7,color:COLORS.text}}>{ec.ankunft}</p>
</Card>
<div style={{marginBottom:16}}>
<h3 style={{fontSize:15,fontWeight:700,marginBottom:12,color:COLORS.text}}> Erkundung – was möchten Sie tun?</h3>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
{exploreCategories.map(cat=>{
const isRevealed = revealed[cat.key];
return (
<div key={cat.key} onClick={()=>{haptic("light");setRevealed(r=>({...r,[cat.key]:true}))}} style={{background:isRevealed?cat.color+"08":COLORS.card,border:`2px solid ${isRevealed?cat.color+"40":COLORS.border}`,borderRadius:14,padding:14,cursor:"pointer",transition:"all .3s"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:isRevealed?10:0}}>
<span style={{fontSize:20}}><Icon name={cat.iconName} size={18} color={cat.color}/></span>
<span style={{fontSize:14,fontWeight:700,color:isRevealed?cat.color:COLORS.text}}>{cat.label}</span>
{isRevealed && <span style={{marginLeft:"auto",fontSize:11,color:COLORS.green}}>✓ erhoben</span>}
{!isRevealed && <span style={{marginLeft:"auto",fontSize:11,color:COLORS.textDim}}>tippen zum erheben</span>}
</div>
{isRevealed && (
<div style={{paddingTop:8,borderTop:`1px solid ${cat.color}20`}}>
{cat.render()}
</div>
)}
</div>
);
})}
</div>
</div>
<div style={{textAlign:"center",marginTop:24}}>
<Button onClick={()=>setPhase("diagnose")} size="lg" style={{background:`linear-gradient(135deg,${COLORS.purple},#7c3aed)`,fontSize:16,padding:"14px 32px"}}>
Verdachtsdiagnose stellen
</Button>
<p style={{fontSize:12,color:COLORS.textDim,marginTop:8}}>{revealedCount} von {totalCategories} Kategorien erkundet</p>
</div>
</div>
);
}
// ─── DIAGNOSE PHASE ───
if(phase==="diagnose") {
const submitDiag = (idx)=>{
if(diagSelected!==null) return;
setDiagSelected(idx);
const correct = idx===ec.correctDiagnose;
setDiagCorrect(correct);
if(correct) {setDiagScore(1);haptic("success");}
else haptic("error");
};
return (
<div className="fade-in">
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<Button onClick={()=>setPhase("explore")} variant="ghost" size="sm">← Zurück zur Erkundung</Button>
<Badge color={COLORS.purple}>Verdachtsdiagnose</Badge>
</div>
<Card style={{marginBottom:16,background:`linear-gradient(135deg,${COLORS.purple}08,${COLORS.card})`,borderColor:COLORS.purple+"30"}}>
<div style={{fontSize:11,fontWeight:700,color:COLORS.purple,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}> Einsatzmeldung</div>
<p style={{fontSize:14,color:COLORS.textMuted,lineHeight:1.5}}>{ec.meldung}</p>
</Card>
<Card>
<h3 style={{fontSize:17,fontWeight:700,marginBottom:16,lineHeight:1.4}}>Welche Verdachtsdiagnose stellen Sie?</h3>
<div style={{display:"flex",flexDirection:"column",gap:10}}>
{ec.diagnoseOptionen.map((o,i)=>{
let bg=COLORS.bg,border=COLORS.border,color=COLORS.text;
let anim="";
if(diagSelected!==null){
if(i===ec.correctDiagnose){bg=COLORS.green+"20";border=COLORS.green;color=COLORS.green;anim="correct-pop";}
else if(i===diagSelected&&i!==ec.correctDiagnose){bg=COLORS.accent+"20";border=COLORS.accent;color=COLORS.accent;anim="shake-anim";}
}
return(
<div key={i} className={anim} onClick={()=>submitDiag(i)} style={{padding:"14px 18px",background:bg,border:`2px solid ${border}`,borderRadius:12,cursor:diagSelected===null?"pointer":"default",transition:"all .2s",color,fontWeight:diagSelected!==null&&i===ec.correctDiagnose?700:400,position:"relative",overflow:"hidden"}}
onMouseEnter={e=>{if(diagSelected===null)e.currentTarget.style.borderColor=COLORS.purple}}
onMouseLeave={e=>{if(diagSelected===null)e.currentTarget.style.borderColor=COLORS.border}}>
<span style={{fontWeight:700,marginRight:10,opacity:.5}}>{String.fromCharCode(65+i)}</span>{o}
{diagSelected===i&&i===ec.correctDiagnose&&<ConfettiBurst active={true}/>}
</div>
);
})}
</div>
{diagSelected!==null && (
<div style={{marginTop:16}}>
<Card style={{background:diagCorrect?COLORS.green+"10":COLORS.accent+"10",borderColor:(diagCorrect?COLORS.green:COLORS.accent)+"30"}}>
<div style={{fontSize:13,lineHeight:1.6,color:COLORS.textMuted}}>
<strong style={{color:diagCorrect?COLORS.green:COLORS.accent}}>{diagCorrect?"✓ Korrekte Diagnose!":"✗ Falsche Diagnose"}</strong>
<div style={{marginTop:8}}><LinkedText text={ec.diagnoseErklaerung} navigate={navigate}/></div>
</div>
</Card>
<div style={{marginTop:16,textAlign:"center"}}>
{diagCorrect ? (
<Button onClick={()=>{setPhase("treat");setTreatStep(0);setTreatSelected(null);}} size="lg" style={{background:`linear-gradient(135deg,${COLORS.green},#059669)`}}>
Weiter zur Behandlung →
</Button>
) : (
<div style={{display:"flex",justifyContent:"center",gap:12}}>
<Button onClick={()=>setCaseIdx(null)} variant="secondary">Alle Prüfungsfälle</Button>
<Button onClick={()=>{startCase(caseIdx);}}>Fall wiederholen</Button>
</div>
)}
</div>
</div>
)}
</Card>
</div>
);
}
// ─── TREAT PHASE ───
if(phase==="treat") {
if(treatSteps.length===0) {
return <div className="fade-in"><p style={{color:COLORS.textMuted}}>Keine Behandlungsfragen verfügbar.</p><Button onClick={()=>setCaseIdx(null)}>Zurück</Button></div>;
}
const ts = treatSteps[treatStep];
const answerTreat = (idx)=>{
if(treatSelected!==null) return;
setTreatSelected(idx);
if(idx===ts.correct) {setTreatScore(s=>s+1);haptic("success");}
else haptic("error");
};
const nextTreat = ()=>{
if(treatStep+1>=treatSteps.length){
setPhase("done");
setStats(st=>({...st,casesCompleted:st.casesCompleted+1}));
return;
}
setTreatStep(treatStep+1);setTreatSelected(null);
};
return (
<div className="fade-in">
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
<Button onClick={()=>setCaseIdx(null)} variant="ghost" size="sm">← Alle Prüfungsfälle</Button>
<div style={{display:"flex",gap:8}}>
<Badge color={COLORS.green}>✓ Diagnose korrekt</Badge>
<Badge color={COLORS.purple}>Behandlung {treatStep+1}/{treatSteps.length}</Badge>
</div>
</div>
<Card style={{marginBottom:12,background:`linear-gradient(135deg,${COLORS.green}08,${COLORS.card})`,borderColor:COLORS.green+"30",padding:"12px 16px"}}>
<div style={{fontSize:12,color:COLORS.green,fontWeight:700}}>✓ Diagnose: {ec.diagnoseOptionen[ec.correctDiagnose]}</div>
</Card>
<ProgressBar value={treatStep+1} max={treatSteps.length} color={COLORS.purple} h={4}/>
<Card style={{marginTop:16}}>
<h3 style={{fontSize:16,fontWeight:600,marginBottom:16,lineHeight:1.5}}>{ts.q}</h3>
<div style={{display:"flex",flexDirection:"column",gap:10}}>
{ts.opts.map((o,i)=>{
let bg=COLORS.bg,border=COLORS.border,color=COLORS.text;
let anim="";
if(treatSelected!==null){
if(i===ts.correct){bg=COLORS.green+"20";border=COLORS.green;color=COLORS.green;anim="correct-pop";}
else if(i===treatSelected){bg=COLORS.accent+"20";border=COLORS.accent;color=COLORS.accent;anim="shake-anim";}
}
return(
<div key={i} className={anim} onClick={()=>answerTreat(i)} style={{padding:"12px 16px",background:bg,border:`2px solid ${border}`,borderRadius:12,cursor:treatSelected===null?"pointer":"default",transition:"all .2s",color,fontWeight:treatSelected!==null&&i===ts.correct?700:400}}>
<span style={{fontWeight:700,marginRight:10,opacity:.5}}>{String.fromCharCode(65+i)}</span>{o}
</div>
);
})}
</div>
{treatSelected!==null && (
<div style={{marginTop:16}}>
<Card style={{background:COLORS.blue+"10",borderColor:COLORS.blue+"30"}}>
<div style={{fontSize:13,lineHeight:1.6,color:COLORS.textMuted}}>
<strong style={{color:COLORS.blue}}>Erläuterung:</strong> <LinkedText text={ts.explanation} navigate={navigate}/>
</div>
</Card>
<div style={{marginTop:12,display:"flex",justifyContent:"flex-end"}}>
<Button onClick={nextTreat}>{treatStep+1>=treatSteps.length?"Ergebnis":"Nächste Frage →"}</Button>
</div>
</div>
)}
</Card>
</div>
);
}
// ─── ALGO EXERCISE INLINE (within exam case) ───
if(phase==="done" && algoExercise) {
return <AlgorithmTrainer initialAlgo={algoExercise.algo} initialExercise={algoExercise.type} onBack={()=>setAlgoExercise(null)}/>;
}
// ─── DONE ───
if(phase==="done") {
const totalQ = treatSteps.length + 1;
const totalCorrect = diagScore + treatScore;
const pct = Math.round(totalCorrect/totalQ*100);
const examAlgo = ALGORITHM_DATA.find(a=>a.id===ec.bpr);
return (
<div className="fade-in" style={{textAlign:"center",paddingTop:30}}>
<ScoreCircle pct={pct} size={160}/>
<h2 style={{fontSize:24,fontWeight:700,marginTop:20}}>Prüfungsfall abgeschlossen</h2>
<p style={{fontSize:14,color:COLORS.textMuted,margin:"8px 0"}}>{ec.meldung}</p>
<div style={{display:"flex",justifyContent:"center",gap:16,marginTop:8}}>
<div style={{textAlign:"center"}}>
<div style={{fontSize:11,color:COLORS.textDim}}>Diagnose</div>
<Badge color={diagScore?COLORS.green:COLORS.accent}>{diagScore?'✓ Korrekt':'✗ Falsch'}</Badge>
</div>
<div style={{textAlign:"center"}}>
<div style={{fontSize:11,color:COLORS.textDim}}>Behandlung</div>
<Badge color={COLORS.purple}>{treatScore}/{treatSteps.length}</Badge>
</div>
</div>
<p style={{color:COLORS.textMuted,marginTop:12}}>{totalCorrect} von {totalQ} gesamt korrekt</p>
<div style={{display:"flex",justifyContent:"center",gap:12,marginTop:24}}>
<Button onClick={()=>setCaseIdx(null)} variant="secondary">Alle Prüfungsfälle</Button>
<Button onClick={()=>startCase(caseIdx)}>Nochmal</Button>
</div>
{examAlgo && (
<Card style={{marginTop:28,padding:20,textAlign:"left",borderColor:COLORS.green+"40",background:COLORS.green+"08"}}>
<h4 style={{fontSize:14,fontWeight:700,marginBottom:4,color:COLORS.green}}> Algorithmus vertiefen: {examAlgo.name}</h4>
<p style={{color:COLORS.textMuted,fontSize:12,marginBottom:12}}>Trainieren Sie den zugehörigen BPR-Algorithmus:</p>
<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
<Button size="sm" onClick={()=>setAlgoExercise({algo:examAlgo,type:"order"})} style={{background:COLORS.orange,fontSize:11,padding:"6px 12px"}}> Schritte ordnen ({examAlgo.steps.length})</Button>
{examAlgo.decisions.length>0 && <Button size="sm" onClick={()=>setAlgoExercise({algo:examAlgo,type:"tree"})} style={{background:COLORS.purple,fontSize:11,padding:"6px 12px"}}> Entscheidungen ({examAlgo.decisions.length})</Button>}
{examAlgo.gaps.length>0 && <Button size="sm" onClick={()=>setAlgoExercise({algo:examAlgo,type:"gaps"})} style={{background:COLORS.green,fontSize:11,padding:"6px 12px"}}> Lücken füllen ({examAlgo.gaps.length})</Button>}
</div>
</Card>
)}
</div>
);
}
return null;
}
// ═══════════════════════════════════════════════════════
// ALGORITHMEN-TRAINER COMPONENT
// ═══════════════════════════════════════════════════════
function AlgorithmTrainer({onBack, initialAlgo, initialExercise}) {
const [selectedAlgo, setSelectedAlgo] = useState(initialAlgo||null);
const [exerciseType, setExerciseType] = useState(initialExercise||null); // "order","tree","gaps"
const [catFilter, setCatFilter] = useState("all");
// Order state
const [orderItems, setOrderItems] = useState([]);
const [placed, setPlaced] = useState([]);
const [orderDone, setOrderDone] = useState(false);
// Tree state
const [treeStep, setTreeStep] = useState(0);
const [treeAnswered, setTreeAnswered] = useState(null);
const [treeScore, setTreeScore] = useState(0);
const [treeDone, setTreeDone] = useState(false);
// Gap state
const [gapIdx, setGapIdx] = useState(0);
const [gapInputs, setGapInputs] = useState({});
const [gapChecked, setGapChecked] = useState(false);
const [gapScore, setGapScore] = useState(0);
const [gapsDone, setGapsDone] = useState(false);
const embedded = !!initialAlgo;
const categories = useMemo(()=>{
const cats = {};
ALGORITHM_DATA.forEach(a=>{
if(!cats[a.kat]) cats[a.kat]={name:a.kat,count:0};
cats[a.kat].count++;
});
return Object.values(cats);
},[]);
const filtered = catFilter==="all" ? ALGORITHM_DATA : ALGORITHM_DATA.filter(a=>a.kat===catFilter);
const startOrder = (algo) => {
const shuffled = [...algo.steps].sort(()=>Math.random()-.5);
setOrderItems(shuffled);
setPlaced([]);
setOrderDone(false);
setSelectedAlgo(algo);
setExerciseType("order");
};
const startTree = (algo) => {
setTreeStep(0);setTreeAnswered(null);setTreeScore(0);setTreeDone(false);
setSelectedAlgo(algo);setExerciseType("tree");
};
const startGaps = (algo) => {
setGapIdx(0);setGapInputs({});setGapChecked(false);setGapScore(0);setGapsDone(false);
setSelectedAlgo(algo);setExerciseType("gaps");
};
const backToSelect = () => {
if(embedded){onBack();return;}
setSelectedAlgo(null);setExerciseType(null);
};
useEffect(()=>{
if(initialAlgo && initialExercise){
if(initialExercise==="order") startOrder(initialAlgo);
else if(initialExercise==="tree") startTree(initialAlgo);
else if(initialExercise==="gaps") startGaps(initialAlgo);
}
},[]);
// ─── ALGORITHM SELECT ───
if(!selectedAlgo) return (
<div className="fade-in">
<Button onClick={onBack} variant="ghost" size="sm" style={{marginBottom:20}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<h2 style={{fontSize:22,fontWeight:700,marginBottom:8}}> Algorithmen-Trainer</h2>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:20}}>
<p style={{color:COLORS.textMuted,fontSize:13,margin:0}}>Wählen Sie einen Algorithmus und eine Übungsform.</p>
<Button size="sm" onClick={()=>{const ra=ALGORITHM_DATA[Math.floor(Math.random()*ALGORITHM_DATA.length)];setSelectedAlgo(ra);}} style={{background:COLORS.green,fontSize:12,padding:"6px 14px"}}> Zufälliger Algorithmus</Button>
</div>
<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
<div onClick={()=>setCatFilter("all")} style={{padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",background:catFilter==="all"?COLORS.green:COLORS.bg,color:catFilter==="all"?"#fff":COLORS.textMuted,border:`1px solid ${catFilter==="all"?COLORS.green:COLORS.border}`,transition:"all .2s"}}>Alle ({ALGORITHM_DATA.length})</div>
{categories.map(c=>(
<div key={c.name} onClick={()=>setCatFilter(c.name)} style={{padding:"6px 12px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",background:catFilter===c.name?COLORS.green:COLORS.bg,color:catFilter===c.name?"#fff":COLORS.textMuted,border:`1px solid ${catFilter===c.name?COLORS.green:COLORS.border}`,transition:"all .2s",whiteSpace:"nowrap"}}>{c.name} ({c.count})</div>
))}
</div>
<div className="card-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
{filtered.map(algo=>(
<Card key={algo.id} style={{padding:16}}>
<h4 style={{fontSize:15,fontWeight:700,marginBottom:4}}>{algo.name}</h4>
<p style={{color:COLORS.textMuted,fontSize:11,marginBottom:12}}>{algo.kat} · {algo.steps.length} Schritte · {algo.decisions.length} Entscheidungen · {algo.gaps.length} Lücken</p>
<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
<Button size="sm" onClick={()=>startOrder(algo)} style={{background:COLORS.orange,fontSize:11,padding:"5px 10px"}}> Schritte ordnen</Button>
<Button size="sm" onClick={()=>startTree(algo)} style={{background:COLORS.purple,fontSize:11,padding:"5px 10px"}}> Entscheidungsbaum</Button>
<Button size="sm" onClick={()=>startGaps(algo)} style={{background:COLORS.green,fontSize:11,padding:"5px 10px"}}> Lücken füllen</Button>
</div>
</Card>
))}
</div>
</div>
);
// ─── EXERCISE SELECT (algo chosen, no exercise type yet) ───
if(selectedAlgo && !exerciseType) {
const algo = selectedAlgo;
return (
<div className="fade-in">
<Button onClick={backToSelect} variant="ghost" size="sm" style={{marginBottom:20}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<h2 style={{fontSize:22,fontWeight:700,marginBottom:8}}> {algo.name}</h2>
<p style={{color:COLORS.textMuted,fontSize:13,marginBottom:24}}>Wählen Sie eine Übungsform:</p>
<div className="card-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:16}}>
<Card onClick={()=>startOrder(algo)} style={{cursor:"pointer",textAlign:"center",padding:28,borderColor:COLORS.orange+"40"}}>
<div style={{fontSize:40,marginBottom:10}}> </div>
<h3 style={{fontSize:17,fontWeight:700,color:COLORS.orange}}>Schritte ordnen</h3>
<p style={{color:COLORS.textMuted,fontSize:12,marginTop:6}}>{algo.steps.length} Schritte in richtige Reihenfolge bringen</p>
</Card>
{algo.decisions.length>0 && <Card onClick={()=>startTree(algo)} style={{cursor:"pointer",textAlign:"center",padding:28,borderColor:COLORS.purple+"40"}}>
<div style={{fontSize:40,marginBottom:10}}> </div>
<h3 style={{fontSize:17,fontWeight:700,color:COLORS.purple}}>Entscheidungsbaum</h3>
<p style={{color:COLORS.textMuted,fontSize:12,marginTop:6}}>{algo.decisions.length} Entscheidungen treffen</p>
</Card>}
{algo.gaps.length>0 && <Card onClick={()=>startGaps(algo)} style={{cursor:"pointer",textAlign:"center",padding:28,borderColor:COLORS.green+"40"}}>
<div style={{fontSize:40,marginBottom:10}}> </div>
<h3 style={{fontSize:17,fontWeight:700,color:COLORS.green}}>Lücken füllen</h3>
<p style={{color:COLORS.textMuted,fontSize:12,marginTop:6}}>{algo.gaps.length} Lücken ausfüllen</p>
</Card>}
</div>
</div>
);
}
// ─── EXERCISE: ORDER STEPS ───
if(exerciseType==="order") {
const algo = selectedAlgo;
const remaining = orderItems.filter(s=>!placed.includes(s));
const correctCount = placed.filter((s,i)=>s===algo.steps[i]).length;
const allPlaced = placed.length === algo.steps.length;
if(allPlaced && !orderDone) setOrderDone(true);
return (
<div className="fade-in">
<Button onClick={backToSelect} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<h3 style={{fontSize:18,fontWeight:700,marginBottom:4}}> Schritte ordnen: {algo.name}</h3>
<p style={{color:COLORS.textMuted,fontSize:12,marginBottom:16}}>Tippen Sie die Schritte in der richtigen Reihenfolge an.</p>
<div style={{marginBottom:16}}>
<div style={{fontSize:12,fontWeight:600,color:COLORS.textMuted,marginBottom:8}}>Ihre Reihenfolge:</div>
{algo.steps.map((correctStep,i)=>{
const userStep = placed[i];
const isCorrect = userStep === correctStep;
const showResult = orderDone;
return (
<div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,padding:"8px 12px",borderRadius:8,background:!userStep?COLORS.bg+"80":showResult?(isCorrect?"#0d2818":"#2d1215"):COLORS.cardBg,border:`1px solid ${!userStep?COLORS.border+"40":showResult?(isCorrect?COLORS.green+"60":"#ef444460"):COLORS.accent+"30"}`,minHeight:38,transition:"all .3s"}}>
<span style={{fontSize:12,fontWeight:700,color:COLORS.textMuted,minWidth:24}}>{i+1}.</span>
{userStep ? (
<span style={{fontSize:13,color:showResult?(isCorrect?COLORS.green:"#ef4444"):COLORS.text}}>
{showResult && !isCorrect && <span style={{textDecoration:"line-through",opacity:.6}}>{userStep}</span>}
{showResult && !isCorrect && <span style={{marginLeft:8,color:COLORS.green}}>→ {correctStep}</span>}
{(!showResult || isCorrect) && userStep}
{showResult && isCorrect && " ✓"}
</span>
) : (
<span style={{fontSize:12,color:COLORS.textMuted,fontStyle:"italic"}}>—</span>
)}
</div>
);
})}
</div>
{!orderDone && remaining.length > 0 && (
<div>
<div style={{fontSize:12,fontWeight:600,color:COLORS.textMuted,marginBottom:8}}>Verfügbare Schritte (antippen zum Platzieren):</div>
<div style={{display:"flex",flexWrap:"wrap",gap:6}}>
{remaining.map((s,i)=>(
<div key={i} onClick={()=>{setPlaced(p=>[...p,s]);}} style={{padding:"8px 14px",borderRadius:8,background:COLORS.accent+"15",border:`1px solid ${COLORS.accent}30`,color:COLORS.text,fontSize:12,cursor:"pointer",transition:"all .2s"}} onMouseOver={e=>e.target.style.background=COLORS.accent+"30"} onMouseOut={e=>e.target.style.background=COLORS.accent+"15"}>
{s}
</div>
))}
</div>
{placed.length > 0 && !orderDone && (
<Button onClick={()=>setPlaced(p=>p.slice(0,-1))} variant="ghost" size="sm" style={{marginTop:8,fontSize:11}}>↩ Letzten Schritt zurücknehmen</Button>
)}
</div>
)}
{orderDone && (
<Card style={{padding:16,marginTop:16,borderColor:(correctCount===algo.steps.length?COLORS.green:COLORS.orange)+"60"}}>
<div style={{fontSize:16,fontWeight:700,color:correctCount===algo.steps.length?COLORS.green:COLORS.orange,marginBottom:8}}>
{correctCount===algo.steps.length?" Perfekt! Alle Schritte richtig!":`${correctCount} von ${algo.steps.length} Schritten richtig`}
</div>
<ProgressBar value={correctCount} max={algo.steps.length} color={correctCount===algo.steps.length?COLORS.green:COLORS.orange}/>
<div style={{display:"flex",gap:8,marginTop:12}}>
<Button size="sm" onClick={()=>startOrder(algo)}> Nochmal</Button>
<Button size="sm" variant="ghost" onClick={()=>startTree(algo)}> Entscheidungsbaum</Button>
<Button size="sm" variant="ghost" onClick={()=>startGaps(algo)}> Lücken</Button>
</div>
</Card>
)}
</div>
);
}
// ─── EXERCISE: DECISION TREE ───
if(exerciseType==="tree") {
const algo = selectedAlgo;
const decisions = algo.decisions;
if(decisions.length===0) return (<div className="fade-in"><Button onClick={backToSelect} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button><p>Keine Entscheidungsfragen für diesen Algorithmus.</p></div>);
if(treeDone) return (
<div className="fade-in">
<Button onClick={backToSelect} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card style={{padding:24,textAlign:"center",borderColor:(treeScore===decisions.length?COLORS.green:COLORS.orange)+"60"}}>
<div style={{fontSize:48,marginBottom:12}}>{treeScore===decisions.length?" ":" "}</div>
<h3 style={{fontSize:20,fontWeight:700,color:treeScore===decisions.length?COLORS.green:COLORS.orange}}>{treeScore} / {decisions.length} Entscheidungen richtig</h3>
<p style={{color:COLORS.textMuted,fontSize:13,marginTop:8}}>{algo.name}</p>
<ProgressBar value={treeScore} max={decisions.length} color={treeScore===decisions.length?COLORS.green:COLORS.orange} h={10}/>
<div style={{display:"flex",gap:8,justifyContent:"center",marginTop:16}}>
<Button size="sm" onClick={()=>startTree(algo)}> Nochmal</Button>
<Button size="sm" variant="ghost" onClick={()=>startOrder(algo)}> Schritte ordnen</Button>
<Button size="sm" variant="ghost" onClick={()=>startGaps(algo)}> Lücken</Button>
</div>
</Card>
</div>
);
const d = decisions[treeStep];
return (
<div className="fade-in">
<Button onClick={backToSelect} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
<h3 style={{fontSize:16,fontWeight:700}}> {algo.name}</h3>
<Badge color={COLORS.purple}>{treeStep+1} / {decisions.length}</Badge>
</div>
<ProgressBar value={treeStep} max={decisions.length} color={COLORS.purple} h={4}/>
<Card style={{padding:20,marginTop:16}}>
<p style={{fontSize:15,fontWeight:600,lineHeight:1.5,marginBottom:16}}>{d.q}</p>
<div style={{display:"flex",flexDirection:"column",gap:8}}>
{d.opts.map((opt,oi)=>{
const answered = treeAnswered!==null;
const isCorrect = oi===d.correct;
const isSelected = oi===treeAnswered;
let bg = COLORS.bg;
let border = COLORS.border;
if(answered){
if(isCorrect){bg="#0d2818";border=COLORS.green+"80";}
else if(isSelected){bg="#2d1215";border="#ef444480";}
}
return (
<div key={oi} onClick={()=>{
if(answered) return;
setTreeAnswered(oi);
if(oi===d.correct) {setTreeScore(s=>s+1);haptic("success");}
else haptic("error");
}} className={answered?(isCorrect?"correct-pop":(isSelected?"shake-anim":"")):""}
style={{padding:"12px 16px",borderRadius:10,background:bg,border:`1px solid ${border}`,cursor:answered?"default":"pointer",transition:"all .2s",fontSize:13}}>
{opt}
{answered && isCorrect && " ✓"}
{answered && isSelected && !isCorrect && " ✗"}
</div>
);
})}
</div>
{treeAnswered!==null && (
<div style={{marginTop:12,padding:12,borderRadius:8,background:treeAnswered===d.correct?"#0d2818":"#2d1215",fontSize:12,lineHeight:1.6,color:treeAnswered===d.correct?COLORS.green:"#f87171"}}>
{d.feedback}
</div>
)}
{treeAnswered!==null && (
<Button size="sm" onClick={()=>{
if(treeStep+1 >= decisions.length) setTreeDone(true);
else {setTreeStep(s=>s+1);setTreeAnswered(null);}
}} style={{marginTop:12}}>
{treeStep+1 >= decisions.length ? "Ergebnis anzeigen →" : "Nächste Entscheidung →"}
</Button>
)}
</Card>
</div>
);
}
// ─── EXERCISE: FILL GAPS ───
// gapMatch() is loaded from utils.js
if(exerciseType==="gaps") {
const algo = selectedAlgo;
const allGaps = algo.gaps;
if(allGaps.length===0) return (<div className="fade-in"><Button onClick={backToSelect} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button><p>Keine Lückentexte für diesen Algorithmus.</p></div>);
if(gapsDone) return (
<div className="fade-in">
<Button onClick={backToSelect} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card style={{padding:24,textAlign:"center",borderColor:(gapScore===allGaps.length?COLORS.green:COLORS.orange)+"60"}}>
<div style={{fontSize:48,marginBottom:12}}>{gapScore===allGaps.length?" ":" "}</div>
<h3 style={{fontSize:20,fontWeight:700,color:gapScore===allGaps.length?COLORS.green:COLORS.orange}}>{gapScore} / {allGaps.length} Lücken richtig</h3>
<p style={{color:COLORS.textMuted,fontSize:13,marginTop:8}}>{algo.name}</p>
<ProgressBar value={gapScore} max={allGaps.length} color={gapScore===allGaps.length?COLORS.green:COLORS.orange} h={10}/>
<div style={{display:"flex",gap:8,justifyContent:"center",marginTop:16}}>
<Button size="sm" onClick={()=>startGaps(algo)}> Nochmal</Button>
<Button size="sm" variant="ghost" onClick={()=>startOrder(algo)}> Ordnen</Button>
<Button size="sm" variant="ghost" onClick={()=>startTree(algo)}> Baum</Button>
</div>
</Card>
</div>
);
const gap = allGaps[gapIdx];
if(!gap) return <div className="fade-in"><p style={{color:COLORS.textMuted}}>Keine Lücken verfügbar.</p><Button onClick={onBack} variant="ghost" size="sm">← Zurück</Button></div>;
const answers = gap.answer.split(";");
const parts = gap.text.split("___");
const inputCount = parts.length - 1;
const checkGap = () => {
let correct = true;
for(let i=0;i<inputCount;i++){
if(!gapMatch(gapInputs[`${gapIdx}-${i}`], answers[i])) correct = false;
}
if(correct) setGapScore(s=>s+1);
setGapChecked(true);
};
return (
<div className="fade-in">
<Button onClick={backToSelect} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
<h3 style={{fontSize:16,fontWeight:700}}> {algo.name}</h3>
<Badge color={COLORS.green}>{gapIdx+1} / {allGaps.length}</Badge>
</div>
<ProgressBar value={gapIdx} max={allGaps.length} color={COLORS.green} h={4}/>
<Card style={{padding:20,marginTop:16}}>
<div style={{fontSize:15,lineHeight:2,marginBottom:16}}>
{parts.map((part,pi)=>(
<span key={pi}>
{part}
{pi < inputCount && (
gapChecked ? (
<span style={{display:"inline-block",padding:"2px 10px",borderRadius:6,fontWeight:700,fontSize:14,
background:gapMatch(gapInputs[`${gapIdx}-${pi}`], answers[pi])?"#0d2818":"#2d1215",
color:gapMatch(gapInputs[`${gapIdx}-${pi}`], answers[pi])?COLORS.green:"#ef4444",
border:`1px solid ${gapMatch(gapInputs[`${gapIdx}-${pi}`], answers[pi])?COLORS.green+"60":"#ef444460"}`
}}>
{(gapInputs[`${gapIdx}-${pi}`]||"—")}
{!gapMatch(gapInputs[`${gapIdx}-${pi}`], answers[pi])
&& <span style={{color:COLORS.green,marginLeft:6}}>({answers[pi]})</span>}
&& <span style={{color:COLORS.green,marginLeft:6}}>({answers[pi]})</span>}
</span>
) : (
<input
type="text"
value={gapInputs[`${gapIdx}-${pi}`]||""}
onChange={e=>setGapInputs(g=>({...g,[`${gapIdx}-${pi}`]:e.target.value}))}
onKeyDown={e=>{if(e.key==="Enter") checkGap();}}
placeholder="..."
style={{display:"inline-block",width:Math.max(60,answers[pi]?.length*10||80),padding:"2px 8px",borderRadius:6,border:`1px solid ${COLORS.accent}50`,background:COLORS.bg,color:COLORS.text,fontSize:14,fontWeight:600,textAlign:"center",outline:"none"}}
autoFocus={pi===0}
/>
)
)}
</span>
))}
</div>
{!gapChecked ? (
<Button size="sm" onClick={checkGap}>Prüfen ✓</Button>
) : (
<Button size="sm" onClick={()=>{
if(gapIdx+1 >= allGaps.length) setGapsDone(true);
else {setGapIdx(g=>g+1);setGapChecked(false);}
}} style={{marginTop:8}}>
{gapIdx+1 >= allGaps.length ? "Ergebnis →" : "Nächste Lücke →"}
</Button>
)}
</Card>
</div>
);
}
return null;
}
function CaseSimulation({navigate,stats,setStats}) {
const [mode, setMode] = useState("select"); // select, training, exam, algo
const [caseIdx, setCaseIdx] = useState(null);
const [step, setStep] = useState(0);
const [selected, setSelected] = useState(null);
const [caseScore, setCaseScore] = useState(0);
const [caseDone, setCaseDone] = useState(false);
const [catFilter, setCatFilter] = useState("all");
const [caseSearch, setCaseSearch] = useState("");
const [algoExercise, setAlgoExercise] = useState(null); // {algo, type} for inline algo trainer
const bprNames = useMemo(()=>{
const map={};
BPR.forEach(b=>map[b.id]=b.name);
return map;
},[]);
const categories = useMemo(()=>{
const cats = {};
CASES.forEach(c=>{
const name = bprNames[c.bpr]||c.bpr;
if(!cats[c.bpr]) cats[c.bpr]={id:c.bpr,name,count:0};
cats[c.bpr].count++;
});
return Object.values(cats).sort((a,b)=>a.name.localeCompare(b.name));
},[bprNames]);
const debouncedCaseSearch = useDebounce(caseSearch, 250);
const filteredCases = (catFilter==="all" ? CASES : CASES.filter(c=>c.bpr===catFilter)).filter(c=>{if(!debouncedCaseSearch) return true;const s=debouncedCaseSearch.toLowerCase();return (c.title||"").toLowerCase().includes(s)||(c.scenario||"").toLowerCase().includes(s)||(bprNames[c.bpr]||"").toLowerCase().includes(s);});
// ─── MODE SELECT ───
if(mode==="select") return (
<div className="fade-in">
<Button onClick={()=>navigate("dashboard")} variant="ghost" size="sm" style={{marginBottom:20}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<h2 style={{fontSize:22,fontWeight:700,marginBottom:8}}> Fälle</h2>
<p style={{color:COLORS.textMuted,fontSize:13,marginBottom:24}}>Wählen Sie den Modus:</p>
<div className="card-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
<Card onClick={()=>setMode("training")} style={{cursor:"pointer",borderColor:COLORS.orange+"40",textAlign:"center",padding:32}}>
<div style={{fontSize:48,marginBottom:12}}> </div>
<h3 style={{fontSize:20,fontWeight:700,color:COLORS.orange,marginBottom:8}}>Trainingsfälle</h3>
<p style={{color:COLORS.textMuted,fontSize:13,lineHeight:1.6}}>Alle {CASES.length} Fälle mit <strong>sichtbarem Krankheitsbild</strong>. Ideal zum Lernen und Üben der Behandlungsschritte.</p>
<Badge color={COLORS.orange} style={{marginTop:12}}>{CASES.length} Fälle · {categories.length} Krankheitsbilder</Badge>
<div style={{marginTop:14}}><Button size="sm" onClick={(e)=>{e.stopPropagation();setMode("training");setCaseIdx(Math.floor(Math.random()*CASES.length));setStep(0);setSelected(null);setCaseScore(0);setCaseDone(false);}} style={{background:COLORS.orange,fontSize:12,padding:"6px 16px"}}> Zufälliger Fall</Button></div>
</Card>
<Card onClick={()=>setMode("exam")} style={{cursor:"pointer",borderColor:COLORS.purple+"40",textAlign:"center",padding:32}}>
<div style={{fontSize:48,marginBottom:12}}> </div>
<h3 style={{fontSize:20,fontWeight:700,color:COLORS.purple,marginBottom:8}}>Prüfungsfälle</h3>
<p style={{color:COLORS.textMuted,fontSize:13,lineHeight:1.6}}>Nur die <strong>Einsatzmeldung</strong>. Erkunden Sie systematisch, stellen Sie die Diagnose, dann behandeln Sie.</p>
<Badge color={COLORS.purple} style={{marginTop:12}}>{EXAM_CASES.length} Fälle · xABCDE + Schemata</Badge>
<div style={{marginTop:14}}><Button size="sm" onClick={(e)=>{e.stopPropagation();setMode("exam_random");}} style={{background:COLORS.purple,fontSize:12,padding:"6px 16px"}}> Zufälliger Fall</Button></div>
</Card>
<Card onClick={()=>setMode("algo")} style={{cursor:"pointer",borderColor:COLORS.green+"40",textAlign:"center",padding:32}}>
<div style={{fontSize:48,marginBottom:12}}> </div>
<h3 style={{fontSize:20,fontWeight:700,color:COLORS.green,marginBottom:8}}>Algorithmen-Trainer</h3>
<p style={{color:COLORS.textMuted,fontSize:13,lineHeight:1.6}}>BPR-Algorithmen trainieren: <strong>Schritte ordnen</strong>, <strong>Entscheidungen treffen</strong>, <strong>Lücken füllen</strong>.</p>
<Badge color={COLORS.green} style={{marginTop:12}}>{ALGORITHM_DATA.length} Algorithmen · 3 Übungsformen</Badge>
<div style={{marginTop:14}}><Button size="sm" onClick={(e)=>{e.stopPropagation();setMode("algo_random");}} style={{background:COLORS.green,fontSize:12,padding:"6px 16px"}}> Zufälliger Algorithmus</Button></div>
</Card>
</div>
</div>
);
// ─── EXAM MODE ───
if(mode==="exam"||mode==="exam_random") return <ExamCaseSimulation navigate={(v,s)=>{if(v==="cases"){setMode("select");return;}navigate(v,s);}} stats={stats} setStats={setStats} initialRandom={mode==="exam_random"}/>;
if(mode==="algo") return <AlgorithmTrainer onBack={()=>setMode("select")}/>;
if(mode==="algo_random"){const ra=ALGORITHM_DATA[Math.floor(Math.random()*ALGORITHM_DATA.length)];return <AlgorithmTrainer onBack={()=>setMode("select")} initialAlgo={ra}/>;}
// ─── TRAINING MODE ───
if(caseIdx===null) return (
<div className="fade-in">
<Button onClick={()=>setMode("select")} variant="ghost" size="sm" style={{marginBottom:20}}>← Modus wählen</Button>
<h2 style={{fontSize:22,fontWeight:700,marginBottom:8}}> Trainingsfälle</h2>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:16}}>
<p style={{color:COLORS.textMuted,fontSize:13,margin:0}}>{filteredCases.length} von {CASES.length} Fällen{debouncedCaseSearch?` für „${debouncedCaseSearch}"`:""}</p>
<Button size="sm" onClick={()=>{const r=Math.floor(Math.random()*CASES.length);setCaseIdx(r);setStep(0);setSelected(null);setCaseScore(0);setCaseDone(false);}} style={{background:COLORS.orange,fontSize:12,padding:"6px 14px"}}> Zufälliger Fall</Button>
</div>
<input value={caseSearch} onChange={e=>setCaseSearch(e.target.value)} placeholder="Fall suchen (Titel, Szenario, Krankheitsbild)..." style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1px solid ${COLORS.border}`,background:COLORS.card,color:COLORS.text,fontSize:13,marginBottom:12,outline:"none",boxSizing:"border-box"}}/>
<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
<div onClick={()=>setCatFilter("all")} style={{padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",background:catFilter==="all"?COLORS.orange:COLORS.bg,color:catFilter==="all"?"#fff":COLORS.textMuted,border:`1px solid ${catFilter==="all"?COLORS.orange:COLORS.border}`,transition:"all .2s"}}>
Alle ({CASES.length})
</div>
{categories.map(cat=>(
<div key={cat.id} onClick={()=>setCatFilter(cat.id)} style={{padding:"6px 12px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",background:catFilter===cat.id?COLORS.orange:COLORS.bg,color:catFilter===cat.id?"#fff":COLORS.textMuted,border:`1px solid ${catFilter===cat.id?COLORS.orange:COLORS.border}`,transition:"all .2s",whiteSpace:"nowrap"}}>
{cat.name} ({cat.count})
</div>
))}
</div>
<div className="card-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
{filteredCases.map((c,i)=>{
const globalIdx = CASES.indexOf(c);
return (
<Card key={globalIdx} onClick={()=>{setCaseIdx(globalIdx);setStep(0);setSelected(null);setCaseScore(0);setCaseDone(false);}}>
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
<Badge color={COLORS.orange}>Fall {globalIdx+1}</Badge>
<Badge color={COLORS.blue} bg={COLORS.blue+"10"}>{bprNames[c.bpr]||c.bpr}</Badge>
</div>
<h3 style={{fontSize:15,fontWeight:700,margin:"6px 0 6px"}}>{c.title}</h3>
<p style={{fontSize:12,color:COLORS.textMuted,lineHeight:1.5}}>{c.scenario.substring(0,100)}...</p>
<div style={{fontSize:11,color:COLORS.textDim,marginTop:8}}>{c.steps.length} Entscheidungen</div>
</Card>
);
})}
{filteredCases.length===0 && <EmptyState text="Keine Fälle gefunden" sub="Passen Sie den Filter oder die Suche an."/>}
</div>
</div>
);
const c = CASES[caseIdx];
if(!c) return <div className="fade-in"><Button onClick={()=>{setCaseIdx(null);}} variant="ghost" size="sm">← Zurück</Button><p style={{color:COLORS.textMuted,marginTop:16}}>Fall nicht gefunden.</p></div>;
const matchingAlgo = ALGORITHM_DATA.find(a=>a.id===c.bpr);
// ─── ALGO EXERCISE INLINE (within training case) ───
if(caseDone && algoExercise) {
return <AlgorithmTrainer initialAlgo={algoExercise.algo} initialExercise={algoExercise.type} onBack={()=>setAlgoExercise(null)}/>;
}
if(caseDone) {
const pct = Math.round(caseScore/c.steps.length*100);
return (
<div className="fade-in" style={{textAlign:"center",paddingTop:40}}>
<div style={{fontSize:64,marginBottom:16}}>{pct>=80?" ":" "}</div>
<h2 style={{fontSize:24,fontWeight:700}}>Fall abgeschlossen: {c.title}</h2>
<p style={{fontSize:48,fontWeight:700,color:pct>=80?COLORS.green:COLORS.yellow,margin:"12px 0"}}>{pct}%</p>
<p style={{color:COLORS.textMuted}}>{caseScore} von {c.steps.length} Schritten korrekt</p>
<div style={{display:"flex",justifyContent:"center",gap:12,marginTop:24}}>
<Button onClick={()=>setCaseIdx(null)} variant="secondary">Alle Fälle</Button>
<Button onClick={()=>{setStep(0);setSelected(null);setCaseScore(0);setCaseDone(false);}}>Nochmal</Button>
</div>
{matchingAlgo && (
<Card style={{marginTop:28,padding:20,textAlign:"left",borderColor:COLORS.green+"40",background:COLORS.green+"08"}}>
<h4 style={{fontSize:14,fontWeight:700,marginBottom:4,color:COLORS.green}}> Algorithmus vertiefen: {matchingAlgo.name}</h4>
<p style={{color:COLORS.textMuted,fontSize:12,marginBottom:12}}>Trainieren Sie den zugehörigen BPR-Algorithmus mit 3 Übungsformen:</p>
<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
<Button size="sm" onClick={()=>setAlgoExercise({algo:matchingAlgo,type:"order"})} style={{background:COLORS.orange,fontSize:11,padding:"6px 12px"}}> Schritte ordnen ({matchingAlgo.steps.length})</Button>
{matchingAlgo.decisions.length>0 && <Button size="sm" onClick={()=>setAlgoExercise({algo:matchingAlgo,type:"tree"})} style={{background:COLORS.purple,fontSize:11,padding:"6px 12px"}}> Entscheidungen ({matchingAlgo.decisions.length})</Button>}
{matchingAlgo.gaps.length>0 && <Button size="sm" onClick={()=>setAlgoExercise({algo:matchingAlgo,type:"gaps"})} style={{background:COLORS.green,fontSize:11,padding:"6px 12px"}}> Lücken füllen ({matchingAlgo.gaps.length})</Button>}
</div>
</Card>
)}
</div>
);
}
const s = c.steps[step];
const answer = (idx)=>{
if(selected!==null) return;
setSelected(idx);
if(idx===s.correct){setCaseScore(sc=>sc+1);setStats(st=>({...st,quizCorrect:st.quizCorrect+1,quizTotal:st.quizTotal+1}));}
else setStats(st=>({...st,quizTotal:st.quizTotal+1}));
};
const nextStep = ()=>{
if(step+1>=c.steps.length){setCaseDone(true);setStats(st=>({...st,casesCompleted:st.casesCompleted+1}));return;}
setStep(step+1);setSelected(null);
};
return (
<div className="fade-in">
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
<Button onClick={()=>setCaseIdx(null)} variant="ghost" size="sm">← Alle Fälle</Button>
<Badge color={COLORS.orange}>Schritt {step+1}/{c.steps.length}</Badge>
</div>
<Card style={{marginBottom:16,background:`linear-gradient(135deg,${COLORS.orange}08,${COLORS.card})`,borderColor:COLORS.orange+"30"}}>
<Badge color={COLORS.orange}>{c.title}</Badge>
<LinkedText text={c.scenario} navigate={navigate} style={{marginTop:10,fontSize:14,lineHeight:1.7,color:COLORS.textMuted,display:"block"}}/>
{CASE_EKG_MAP[c.id] && (()=>{const ekgData=EKG_DATA.find(e=>e.id===CASE_EKG_MAP[c.id]);return(<div style={{marginTop:12}}>
<div style={{fontSize:12,fontWeight:700,color:"#e11d48",marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}> Monitor / 12-Kanal-EKG</div>
<EcgDiagram ekgId={CASE_EKG_MAP[c.id]} compact={true}/>
{ekgData&&ekgData.images&&<div style={{marginTop:8}}><EkgImageViewer images={ekgData.images}/></div>}
</div>);})()}
</Card>
<ProgressBar value={step+1} max={c.steps.length} color={COLORS.orange} h={4}/>
<Card style={{marginTop:16}}>
<h3 style={{fontSize:16,fontWeight:600,marginBottom:16,lineHeight:1.5}}>{s.q}</h3>
<div style={{display:"flex",flexDirection:"column",gap:10}}>
{s.opts.map((o,i)=>{
let bg=COLORS.bg,border=COLORS.border,color=COLORS.text;
if(selected!==null){
if(i===s.correct){bg=COLORS.green+"20";border=COLORS.green;color=COLORS.green;}
else if(i===selected){bg=COLORS.accent+"20";border=COLORS.accent;color=COLORS.accent;}
}
return(
<div key={i} onClick={()=>answer(i)} style={{padding:"12px 16px",background:bg,border:`2px solid ${border}`,borderRadius:12,cursor:selected===null?"pointer":"default",transition:"all .2s",color,fontWeight:selected!==null&&i===s.correct?700:400}}>
<span style={{fontWeight:700,marginRight:10,opacity:.5}}>{String.fromCharCode(65+i)}</span>{o}
</div>
);
})}
</div>
{selected!==null && (
<div style={{marginTop:16}}>
<Card style={{background:COLORS.blue+"10",borderColor:COLORS.blue+"30"}}>
<div style={{fontSize:13,lineHeight:1.6,color:COLORS.textMuted}}>
<strong style={{color:COLORS.blue}}>Erläuterung:</strong> <LinkedText text={s.explanation} navigate={navigate}/>
</div>
</Card>
<div style={{marginTop:12,display:"flex",justifyContent:"flex-end"}}>
<Button onClick={nextStep}>{step+1>=c.steps.length?"Ergebnis":"Nächster Schritt →"}</Button>
</div>
</div>
)}
</Card>
</div>
);
}
// ═══════════════════════════════════════════════════════
// CASE → EKG ZUORDNUNG
// ═══════════════════════════════════════════════════════
const CASE_EKG_MAP = {
1:"vf", 2:"pea", 3:"asystolie", 4:"asystolie", 5:"vf", 6:"asystolie",
13:"stemi_inferior", 14:"stemi_posterior", 15:"stemi_anterior",
16:"sinustachy", 17:"sinustachy", 18:"asystolie", 19:"vhf", 20:"sinusrhythmus",
37:"hypothermie_ekg", 38:"hypothermie_ekg",
40:"avblock3", 41:"sinusbrady", 42:"sinusbrady",
43:"svt", 44:"vt", 45:"vhf",
49:"sinustachy", 58:"lae_ekg", 59:"lae_ekg", 60:"pea",
70:"sinustachy", 85:"sinusrhythmus",
88:"stemi_anterior", 89:"lae_ekg", 90:"sinusrhythmus",
94:"asystolie", 95:"vf", 99:"sinustachy",
102:"stemi_inferior", 103:"stemi_posterior", 104:"sinusbrady",
105:"avblock3", 106:"vhf", 107:"vt",
120:"sinustachy", 129:"sinustachy",
130:"lae_ekg", 131:"pea",
145:"hypothermie_ekg", 146:"sinusbrady"
};
// ═══════════════════════════════════════════════════════
// DATA: NOTFALL-SCORES
// ═══════════════════════════════════════════════════════
const SCORES_DATA = [
{id:"gcs",name:"Glasgow Coma Scale (GCS)",kategorie:"Neurologie",
beschreibung:"Beurteilung der Bewusstseinslage. Minimalwert 3, Maximalwert 15.",
items:[
{name:"Augenöffnen",options:[
{label:"Spontan",value:4},{label:"Auf Ansprache",value:3},{label:"Auf Schmerzreiz",value:2},{label:"Keine Reaktion",value:1}]},
{name:"Verbale Reaktion",options:[
{label:"Orientiert",value:5},{label:"Verwirrt",value:4},{label:"Unzusammenhängende Worte",value:3},{label:"Unverständliche Laute",value:2},{label:"Keine Reaktion",value:1}]},
{name:"Motorische Reaktion",options:[
{label:"Befolgt Aufforderung",value:6},{label:"Gezielte Schmerzabwehr",value:5},{label:"Ungezielte Schmerzabwehr",value:4},{label:"Beugesynergismen",value:3},{label:"Strecksynergismen",value:2},{label:"Keine Reaktion",value:1}]}
],
interpret:(s)=>s>=13?"Leichtes SHT (GCS 13-15) – Monitoring, O₂ bei Bedarf.":s>=9?"Mittleres SHT (GCS 9-12) – NA nachfordern! Intubationsbereitschaft.":s>=4?"Schweres SHT (GCS ≤ 8) – Intubation erwägen! → BPR A-Problem / Polytrauma":"Minimaler GCS (3) – Intubation! Pupillenkontrolle! → BPR Polytrauma",
color:(s)=>s>=13?"#22c55e":s>=9?"#f59e0b":"#ef4444"},
{id:"qsofa",name:"qSOFA-Score",kategorie:"Sepsis",
beschreibung:"Quick Sequential Organ Failure Assessment. Screening-Tool für Sepsis. ≥ 2 Punkte = V.a. Sepsis.",
items:[
{name:"Atemfrequenz ≥ 22/min",options:[{label:"Nein",value:0},{label:"Ja",value:1}]},
{name:"Systolischer RR ≤ 100 mmHg",options:[{label:"Nein",value:0},{label:"Ja",value:1}]},
{name:"Veränderte Bewusstseinslage (GCS < 15)",options:[{label:"Nein",value:0},{label:"Ja",value:1}]}
],
interpret:(s)=>s>=2?"≥ 2 Punkte: V.a. Sepsis! VEL (Ziel-MAP ≥ 65 mmHg), Klinik mit Intensivstation, Voranmeldung. → BPR Sepsis":s===1?"1 Punkt: Erhöhte Aufmerksamkeit, engmaschiges Monitoring.":"0 Punkte: Sepsis unwahrscheinlich.",
color:(s)=>s>=2?"#ef4444":s===1?"#f59e0b":"#22c55e"},
{id:"news2",name:"NEWS2-Score",kategorie:"Vitalzeichen",
beschreibung:"National Early Warning Score. Erkennung klinischer Verschlechterung. ≥ 5 = erhöhtes Risiko.",
items:[
{name:"Atemfrequenz (/min)",options:[
{label:"≤ 8",value:3},{label:"9-11",value:1},{label:"12-20",value:0},{label:"21-24",value:2},{label:"≥ 25",value:3}]},
{name:"SpO₂ (%)",options:[
{label:"≤ 91",value:3},{label:"92-93",value:2},{label:"94-95",value:1},{label:"≥ 96",value:0}]},
{name:"Sauerstoffgabe",options:[
{label:"Nein (Raumluft)",value:0},{label:"Ja",value:2}]},
{name:"Temperatur (°C)",options:[
{label:"≤ 35,0",value:3},{label:"35,1-36,0",value:1},{label:"36,1-38,0",value:0},{label:"38,1-39,0",value:1},{label:"≥ 39,1",value:2}]},
{name:"Systolischer RR (mmHg)",options:[
{label:"≤ 90",value:3},{label:"91-100",value:2},{label:"101-110",value:1},{label:"111-219",value:0},{label:"≥ 220",value:3}]},
{name:"Herzfrequenz (/min)",options:[
{label:"≤ 40",value:3},{label:"41-50",value:1},{label:"51-90",value:0},{label:"91-110",value:1},{label:"111-130",value:2},{label:"≥ 131",value:3}]},
{name:"Bewusstsein",options:[
{label:"Wach (Alert)",value:0},{label:"Reagiert auf Ansprache (Voice)",value:3},{label:"Reagiert auf Schmerz (Pain)",value:3},{label:"Keine Reaktion (Unresponsive)",value:3}]}
],
interpret:(s)=>s>=7?"≥ 7: KRITISCH! Sofortige Notfallbehandlung, NA nachfordern. ABCDE-Reevaluation!":s>=5?"5-6: ERHÖHTES RISIKO – engmaschige Überwachung, NA erwägen, Transport mit Monitor.":s>=1?"1-4: Leicht erhöht – Monitoring, Reevaluation alle 15 min.":"0: Unauffällig.",
color:(s)=>s>=7?"#ef4444":s>=5?"#f59e0b":"#22c55e"},
{id:"wells_lae",name:"Wells-Score (LAE)",kategorie:"Lungenembolie",
beschreibung:"Klinische Wahrscheinlichkeit einer Lungenarterienembolie.",
items:[
{name:"Klinische Zeichen einer TVT",options:[{label:"Nein",value:0},{label:"Ja",value:3}]},
{name:"LAE wahrscheinlicher als Differentialdiagnose",options:[{label:"Nein",value:0},{label:"Ja",value:3}]},
{name:"Herzfrequenz > 100/min",options:[{label:"Nein",value:0},{label:"Ja",value:1.5}]},
{name:"Immobilisation (> 3 Tage) oder OP (< 4 Wochen)",options:[{label:"Nein",value:0},{label:"Ja",value:1.5}]},
{name:"Frühere TVT oder LAE",options:[{label:"Nein",value:0},{label:"Ja",value:1.5}]},
{name:"Hämoptyse",options:[{label:"Nein",value:0},{label:"Ja",value:1}]},
{name:"Malignom (aktiv oder < 6 Monate)",options:[{label:"Nein",value:0},{label:"Ja",value:1}]}
],
interpret:(s)=>s>=5?"Hohe Wahrscheinlichkeit (≥ 5 Punkte) – Heparin 5.000 I.E. i.v. sofort! CT-Angio. → BPR LAE":s>=2?"Mittlere Wahrscheinlichkeit (2-4) – D-Dimere, ggf. CT-Angio.":"Niedrige Wahrscheinlichkeit (< 2) – D-Dimere zum Ausschluss.",
color:(s)=>s>=5?"#ef4444":s>=2?"#f59e0b":"#22c55e"},
{id:"cincinnati",name:"BE-FAST / Cincinnati Stroke Scale",kategorie:"Neurologie",
beschreibung:"Schnelles Screening für Schlaganfall. 1 Kriterium positiv = Schlaganfall-Verdacht!",
items:[
{name:"Balance – Gleichgewichtsstörung/Schwindel",options:[{label:"Nein",value:0},{label:"Ja – plötzlicher Schwindel/Gangstörung",value:1}]},
{name:"Eyes – Sehstörung",options:[{label:"Nein",value:0},{label:"Ja – Doppelbilder/Gesichtsfeldausfall",value:1}]},
{name:"Face – Gesichtslähmung (Grinsen lassen)",options:[{label:"Symmetrisch",value:0},{label:"Asymmetrisch (Mundwinkel hängt)",value:1}]},
{name:"Arms – Armvorhalteversuch (10 Sek.)",options:[{label:"Beide Arme gleich",value:0},{label:"Ein Arm sinkt/driftet ab",value:1}]},
{name:"Speech – Sprache",options:[{label:"Normal, klar",value:0},{label:"Verwaschen/unverständlich/nicht möglich",value:1}]},
{name:"Time – Symptombeginn dokumentiert?",options:[{label:"Nein/unklar",value:0},{label:"Ja – Uhrzeit notiert",value:0}]}
],
interpret:(s)=>s>=1?`${s} von 5 positiv → V.a. Schlaganfall! Stroke Unit voranmelden, Zeitfenster dokumentieren! → BPR Schlaganfall`:"0/5 – Kein Hinweis auf akuten Schlaganfall, weitere Diagnostik.",
color:(s)=>s>=1?"#ef4444":"#22c55e"},
{id:"apgar",name:"APGAR-Score (Neugeborene)",kategorie:"Pädiatrie",
beschreibung:"Beurteilung des Neugeborenen nach 1, 5 und 10 Minuten.",
items:[
{name:"Hautfarbe (Appearance)",options:[
{label:"Blau/blass",value:0},{label:"Stamm rosig, Extremitäten blau",value:1},{label:"Komplett rosig",value:2}]},
{name:"Herzfrequenz (Pulse)",options:[
{label:"Nicht nachweisbar",value:0},{label:"< 100/min",value:1},{label:"≥ 100/min",value:2}]},
{name:"Reflexe/Grimassieren (Grimace)",options:[
{label:"Keine Reaktion",value:0},{label:"Grimassieren",value:1},{label:"Schreien, Husten",value:2}]},
{name:"Muskeltonus (Activity)",options:[
{label:"Schlaff",value:0},{label:"Leichte Beugung",value:1},{label:"Aktive Bewegung",value:2}]},
{name:"Atmung (Respiration)",options:[
{label:"Keine",value:0},{label:"Langsam/unregelmäßig",value:1},{label:"Kräftiges Schreien",value:2}]}
],
interpret:(s)=>s>=7?"Lebensfrisches Neugeborenes (7-10) – Basisversorgung, Wärmeerhalt, Abtrocknen.":s>=4?"Mäßig deprimiert (4-6) – Stimulation, O₂, ggf. Maskenbeatmung. → BPR NLS":"Schwer deprimiert (0-3) – sofortige Reanimation! 5 Beatmungen → CPR 3:1. → BPR NLS",
color:(s)=>s>=7?"#22c55e":s>=4?"#f59e0b":"#ef4444"},
{id:"naca",name:"NACA-Score",kategorie:"Einsatzbeurteilung",
beschreibung:"National Advisory Committee for Aeronautics. Schweregradbeurteilung für Einsatzdokumentation.",
items:[
{name:"Schweregrad",options:[
{label:"NACA I – Geringfügige Störung",value:1},
{label:"NACA II – Ambulante Abklärung",value:2},
{label:"NACA III – Stationäre Behandlung",value:3},
{label:"NACA IV – Akute Lebensgefahr nicht auszuschließen",value:4},
{label:"NACA V – Akute Lebensgefahr",value:5},
{label:"NACA VI – Reanimation",value:6},
{label:"NACA VII – Tod",value:7}]}
],
interpret:(s)=>s>=6?"NACA "+s+" – Reanimation/Tod":s>=4?"NACA "+s+" – Akute Lebensgefahr! NA-Indikation.":"NACA "+s+" – Keine akute Lebensgefahr.",
color:(s)=>s>=5?"#ef4444":s>=4?"#f59e0b":"#22c55e"},
{id:"kindgcs",name:"Pädiatrische GCS (< 2 Jahre)",kategorie:"Pädiatrie",
beschreibung:"Modifizierte Glasgow Coma Scale für Säuglinge und Kleinkinder unter 2 Jahren.",
items:[
{name:"Augenöffnen",options:[
{label:"Spontan",value:4},{label:"Auf Ansprache",value:3},{label:"Auf Schmerzreiz",value:2},{label:"Keine Reaktion",value:1}]},
{name:"Verbale Reaktion",options:[
{label:"Brabbelt, lächelt",value:5},{label:"Schreit, ist tröstbar",value:4},{label:"Schreit anhaltend",value:3},{label:"Stöhnt",value:2},{label:"Keine Reaktion",value:1}]},
{name:"Motorische Reaktion",options:[
{label:"Spontane Bewegung",value:6},{label:"Gezielte Schmerzabwehr",value:5},{label:"Zurückziehen auf Schmerz",value:4},{label:"Beugesynergismen",value:3},{label:"Strecksynergismen",value:2},{label:"Keine Reaktion",value:1}]}
],
interpret:(s)=>s>=13?"GCS 13-15: Leichte Bewusstseinsstörung":s>=9?"GCS 9-12: Mittelschwer → NA nachfordern!":"GCS 3-8: Schwer → Intubation erwägen, Kinderklinik!",
color:(s)=>s>=13?"#22c55e":s>=9?"#f59e0b":"#ef4444"}
];
// ═══════════════════════════════════════════════════════
// DATA: CHECKLISTEN / SOPs
// ═══════════════════════════════════════════════════════
const CHECKLISTS_DATA = [
{id:"rsi",name:"RSI-Checkliste (Narkoseeinleitung)",kategorie:"Atemweg",iconName:"lung",
items:[
{group:"Vorbereitung",checks:["Indikation bestätigt (GCS ≤ 8, Atemwegsschutz, Oxygenierungsversagen)","Absaugung bereit + funktionsfähig","Laryngoskop + Videolaryngoskop bereit + Licht OK","Tubus: Größe gewählt + 0,5 kleiner bereit","Führungsstab/Bougie bereit","Cuffspritze bereit","Fixierungsmaterial bereit","Supraglottischer Atemweg als Backup bereit","Kapnographie angeschlossen","Beatmungsgerät eingestellt (Vt, AF, FiO₂)"]},
{group:"Medikamente",checks:["Analgetikum aufgezogen + beschriftet (z.B. Fentanyl/Esketamin)","Hypnotikum aufgezogen + beschriftet (z.B. Propofol/Midazolam/Esketamin)","Muskelrelaxans aufgezogen + beschriftet (z.B. Succinylcholin/Rocuronium)","Notfallmedikamente bereit (Atropin, Noradrenalin/Akrinor)","Venöser Zugang sicher + läuft","Zweiter Zugang empfohlen"]},
{group:"Prä-Oxygenierung",checks:["O₂ 15 l/min über dichtsitzende Maske","3 Minuten Prä-Oxygenierung ODER 8 tiefe Atemzüge","SpO₂ > 95% erreicht (wenn möglich)","Oberkörperhochlagerung 30° (wenn möglich)"]},
{group:"Durchführung",checks:["Team-Timeout: Rollen + Plan A/B/C kommuniziert","Analgetikum verabreicht","Hypnotikum verabreicht → Bewusstlosigkeit bestätigt","45-60 Sek. warten (kein Beutelbeatmung bei Relaxans!)","Relaxans verabreicht → Faszikulationen abwarten (Succi)","Laryngoskopie → Tubus einführen","Cuff blocken","Tubuslage: Kapnographie (CO₂-Kurve!), Auskultation, Beschlagen","Tubus fixiert, Tiefe dokumentiert"]}
]},
{id:"rea_check",name:"Reanimations-Setup",kategorie:"Reanimation",iconName:"zap",
items:[
{group:"Erstmaßnahmen",checks:["Bewusstlosigkeit festgestellt","Keine (normale) Atmung → Reanimationsalarm","CPR 30:2 begonnen (100-120/min, 5-6 cm)","AED/Defi angelegt"]},
{group:"Defibrillator",checks:["Pads korrekt platziert (anterolateral ODER anteroposterior)","Rhythmusanalyse durchgeführt","Defibrillierbarer Rhythmus? → 200 J biphasisch","Nicht-defibrillierbar? → CPR weiter + Ursachen suchen"]},
{group:"Atemweg",checks:["Guedel/Wendl-Tubus eingelegt","Beutel-Maske-Beatmung (2 Hübe nach 30 Kompressionen)","Absaugung bereit","Supraglottischer Atemweg / Intubation nach 2. Zyklus erwägen"]},
{group:"Zugang + Medikamente",checks:["i.v.-Zugang (alternativ: i.o.-Zugang)","VF/pVT: Epi nach 3. Schock, dann alle 4 min","VF/pVT: Amiodaron 300 mg nach 3. Schock","Asystolie/PEA: Epi sofort, dann alle 4 min","Kein Amiodaron bei Asystolie/PEA!"]},
{group:"Reversible Ursachen (4H + HITS)",checks:["Hypoxie → Beatmung, O₂","Hypovolämie → Volumen","Hypo-/Hyperkaliämie → Anamnese, Labor","Hypothermie → Temperatur messen","Herzbeuteltamponade → Perikardpunktion (NA)","Intoxikation → Antidot, Lipidrescue","Thrombose (LAE/ACS) → Lyse erwägen","Spannungspneumothorax → Entlastungspunktion"]}
]},
{id:"trauma_check",name:"Trauma-Versorgung (<C>ABCDE)",kategorie:"Trauma",iconName:"bone",
items:[
{group:"<C> Critical Bleeding",checks:["Massive externe Blutung? → Direkte Kompression, Tourniquet","Beckenverletzung? → Beckenschlinge anlegen"]},
{group:"A – Airway + HWS",checks:["HWS-Immobilisation (manuell → Stifneck)","Mund inspiziert, ggf. Fremdkörper entfernt","Atemweg frei? → Guedel/Wendl bei Bewusstlosigkeit","Intubation bei GCS ≤ 8 erwägen"]},
{group:"B – Breathing",checks:["Atemfrequenz, SpO₂, Auskultation","Spannungspneumothorax? → Entlastungspunktion!","Offener Pneumothorax? → Ventilverband","Instabiler Thorax? → Lagerung, Analgesie","O₂-Gabe nach Bedarf (Ziel SpO₂ ≥ 94%)"]},
{group:"C – Circulation",checks:["Puls, RR, Rekapillarisierungszeit","2x großlumiger i.v.-Zugang","VEL bei Schock (permissive Hypotension: Ziel-RRsyst 80-90)","Frakturen schienen","Wärmeerhalt!"]},
{group:"D – Disability",checks:["GCS erheben","Pupillen: Größe, Lichtreaktion, Seitendifferenz","BZ messen","Extremitäten: grobe Kraft, Sensibilität"]},
{group:"E – Exposure / Environment",checks:["Komplett entkleiden (Verletzungen suchen)","Rücken inspizieren (Log-Roll)","Wärmeerhalt (Decken, beheizte Infusionen)","Temperatur messen","Bodycheck: Kopf bis Fuß systematisch"]}
]},
{id:"sinnhaft",name:"Übergabe (SINNHAFT)",kategorie:"Kommunikation",iconName:"megaphone",
items:[
{group:"S – Start",checks:["RUHE herstellen: alle Manipulationen/Tätigkeiten am Patienten stoppen","Face-to-Face-Kommunikation sicherstellen","'Start der Übergabe' laut aussprechen → alle Beteiligten im Bilde"]},
{group:"I – Identifikation",checks:["Geschlecht des Patienten","Name des Patienten","Alter (NICHT Geburtsdatum!)"]},
{group:"N – Notfallereignis",checks:["WAS? Leitsymptom / Verdachtsdiagnose","WIE? Ursache / Mechanismus","WANN? Zeitpunkt des Ereignisses","Optional: WO? Ort / Auffindesituation"]},
{group:"N – Notfallpriorität",checks:["Befunde + Vitalparameter nach (x)ABCDE-Schema:","A (Airway): z.B. Stridor, Atemweg gesichert?","B (Breathing): AF, SpO₂, Auskultation","C (Circulation): RR, HF, Rekapzeit, Blutung","D (Disability): GCS, Pupillen, BZ, DMS","E (Exposure): Temperatur, Schmerzskala (NRS)","Pathologische Befunde hervorheben!"]},
{group:"H – Handlungen",checks:["Durchgeführte Maßnahmen mit Dosis/Umfang/Zeitpunkt","Wirkung der Maßnahmen dokumentieren","Bewusst UNTERLASSENE Maßnahmen benennen + begründen"]},
{group:"A – Anamnese",checks:["Allergien","Vorerkrankungen","Dauermedikation","Soziale Aspekte (z.B. Patientenverfügung, häusliche Gewalt)","Infektionen","Besonderheiten (DNR, DNI, Zeugen Jehovas etc.)"]},
{group:"F – Fazit",checks:["Übernehmendes Team wiederholt zusammenfassend:","→ Identifikation","→ Notfallereignis","→ Notfallpriorität (ohne Vitalparameter)","→ Handlungen (ohne Wirkung)"]},
{group:"T – Teamfragen",checks:["Raum für Fragen aus dem übernehmenden Team","Offene Punkte klären","Verantwortungsübergabe bestätigt"]}
]},
{id:"med_vorbereitung",name:"Medikamenten-Vorbereitung",kategorie:"Medikation",iconName:"pill",
items:[
{group:"6-R-Regel",checks:["Richtiger Patient","Richtiges Medikament","Richtige Dosis","Richtige Applikationsform (i.v., i.m., i.o., nasal)","Richtige Zeit","Richtige Dokumentation"]},
{group:"Vor Gabe prüfen",checks:["Indikation vorhanden (laut SAA/BPR)","Kontraindikationen ausgeschlossen","Allergien erfragt","Vitale Bedrohung → NA-Rücksprache bei Unsicherheit","Medikament aufgezogen + beschriftet","Zugang funktionsfähig + gespült"]},
{group:"Nach Gabe prüfen",checks:["Wirkung beobachten (Zeitfenster beachten)","UAW überwachen","Nachdokumentation: Medikament, Dosis, Uhrzeit, Applikationsweg","Repetitionsdosis: Zeitintervall beachten"]}
]}
,
{id:"iv_zugang",name:"i.v.-Zugang",kategorie:"Invasiv (SAA)",iconName:"syringe",
items:[
{group:"Vorbereitung",checks:["Indikation: Infusion oder Medikamentengabe i.v. erforderlich","Kontraindikationen geprüft: Keine Punktion bei Dialyse-Shunt, Parese, Infektion, Verletzung","Punktionsstelle: peripher → zentral, Ellenbeuge möglichst vermeiden","Material: Venenverweilkanüle, Stauschlauch, Desinfektionsmittel, Pflaster, Tupfer","Handschuhe angezogen"]},
{group:"Durchführung",checks:["Stauschlauch anlegen","Vene tasten/identifizieren","Hautdesinfektion (Einwirkzeit!)","Erneute Desinfektion","Punktion: Kanüle 15-30° → Blut in Kammer → Kunststoffkanüle vorschieben","Stauschlauch lösen","Mandrin entfernen + sicher entsorgen","Infusionssystem anschließen → Durchlauf prüfen"]},
{group:"Nachsorge",checks:["Kanüle fixieren (Pflaster/Fixomull)","Punktionsstelle auf Schwellung/Paravasation prüfen","Ggf. Dreiwegehahn aufsetzen","Dokumentation: Datum, Größe, Punktionsort"]}
]},
{id:"io_zugang",name:"i.o.-Zugang",kategorie:"Invasiv (SAA)",iconName:"crosshair",
items:[
{group:"Indikation prüfen",checks:["Kreislaufstillstand ODER lebensbedrohliche Situation","i.v.-Zugang nicht möglich / nicht zeitgerecht","Kontraindikationen ausgeschlossen: Keine Fraktur der Tibia, kein Vorversuch am selben Knochen","Keine Infektion/Prothese/Implantat an Punktionsstelle"]},
{group:"Vorbereitung",checks:["Punktionsort: Proximale Tibia medial der Tuberositas tibiae","Geeignete Nadel gewählt (EZ-IO: Farbe nach Patientengewicht)","Verlängerungsschlauch + Dreiwegehahn + kristalloide Lösung bereit","Desinfektionsmittel bereit","Ggf. Lidocain 2% für wachen Patienten"]},
{group:"Durchführung",checks:["Hautdesinfektion","Nadel senkrecht auf Tibia aufsetzen","EZ-IO: Bohren bis Widerstandsverlust","Mandrin entfernen","Aspiration → Knochenmark = korrekte Lage","NaCl-Bolus zum Freispülen","Verlängerungsschlauch anschließen"]},
{group:"Nachsorge",checks:["Fixierung","Auf Paravasation prüfen (Wadenschwellung?)","Alle i.v.-Medikamente sind i.o. applizierbar","Maximale Liegedauer: 24 Stunden","Dokumentation: Uhrzeit, Punktionsort, System"]}
]},
{id:"thorax_check",name:"Thoraxentlastungspunktion",kategorie:"Invasiv (SAA)",iconName:"crosshair",
items:[
{group:"Indikation",checks:["Spannungspneumothorax: rasch zunehmende hämodynamische + respiratorische Instabilität","Klinische Zeichen: einseitig fehlendes AG, Hautemphysem, Halsvenenstauung, Trachealdeviation","Bei korrekter Indikation: KEINE Kontraindikation"]},
{group:"Material + Punktionsort",checks:["Kanüle > 8 cm Länge, möglichst großlumig","Spritze halb mit NaCl/Aqua gefüllt auf Kanüle","Punktionsstelle wählen: Monaldi (2. ICR MCL) ODER Bülau (4. ICR vordere Axillarlinie)","Cave Monaldi: A. thoracica interna bei zu medialem Einstich","Cave Bülau: Organverletzungen bei zu caudalem Einstich"]},
{group:"Durchführung",checks:["Hautdesinfektion","Punktion am Oberrand der Rippe (senkrecht zur Thoraxwand!)","Vorschieben unter Aspiration","Luftaustritt: Lagebestätigung (Blasen in Spritze)","Mandrin entfernen, Kanüle belassen","Kanüle fixieren"]},
{group:"Erfolgskontrolle",checks:["Hämodynamische Besserung?","Atemgeräusch kontrollieren","SpO2 verbessert?","Transport in Thoraxchirurgie"]}
]},
{id:"geburt_check",name:"Außerklinische Geburt",kategorie:"Geburtshilfe (BPR)",iconName:"users",
items:[
{group:"Erstbeurteilung",checks:["Unmittelbar nahende Geburt? (Pressdrang, Kind sichtbar?)","KEIN sicheres Zeichen? → vorzeitiger Blasensprung → Liegendtransport","Kontraindikation Geburt vor Ort? (Querlage, Placenta praevia) → Transport!","Zeitpunkt des Blasensprungs erfragen"]},
{group:"Vorbereitung",checks:["Wärme sicherstellen (Raum/RTW heizen, Tücher bereitlegen)","Licht, Intimität schaffen","Mutter in Steinschnittlage positionieren","i.v.-Zugang legen","Sterile Handschuhe anziehen","Abnabelungsset bereitlegen","Warme Tücher für Neugeborenes"]},
{group:"Geburt begleiten",checks:["Geburtsfortschritt beobachten (KEINE vaginale Untersuchung!)","Dammschutz = Kopfbremse anwenden","Schulterentwicklung: Kind folgt","Uhrzeit der Geburt dokumentieren"]},
{group:"Nachgeburt",checks:["Abnabeln nach 1 min, 15-20 cm vom Nabel","Neugeborenes: Abtrocknen, stimulieren, Wärmeerhalt","APGAR-Score nach 1, 5 und 10 min","Aktive Atonieprophylaxe: Säugling anlegen","Oxytocin durch NA erwägen","Regelmäßig Blutung + Uteruskontraktion prüfen","Plazenta-Geburt abwarten (NICHT aktiv ziehen!)"]}
]},
{id:"atemweg_check",name:"Atemwegsmanagement",kategorie:"Atemweg (BPR/SAA)",iconName:"lung",
items:[
{group:"Basismaßnahmen",checks:["Mund-Rachen inspizieren + Absaugung bereit","Kopf überstrecken / Esmarch-Handgriff","O2-Gabe hochdosiert (15 l/min)","Guedel-Tubus bei Bewusstlosigkeit (Zahnreihenabstand messen!)","ODER: Wendl-Tubus bei erhaltenem Würgreflex","Beutel-Maske-Beatmung bei Apnoe (C-Griff, 2-Helfer-Technik)"]},
{group:"Extraglottischer Atemweg (EGA)",checks:["Indikation: Beutel-Maske nicht suffizient ODER längerer Transport","EGA-Typ wählen: LTS-D, Larynxmaske 2. Gen. oder i-gel","Größe nach Patientengewicht wählen","Einführen gemäß SAA (blind, ohne Laryngoskop)","Cuff blocken (außer i-gel)","Lagebestätigung: Kapnographie (CO2-Kurve!)","Auskultation: beidseits seitengleich?","Magensonde über Drainagekanal (LTS-D)"]},
{group:"Intubation (NA-Maßnahme)",checks:["Nur durch Notarzt oder delegiert mit Rücksprache","RSI-Checkliste durcharbeiten","Plan B: EGA bereithalten","Plan C: Koniotomie-Set bereithalten"]},
{group:"Monitoring",checks:["Kontinuierliche Kapnographie!","SpO2-Monitoring","Beatmungsparameter: Vt 6-8 ml/kgKG, AF 10-12/min","Tubustiefe / EGA-Tiefe dokumentieren"]}
]},
{id:"lyse_check",name:"Lyse-Checkliste",kategorie:"ACS / LAE / Stroke (BPR)",iconName:"zap",
items:[
{group:"Indikation prüfen",checks:["STEMI (ST-Hebung oder neuer LSB + Symptome)?","ODER LAE mit hämodynamischer Instabilität?","ODER Ischämischer Schlaganfall im Zeitfenster (< 4,5h)?","Symptombeginn-Zeitpunkt dokumentiert!"]},
{group:"Kontraindikationen ausschließen (absolut)",checks:["Aktive innere Blutung","Hämorrhagischer Schlaganfall (aktuell oder anamnestisch)","Intrakranielle Neoplasie / ZNS-Operation < 3 Monate","Aortendissektion","Gerinnungsstörung / INR > 1,7","Punktion nicht komprimierbarer Gefäße < 24h"]},
{group:"Relative Kontraindikationen",checks:["Große OP / Trauma < 2-4 Wochen","Schwangerschaft","Unkontrollierter Hypertonus (> 180/110 trotz Therapie)","Orale Antikoagulation","CPR > 10 min (bei ACS relativ)","Schwere Leber-/Nierenerkrankung"]},
{group:"Vor Lyse",checks:["NA-Entscheidung: Lyse indiziert","i.v.-Zugang gesichert (2x)","RR, HF, SpO2 dokumentiert","12-Kanal-EKG dokumentiert","Monitoring aufgebaut","Reanimationsbereitschaft hergestellt","Zeitpunkt dokumentiert"]},
{group:"Bei LAE (Kreislaufstillstand)",checks:["Heparin 5.000 I.E. i.v. bei LAE (laut BPR LAE, wenn Wells ≥ 5)","Alteplase (rt-PA) 50 mg i.v. als Bolus bei instabiler LAE","CPR für mindestens 60-90 min nach Lyse fortsetzen!","Ggf. weitere 50 mg nach 15 min"]}
]}
];
// ═══════════════════════════════════════════════════════
// DATA: ABCDE-SCHEMA INTERAKTIV
// ═══════════════════════════════════════════════════════
const ABCDE_DATA = [
{id:"a",letter:"A",title:"Airway – Atemweg",color:"#ef4444",
checks:["Patient ansprechbar? → Atemweg frei","Stridor/Gurgeln/Schnarchen?","Mund-Rachen inspizieren","Fremdkörper? → Entfernen","Schwellung/Trauma → Atemweg bedroht?"],
interventions:["Kopf überstrecken/Esmarch-Handgriff","Absaugung","Guedel-Tubus / Wendl-Tubus","Bei GCS ≤ 8: supraglottischer Atemweg / Intubation erwägen"],
redflags:["Komplette Verlegung → sofort handeln!","Inspiratorischer Stridor → Schwellung/FK?","Kein Sprechen möglich → kritisch!"]},
{id:"b",letter:"B",title:"Breathing – Atmung",color:"#f59e0b",
checks:["Atemfrequenz zählen (30 Sek. × 2)","SpO₂ messen","Auskultation: seitengleich? Rasselgeräusche? Giemen?","Thorax inspizieren: symmetrisch? Einziehungen?","Atemarbeit: Einsatz Atemhilfsmuskulatur?"],
interventions:["O₂-Gabe (Ziel SpO₂ ≥ 94%, COPD: 88-92%)","Lagerung: Oberkörper hoch","Bronchodilatation: Salbutamol bei Giemen","Beatmung bei AF < 8 oder > 30","Entlastungspunktion bei V.a. Spannungspneu"],
redflags:["SpO₂ < 90% → kritisch!","AF < 8 oder > 30/min","Einseitig aufgehobenes AG → Pneumothorax?","Schaumiger Auswurf → Lungenödem"]},
{id:"c",letter:"C",title:"Circulation – Kreislauf",color:"#3b82f6",
checks:["Puls: Frequenz, Rhythmus, Qualität","RR messen","Rekapillarisierungszeit (< 2 Sek. normal)","Hautkolorit: blass? zyanotisch? marmoriert?","Blutungsquellen suchen!","12-Kanal-EKG ableiten"],
interventions:["i.v.-Zugang (bei Schock: 2× großlumig)","VEL bei Hypovolämie","Blutungskontrolle (Kompression/Tourniquet)","BZ messen","Schocklagerung bei RRsyst < 90"],
redflags:["RR syst < 90 mmHg → Schock!","HF > 150 oder < 40 → Rhythmusstörung!","Keine tastbaren Pulse → Reanimation?","Rekapzeit > 4 Sek. → Zentralisation"]},
{id:"d",letter:"D",title:"Disability – Neurologie",color:"#8b5cf6",
checks:["GCS erheben (Augen + Verbal + Motorik)","Pupillen: Größe, Lichtreaktion, Seitendifferenz","BZ messen!","Extremitäten: Kraft, Sensibilität, Seitenvergleich","Cincinnati Stroke Scale (Gesicht/Arm/Sprache)"],
interventions:["Hypoglykämie → Glucose","Krampfanfall → Midazolam","Intubation bei GCS ≤ 8","Oberkörperhochlagerung 30° bei SHT"],
redflags:["GCS-Verschlechterung → sofort re-evaluieren!","Einseitig weite Pupille → Einklemmung?","BZ < 40 mg/dl → sofort Glucose!","Akute Hemiparese → Stroke! Zeitfenster?"]},
{id:"e",letter:"E",title:"Exposure – Erweiterte Untersuchung",color:"#06b6d4",
checks:["Komplett entkleiden (Wärmeerhalt!)","Temperatur messen","Bodycheck: Kopf bis Fuß","Rücken inspizieren","Allergien, Medikamente, Vorerkrankungen erfragen (SAMPLER)"],
interventions:["Wärmeerhalt (Decken, Rettungsdecke)","Schmerztherapie","Frakturen schienen","Wundversorgung","Dokumentation aller Befunde"],
redflags:["Hypothermie < 35°C → aktive Maßnahmen!","Unentdeckte Blutungsquelle dorsal","Petechien → Meningokokken?","Medikamenteneinnahme → Intoxikation?"]}
];
// ═══════════════════════════════════════════════════════
// 12-KANAL-EKG SVG KOMPONENTE
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
// LEITSYMPTOM-ABLAUFDIAGRAMME (SVG)
// ═══════════════════════════════════════════════════════
const LS_FLOWS = {
ls_dyspnoe:{title:"Dyspnoe",color:"#3b82f6",nodes:[
{id:"start",type:"start",lines:["DYSPNOE"],x:190,y:10},
{id:"basis",type:"action",lines:["Basismaßnahmen","Sauerstoffgabe"],x:190,y:60},
{id:"q1",type:"decision",lines:["Spontanatmung","ausreichend?"],x:190,y:130},
{id:"aw",type:"ref",lines:["→ BPR","Atemwegsmanagem."],x:20,y:130},
{id:"q2",type:"decision",lines:["Stridor /","Aspiration?"],x:190,y:210},
{id:"fk",type:"ref",lines:["→ BPR A-Problem","Fremdkörper"],x:20,y:210},
{id:"q3",type:"decision",lines:["Spannungs-","pneumothorax?"],x:190,y:290},
{id:"thorax",type:"ref",lines:["→ SAA Thorax-","entlastung"],x:20,y:290},
{id:"diff",type:"action",lines:["Differenzierung","nach Ursache"],x:190,y:370},
{id:"d1",type:"result",lines:["Plötzlich +","unauff. Ausk.","→ V.a. LAE"],x:10,y:450},
{id:"d2",type:"result",lines:["Giemen +","kein Fieber","→ Asthma"],x:130,y:450},
{id:"d3",type:"result",lines:["Giemen +","Fieber","→ COPD"],x:250,y:450},
{id:"d4",type:"result",lines:["RG / Knistern","kein Fieber","→ Lungenödem"],x:370,y:450}
],edges:[
["start","basis"],["basis","q1"],["q1","q2","Ja"],["q1","aw","Nein"],
["q2","q3","Nein"],["q2","fk","Ja"],
["q3","diff","Nein"],["q3","thorax","Ja"],
["diff","d1"],["diff","d2"],["diff","d3"],["diff","d4"]
]},
ls_blutung:{title:"Kritische Blutung",color:"#ef4444",nodes:[
{id:"start",type:"start",lines:["KRITISCHE","BLUTUNG"],x:190,y:10},
{id:"basis",type:"action",lines:["Basismaßnahmen","<c>ABCDE"],x:190,y:75},
{id:"komp",type:"action",lines:["Manuelle","Kompression"],x:190,y:140},
{id:"q1",type:"decision",lines:["Lokalisation?"],x:190,y:210},
{id:"ext",type:"action",lines:["Extremität:","Hochlagerung →","Kompr.verband →","Tourniquet"],x:50,y:290},
{id:"stamm",type:"action",lines:["Körperstamm:","Hämostyptikum","+ Packing"],x:330,y:290},
{id:"allg",type:"action",lines:["Beckenschlinge?","Immobilisation","Hypothermieschutz"],x:190,y:400},
{id:"zugang",type:"action",lines:["i.v./i.o.-Zugang","+ VEL","+ Tranexamsäure"],x:190,y:490},
{id:"load",type:"result",lines:["Load & Go","prüfen!"],x:190,y:580}
],edges:[
["start","basis"],["basis","komp"],["komp","q1"],
["q1","ext","Extremität"],["q1","stamm","Stamm"],
["ext","allg"],["stamm","allg"],["allg","zugang"],["zugang","load"]
]},
ls_tloc:{title:"Kurzzeitige Bewusstlosigkeit (TLOC)",color:"#f59e0b",nodes:[
{id:"start",type:"start",lines:["TLOC"],x:190,y:10},
{id:"basis",type:"action",lines:["Basismaßnahmen","12-Kanal-EKG"],x:190,y:60},
{id:"q1",type:"decision",lines:["V.a. SHT /","Trauma?"],x:190,y:130},
{id:"poly",type:"ref",lines:["→ BPR","Polytrauma"],x:20,y:130},
{id:"diff",type:"decision",lines:["Differenzierung?"],x:190,y:215},
{id:"syn",type:"action",lines:["Synkope"],x:50,y:300},
{id:"krampf",type:"ref",lines:["→ BPR","Krampfanfall"],x:190,y:300},
{id:"stroke",type:"ref",lines:["→ BPR","Schlaganfall"],x:330,y:300},
{id:"syn_diff",type:"decision",lines:["Synkope-Typ?"],x:50,y:380},
{id:"ort",type:"result",lines:["Orthostatisch","/ Vagal","→ oft benigne"],x:0,y:460},
{id:"kard",type:"result",lines:["Kardial:","Rhythmogen → Brady/","Tachykardie","Ischämisch → ACS","Embolisch → LAE"],x:160,y:460}
],edges:[
["start","basis"],["basis","q1"],["q1","diff","Nein"],["q1","poly","Ja"],
["diff","syn","Synkope"],["diff","krampf","Krampf"],["diff","stroke","Neuro"],
["syn","syn_diff"],["syn_diff","ort","Benigne"],["syn_diff","kard","Kardial"]
]},
ls_brustschmerz:{title:"Nichttraumatischer Brustschmerz",color:"#ec4899",nodes:[
{id:"start",type:"start",lines:["BRUSTSCHMERZ","(nichttraumat.)"],x:190,y:10},
{id:"basis",type:"action",lines:["Basismaßnahmen","RR BEIDSEITS","12-Kanal-EKG"],x:190,y:80},
{id:"q1",type:"decision",lines:["Anhalt für","ACS?"],x:190,y:175},
{id:"acs",type:"ref",lines:["→ BPR ACS","ASS + Heparin"],x:20,y:175},
{id:"q2",type:"decision",lines:["Pneumo-","thorax?"],x:190,y:260},
{id:"ptx",type:"ref",lines:["→ SAA Thorax-","entlastung"],x:20,y:260},
{id:"q3",type:"decision",lines:["V.a. LAE?"],x:190,y:340},
{id:"lae",type:"ref",lines:["→ BPR LAE","Heparin"],x:20,y:340},
{id:"q4",type:"decision",lines:["Aorten-","syndrom?"],x:190,y:415},
{id:"aorta",type:"ref",lines:["→ BPR Aorten-","syndrom"],x:20,y:415},
{id:"schmerz",type:"action",lines:["Schmerztherapie","Re-Evaluation"],x:190,y:500}
],edges:[
["start","basis"],["basis","q1"],
["q1","q2","Nein"],["q1","acs","Ja"],
["q2","q3","Nein"],["q2","ptx","Ja"],
["q3","q4","Nein"],["q3","lae","Ja"],
["q4","schmerz","Nein"],["q4","aorta","Ja"]
]},
ls_schmerzen:{title:"Schmerzen (Analgesie-Algorithmus)",color:"#10b981",nodes:[
{id:"start",type:"start",lines:["SCHMERZEN"],x:190,y:10},
{id:"basis",type:"action",lines:["Lagerung","bei Trauma: Kühlung"],x:190,y:60},
{id:"nrs",type:"decision",lines:["NRS-Stufe?"],x:190,y:130},
{id:"nrs3",type:"action",lines:["NRS ≥ 3:","i.v.-Zugang","Paracetamol ODER","Ibuprofen"],x:20,y:220},
{id:"abd",type:"decision",lines:["Abdominell","kolikartig?"],x:20,y:335},
{id:"busc",type:"result",lines:["+ Butyl-","scopolamin"],x:0,y:420},
{id:"nrs6",type:"action",lines:["NRS ≥ 6:","+ Opioid ODER","Esketamin"],x:190,y:220},
{id:"typ",type:"decision",lines:["Schmerztyp?"],x:190,y:325},
{id:"t_trauma",type:"result",lines:["Trauma:","Opioid oder","Esketamin"],x:80,y:420},
{id:"t_abd",type:"result",lines:["Abdominell:","Opioid"],x:210,y:420},
{id:"t_acs",type:"result",lines:["ACS:","Morphin"],x:330,y:420},
{id:"nrs9",type:"action",lines:["NRS ≥ 9:","Opioid/Esketamin","ZUERST, dann","Basis-Analgesie"],x:360,y:220}
],edges:[
["start","basis"],["basis","nrs"],
["nrs","nrs3","3-5"],["nrs","nrs6","6-8"],["nrs","nrs9","≥ 9"],
["nrs3","abd"],["abd","busc","Ja"],
["nrs6","typ"],["typ","t_trauma","Trauma"],["typ","t_abd","Abdom."],["typ","t_acs","ACS"]
]},
ls_schock:{title:"Schock",color:"#8b5cf6",nodes:[
{id:"start",type:"start",lines:["SCHOCK"],x:210,y:10},
{id:"basis",type:"action",lines:["Basismaßnahmen","i.v.-Zugang + VEL"],x:210,y:60},
{id:"diff",type:"decision",lines:["Schockform?"],x:210,y:135},
{id:"hypo",type:"result",lines:["Hypovolämisch:","→ Polytrauma","→ Krit. Blutung","VEL + Tranexam."],x:10,y:230},
{id:"dist",type:"result",lines:["Distributiv:","→ Anaphylaxie","→ Sepsis","Epi / Volumen"],x:140,y:230},
{id:"kard",type:"result",lines:["Kardiogen:","→ ACS","→ Rhythmusstör.","Katecholamine"],x:270,y:230},
{id:"obstr",type:"result",lines:["Obstruktiv:","→ LAE","→ Spannungs-PTX","Ursache beheben!"],x:400,y:230},
{id:"reeval",type:"action",lines:["Regelmäßige","Re-Evaluation","ABCDE"],x:210,y:370}
],edges:[
["start","basis"],["basis","diff"],
["diff","hypo"],["diff","dist"],["diff","kard"],["diff","obstr"],
["hypo","reeval"],["dist","reeval"],["kard","reeval"],["obstr","reeval"]
]},
ls_neuro:{title:"Zentrales neurologisches Defizit",color:"#06b6d4",nodes:[
{id:"start",type:"start",lines:["ZENTRALES","NEURO. DEFIZIT"],x:190,y:10},
{id:"basis",type:"action",lines:["Basismaßnahmen","ABCDE-Schema"],x:190,y:75},
{id:"q1",type:"decision",lines:["A-Problem?"],x:190,y:145},
{id:"a_ref",type:"ref",lines:["→ Atemweg","sichern"],x:20,y:145},
{id:"q2",type:"decision",lines:["Fokale","Neurologie?"],x:190,y:225},
{id:"stroke",type:"ref",lines:["→ BPR Stroke","BE-FAST!"],x:20,y:225},
{id:"q3",type:"decision",lines:["Krampfanfall?"],x:190,y:305},
{id:"krampf",type:"ref",lines:["→ BPR Krampf","Midazolam"],x:20,y:305},
{id:"q4",type:"decision",lines:["BZ < 60?"],x:190,y:380},
{id:"hypo",type:"ref",lines:["→ BPR Hypo-","glykämie"],x:20,y:380},
{id:"q5",type:"decision",lines:["Intoxikation?"],x:190,y:455},
{id:"intox",type:"ref",lines:["→ BPR Intox.","/ Hypothermie"],x:20,y:455},
{id:"weiter",type:"action",lines:["Weitere DD:","Meningitis","Intrakran. Blutung"],x:190,y:535}
],edges:[
["start","basis"],["basis","q1"],
["q1","q2","Nein"],["q1","a_ref","Ja"],
["q2","q3","Nein"],["q2","stroke","Ja"],
["q3","q4","Nein"],["q3","krampf","Ja"],
["q4","q5","Nein"],["q4","hypo","Ja"],
["q5","weiter","Nein"],["q5","intox","Ja"]
]}
};
const BPR_FLOWS = {
rea_als:{title:"Reanimation Erwachsene (ALS)",color:"#ef4444",nodes:[
{id:"s",type:"start",lines:["KREISLAUF-","STILLSTAND"],x:170,y:5},
{id:"hdm",type:"action",lines:["HDM 100–120/min","Tiefe 5–6 cm","30:2 Beatmung"],x:170,y:75},
{id:"ega",type:"action",lines:["EGA einlegen","Kapnographie","i.v./i.o.-Zugang"],x:170,y:160},
{id:"rhy",type:"decision",lines:["Rhythmus-","analyse"],x:170,y:250},
{id:"vf",type:"action",lines:["VF / pVT:","Defibrillation"],x:20,y:340},
{id:"pea",type:"action",lines:["Asystolie / PEA:","KEINE Defi"],x:320,y:340},
{id:"epi_vf",type:"action",lines:["Epi nach 3. Defi","dann alle 4 min"],x:20,y:420},
{id:"ami",type:"action",lines:["Amiodaron:","300 mg n. 3. Defi","150 mg n. 5. Defi"],x:20,y:500},
{id:"epi_pea",type:"action",lines:["Epi SOFORT","dann alle 4 min"],x:320,y:420},
{id:"hits",type:"result",lines:["4H und HITS","bedenken!"],x:320,y:500},
{id:"loop",type:"ref",lines:["→ Rhythmusanalyse","alle 2 min"],x:170,y:580}
],edges:[
["s","hdm"],["hdm","ega"],["ega","rhy"],
["rhy","vf","VF/pVT"],["rhy","pea","Asyst./PEA"],
["vf","epi_vf"],["epi_vf","ami"],["pea","epi_pea"],["epi_pea","hits"],
["ami","loop"],["hits","loop"]
]},
rea_pls:{title:"Reanimation Kinder (PLS)",color:"#ef4444",nodes:[
{id:"s",type:"start",lines:["KREISLAUFSTILLSTAND","KIND"],x:170,y:5},
{id:"beat",type:"action",lines:["5 initiale","Beatmungen"],x:170,y:65},
{id:"hdm",type:"action",lines:["HDM 100–120/min","⅓ Thoraxdurchmesser","15:2 Beatmung"],x:170,y:135},
{id:"tech",type:"decision",lines:["Alter?"],x:170,y:225},
{id:"sgl",type:"ref",lines:["Säugling:","2-Daumen-Technik"],x:20,y:225},
{id:"kind",type:"ref",lines:["Kind:","ein-/beidhändig"],x:320,y:225},
{id:"ega",type:"action",lines:["EGA + Kapnographie","i.v./i.o.-Zugang"],x:170,y:310},
{id:"rhy",type:"decision",lines:["Rhythmus?"],x:170,y:390},
{id:"vf",type:"action",lines:["VF/pVT:","Defi 4 J/kgKG"],x:20,y:470},
{id:"pea",type:"action",lines:["Asystolie/PEA:","keine Defi"],x:320,y:470},
{id:"med",type:"action",lines:["Epi 0,01 mg/kgKG","Amiod. 5 mg/kgKG","(nach 3. Defi)"],x:170,y:550}
],edges:[
["s","beat"],["beat","hdm"],["hdm","tech"],
["tech","sgl","Säugl."],["tech","kind","Kind"],
["sgl","ega"],["kind","ega"],["ega","rhy"],
["rhy","vf","VF/pVT"],["rhy","pea","Asyst./PEA"],
["vf","med"],["pea","med"]
]},
rea_nls:{title:"Reanimation Neugeborene (NLS)",color:"#ef4444",nodes:[
{id:"s",type:"start",lines:["NEUGEBORENES"],x:170,y:5},
{id:"warm",type:"action",lines:["Wärmeerhalt","Abtrocknen"],x:170,y:55},
{id:"aw",type:"action",lines:["Atemwege frei","Kopf Neutralposition"],x:170,y:120},
{id:"apgar",type:"action",lines:["APGAR-Score","1 / 5 / 10 min"],x:170,y:185},
{id:"beat",type:"action",lines:["5 initiale Beatm.","(Blähmanöver)","30/min"],x:170,y:255},
{id:"q1",type:"decision",lines:["HF < 60","trotz Beatm.?"],x:170,y:345},
{id:"ok",type:"result",lines:["Weiter beatmen","überwachen"],x:320,y:345},
{id:"hdm",type:"action",lines:["HDM starten","3:1 (HDM:Beat.)"],x:170,y:430},
{id:"epi",type:"action",lines:["Epi 10–30 µg/","kgKG i.v./i.o."],x:170,y:505},
{id:"nvk",type:"ref",lines:["Nabelvenenkath.","erwägen"],x:170,y:575}
],edges:[
["s","warm"],["warm","aw"],["aw","apgar"],["apgar","beat"],
["beat","q1"],["q1","hdm","Ja"],["q1","ok","Nein"],
["hdm","epi"],["epi","nvk"]
]},
post_rosc:{title:"Postreanimation (Post-ROSC)",color:"#f97316",nodes:[
{id:"s",type:"start",lines:["ROSC"],x:170,y:5},
{id:"abcde",type:"action",lines:["ABCDE-Re-Eval.","GCS + Pupillen"],x:170,y:55},
{id:"aw",type:"action",lines:["Atemweg sichern","GCS ≤ 8: Intubation","SpO₂ 94–98%"],x:170,y:130},
{id:"ekg",type:"action",lines:["12-Kanal-EKG","i.v.-Zugang"],x:170,y:215},
{id:"rr",type:"action",lines:["Ziel-RRsyst","≥ 80 mmHg","VEL / Vasopressoren"],x:170,y:285},
{id:"bz",type:"action",lines:["BZ-Kontrolle","Hypo-/Hyperglyk.","behandeln"],x:170,y:365},
{id:"temp",type:"action",lines:["Temperaturmgmt.","Ziel 32–36 °C"],x:170,y:445},
{id:"transp",type:"result",lines:["Transport geeignete","Klinik (PCI bei STEMI)"],x:170,y:515}
],edges:[
["s","abcde"],["abcde","aw"],["aw","ekg"],["ekg","rr"],
["rr","bz"],["bz","temp"],["temp","transp"]
]},
fk_aspiration:{title:"Fremdkörperaspiration",color:"#f59e0b",nodes:[
{id:"s",type:"start",lines:["FREMDKÖRPER-","ASPIRATION"],x:170,y:5},
{id:"q1",type:"decision",lines:["Effektiver","Husten?"],x:170,y:80},
{id:"husten",type:"action",lines:["Zum Husten","ermutigen"],x:320,y:80},
{id:"q2",type:"decision",lines:["Bewusstlos?"],x:170,y:170},
{id:"rea",type:"ref",lines:["→ Reanimation","(30:2)"],x:320,y:170},
{id:"erw",type:"decision",lines:["Erwachsener?"],x:170,y:255},
{id:"erw_m",type:"action",lines:["5× Rückenschläge","5× Heimlich-Griff","alternierend"],x:20,y:340},
{id:"kind_m",type:"action",lines:["Säugling:","5× Rückenklopfen","5× Thoraxkompr.","Kind: wie Erw."],x:320,y:340},
{id:"laryn",type:"ref",lines:["Laryngoskopie +","Magillzange","erwägen"],x:170,y:435}
],edges:[
["s","q1"],["q1","husten","Ja"],["q1","q2","Nein"],
["q2","rea","Ja"],["q2","erw","Nein"],
["erw","erw_m","Erw."],["erw","kind_m","Kind"],
["erw_m","laryn"],["kind_m","laryn"]
]},
a_problem_erw:{title:"A-Problem Erwachsene",color:"#f59e0b",nodes:[
{id:"s",type:"start",lines:["A-PROBLEM","ERWACHSENE"],x:170,y:5},
{id:"h",type:"action",lines:["Hinweise: Stridor","inv. Atmung, Dyspnoe","Sprechen unmöglich"],x:170,y:75},
{id:"q1",type:"decision",lines:["Bewusstlos?"],x:170,y:170},
{id:"aw",type:"ref",lines:["→ Atemwegs-","management"],x:20,y:170},
{id:"q2",type:"decision",lines:["Fremdkörper?"],x:170,y:250},
{id:"fk",type:"ref",lines:["→ BPR FK-","Aspiration"],x:20,y:250},
{id:"q3",type:"decision",lines:["Ödem/Schwellung","Oropharynx?"],x:170,y:340},
{id:"epi",type:"action",lines:["Epinephrin","vernebeln"],x:20,y:340},
{id:"q4",type:"decision",lines:["Anaphylaxie?"],x:170,y:430},
{id:"ana",type:"ref",lines:["→ BPR","Anaphylaxie"],x:20,y:430},
{id:"other",type:"result",lines:["Andere Ursachen:","Angioödem, Tumor,","Abszess → NA/Transp."],x:170,y:515}
],edges:[
["s","h"],["h","q1"],["q1","q2","Nein"],["q1","aw","Ja"],
["q2","q3","Nein"],["q2","fk","Ja"],
["q3","q4","Nein"],["q3","epi","Ja"],
["q4","other","Nein"],["q4","ana","Ja"]
]},
aortensyndrom:{title:"Akutes Aortensyndrom",color:"#dc2626",nodes:[
{id:"s",type:"start",lines:["AKUTES","AORTENSYNDROM"],x:170,y:5},
{id:"h",type:"action",lines:["Reißender Schmerz","Rücken/Schulterblatt","wandernd"],x:170,y:75},
{id:"rr",type:"action",lines:["RR an BEIDEN Armen","Diff. > 20 mmHg?","Periphere Pulse?"],x:170,y:160},
{id:"basis",type:"action",lines:["Basismaßnahmen","O₂-Gabe, i.v.-Zugang","12-Kanal-EKG"],x:170,y:250},
{id:"schmerz",type:"action",lines:["Schmerztherapie"],x:170,y:335},
{id:"q1",type:"decision",lines:["RRsyst","> 140?"],x:170,y:400},
{id:"ura",type:"action",lines:["Urapidil i.v."],x:20,y:400},
{id:"transp",type:"result",lines:["Load-go-treat!","Zuweisungskonzept"],x:170,y:480}
],edges:[
["s","h"],["h","rr"],["rr","basis"],["basis","schmerz"],
["schmerz","q1"],["q1","ura","Ja"],["q1","transp","Nein"],
["ura","transp"]
]},
acs:{title:"Akutes Koronarsyndrom (ACS)",color:"#ef4444",nodes:[
{id:"s",type:"start",lines:["V.a. ACS"],x:170,y:5},
{id:"sym",type:"action",lines:["Retrosternaler Druck","Ausstrahlung, Übelkeit","Kaltschweißigkeit"],x:170,y:60},
{id:"ekg",type:"action",lines:["12-Kanal-EKG","+ erw. Ableitungen","i.v.-Zugang, O₂"],x:170,y:140},
{id:"q1",type:"decision",lines:["STEMI /","OMI?"],x:170,y:230},
{id:"stemi",type:"action",lines:["ASS + Heparin","→ PCI-Klinik","direkt ins HKL"],x:20,y:320},
{id:"nste",type:"decision",lines:["NSTE-ACS:","Risikofakt.?"],x:320,y:320},
{id:"nste_h",type:"action",lines:["ASS + Heparin","→ PCI-Klinik"],x:230,y:410},
{id:"nste_l",type:"action",lines:["ASS","→ Klinik"],x:400,y:410},
{id:"schmerz",type:"action",lines:["Schmerztherapie","Rhythmusüberwachung"],x:170,y:490},
{id:"tele",type:"result",lines:["EKG telemetrisch","übertragen"],x:170,y:565}
],edges:[
["s","sym"],["sym","ekg"],["ekg","q1"],
["q1","stemi","Ja"],["q1","nste","Nein"],
["nste","nste_h","Ja"],["nste","nste_l","Nein"],
["stemi","schmerz"],["nste_h","schmerz"],["nste_l","schmerz"],
["schmerz","tele"]
]},
anaphylaxie:{title:"Anaphylaxie",color:"#a855f7",nodes:[
{id:"s",type:"start",lines:["ANAPHYLAXIE"],x:170,y:5},
{id:"stop",type:"action",lines:["Allergenexposition","STOPPEN"],x:170,y:55},
{id:"abcde",type:"action",lines:["A-B-C-D-E","Beurteilung"],x:170,y:115},
{id:"q1",type:"decision",lines:["Grad?"],x:170,y:185},
{id:"g4",type:"ref",lines:["Grad IV:","→ Reanimation"],x:320,y:185},
{id:"epi",type:"action",lines:["Grad II/III:","Epi i.m.","(Repetition alle 5 min)"],x:170,y:275},
{id:"q2",type:"decision",lines:["Stridor?"],x:170,y:370},
{id:"vern",type:"action",lines:["Epi vernebeln","4 mg"],x:20,y:370},
{id:"q3",type:"decision",lines:["Broncho-","spasmus?"],x:170,y:450},
{id:"salb",type:"action",lines:["Salbutamol","vernebeln"],x:20,y:450},
{id:"zugang",type:"action",lines:["O₂, i.v.-Zugang","VEL, Dimetinden","Prednisolon i.v."],x:170,y:535}
],edges:[
["s","stop"],["stop","abcde"],["abcde","q1"],
["q1","epi","II/III"],["q1","g4","IV"],
["epi","q2"],["q2","vern","Ja"],["q2","q3","Nein"],
["vern","q3"],["q3","salb","Ja"],["q3","zugang","Nein"],
["salb","zugang"]
]},
art_verschluss:{title:"Akuter arterieller Verschluss",color:"#f97316",nodes:[
{id:"s",type:"start",lines:["ART. VERSCHLUSS"],x:170,y:5},
{id:"sym",type:"action",lines:["6 P: Pain, Pallor","Pulselessness","Paresthesia, Paralysis"],x:170,y:65},
{id:"basis",type:"action",lines:["Basismaßnahmen","i.v.-Zugang"],x:170,y:155},
{id:"anam",type:"action",lines:["Anamnese: VHF?","MI? Atherosklerose?"],x:170,y:230},
{id:"unt",type:"action",lines:["Motorik, Sensibilität","Pulsstatus, Hautkolorit"],x:170,y:305},
{id:"schmerz",type:"action",lines:["Schmerztherapie"],x:170,y:380},
{id:"hep",type:"action",lines:["Heparin","5.000 I.E. i.v."],x:170,y:440},
{id:"lager",type:"result",lines:["Tieflagerung +","Immobilisation","→ Transport"],x:170,y:510}
],edges:[
["s","sym"],["sym","basis"],["basis","anam"],["anam","unt"],
["unt","schmerz"],["schmerz","hep"],["hep","lager"]
]},
tracheostoma:{title:"Verlegtes Tracheostoma",color:"#64748b",nodes:[
{id:"s",type:"start",lines:["ATEMNOT","TRACHEOSTOMA"],x:170,y:5},
{id:"o2",type:"action",lines:["O₂ über Stoma","(+ Mund/Nase?)"],x:170,y:65},
{id:"entf",type:"action",lines:["Aufsätze entfernen","Innenkanüle raus"],x:170,y:135},
{id:"saug",type:"action",lines:["Absaugkatheter","endobronchial"],x:170,y:205},
{id:"q1",type:"decision",lines:["Erfolg?"],x:170,y:280},
{id:"ok",type:"result",lines:["Weiter","überwachen"],x:320,y:280},
{id:"entbl",type:"action",lines:["Oropharynx absaugen","Kanüle entblocken"],x:170,y:360},
{id:"q2",type:"decision",lines:["Erfolg?"],x:170,y:440},
{id:"kanraus",type:"action",lines:["Trachealkanüle","komplett entfernen"],x:170,y:520},
{id:"beat",type:"result",lines:["Beutel-Masken-Beatm.","ODER Beutel-Stoma-","Beatmung"],x:170,y:595}
],edges:[
["s","o2"],["o2","entf"],["entf","saug"],["saug","q1"],
["q1","ok","Ja"],["q1","entbl","Nein"],["entbl","q2"],
["q2","ok","Ja"],["q2","kanraus","Nein"],["kanraus","beat"]
]},
bronchial:{title:"Bronchialobstruktion",color:"#3b82f6",nodes:[
{id:"s",type:"start",lines:["BRONCHIAL-","OBSTRUKTION"],x:170,y:5},
{id:"basis",type:"action",lines:["Basismaßnahmen"],x:170,y:65},
{id:"o2",type:"decision",lines:["O₂-Typ?"],x:170,y:125},
{id:"hyp",type:"action",lines:["Hypoxisch:","hochdosiert O₂"],x:20,y:125},
{id:"hcap",type:"action",lines:["Hyperkapnisch:","angepasste O₂"],x:320,y:125},
{id:"salb",type:"action",lines:["Salbutamol","Vernebelung"],x:170,y:215},
{id:"ipra",type:"action",lines:["Ipratropiumbromid","Vernebelung"],x:170,y:285},
{id:"iv",type:"action",lines:["i.v.-Zugang","Prednisolon i.v."],x:170,y:355},
{id:"niv",type:"action",lines:["CPAP (Hypoxie)","NIV (Hyperkapnie)"],x:170,y:430},
{id:"esk",type:"result",lines:["Droh. Erschöpfung:","Esketamin erwägen","→ Re-Evaluation"],x:170,y:505}
],edges:[
["s","basis"],["basis","o2"],
["o2","hyp","Hypox."],["o2","hcap","Hyperkap."],
["hyp","salb"],["hcap","salb"],
["salb","ipra"],["ipra","iv"],["iv","niv"],["niv","esk"]
]},
dehydratation:{title:"Dehydratation",color:"#06b6d4",nodes:[
{id:"s",type:"start",lines:["DEHYDRATATION"],x:170,y:5},
{id:"sym",type:"action",lines:["Desorientierung","trock. Haut, Durst","Tachykardie, Hypotonie"],x:170,y:65},
{id:"q1",type:"decision",lines:["V.a. Sepsis?"],x:170,y:160},
{id:"sep",type:"ref",lines:["→ BPR","Sepsis"],x:20,y:160},
{id:"basis",type:"action",lines:["Basismaßnahmen"],x:170,y:240},
{id:"q2",type:"decision",lines:["Wach +","schluckfähig?"],x:170,y:305},
{id:"oral",type:"result",lines:["Zum Trinken","animieren"],x:20,y:305},
{id:"iv",type:"action",lines:["i.v.-Zugang","→ VEL"],x:170,y:395},
{id:"transp",type:"result",lines:["Weitere Versorgung","Transport"],x:170,y:465}
],edges:[
["s","sym"],["sym","q1"],["q1","basis","Nein"],["q1","sep","Ja"],
["basis","q2"],["q2","oral","Ja"],["q2","iv","Nein"],
["iv","transp"]
]},
geburt:{title:"Außerklinische Geburt",color:"#ec4899",nodes:[
{id:"s",type:"start",lines:["GEBURT","AUßERKLINISCH"],x:170,y:5},
{id:"q1",type:"decision",lines:["Geburt","unmittelbar?"],x:170,y:75},
{id:"transp",type:"ref",lines:["→ Liegend-","transport"],x:20,y:75},
{id:"q2",type:"decision",lines:["KI? Querlage?","Placenta praevia?"],x:170,y:165},
{id:"ki",type:"ref",lines:["→ Transport","sofort"],x:20,y:165},
{id:"vorb",type:"action",lines:["Vorbereitung:","Wärme, Licht","Steinschnittlage"],x:170,y:260},
{id:"geb",type:"action",lines:["Geburt begleiten:","Dammschutz","Schulterentwicklung"],x:170,y:345},
{id:"nab",type:"action",lines:["Abnabeln nach 1 min","15–20 cm vom Nabel"],x:170,y:430},
{id:"aton",type:"action",lines:["Atonieprophylaxe","Säugling anlegen","i.v.-Zugang"],x:170,y:505},
{id:"re",type:"result",lines:["Blutung? Uterus-","kontraktion prüfen!"],x:170,y:585}
],edges:[
["s","q1"],["q1","q2","Ja"],["q1","transp","Nein"],
["q2","vorb","Nein"],["q2","ki","Ja"],
["vorb","geb"],["geb","nab"],["nab","aton"],["aton","re"]
]},
hyperglyk:{title:"Hyperglykämie",color:"#f59e0b",nodes:[
{id:"s",type:"start",lines:["HYPERGLYKÄMIE"],x:170,y:5},
{id:"bz",type:"action",lines:["BZ: Erw. > 250","Kind > 200 mg/dl"],x:170,y:60},
{id:"basis",type:"action",lines:["Basismaßnahmen","i.v. → VEL"],x:170,y:130},
{id:"diag",type:"action",lines:["Temp.-Messung","12-Kanal-EKG"],x:170,y:200},
{id:"anam",type:"action",lines:["Anamnese: Diabetes?","Neumanifestation?","Infekt? Insulinpumpe?"],x:170,y:275},
{id:"abcde",type:"action",lines:["Symptom. Therapie","nach ABCDE"],x:170,y:370},
{id:"dd",type:"result",lines:["Bei Bewusstseins-","störung: weitere","Ursachen erwägen!"],x:170,y:445}
],edges:[
["s","bz"],["bz","basis"],["basis","diag"],["diag","anam"],
["anam","abcde"],["abcde","dd"]
]},
hypertensiv:{title:"Hypertensiver Notfall",color:"#dc2626",nodes:[
{id:"s",type:"start",lines:["HYPERTENSIVER","NOTFALL"],x:170,y:5},
{id:"rr",type:"action",lines:["RRsyst > 220 mmHg","+ klin. Symptome"],x:170,y:70},
{id:"sym",type:"action",lines:["ZNS: Kopfschmerz,","Sehstörung, Krampf","Kardial: Dyspnoe"],x:170,y:145},
{id:"ekg",type:"action",lines:["12-Kanal-EKG"],x:170,y:235},
{id:"q1",type:"decision",lines:["Lungenödem?"],x:170,y:300},
{id:"loe",type:"ref",lines:["→ BPR","Lungenödem"],x:20,y:300},
{id:"med",type:"action",lines:["Dauermedikation","vorziehen"],x:170,y:385},
{id:"ura",type:"action",lines:["Urapidil i.v.","ggf. Nitro sublingual"],x:170,y:455},
{id:"ziel",type:"result",lines:["Ziel: RR-Senkung","max. 20–25 %"],x:170,y:530}
],edges:[
["s","rr"],["rr","sym"],["sym","ekg"],["ekg","q1"],
["q1","loe","Ja"],["q1","med","Nein"],
["med","ura"],["ura","ziel"]
]},
hypoglyk:{title:"Hypoglykämie",color:"#10b981",nodes:[
{id:"s",type:"start",lines:["HYPOGLYKÄMIE"],x:170,y:5},
{id:"bz",type:"action",lines:["BZ < 60 mg/dl","(< 3,3 mmol/l)"],x:170,y:60},
{id:"q1",type:"decision",lines:["Wach +","schluckfähig?"],x:170,y:135},
{id:"oral",type:"action",lines:["Orale Glucose"],x:20,y:135},
{id:"q2",type:"decision",lines:["i.v.-Zugang","möglich?"],x:170,y:225},
{id:"gluc",type:"action",lines:["Glucagon i.m./i.n.","Erw. 1 mg","Kind <25kg: 0,5 mg"],x:20,y:225},
{id:"iv",type:"action",lines:["Glucose i.v.","Erw. 8–10 g","Kind 0,2 g/kgKG"],x:170,y:325},
{id:"kontr",type:"action",lines:["BZ-Kontrolle","nach 5 min"],x:170,y:405},
{id:"q3",type:"decision",lines:["BZ > 90?"],x:170,y:480},
{id:"ok",type:"result",lines:["Ziel erreicht","Re-Evaluation"],x:320,y:480},
{id:"rep",type:"ref",lines:["Repetition"],x:20,y:480}
],edges:[
["s","bz"],["bz","q1"],["q1","oral","Ja"],["q1","q2","Nein"],
["q2","iv","Ja"],["q2","gluc","Nein"],
["gluc","kontr"],["iv","kontr"],["kontr","q3"],
["q3","ok","Ja"],["q3","rep","Nein"]
]},
hypothermie:{title:"Hypothermie",color:"#06b6d4",nodes:[
{id:"s",type:"start",lines:["HYPOTHERMIE"],x:170,y:5},
{id:"stad",type:"action",lines:["Stadien: I–IV","I: klar, frierend","II/III: beeintr. Bew."],x:170,y:65},
{id:"rett",type:"action",lines:["Rettung aus","kalter Umgebung"],x:170,y:155},
{id:"q1",type:"decision",lines:["Stadium?"],x:170,y:235},
{id:"iv_ref",type:"ref",lines:["Stadium IV:","→ Reanimation"],x:20,y:235},
{id:"s1",type:"action",lines:["Stadium I:","Wärme, trocken","warme Getränke"],x:320,y:235},
{id:"s23",type:"action",lines:["Stadium II/III:","Immobilisation","Wärmeerhalt"],x:170,y:330},
{id:"mass",type:"action",lines:["O₂, ggf. EGA","ext. Erwärmung","gewärmte VEL"],x:170,y:415},
{id:"transp",type:"result",lines:["Transport"],x:170,y:495}
],edges:[
["s","stad"],["stad","rett"],["rett","q1"],
["q1","iv_ref","IV"],["q1","s1","I"],["q1","s23","II/III"],
["s23","mass"],["mass","transp"]
]},
bradykardie:{title:"Instabile Bradykardie",color:"#8b5cf6",nodes:[
{id:"s",type:"start",lines:["BRADYKARDIE","HF < 60/min"],x:170,y:5},
{id:"ekg",type:"action",lines:["12-Kanal-EKG","Instabilitätszeichen?"],x:170,y:70},
{id:"basis",type:"action",lines:["Basismaßnahmen","O₂, i.v.-Zugang"],x:170,y:145},
{id:"q1",type:"decision",lines:["Instabil?"],x:170,y:225},
{id:"stab",type:"result",lines:["Überwachen","Re-Evaluation"],x:320,y:225},
{id:"atro",type:"action",lines:["Atropin 0,5 mg i.v.","Repet. alle 4 min","max. 3 mg"],x:170,y:310},
{id:"q2",type:"decision",lines:["HF steigt?"],x:170,y:400},
{id:"ok",type:"result",lines:["Überwachen"],x:320,y:400},
{id:"epi",type:"action",lines:["Epinephrin","5 µg Boli i.v."],x:170,y:480},
{id:"q3",type:"decision",lines:["Bewusstlos?"],x:170,y:555},
{id:"pacer",type:"result",lines:["Ext. Schrittmacher","(+ Schmerzth.)"],x:20,y:555},
{id:"rever",type:"result",lines:["Reversible Urs.","suchen (EVA)"],x:320,y:555}
],edges:[
["s","ekg"],["ekg","basis"],["basis","q1"],
["q1","atro","Ja"],["q1","stab","Nein"],
["atro","q2"],["q2","ok","Ja"],["q2","epi","Nein"],
["epi","q3"],["q3","pacer","Ja"],["q3","rever","Nein"]
]},
tachykardie:{title:"Instabile Tachykardie",color:"#8b5cf6",nodes:[
{id:"s",type:"start",lines:["TACHYKARDIE"],x:170,y:5},
{id:"ekg",type:"action",lines:["12-Kanal-EKG","Reversible Urs. prüfen"],x:170,y:60},
{id:"basis",type:"action",lines:["Basismaßnahmen","O₂, i.v.-Zugang"],x:170,y:135},
{id:"q1",type:"decision",lines:["Instabil?"],x:170,y:215},
{id:"q2",type:"decision",lines:["Bewusstlos?"],x:20,y:305},
{id:"kard",type:"action",lines:["Kardioversion","(synchronisiert)"],x:20,y:400},
{id:"na",type:"action",lines:["Wach → spezif.","Therapie durch NA"],x:170,y:400},
{id:"stab",type:"decision",lines:["Regelmäßig +","Schmalkompl.?"],x:320,y:305},
{id:"vagus",type:"action",lines:["Vagusreiz","mod. Valsalva"],x:320,y:400},
{id:"re",type:"result",lines:["Re-Evaluation","Ischämie bedenken!"],x:170,y:490}
],edges:[
["s","ekg"],["ekg","basis"],["basis","q1"],
["q1","q2","Ja"],["q1","stab","Nein"],
["q2","kard","Ja"],["q2","na","Nein"],
["stab","vagus","Ja"],
["kard","re"],["na","re"],["vagus","re"]
]},
intoxikation:{title:"Intoxikation",color:"#64748b",nodes:[
{id:"s",type:"start",lines:["INTOXIKATION"],x:170,y:5},
{id:"schutz",type:"action",lines:["EIGENSCHUTZ!","Rückzug? FW?"],x:170,y:60},
{id:"stop",type:"action",lines:["Giftexposition","beenden"],x:170,y:125},
{id:"basis",type:"action",lines:["Basismaßnahmen"],x:170,y:185},
{id:"q1",type:"decision",lines:["Opioid-","Toxidrom?"],x:170,y:250},
{id:"nal",type:"action",lines:["Naloxon 0,1 mg","fraktioniert i.v."],x:20,y:250},
{id:"q2",type:"decision",lines:["Rauchgas /","CO?"],x:170,y:340},
{id:"co",type:"action",lines:["Hochdos. O₂","FiO₂ 1,0","ggf. CPAP"],x:20,y:340},
{id:"iv",type:"action",lines:["i.v.-Zugang","Material asservieren"],x:170,y:430},
{id:"gift",type:"result",lines:["Giftnotrufzentrale","Sympt. Therapie","→ Transport"],x:170,y:505}
],edges:[
["s","schutz"],["schutz","stop"],["stop","basis"],["basis","q1"],
["q1","nal","Ja"],["q1","q2","Nein"],
["q2","co","Ja"],["q2","iv","Nein"],
["nal","iv"],["co","iv"],["iv","gift"]
]},
lungenoedem:{title:"Kardiales Lungenödem",color:"#3b82f6",nodes:[
{id:"s",type:"start",lines:["KARDIALES","LUNGENÖDEM"],x:170,y:5},
{id:"lager",type:"action",lines:["Oberkörper hoch","Beine tief"],x:170,y:70},
{id:"o2",type:"action",lines:["O₂-Gabe","NIV/CPAP","PEEP 5–10 cmH₂O"],x:170,y:140},
{id:"iv",type:"action",lines:["i.v.-Zugang"],x:170,y:225},
{id:"nitro",type:"action",lines:["Glyceroltrinitrat","0,4 mg sublingual","Repet. nach 5 min"],x:170,y:285},
{id:"furo",type:"action",lines:["Furosemid 20 mg i.v.","Repet. nach 15 min"],x:170,y:370},
{id:"morph",type:"action",lines:["Ggf. Morphin i.v."],x:170,y:445},
{id:"ekg",type:"result",lines:["12-Kanal-EKG","Re-Evaluation"],x:170,y:505}
],edges:[
["s","lager"],["lager","o2"],["o2","iv"],["iv","nitro"],
["nitro","furo"],["furo","morph"],["morph","ekg"]
]},
krampf_erw:{title:"Krampfanfall Erwachsene",color:"#f59e0b",nodes:[
{id:"s",type:"start",lines:["KRAMPFANFALL","ERWACHSENE"],x:170,y:5},
{id:"schutz",type:"action",lines:["Schutz vor Verletzung","KEINE orale Manip."],x:170,y:70},
{id:"basis",type:"action",lines:["Basismaßnahmen","Sauerstoff"],x:170,y:145},
{id:"q1",type:"decision",lines:["Hypoxischer","Krampf?"],x:170,y:225},
{id:"hyp",type:"ref",lines:["KI Midazolam!","→ Ursache","behandeln"],x:20,y:225},
{id:"mid",type:"action",lines:["Midazolam:","0,1 mg/kgKG i.v.","ODER 10 mg nasal"],x:170,y:320},
{id:"warn",type:"action",lines:["ADÄQUAT HOCH","dosieren!","NICHT titrieren!"],x:170,y:410},
{id:"rep",type:"action",lines:["1× Repetition mögl.","max. 20 mg"],x:170,y:490},
{id:"bz",type:"result",lines:["BZ-Messung","Temp.-Messung","Postiktale Betreuung"],x:170,y:565}
],edges:[
["s","schutz"],["schutz","basis"],["basis","q1"],
["q1","mid","Nein"],["q1","hyp","Ja"],
["mid","warn"],["warn","rep"],["rep","bz"]
]},
krampf_kind:{title:"Krampfanfall Kind",color:"#f59e0b",nodes:[
{id:"s",type:"start",lines:["KRAMPFANFALL","KIND"],x:170,y:5},
{id:"schutz",type:"action",lines:["Schutz, KEINE","orale Manipulation"],x:170,y:70},
{id:"basis",type:"action",lines:["Basismaßnahmen, O₂","Fieberkrampf?"],x:170,y:140},
{id:"mid",type:"decision",lines:["Gabe-Weg?"],x:170,y:220},
{id:"bucc",type:"action",lines:["Buccal/nasal:","3–11M: 2,5 mg","1–4J: 5 mg","5–9J: 7,5 mg","≥10J: 10 mg"],x:20,y:310},
{id:"iv",type:"action",lines:["i.v.:","0,1 mg/kgKG","max. 1× Repet."],x:320,y:310},
{id:"bz",type:"action",lines:["BZ-Messung","Temp.-Messung"],x:170,y:440},
{id:"fieb",type:"action",lines:["Bei Fieber: Kühlung","Paracetamol/Ibuprofen"],x:170,y:515},
{id:"na",type:"result",lines:["NA-Nachforderung","niederschwellig!"],x:170,y:590}
],edges:[
["s","schutz"],["schutz","basis"],["basis","mid"],
["mid","bucc","buccal"],["mid","iv","i.v."],
["bucc","bz"],["iv","bz"],["bz","fieb"],["fieb","na"]
]},
lae:{title:"Lungenarterienembolie",color:"#dc2626",nodes:[
{id:"s",type:"start",lines:["V.a. LAE"],x:170,y:5},
{id:"sym",type:"action",lines:["Akute Dyspnoe","Thoraxschmerz","Tachypnoe, Synkope"],x:170,y:60},
{id:"basis",type:"action",lines:["Basismaßnahmen","O₂, ggf. NIV","12-Kanal-EKG"],x:170,y:145},
{id:"iv",type:"action",lines:["i.v.-Zugang"],x:170,y:230},
{id:"wells",type:"action",lines:["Wells-Score","sPESI-Score","erheben"],x:170,y:290},
{id:"q1",type:"decision",lines:["Wells ≥ 5","+ sPESI ≥ 1?"],x:170,y:370},
{id:"hep",type:"action",lines:["Heparin","5.000 I.E. i.v."],x:20,y:370},
{id:"no",type:"action",lines:["Weitere Vers.","nach Zustand"],x:320,y:370},
{id:"transp",type:"result",lines:["Transport","NA-Nachford."],x:170,y:460}
],edges:[
["s","sym"],["sym","basis"],["basis","iv"],["iv","wells"],
["wells","q1"],["q1","hep","Ja"],["q1","no","Nein"],
["hep","transp"],["no","transp"]
]},
obstruktion_kind:{title:"Obstruktion obere AW Kind",color:"#f97316",nodes:[
{id:"s",type:"start",lines:["OBSTRUKTION","OBERE AW KIND"],x:170,y:5},
{id:"basis",type:"action",lines:["Basismaßnahmen","O₂-Gabe"],x:170,y:70},
{id:"q1",type:"decision",lines:["Fremdkörper?"],x:170,y:145},
{id:"fk",type:"ref",lines:["→ BPR FK-","Aspiration"],x:20,y:145},
{id:"pk",type:"action",lines:["Pseudokrupp /","Laryngotrach.-","bronchitis"],x:170,y:235},
{id:"pred",type:"action",lines:["Prednisolon","rektal"],x:170,y:320},
{id:"epi",type:"action",lines:["Epinephrin","vernebeln (4 mg)"],x:170,y:390},
{id:"q2",type:"decision",lines:["Besserung?"],x:170,y:465},
{id:"ok",type:"result",lines:["Überwachen","Transport"],x:320,y:465},
{id:"rep",type:"result",lines:["Repetition Epi","NA erwägen"],x:20,y:465}
],edges:[
["s","basis"],["basis","q1"],["q1","fk","Ja"],["q1","pk","Nein"],
["pk","pred"],["pred","epi"],["epi","q2"],
["q2","ok","Ja"],["q2","rep","Nein"]
]},
polytrauma:{title:"Polytrauma",color:"#ef4444",nodes:[
{id:"s",type:"start",lines:["POLYTRAUMA"],x:170,y:5},
{id:"c",type:"action",lines:["<c> Krit. Blutung","stillen: Tourniquet","Hämostyptikum"],x:170,y:60},
{id:"a",type:"action",lines:["A: Atemweg sichern","Laryngoskopie, EGA"],x:170,y:145},
{id:"b",type:"action",lines:["B: Beatmung, SpO₂","ggf. Thoraxentlast."],x:170,y:220},
{id:"c2",type:"action",lines:["C: i.v./i.o., VEL","Beckenschlinge","Tranexamsäure"],x:170,y:300},
{id:"d",type:"action",lines:["D: Neuro, GCS","Pupillen"],x:170,y:390},
{id:"e",type:"action",lines:["E: Entkleiden","Wärmeerhalt","Schmerztherapie"],x:170,y:460},
{id:"load",type:"result",lines:["Load-go-treat!","Traumazentrum","Luftrettung?"],x:170,y:545}
],edges:[
["s","c"],["c","a"],["a","b"],["b","c2"],["c2","d"],["d","e"],["e","load"]
]},
schlaganfall:{title:"Schlaganfall",color:"#8b5cf6",nodes:[
{id:"s",type:"start",lines:["V.a. SCHLAGANFALL"],x:170,y:5},
{id:"sym",type:"action",lines:["BE-FAST-Test","Halbseite, Sprache","Sehstörung, Bewussts."],x:170,y:65},
{id:"basis",type:"action",lines:["Basismaßnahmen","i.v.-Zugang"],x:170,y:155},
{id:"aw",type:"decision",lines:["Atemstörung?"],x:170,y:235},
{id:"aw_ja",type:"action",lines:["AW sichern","Ziel SpO₂ 94–98%"],x:20,y:235},
{id:"rr",type:"decision",lines:["RRsyst?"],x:170,y:320},
{id:"rr_h",type:"action",lines:["> 220: Urapidil"],x:20,y:320},
{id:"rr_l",type:"action",lines:["< 120: VEL"],x:320,y:320},
{id:"bz",type:"decision",lines:["BZ < 60?"],x:170,y:400},
{id:"hypo",type:"ref",lines:["→ BPR","Hypoglykämie"],x:20,y:400},
{id:"temp",type:"action",lines:["Temp > 38 °C?","→ Kühlung"],x:170,y:475},
{id:"su",type:"result",lines:["→ Stroke Unit","Zuweisungskonzept"],x:170,y:545}
],edges:[
["s","sym"],["sym","basis"],["basis","aw"],
["aw","aw_ja","Ja"],["aw","rr","Nein"],
["aw_ja","rr"],
["rr","rr_h","> 220"],["rr","rr_l","< 120"],["rr","bz","normal"],
["rr_h","bz"],["rr_l","bz"],
["bz","hypo","Ja"],["bz","temp","Nein"],["temp","su"]
]},
sepsis:{title:"Sepsis",color:"#dc2626",nodes:[
{id:"s",type:"start",lines:["V.a. SEPSIS"],x:170,y:5},
{id:"def",type:"action",lines:["Infektion +","Organdysfunktion"],x:170,y:60},
{id:"score",type:"action",lines:["qSOFA ≥ 2 / NEWS2 ≥ 5","AF ≥ 22, RRsyst ≤ 100","Bewusstseinsänderung"],x:170,y:130},
{id:"basis",type:"action",lines:["Basismaßnahmen","O₂-Gabe"],x:170,y:225},
{id:"iv",type:"action",lines:["i.v.-Zugang","(möglichst 2×)","→ VEL"],x:170,y:300},
{id:"temp",type:"action",lines:["Temperatur-","messung"],x:170,y:385},
{id:"transp",type:"result",lines:["Transport geeignete","Klinik, Re-Eval. ABCDE"],x:170,y:450}
],edges:[
["s","def"],["def","score"],["score","basis"],["basis","iv"],
["iv","temp"],["temp","transp"]
]},
stromunfall:{title:"Stromunfall",color:"#f59e0b",nodes:[
{id:"s",type:"start",lines:["STROMUNFALL"],x:170,y:5},
{id:"schutz",type:"action",lines:["EIGENSCHUTZ!","< 1kV: 1m Abstand","≥ 1kV: 5m Abstand"],x:170,y:60},
{id:"frei",type:"action",lines:["Spannungsfreiheit","durch Fachpersonal"],x:170,y:150},
{id:"q1",type:"decision",lines:["Kreislauf-","stillstand?"],x:170,y:235},
{id:"rea",type:"ref",lines:["→ BPR","Reanimation"],x:20,y:235},
{id:"basis",type:"action",lines:["Basismaßnahmen","12-Kanal-EKG","i.v.-Zugang"],x:170,y:325},
{id:"sym",type:"decision",lines:["Symptome?"],x:170,y:415},
{id:"hrst",type:"ref",lines:["HRST → BPR","Brady/Tachy"],x:20,y:415},
{id:"krampf",type:"ref",lines:["Krampf →","BPR Krampf"],x:320,y:415},
{id:"rest",type:"result",lines:["Verbrennungen →","BPR Thermisch","Schmerzth. + Transp."],x:170,y:505}
],edges:[
["s","schutz"],["schutz","frei"],["frei","q1"],
["q1","rea","Ja"],["q1","basis","Nein"],
["basis","sym"],["sym","hrst","HRST"],["sym","krampf","Krampf"],
["sym","rest","Verbr."]
]},
thermisch:{title:"Thermische Verletzungen",color:"#f97316",nodes:[
{id:"s",type:"start",lines:["THERMISCHE","VERLETZUNG"],x:170,y:5},
{id:"basis",type:"action",lines:["Basismaßnahmen","KEINE akt. Kühlung!"],x:170,y:70},
{id:"warm",type:"action",lines:["Normothermie!","RTW vorheizen","Wärmedecken"],x:170,y:145},
{id:"iv",type:"action",lines:["i.v.-Zugang (2×)","nicht in Verbrennung","ggf. i.o."],x:170,y:230},
{id:"vel",type:"action",lines:["VEL: Erw. max. 1 l/h","Kind: 10 ml/kgKG/h"],x:170,y:320},
{id:"schmerz",type:"action",lines:["Schmerztherapie","(ab Grad III↓ Bedarf)"],x:170,y:395},
{id:"vkof",type:"action",lines:["VKOF abschätzen","1 Handfläche = 1%","Steril abdecken"],x:170,y:470},
{id:"q1",type:"decision",lines:["Inhalations-","trauma?"],x:170,y:560},
{id:"inh",type:"action",lines:["β₂-Sympathomim.","CO-Intox. bedenken"],x:20,y:560},
{id:"transp",type:"result",lines:["Transport nach","Zuweisungskonzept"],x:170,y:640}
],edges:[
["s","basis"],["basis","warm"],["warm","iv"],["iv","vel"],
["vel","schmerz"],["schmerz","vkof"],["vkof","q1"],
["q1","inh","Ja"],["q1","transp","Nein"],["inh","transp"]
]}
};
function FlowDiagram({flowId, flowSource, compact}) {
const flow = (flowSource || LS_FLOWS)[flowId];
if(!flow) return null;
const sc = compact ? 0.52 : 0.78;
const NW = 115; // node width (unscaled)
const LH = 14; // line height per text line (unscaled)
const PY = 5; // vertical padding (unscaled)
const FS = compact ? 6 : 8; // font size in px
const TITLE_SPACE = 22;
// Calculate each node's height from its lines
const nodeH = {};
flow.nodes.forEach(n => { nodeH[n.id] = n.lines.length * LH + PY * 2; });
// Calculate viewBox
let maxX = 0, maxY = 0;
flow.nodes.forEach(n => {
const r = n.x + NW + 10;
const b = n.y + TITLE_SPACE + nodeH[n.id] + 10;
if(r > maxX) maxX = r;
if(b > maxY) maxY = b;
});
const VW = Math.round(maxX * sc);
const VH = Math.round(maxY * sc);
const nodeMap = {};
flow.nodes.forEach(n => nodeMap[n.id] = n);
const C = {
start: {bg: flow.color, fg: "#fff", bdr: flow.color},
action: {bg: "#1e293b", fg: "#e2e8f0", bdr: "#475569"},
decision: {bg: "#1e1a30", fg: "#fcd34d", bdr: "#eab308"},
ref: {bg: "#0f172a", fg: "#94a3b8", bdr: "#475569"},
result: {bg: flow.color + "18", fg: flow.color, bdr: flow.color + "60"}
};
const mkr = "lsArr_" + flowId;
// Helper to get center-x and bottom-y / top-y of a node
const cx = n => (n.x + NW / 2) * sc;
const topY = n => (n.y + TITLE_SPACE) * sc;
const botY = n => (n.y + TITLE_SPACE + nodeH[n.id]) * sc;
const midY = n => (n.y + TITLE_SPACE + nodeH[n.id] / 2) * sc;
const leftX = n => n.x * sc;
const rightX = n => (n.x + NW) * sc;
const svgEls = [];
// Defs
svgEls.push(React.createElement("defs", {key: "defs"},
React.createElement("marker", {id: mkr, viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 5, markerHeight: 5, orient: "auto-start-reverse"},
React.createElement("path", {d: "M 0 0 L 10 5 L 0 10 z", fill: "#64748b"})
)
));
// Title
svgEls.push(React.createElement("text", {key: "title", x: VW / 2, y: compact ? 9 : 13, textAnchor: "middle", fill: flow.color, fontSize: compact ? 8 : 11, fontWeight: 700, fontFamily: "system-ui, sans-serif"}, flow.title));
// Edges
flow.edges.forEach((e, i) => {
const from = nodeMap[e[0]];
const to = nodeMap[e[1]];
if(!from || !to) return;
const label = e[2] || null;
const fromCx = cx(from);
const toCx = cx(to);
const isHoriz = Math.abs(fromCx - toCx) > 15;
let sx, sy, ex, ey;
if(!isHoriz) {
// Vertical: bottom of from → top of to
sx = fromCx; sy = botY(from);
ex = toCx; ey = topY(to);
} else {
// Horizontal: exit from side of from, enter top of to
sy = midY(from);
sx = toCx < fromCx ? leftX(from) : rightX(from);
ex = toCx; ey = topY(to);
}
let d;
if(Math.abs(sx - ex) < 3) {
d = "M" + sx.toFixed(1) + "," + sy.toFixed(1) + " L" + ex.toFixed(1) + "," + ey.toFixed(1);
} else {
const my = sy + (ey - sy) * 0.45;
d = "M" + sx.toFixed(1) + "," + sy.toFixed(1) + " L" + sx.toFixed(1) + "," + my.toFixed(1) + " L" + ex.toFixed(1) + "," + my.toFixed(1) + " L" + ex.toFixed(1) + "," + ey.toFixed(1);
}
const els = [React.createElement("path", {key: "p", d: d, stroke: "#64748b", strokeWidth: compact ? 0.6 : 0.8, fill: "none", markerEnd: "url(#" + mkr + ")"})];
if(label) {
const lx = Math.abs(sx - ex) < 3 ? sx + (compact ? 2 : 3) : (sx + ex) / 2;
const ly = Math.abs(sx - ex) < 3 ? (sy + ey) / 2 : sy + (ey - sy) * 0.45 - 2;
els.push(React.createElement("rect", {key: "lr", x: lx - 14, y: ly - 5, width: 28, height: 8, fill: "#0a0e1a", rx: 2}));
els.push(React.createElement("text", {key: "lt", x: lx, y: ly + 1.5, fill: "#a5b4fc", fontSize: compact ? 5 : 6, fontFamily: "system-ui, sans-serif", textAnchor: "middle", fontWeight: 600}, label));
}
svgEls.push(React.createElement("g", {key: "e" + i}, ...els));
});
// Nodes
flow.nodes.forEach((n, i) => {
const c = C[n.type] || C.action;
const nx = n.x * sc;
const ny = (n.y + TITLE_SPACE) * sc;
const nwS = NW * sc;
const nhS = nodeH[n.id] * sc;
const isDec = n.type === "decision";
const els = [];
if(isDec) {
// Diamond: make wider to fit text
const dw = nwS * 1.2;
const dx = nx - nwS * 0.1;
els.push(React.createElement("polygon", {key: "bg",
points: (dx + dw / 2).toFixed(1) + "," + ny.toFixed(1) + " " + (dx + dw).toFixed(1) + "," + (ny + nhS / 2).toFixed(1) + " " + (dx + dw / 2).toFixed(1) + "," + (ny + nhS).toFixed(1) + " " + dx.toFixed(1) + "," + (ny + nhS / 2).toFixed(1),
fill: c.bg, stroke: c.bdr, strokeWidth: compact ? 0.8 : 1.2
}));
n.lines.forEach((line, li) => {
els.push(React.createElement("text", {key: "t" + li,
x: dx + dw / 2, y: ny + PY * sc + (li + 0.75) * LH * sc,
textAnchor: "middle", fill: c.fg, fontSize: FS,
fontWeight: 400, fontFamily: "system-ui, sans-serif"
}, line));
});
} else {
els.push(React.createElement("rect", {key: "bg",
x: nx, y: ny, width: nwS, height: nhS,
rx: n.type === "start" ? 6 : 4,
fill: c.bg, stroke: c.bdr, strokeWidth: n.type === "start" ? (compact ? 1 : 1.5) : (compact ? 0.6 : 0.8)
}));
n.lines.forEach((line, li) => {
els.push(React.createElement("text", {key: "t" + li,
x: nx + nwS / 2, y: ny + PY * sc + (li + 0.75) * LH * sc,
textAnchor: "middle", fill: c.fg, fontSize: FS,
fontWeight: n.type === "start" ? 700 : 400,
fontFamily: "system-ui, sans-serif"
}, line));
});
}
svgEls.push(React.createElement("g", {key: "n" + i}, ...els));
});
return React.createElement("svg", {
viewBox: "0 0 " + VW + " " + VH,
style: {width: "100%", maxWidth: compact ? 300 : 500, background: "#0a0e1a", borderRadius: compact ? 8 : 12, border: "1px solid #1e293b", padding: compact ? 4 : 8}
}, ...svgEls);
}
function EkgFullscreen({images,startIndex,onClose}) {
const [idx, setIdx] = useState(startIndex);
const img = images[idx];
return (
<div onClick={onClose} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.92)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20}}>
<div onClick={e=>e.stopPropagation()} style={{maxWidth:"95vw",maxHeight:"85vh",position:"relative",display:"flex",flexDirection:"column",alignItems:"center"}}>
<img src={img.src} alt={img.caption} style={{maxWidth:"100%",maxHeight:"75vh",objectFit:"contain",borderRadius:8}}/>
<div style={{color:"#fff",textAlign:"center",marginTop:12,fontSize:13}}>{img.caption}</div>
<div style={{color:"#999",textAlign:"center",fontSize:11,fontStyle:"italic",marginTop:2}}>{img.source}</div>
{images.length>1 && (
<div style={{display:"flex",justifyContent:"center",gap:16,marginTop:16}}>
<button onClick={()=>setIdx(i=>(i-1+images.length)%images.length)} style={{color:"#fff",background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:13}}>← Vorheriges</button>
<span style={{color:"#999",alignSelf:"center",fontSize:13}}>{idx+1}/{images.length}</span>
<button onClick={()=>setIdx(i=>(i+1)%images.length)} style={{color:"#fff",background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:13}}>Nächstes →</button>
</div>
)}
</div>
<button onClick={onClose} style={{position:"absolute",top:20,right:20,color:"#fff",background:"rgba(255,255,255,0.1)",border:"none",borderRadius:"50%",width:40,height:40,fontSize:20,cursor:"pointer"}}>✕</button>
</div>
);
}
function EkgImageViewer({images}) {
const [viewing, setViewing] = useState(null);
if(!images || !images.length) return null;
return (<div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
{images.map((img,i) => (
<div key={i} onClick={()=>setViewing(i)} style={{cursor:"pointer"}}>
<img src={img.src} alt={img.caption} loading="lazy" style={{width:"100%",borderRadius:12,border:`1px solid ${COLORS.border}`}}/>
<div style={{fontSize:11,color:COLORS.textDim,marginTop:4}}>{img.caption}</div>
<div style={{fontSize:10,color:COLORS.textDim,fontStyle:"italic"}}>{img.source}</div>
</div>
))}
</div>
{viewing!==null && <EkgFullscreen images={images} startIndex={viewing} onClose={()=>setViewing(null)}/>}
</div>);
}
function EcgDiagram({ekgId, compact=false}) {
const W = compact ? 320 : 380;
const H = compact ? 260 : 320;
const leads = ["I","II","III","aVR","aVL","aVF","V1","V2","V3","V4","V5","V6"];
const cols = 4, rows = 3;
const lw = W/cols, lh = H/rows;
const data = ECG_WAVES[ekgId];
if(!data) return null;
return (
<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",background:"#fefdf8",borderRadius:8,border:"1px solid #e5e0d5"}}>
<defs>
<pattern id="ecgGrid" width="4" height="4" patternUnits="userSpaceOnUse">
<path d="M 4 0 L 0 0 0 4" fill="none" stroke="#f0c8c8" strokeWidth="0.3"/>
</pattern>
<pattern id="ecgGridL" width="20" height="20" patternUnits="userSpaceOnUse">
<path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0a0a0" strokeWidth="0.5"/>
</pattern>
</defs>
<rect width={W} height={H} fill="url(#ecgGrid)"/>
<rect width={W} height={H} fill="url(#ecgGridL)"/>
{leads.map((name,i)=>{
const col=i%cols, row=Math.floor(i/cols);
const x=col*lw, y=row*lh;
const wave = data[i] || data[0];
return (
<g key={name}>
<rect x={x} y={y} width={lw} height={lh} fill="none" stroke="#d0a0a0" strokeWidth="0.5"/>
<text x={x+3} y={y+10} fontSize="7" fontWeight="700" fill="#333" fontFamily="monospace">{name}</text>
<EcgWave x={x+2} y={y+lh/2} w={lw-4} h={lh*0.8} wave={wave}/>
</g>
);
})}
</svg>
);
}
function EcgWave({x,y,w,h,wave}) {
if(!wave || !wave.pts) return <line x1={x} y1={y} x2={x+w} y2={y} stroke="#222" strokeWidth="0.8"/>;
const pts = wave.pts;
const scaleX = w / 100;
const scaleY = h / 2;
let d = "";
pts.forEach((p,i)=>{
const px = x + p[0] * scaleX;
const py = y - p[1] * scaleY;
d += (i===0 ? "M" : "L") + px.toFixed(1) + "," + py.toFixed(1) + " ";
});
return <path d={d} fill="none" stroke="#111" strokeWidth="0.9" strokeLinejoin="round" strokeLinecap="round"/>;
}
// Waveform helpers
function nBeat(xOff,p,pr,q,r,s,st,t,u,qw,notch){
// Generate one PQRST beat starting at xOff
// p=P height, pr=PR length, q=Q depth, r=R height, s=S depth
// st=ST level, t=T height, u=U height, qw=QRS width factor
// notch: "rsr" for RSR' (RSB V1), "m" for M-shape (LSB V5/V6), "wide" for extra wide
const pts = [];
const qf = qw||1;
let x = xOff;
// baseline
pts.push([x,0]);
// P wave
if(p!==0) {
pts.push([x+1,0]);
pts.push([x+2.5,p*0.4]);
pts.push([x+4,p*0.6]);
pts.push([x+5.5,p*0.4]);
pts.push([x+7,0]);
} else {
pts.push([x+7,0]);
}
// PR segment
x += 7 + (pr||1)*3;
pts.push([x,0]);
// QRS complex
if(notch==="rsr") {
// RSR' pattern: small r, dip to S, then tall R'
pts.push([x+0.8*qf, r*0.35]);
pts.push([x+1.5*qf, -s*0.5]);
pts.push([x+2.2*qf, -s*0.2]);
pts.push([x+3.2*qf, r*0.95]);
pts.push([x+3.8*qf, r*0.8]);
pts.push([x+4.5*qf, -s*0.15]);
pts.push([x+5*qf, (st||0)*0.3]);
x += 5*qf;
} else if(notch==="m") {
// M-shape: R up, notch down, R' up again (LSB lateral leads)
pts.push([x+0.8*qf, r*0.75]);
pts.push([x+1.5*qf, r*0.4]);
pts.push([x+2.2*qf, r*0.3]);
pts.push([x+3*qf, r*0.9]);
pts.push([x+3.8*qf, r*0.65]);
pts.push([x+4.5*qf, -s*0.15]);
pts.push([x+5*qf, (st||0)*0.3]);
x += 5*qf;
} else if(notch==="ws") {
// Wide S for LSB V1-V3: tiny r then very deep wide S
if(q) { pts.push([x+0.5*qf,-q*0.3]); }
pts.push([x+0.8*qf, r*0.3]);
pts.push([x+1.5*qf, r*0.15]);
pts.push([x+2*qf, -s*0.5]);
pts.push([x+3*qf, -s*0.9]);
pts.push([x+4*qf, -s*0.7]);
pts.push([x+5*qf, (st||0)*0.3]);
x += 5*qf;
} else {
// Normal QRS
if(q) { pts.push([x+0.5*qf,-q*0.3]); }
pts.push([x+1.2*qf, r*0.9]);
pts.push([x+1.8*qf, r*1.0]);
pts.push([x+2.4*qf, r*0.7]);
pts.push([x+3*qf, -s*0.8]);
pts.push([x+3.5*qf, (st||0)*0.3]);
x += 3.5*qf;
}
// ST segment
pts.push([x+2, (st||0)*0.35]);
// T wave
pts.push([x+3.5, t*0.35 + (st||0)*0.2]);
pts.push([x+5, t*0.5]);
pts.push([x+6.5, t*0.35]);
pts.push([x+8, (u||0)*0.15]);
// U wave
if(u) {
pts.push([x+9, u*0.2]);
pts.push([x+10, u*0.1]);
pts.push([x+11, 0]);
} else {
pts.push([x+9.5, 0]);
}
return pts;
}
function mkLead(beats, noise, flutter) {
let all = [];
const spacing = 100 / beats.length;
beats.forEach((b,i) => {
const off = i * spacing;
const pts = nBeat(off, b.p||0, b.pr||1, b.q||0, b.r||0.5, b.s||0, b.st||0, b.t||0.3, b.u||0, b.qw||1, b.notch||null);
all = all.concat(pts);
});
// Add noise for fibrillation
if(noise) {
const noisy = [];
all.forEach(p => {
noisy.push([p[0], p[1] + (Math.sin(p[0]*noise*3.7)*0.08 + Math.cos(p[0]*noise*7.1)*0.05)]);
});
return {pts: noisy};
}
// Add flutter waves
if(flutter) {
const fl = [];
for(let fx=0; fx<100; fx+=0.5) {
fl.push([fx, Math.sin(fx*flutter*0.6)*0.15]);
}
// Merge: QRS from all, baseline from flutter
const merged = [];
let ai = 0;
fl.forEach(fp => {
// Find if there's a QRS nearby
while(ai < all.length-1 && all[ai+1][0] < fp[0]) ai++;
if(ai < all.length && Math.abs(all[ai][0]-fp[0])<1.5 && Math.abs(all[ai][1])>0.15) {
merged.push(all[ai]);
} else {
merged.push(fp);
}
});
return {pts: merged};
}
return {pts: all};
}
function vfWave() {
const pts = [];
for(let x=0;x<100;x+=0.4){
const y = (Math.sin(x*1.3)*0.35 + Math.sin(x*2.7)*0.25 + Math.cos(x*4.1)*0.15) * (0.6+0.4*Math.sin(x*0.15));
pts.push([x,y]);
}
return {pts};
}
function asystoleWave() {
const pts = [];
for(let x=0;x<100;x+=1){
pts.push([x, Math.random()*0.02-0.01]);
}
return {pts};
}
function torsadeWave() {
const pts = [];
for(let x=0;x<100;x+=0.5){
const envelope = Math.sin(x*0.08)*0.8;
const y = Math.sin(x*1.2)*envelope;
pts.push([x,y]);
}
return {pts};
}
// Normal sinus beat templates per lead
const N = {
I: {p:0.3, r:0.6, s:0.1, t:0.35},
II: {p:0.4, r:0.8, s:0.15, t:0.45},
III: {p:0.15, r:0.35, s:0.25, t:0.2},
aVR: {p:-0.3, r:0.1, s:0.7, q:0, t:-0.35},
aVL: {p:0.15, r:0.4, s:0.15, t:0.2},
aVF: {p:0.3, r:0.55, s:0.1, t:0.35},
V1: {p:0.2, r:0.2, s:0.7, t:0.1},
V2: {p:0.2, r:0.35, s:0.6, t:0.45},
V3: {p:0.2, r:0.5, s:0.4, t:0.5},
V4: {p:0.2, r:0.75, s:0.2, t:0.5},
V5: {p:0.2, r:0.7, s:0.1, t:0.4},
V6: {p:0.2, r:0.55, s:0.05, t:0.35},
};
function sinus(overrides, nBeats, noiseLevel, flutterLevel) {
const leadNames = ["I","II","III","aVR","aVL","aVF","V1","V2","V3","V4","V5","V6"];
return leadNames.map(name => {
const base = {...N[name]};
const ov = (overrides && overrides[name]) ? {...base, ...overrides[name]} : base;
const nb = nBeats || 3;
const beats = [];
for(let i=0;i<nb;i++) beats.push(ov);
return mkLead(beats, noiseLevel, flutterLevel);
});
}
function irregular(overrides, beatPatterns) {
const leadNames = ["I","II","III","aVR","aVL","aVF","V1","V2","V3","V4","V5","V6"];
return leadNames.map(name => {
const base = {...N[name]};
const ov = (overrides && overrides[name]) ? {...base, ...overrides[name]} : base;
const beats = (beatPatterns||[]).map(bp => ({...ov, ...bp}));
return mkLead(beats);
});
}
// ═══════════════════════════════════════════════════════
// ECG WAVEFORM DATA PER CONDITION
// ═══════════════════════════════════════════════════════
// Map quiz question to EKG diagram
// getEkgIdForQuiz() is loaded from utils.js
const ECG_WAVES = {};
// 1. Normal Sinus
ECG_WAVES["sinusrhythmus"] = sinus(null, 3);
// 2. Sinustachykardie
ECG_WAVES["sinustachy"] = sinus(null, 5);
// 3. Sinusbradykardie
ECG_WAVES["sinusbrady"] = sinus(null, 2);
// 4. Vorhofflimmern – no P waves, irregular RR
ECG_WAVES["vhf"] = (()=>{
const L = ["I","II","III","aVR","aVL","aVF","V1","V2","V3","V4","V5","V6"];
return L.map(name => {
const base = {...N[name], p:0};
const beats = [
{...base},
{...base},
{...base},
{...base},
];
// Make irregular spacing by adjusting pr
beats[0].pr = 0.5;
beats[1].pr = 1.8;
beats[2].pr = 0.7;
beats[3].pr = 1.3;
return mkLead(beats, 3);
});
})();
// 5. Vorhofflattern
ECG_WAVES["vhflattern"] = sinus({
II:{p:0, st:-0.1}, III:{p:0, st:-0.1}, aVF:{p:0, st:-0.1},
V1:{p:0}, V2:{p:0}
}, 4, 0, 2);
// 6. SVT
ECG_WAVES["svt"] = sinus({
I:{p:0,r:0.55}, II:{p:0,r:0.75}, III:{p:0,r:0.3},
aVR:{p:0}, aVL:{p:0}, aVF:{p:0},
V1:{p:0}, V2:{p:0}, V3:{p:0}, V4:{p:0}, V5:{p:0}, V6:{p:0}
}, 6);
// 7. VT – wide QRS, regular
ECG_WAVES["vt"] = sinus({
I:{p:0,r:0.8,s:0.3,qw:2.2,t:-0.3,pr:0.3},
II:{p:0,r:0.9,s:0.4,qw:2.2,t:-0.4,pr:0.3},
III:{p:0,r:0.7,s:0.3,qw:2.2,t:-0.25,pr:0.3},
aVR:{p:0,r:0.1,s:0.9,qw:2.2,t:0.3,pr:0.3},
aVL:{p:0,r:0.5,s:0.2,qw:2.2,t:-0.2,pr:0.3},
aVF:{p:0,r:0.75,s:0.3,qw:2.2,t:-0.3,pr:0.3},
V1:{p:0,r:0.8,s:0.1,qw:2.2,t:-0.3,pr:0.3},
V2:{p:0,r:0.85,s:0.1,qw:2.2,t:-0.35,pr:0.3},
V3:{p:0,r:0.7,s:0.2,qw:2.2,t:-0.3,pr:0.3},
V4:{p:0,r:0.6,s:0.3,qw:2.2,t:-0.25,pr:0.3},
V5:{p:0,r:0.5,s:0.4,qw:2.2,t:-0.2,pr:0.3},
V6:{p:0,r:0.4,s:0.5,qw:2.2,t:-0.15,pr:0.3},
}, 4);
// 8. Torsade de Pointes
ECG_WAVES["torsade"] = Array(12).fill(torsadeWave());
// 9. Kammerflimmern
ECG_WAVES["vf"] = Array(12).fill(vfWave());
// 10. Pulslose VT (same as VT)
ECG_WAVES["pvt"] = ECG_WAVES["vt"];
// 11. Asystolie
ECG_WAVES["asystolie"] = Array(12).fill(asystoleWave());
// 12. PEA (looks organized but no pulse)
ECG_WAVES["pea"] = sinus({
I:{r:0.4,t:0.2}, II:{r:0.5,t:0.25}, V1:{r:0.15,s:0.5}
}, 3);
// 13. STEMI Anterior – ST elevation V1-V4
ECG_WAVES["stemi_anterior"] = sinus({
V1:{st:0.7,t:0.6,r:0.3}, V2:{st:0.9,t:0.7,r:0.4},
V3:{st:0.8,t:0.65,r:0.5}, V4:{st:0.6,t:0.55},
III:{st:-0.3,t:-0.15}, aVF:{st:-0.25,t:-0.1}
}, 3);
// 14. STEMI Inferior – ST elevation II, III, aVF
ECG_WAVES["stemi_inferior"] = sinus({
II:{st:0.7,t:0.6}, III:{st:0.8,t:0.65}, aVF:{st:0.7,t:0.6},
I:{st:-0.3,t:-0.1}, aVL:{st:-0.4,t:-0.2}
}, 3);
// 15. STEMI Posterior – ST depression V1-V3
ECG_WAVES["stemi_posterior"] = sinus({
V1:{st:-0.6,t:-0.4,r:0.45}, V2:{st:-0.7,t:-0.45,r:0.55},
V3:{st:-0.5,t:-0.3,r:0.6}
}, 3);
// 16. AV Block I – prolonged PQ
ECG_WAVES["avblock1"] = sinus({
I:{pr:3.5}, II:{pr:3.5,p:0.5}, III:{pr:3.5}, aVR:{pr:3.5}, aVL:{pr:3.5}, aVF:{pr:3.5,p:0.4},
V1:{pr:3.5}, V2:{pr:3.5}, V3:{pr:3.5}, V4:{pr:3.5}, V5:{pr:3.5}, V6:{pr:3.5}
}, 3);
// 17. AV Block II Wenckebach – progressive PQ then dropped beat
ECG_WAVES["avblock2_1"] = (()=>{
const L = ["I","II","III","aVR","aVL","aVF","V1","V2","V3","V4","V5","V6"];
return L.map(name => {
const base = N[name];
const beats = [
{...base, pr:1.2, p:(base.p||0.3)*1.4},
{...base, pr:2.5, p:(base.p||0.3)*1.4},
{p:(base.p||0.3)*1.6, pr:0.5, r:0, s:0, t:0, q:0},
];
return mkLead(beats);
});
})();
// 18. AV Block II Mobitz – sudden drop, constant PQ
ECG_WAVES["avblock2_2"] = (()=>{
const L = ["I","II","III","aVR","aVL","aVF","V1","V2","V3","V4","V5","V6"];
return L.map(name => {
const base = {...N[name], qw:1.4, pr:1.5, p:N[name].p||0.3};
const beats = [
{...base},
{p:(N[name].p||0.3)*1.6, pr:0.5, r:0, s:0, t:0, q:0},
{...base},
];
return mkLead(beats);
});
})();
// 19. AV Block III – dissociated P and QRS
ECG_WAVES["avblock3"] = (()=>{
const L = ["I","II","III","aVR","aVL","aVF","V1","V2","V3","V4","V5","V6"];
return L.map((name,li) => {
const base = N[name];
// Simulate AV dissociation: P waves at higher rate, QRS at lower rate with varying PR
// 3 slow wide escape beats with P waves appearing at different positions relative to QRS
const beats = [
{p:base.p*1.2, pr:0.2, r:base.r*0.7, s:base.s||0, t:base.t*0.6, qw:2.0, q:0},
{p:base.p*1.2, pr:1.8, r:base.r*0.7, s:base.s||0, t:base.t*0.6, qw:2.0, q:0},
{p:base.p*1.2, pr:3.5, r:base.r*0.7, s:base.s||0, t:base.t*0.6, qw:2.0, q:0},
];
return mkLead(beats);
});
})();
// 20. Hyperkaliämie – peaked T, wide QRS, flat P
ECG_WAVES["hyperkaliaemie"] = sinus({
I:{p:0.05,t:0.8,qw:1.6}, II:{p:0.05,t:0.9,qw:1.6},
III:{p:0,t:0.7,qw:1.6}, aVR:{p:0,r:0.1,s:0.8,t:-0.8,qw:1.6},
aVL:{p:0,t:0.6,qw:1.6}, aVF:{p:0,t:0.75,qw:1.6},
V1:{p:0,t:0.7,qw:1.6,s:0.5}, V2:{p:0,t:0.9,qw:1.6},
V3:{p:0,t:0.95,qw:1.6}, V4:{p:0,t:0.9,qw:1.6},
V5:{p:0,t:0.8,qw:1.6}, V6:{p:0,t:0.7,qw:1.6}
}, 3);
// 21. Hypokaliämie – flat T, U waves, ST depression
ECG_WAVES["hypokaliaemie"] = sinus({
I:{t:0.05,u:0.25,st:-0.2}, II:{t:0.05,u:0.3,st:-0.25},
III:{t:0,u:0.2,st:-0.15}, V1:{t:0,u:0.2,st:-0.2},
V2:{t:0.05,u:0.35,st:-0.3}, V3:{t:0.05,u:0.4,st:-0.3},
V4:{t:0.05,u:0.35,st:-0.25}, V5:{t:0.05,u:0.3,st:-0.2},
V6:{t:0.05,u:0.25,st:-0.15}
}, 3);
// 22. LSB – wide QRS, no Q in I/V5-V6, deep S in V1
ECG_WAVES["lsb"] = (()=>{
const L = ["I","II","III","aVR","aVL","aVF","V1","V2","V3","V4","V5","V6"];
const overrides = {
I:{r:0.8,s:0.05,q:0,qw:1.8,t:-0.35,st:-0.2,notch:"m"},
II:{r:0.7,s:0.1,qw:1.8,t:-0.3,st:-0.15,notch:"m"},
III:{r:0.15,s:0.7,qw:1.8,t:0.25,st:0.15,notch:"ws"},
aVR:{r:0.1,s:0.9,q:0,qw:1.8,t:0.35,notch:"ws"},
aVL:{r:0.75,s:0.05,qw:1.8,t:-0.35,st:-0.2,notch:"m"},
aVF:{r:0.5,s:0.35,qw:1.8,t:-0.15,notch:"m"},
V1:{r:0.08,s:0.95,qw:1.8,t:0.35,st:0.25,notch:"ws"},
V2:{r:0.1,s:0.9,qw:1.8,t:0.4,st:0.2,notch:"ws"},
V3:{r:0.2,s:0.7,qw:1.8,t:0.15,notch:"ws"},
V4:{r:0.6,s:0.15,qw:1.8,t:-0.25,st:-0.1,notch:"m"},
V5:{r:0.85,s:0.05,qw:1.8,t:-0.35,st:-0.2,notch:"m"},
V6:{r:0.75,s:0.05,qw:1.8,t:-0.3,st:-0.15,notch:"m"},
};
return L.map(name => {
const base = {...N[name], ...overrides[name]};
return mkLead([base,base,base]);
});
})();
// 23. RSB – rSR' in V1, wide S in I/V6
ECG_WAVES["rsb"] = (()=>{
const L = ["I","II","III","aVR","aVL","aVF","V1","V2","V3","V4","V5","V6"];
const overrides = {
I:{r:0.5,s:0.45,qw:1.8,t:0.25},
II:{r:0.7,s:0.2,qw:1.8,t:0.3},
III:{r:0.3,s:0.15,qw:1.8,t:0.15},
aVR:{r:0.1,s:0.7,qw:1.8,t:-0.3},
aVL:{r:0.4,s:0.35,qw:1.8,t:0.15},
aVF:{r:0.5,s:0.15,qw:1.8,t:0.25},
V1:{r:0.7,s:0.6,qw:1.8,t:-0.3,st:-0.15,notch:"rsr"},
V2:{r:0.6,s:0.45,qw:1.8,t:-0.2,st:-0.1,notch:"rsr"},
V3:{r:0.55,s:0.3,qw:1.8,t:0.1},
V4:{r:0.7,s:0.15,qw:1.8,t:0.3},
V5:{r:0.7,s:0.4,qw:1.8,t:0.3},
V6:{r:0.55,s:0.45,qw:1.8,t:0.25},
};
return L.map(name => {
const base = {...N[name], ...overrides[name]};
return mkLead([base,base,base]);
});
})();
// 24. LAE EKG – S1Q3T3 + tachycardia
ECG_WAVES["lae_ekg"] = sinus({
I:{s:0.45,r:0.4}, // S in I
III:{q:0.4,r:0.25,t:-0.3}, // Q and neg T in III
aVF:{t:-0.15},
V1:{t:-0.25,r:0.15,s:0.5}, V2:{t:-0.3}, V3:{t:-0.25}, V4:{t:-0.2}
}, 5);
// 25. Hypothermie – Osborn (J) waves, bradycardia
ECG_WAVES["hypothermie_ekg"] = sinus({
I:{st:0.4,r:0.5,t:0.25}, II:{st:0.5,r:0.7,t:0.3},
III:{st:0.35,t:0.2}, aVF:{st:0.4,t:0.25},
V2:{st:0.5,t:0.35}, V3:{st:0.55,t:0.4},
V4:{st:0.5,t:0.35}, V5:{st:0.4,t:0.3},
aVR:{st:-0.3,r:0.1,s:0.6}, V1:{st:0.35}
}, 2);
// 26. Perikarditis – diffuse ST elevation, PQ depression
ECG_WAVES["perikarditis_ekg"] = sinus({
I:{st:0.35,t:0.4}, II:{st:0.4,t:0.45}, III:{st:0.3,t:0.35},
aVL:{st:0.3,t:0.35}, aVF:{st:0.35,t:0.4},
aVR:{st:-0.4,t:-0.4,r:0.1,s:0.7},
V1:{st:0.2,t:0.3}, V2:{st:0.35,t:0.4}, V3:{st:0.4,t:0.45},
V4:{st:0.4,t:0.45}, V5:{st:0.35,t:0.4}, V6:{st:0.3,t:0.35}
}, 3);
// ═══════════════════════════════════════════════════════
// REFERENCE / LEXIKON
// ═══════════════════════════════════════════════════════
function Reference({subView,navigate}) {
const initTab = subView ? subView.split(":")[0] : "meds";
const initDetail = subView && subView.includes(":") ? subView.split(":").slice(1).join(":") : null;
const [tab, setTab] = useState(initTab);
const [search, setSearch] = useState("");
const [detail, setDetail] = useState(initDetail);
useEffect(()=>{
if(subView && subView.includes(":")) {
const t = subView.split(":")[0];
const d = subView.split(":").slice(1).join(":");
setTab(t); setDetail(d); window.scrollTo({top:0,behavior:'smooth'});
}
},[subView]);
const debouncedSearch = useDebounce(search, 250);
const filteredMeds = MEDICATIONS.filter(m=>m.name.toLowerCase().includes(debouncedSearch.toLowerCase())||m.gruppe.toLowerCase().includes(debouncedSearch.toLowerCase()));
const filteredInv = INVASIVE.filter(m=>m.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
const filteredLeit = LEITSYMPTOME.filter(l=>l.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
const filteredBpr = BPR.filter(b=>(b.name.toLowerCase().includes(debouncedSearch.toLowerCase())||b.kategorie.toLowerCase().includes(debouncedSearch.toLowerCase()))&&b.kategorie!=="Rechtliche Grundlagen");
const filteredRecht = BPR.filter(b=>(b.name.toLowerCase().includes(debouncedSearch.toLowerCase())||b.kategorie.toLowerCase().includes(debouncedSearch.toLowerCase()))&&b.kategorie==="Rechtliche Grundlagen");
const filteredEkg = EKG_DATA.filter(e=>e.name.toLowerCase().includes(debouncedSearch.toLowerCase())||e.kategorie.toLowerCase().includes(debouncedSearch.toLowerCase()));
const filteredSinnhaft = SINNHAFT_DATA.filter(s=>s.name.toLowerCase().includes(debouncedSearch.toLowerCase())||s.kategorie.toLowerCase().includes(debouncedSearch.toLowerCase()));
const filteredScores = SCORES_DATA.filter(s=>s.name.toLowerCase().includes(debouncedSearch.toLowerCase())||(s.kategorie&&s.kategorie.toLowerCase().includes(debouncedSearch.toLowerCase())));
const filteredChecklists = CHECKLISTS_DATA.filter(c=>c.name.toLowerCase().includes(debouncedSearch.toLowerCase())||(c.kategorie&&c.kategorie.toLowerCase().includes(debouncedSearch.toLowerCase())));
const filteredAbcde = ABCDE_DATA.filter(a=>a.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
const filteredTools = [...filteredScores,...filteredChecklists,...filteredAbcde];
if(detail) {
if(tab==="meds") {
const m = MEDICATIONS.find(x=>x.id===detail);
return (
<div className="fade-in">
<Button onClick={()=>setDetail(null)} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card>
<Badge color={COLORS.accent}>{m.gruppe}</Badge>
<h2 style={{fontSize:22,fontWeight:700,margin:"12px 0"}}>{m.name}</h2>
<div style={{fontSize:12,color:COLORS.textDim,marginBottom:20}}>Konzentration: {m.konzentration}</div>
{[{label:"Indikationen",items:m.indikationen,color:COLORS.green},
{label:"Kontraindikationen",items:m.kontra,color:COLORS.accent},
...(m.relKontra&&m.relKontra.length>0?[{label:"Relative Kontraindikationen",subtitle:"Anwendung nach sorgfältiger Nutzen-/Risiko-Abwägung",items:m.relKontra,color:COLORS.orange}]:[]),
{label:"UAW / Risiken",items:m.uaw,color:COLORS.yellow}
].map(s=>(
<div key={s.label} style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:s.color,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>{s.label}</h4>
{s.subtitle&&<div style={{fontSize:11,color:COLORS.textDim,marginBottom:6,fontStyle:"italic"}}>{s.subtitle}</div>}
{s.items.map((item,i)=><div key={i} style={{fontSize:14,color:COLORS.textMuted,padding:"4px 0",paddingLeft:12,borderLeft:`2px solid ${s.color}30`}}>• <LinkedText text={item} navigate={navigate}/></div>)}
</div>
))}
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.blue,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Dosierung</h4>
<LinkedText text={m.dosierung} navigate={navigate} style={{fontSize:14,color:COLORS.text,background:COLORS.blue+"10",padding:12,borderRadius:8,lineHeight:1.7,display:"block"}}/>
</div>
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.purple,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Besonderheiten</h4>
<LinkedText text={m.besonderheiten} navigate={navigate} style={{fontSize:14,color:COLORS.textMuted,lineHeight:1.7,display:"block"}}/>
</div>
<Badge color={COLORS.textDim}>Altersbegrenzung: {m.alter}</Badge>
</Card>
</div>
);
}
if(tab==="invasive") {
const m = INVASIVE.find(x=>x.id===detail);
return (
<div className="fade-in">
<Button onClick={()=>setDetail(null)} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card>
<h2 style={{fontSize:22,fontWeight:700,marginBottom:16}}>{m.name}</h2>
{[{label:"Indikationen",items:m.indikationen,color:COLORS.green},{label:"Kontraindikationen",items:m.kontra,color:COLORS.accent}].map(s=>(
<div key={s.label} style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:s.color,marginBottom:8,textTransform:"uppercase"}}>{s.label}</h4>
{s.items.map((item,i)=><div key={i} style={{fontSize:14,color:COLORS.textMuted,padding:"4px 0",paddingLeft:12,borderLeft:`2px solid ${s.color}30`}}>• <LinkedText text={item} navigate={navigate}/></div>)}
</div>
))}
{m.alternativen && m.alternativen.length > 0 && (
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.purple,marginBottom:8,textTransform:"uppercase"}}>Alternativen</h4>
{m.alternativen.map((a,i)=><div key={i} style={{fontSize:14,color:COLORS.textMuted,padding:"4px 0",paddingLeft:12,borderLeft:`2px solid ${COLORS.purple}30`}}>• {a}</div>)}
</div>
)}
{m.aufklaerung && m.aufklaerung.length > 0 && (
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.yellow,marginBottom:8,textTransform:"uppercase"}}>Aufklärung / Risiken</h4>
{m.aufklaerung.map((a,i)=><div key={i} style={{fontSize:14,color:COLORS.textMuted,padding:"4px 0",paddingLeft:12,borderLeft:`2px solid ${COLORS.yellow}30`}}>• {a}</div>)}
</div>
)}
{m.einwilligung && m.einwilligung.length > 0 && (
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:"#8b5cf6",marginBottom:8,textTransform:"uppercase"}}>Einwilligung</h4>
{m.einwilligung.map((e,i)=><div key={i} style={{fontSize:14,color:COLORS.textMuted,padding:"4px 0",paddingLeft:12,borderLeft:"2px solid #8b5cf630"}}>• {e}</div>)}
</div>
)}
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.blue,marginBottom:8,textTransform:"uppercase"}}>Durchführung</h4>
<LinkedText text={m.durchfuehrung} navigate={navigate} style={{fontSize:14,color:COLORS.text,background:COLORS.blue+"10",padding:12,borderRadius:8,lineHeight:1.7,display:"block"}}/>
</div>
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.green,marginBottom:8,textTransform:"uppercase"}}>Erfolgskontrolle</h4>
<LinkedText text={m.erfolg} navigate={navigate} style={{fontSize:14,color:COLORS.textMuted,lineHeight:1.7,display:"block"}}/>
</div>
{m.gegenmassnahmen && (
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.orange,marginBottom:8,textTransform:"uppercase"}}>Gegenmaßnahmen bei Komplikationen</h4>
{Array.isArray(m.gegenmassnahmen) ? m.gegenmassnahmen.map((g,i)=><div key={i} style={{fontSize:14,color:COLORS.textMuted,padding:"4px 0",paddingLeft:12,borderLeft:`2px solid ${COLORS.orange}30`}}>• {g}</div>) : <LinkedText text={m.gegenmassnahmen} navigate={navigate} style={{fontSize:14,color:COLORS.textMuted,background:COLORS.orange+"10",padding:12,borderRadius:8,lineHeight:1.7,display:"block"}}/>}
</div>
)}
{m.verlaufskontrolle && m.verlaufskontrolle.length > 0 && (
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.blue,marginBottom:8,textTransform:"uppercase"}}>Verlaufskontrolle</h4>
{m.verlaufskontrolle.map((v,i)=><div key={i} style={{fontSize:14,color:COLORS.textMuted,padding:"4px 0",paddingLeft:12,borderLeft:`2px solid ${COLORS.blue}30`}}>• {v}</div>)}
</div>
)}
{m.gauge && (
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.yellow,marginBottom:8,textTransform:"uppercase"}}>Kennzahlen</h4>
<div style={{fontSize:13,color:COLORS.text,background:COLORS.yellow+"10",padding:12,borderRadius:8,lineHeight:1.8,fontFamily:"monospace"}}>{m.gauge}</div>
</div>
)}
{m.anmerkung && (
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.textDim,marginBottom:8,textTransform:"uppercase"}}>Anmerkungen</h4>
<div style={{fontSize:13,color:COLORS.textMuted,background:COLORS.bg,padding:12,borderRadius:8,lineHeight:1.6,border:`1px solid ${COLORS.border}`}}>{m.anmerkung}</div>
</div>
)}
</Card>
</div>
);
}
if(tab==="leitsymptome") {
const l = LEITSYMPTOME.find(x=>x.id===detail);
return (
<div className="fade-in">
<Button onClick={()=>setDetail(null)} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card>
<Badge color={COLORS.orange}>Leitsymptom</Badge>
<h2 style={{fontSize:22,fontWeight:700,margin:"12px 0"}}>{l.name}</h2>
{LS_FLOWS[l.id] && <div style={{marginBottom:20,textAlign:"center"}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.orange,marginBottom:10,textTransform:"uppercase"}}>Ablaufdiagramm</h4>
<FlowDiagram flowId={l.id} flowSource={LS_FLOWS}/>
</div>}
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.blue,marginBottom:12,textTransform:"uppercase"}}>Algorithmus / Vorgehen</h4>
{l.schritte.map((s,i)=>(
<div key={i} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
<div style={{width:28,height:28,borderRadius:14,background:COLORS.blue+"20",color:COLORS.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</div>
<LinkedText text={s} navigate={navigate} style={{fontSize:14,color:COLORS.text,lineHeight:1.5,paddingTop:4}}/>
</div>
))}
</div>
{l.differenzierung && (
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.yellow,marginBottom:8,textTransform:"uppercase"}}>Differenzierung / Hinweise</h4>
<LinkedText text={l.differenzierung} navigate={navigate} style={{fontSize:14,color:COLORS.textMuted,background:COLORS.yellow+"10",padding:12,borderRadius:8,lineHeight:1.7,display:"block"}}/>
</div>
)}
<div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:16}}>
<span style={{fontSize:12,color:COLORS.textDim,fontWeight:600}}>Medikamente:</span>
{l.medikamente.length>0?l.medikamente.map(m=><LinkedBadge key={m} text={m} navigate={navigate} color={COLORS.accent}/>):<span style={{fontSize:12,color:COLORS.textDim}}>–</span>}
</div>
{l.saas&&l.saas.length>0&&<div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
<span style={{fontSize:12,color:COLORS.textDim,fontWeight:600}}>SAAs:</span>
{l.saas.map(s=><LinkedBadge key={s} text={s} navigate={navigate} color={COLORS.blue}/>)}
</div>}
</Card>
</div>
);
}
if(tab==="recht") {
const b = BPR.find(x=>x.id===detail);
return (
<div className="fade-in">
<Button onClick={()=>setDetail(null)} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card>
<Badge color="#f59e0b">{b.kategorie}</Badge>
<h2 style={{fontSize:22,fontWeight:700,margin:"12px 0"}}>{b.name}</h2>
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:"#f59e0b",marginBottom:12,textTransform:"uppercase"}}>Ablauf / Schritte</h4>
{b.schritte.map((s,i)=>(
<div key={i} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
<div style={{width:28,height:28,borderRadius:14,background:"#f59e0b20",color:"#f59e0b",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</div>
<LinkedText text={s} navigate={navigate} style={{fontSize:14,color:COLORS.text,lineHeight:1.5,paddingTop:4}}/>
</div>
))}
</div>
</Card>
</div>
);
}
if(tab==="bpr") {
const b = BPR.find(x=>x.id===detail);
return (
<div className="fade-in">
<Button onClick={()=>setDetail(null)} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card>
<Badge color={COLORS.green}>{b.kategorie}</Badge>
<h2 style={{fontSize:22,fontWeight:700,margin:"12px 0"}}>{b.name}</h2>
{BPR_FLOWS[b.id] && <div style={{marginBottom:20,textAlign:"center"}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.green,marginBottom:10,textTransform:"uppercase"}}>Ablaufdiagramm</h4>
<FlowDiagram flowId={b.id} flowSource={BPR_FLOWS}/>
</div>}
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.blue,marginBottom:12,textTransform:"uppercase"}}>Behandlungsschritte</h4>
{b.schritte.map((s,i)=>(
<div key={i} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
<div style={{width:28,height:28,borderRadius:14,background:COLORS.blue+"20",color:COLORS.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</div>
<LinkedText text={s} navigate={navigate} style={{fontSize:14,color:COLORS.text,lineHeight:1.5,paddingTop:4}}/>
</div>
))}
</div>
<div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:16}}>
<span style={{fontSize:12,color:COLORS.textDim,fontWeight:600}}>Medikamente:</span>
{b.medikamente.map(m=><LinkedBadge key={m} text={m} navigate={navigate} color={COLORS.accent}/>)}
</div>
{b.saas&&<div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
<span style={{fontSize:12,color:COLORS.textDim,fontWeight:600}}>SAAs:</span>
{b.saas.map(s=><LinkedBadge key={s} text={s} navigate={navigate} color={COLORS.blue}/>)}
</div>}
</Card>
</div>
);
}
if(tab==="sinnhaft") {
const s = SINNHAFT_DATA.find(x=>x.id===detail);
return (
<div className="fade-in">
<Button onClick={()=>setDetail(null)} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card>
<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
<div style={{width:48,height:48,borderRadius:12,background:COLORS.accent+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:COLORS.accent}}>{s.buchstabe}</div>
<div>
<Badge color={COLORS.accent}>{s.kategorie}</Badge>
<h2 style={{fontSize:22,fontWeight:700,margin:"4px 0"}}>{s.name}</h2>
</div>
</div>
<div style={{fontSize:14,color:COLORS.textMuted,lineHeight:1.7,marginBottom:20,padding:12,background:COLORS.blue+"08",borderRadius:8,borderLeft:`3px solid ${COLORS.blue}`}}>{s.beschreibung}</div>
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.green,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Kernpunkte</h4>
{s.kernpunkte.map((k,i)=><div key={i} style={{fontSize:14,color:COLORS.textMuted,padding:"4px 0",paddingLeft:12,borderLeft:`2px solid ${COLORS.green}30`}}>• {k}</div>)}
</div>
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.purple,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>CRM-Aspekt</h4>
<div style={{fontSize:14,color:COLORS.text,background:COLORS.purple+"10",padding:12,borderRadius:8,lineHeight:1.7}}>{s.crm_aspekt}</div>
</div>
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.yellow,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Häufige Fehler</h4>
{s.fehler.map((f,i)=><div key={i} style={{fontSize:14,color:COLORS.textMuted,padding:"4px 0",paddingLeft:12,borderLeft:`2px solid ${COLORS.yellow}30`}}> {f}</div>)}
</div>
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.orange,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Beispiel</h4>
<div style={{fontSize:14,color:COLORS.text,background:COLORS.orange+"10",padding:12,borderRadius:8,lineHeight:1.7,fontStyle:"italic"}}>"{s.beispiel}"</div>
</div>
</Card>
</div>
);
}
if(tab==="werkzeuge" && detail) {
const sc = SCORES_DATA.find(x=>x.id===detail);
if(sc) return (
<div className="fade-in">
<Button onClick={()=>setDetail(null)} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card>
<Badge color={COLORS.purple}>{sc.kategorie}</Badge>
<h2 style={{fontSize:22,fontWeight:700,margin:"12px 0"}}>{sc.name}</h2>
<p style={{fontSize:14,color:COLORS.textMuted,lineHeight:1.6,marginBottom:16}}>{sc.beschreibung}</p>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.blue,marginBottom:12,textTransform:"uppercase"}}>Parameter</h4>
{sc.items.map((item,i)=>(
<div key={i} style={{marginBottom:16,background:COLORS.bg,borderRadius:8,padding:12,border:"1px solid "+COLORS.border}}>
<div style={{fontSize:13,fontWeight:700,color:COLORS.accent,marginBottom:8}}>{item.name}</div>
{item.options.map((o,j)=>(
<div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:j<item.options.length-1?"1px solid "+COLORS.border+"40":"none"}}>
<span style={{fontSize:13,color:COLORS.text}}>{o.label}</span>
<Badge color={COLORS.blue}>{o.value} Pkt.</Badge>
</div>
))}
</div>
))}
{sc.auswertung && <div style={{marginTop:12}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.yellow,marginBottom:8,textTransform:"uppercase"}}>Auswertung</h4>
{sc.auswertung.map((a,i)=>(
<div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
<Badge color={a.color||COLORS.textMuted}>{a.range}</Badge>
<span style={{fontSize:13,color:COLORS.text}}>{a.label}</span>
</div>
))}
</div>}
</Card>
</div>
);
const cl = CHECKLISTS_DATA.find(x=>x.id===detail);
if(cl) return (
<div className="fade-in">
<Button onClick={()=>setDetail(null)} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
<span style={{fontSize:28}}><Icon name={cl.iconName} size={18} color={cl.color}/></span>
<div>
<Badge color={COLORS.green}>{cl.kategorie}</Badge>
<h2 style={{fontSize:20,fontWeight:700,margin:"4px 0"}}>{cl.name}</h2>
</div>
</div>
{cl.items.map((group,gi)=>(
<div key={gi} style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.blue,marginBottom:10,textTransform:"uppercase"}}>{group.group}</h4>
{group.checks.map((check,ci)=>(
<div key={ci} style={{display:"flex",gap:10,marginBottom:6,alignItems:"flex-start"}}>
<span style={{color:COLORS.green,fontSize:13}}>☐</span>
<span style={{fontSize:13,color:COLORS.text,lineHeight:1.5}}>{check}</span>
</div>
))}
</div>
))}
</Card>
</div>
);
const ab = ABCDE_DATA.find(x=>x.letter===detail);
if(ab) return (
<div className="fade-in">
<Button onClick={()=>setDetail(null)} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card>
<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
<div style={{width:48,height:48,borderRadius:12,background:ab.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:ab.color}}>{ab.letter}</div>
<div>
<Badge color={ab.color}>{ab.letter}</Badge>
<h2 style={{fontSize:20,fontWeight:700,margin:"4px 0"}}>{ab.title}</h2>
</div>
</div>
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.blue,marginBottom:10,textTransform:"uppercase"}}>Untersuchung / Checks</h4>
{ab.checks.map((c,i)=>(
<div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
<div style={{width:24,height:24,borderRadius:12,background:ab.color+"20",color:ab.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div>
<span style={{fontSize:14,color:COLORS.text,lineHeight:1.5,paddingTop:2}}>{c}</span>
</div>
))}
</div>
<div>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.green,marginBottom:10,textTransform:"uppercase"}}>Interventionen</h4>
{ab.interventions.map((inv,i)=>(
<div key={i} style={{display:"flex",gap:10,marginBottom:6,alignItems:"flex-start"}}>
<span style={{color:COLORS.green,fontWeight:700,flexShrink:0}}>→</span>
<span style={{fontSize:14,color:COLORS.textMuted,lineHeight:1.5}}>{inv}</span>
</div>
))}
</div>
</Card>
</div>
);
}
if(tab==="ekg") {
const e = EKG_DATA.find(x=>x.id===detail);
if(!e) { setDetail(null); return null; }
return (
<div className="fade-in">
<Button onClick={()=>setDetail(null)} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card>
<Badge color={"#e11d48"}>{e.kategorie}</Badge>
<h2 style={{fontSize:22,fontWeight:700,margin:"12px 0"}}>{e.name}</h2>
<div style={{fontSize:14,color:COLORS.textMuted,marginBottom:16,lineHeight:1.6}}>{e.beschreibung}</div>
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:"#e11d48",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>12-Kanal-EKG (Schema)</h4>
<EcgDiagram ekgId={e.id}/>
</div>
{e.images && e.images.length>0 && <div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:"#e11d48",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Original-EKGs</h4>
<EkgImageViewer images={e.images}/>
</div>}
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:"#e11d48",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>EKG-Merkmale</h4>
{e.merkmale.map((item,i)=><div key={i} style={{fontSize:14,color:COLORS.textMuted,padding:"4px 0",paddingLeft:12,borderLeft:"2px solid #e11d4830"}}>• {item}</div>)}
</div>
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.blue,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Diagnose-Kriterien</h4>
<div style={{fontSize:14,color:COLORS.textMuted,lineHeight:1.6,padding:"8px 12px",background:COLORS.blue+"08",borderRadius:8}}>{e.kriterien}</div>
</div>
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.orange,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Klinische Bedeutung</h4>
<div style={{fontSize:14,color:COLORS.textMuted,lineHeight:1.6,padding:"8px 12px",background:COLORS.orange+"08",borderRadius:8}}>{e.klinik}</div>
</div>
<div style={{marginBottom:16}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.green,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Therapie / Maßnahmen</h4>
<div style={{fontSize:14,color:COLORS.textMuted,lineHeight:1.6,padding:"8px 12px",background:COLORS.green+"08",borderRadius:8}}>{e.therapie}</div>
</div>
<div style={{marginBottom:8,padding:"12px 16px",background:"#e11d4808",borderRadius:12,border:"1px solid #e11d4820"}}>
<h4 style={{fontSize:13,fontWeight:700,color:"#e11d48",marginBottom:6}}> Merktipp</h4>
<div style={{fontSize:14,color:COLORS.text,lineHeight:1.6}}>{e.tipps}</div>
</div>
</Card>
</div>
);
}
}
const tabs = [{id:"meds",label:"Medikamente",iconName:"pill",color:COLORS.accent,count:filteredMeds.length},{id:"invasive",label:"Invasive Maßnahmen",iconName:"syringe",color:COLORS.blue,count:filteredInv.length},{id:"leitsymptome",label:"Leitsymptome",iconName:"stethoscope",color:COLORS.orange,count:filteredLeit.length},{id:"bpr",label:"Krankheitsbilder",iconName:"heartPulse",color:COLORS.green,count:filteredBpr.length},{id:"ekg",label:"EKG-Befunde",iconName:"activity",color:"#e11d48",count:filteredEkg.length},{id:"sinnhaft",label:"Übergabe",iconName:"megaphone",color:"#8b5cf6",count:filteredSinnhaft.length},{id:"werkzeuge",label:"Werkzeuge",iconName:"wrench",color:"#14b8a6",count:filteredTools.length},{id:"recht",label:"Recht & Aufklärung",iconName:"shield",color:"#f59e0b",count:filteredRecht.length}];
return (
<div className="fade-in">
<Button onClick={()=>navigate("dashboard")} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<h2 style={{fontSize:22,fontWeight:700,marginBottom:16}}> Lexikon</h2>
<input value={search} onChange={e=>setSearch(e.target.value)} placeholder=" Suchen..." style={{width:"100%",padding:"12px 16px",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,color:COLORS.text,fontSize:14,fontFamily:"'Outfit',sans-serif",marginBottom:debouncedSearch?8:16,outline:"none"}}/>
{debouncedSearch && <div style={{fontSize:12,color:COLORS.textMuted,marginBottom:12}}>{tabs.find(t=>t.id===tab)?.count||0} Ergebnisse für „{debouncedSearch}"</div>}
<div style={{display:"flex",gap:4,marginBottom:20,flexWrap:"wrap"}}>
{tabs.map(t=>(
<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 16px",borderRadius:10,border:`1px solid ${tab===t.id?COLORS.accent:COLORS.border}`,background:tab===t.id?COLORS.accent+"15":"transparent",color:tab===t.id?COLORS.accent:COLORS.textMuted,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
<Icon name={t.iconName} size={18} color={t.color}/> {t.label} ({t.count})
</button>
))}
</div>
<div className="card-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
{tab==="meds" && filteredMeds.map(m=>(
<Card key={m.id} onClick={()=>setDetail(m.id)} style={{padding:16}}>
<div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{m.name}</div>
<div style={{fontSize:12,color:COLORS.textDim}}>{m.gruppe}</div>
<div style={{fontSize:12,color:COLORS.textMuted,marginTop:6}}>{m.indikationen[0]}</div>
</Card>
))}
{tab==="meds" && filteredMeds.length===0 && <EmptyState sub={debouncedSearch?`Keine Medikamente für "${debouncedSearch}" gefunden.`:"Keine Einträge in dieser Kategorie."}/>}
{tab==="invasive" && filteredInv.map(m=>(
<Card key={m.id} onClick={()=>setDetail(m.id)} style={{padding:16}}>
<div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{m.name}</div>
<div style={{fontSize:12,color:COLORS.textMuted,marginTop:4}}>{m.indikationen[0]}</div>
</Card>
))}
{tab==="invasive" && filteredInv.length===0 && <EmptyState sub={debouncedSearch?`Keine Maßnahmen für "${debouncedSearch}" gefunden.`:"Keine Einträge in dieser Kategorie."}/>}
{tab==="leitsymptome" && filteredLeit.map(l=>(<Card key={l.id} onClick={()=>{setDetail(l.id);window.scrollTo({top:0,behavior:'smooth'});}} style={{padding:16}}>
<Badge color={COLORS.orange} bg={COLORS.orange+"10"}>Leitsymptom</Badge>
<div style={{fontSize:15,fontWeight:700,margin:"8px 0 4px"}}>{l.name}</div>
<div style={{fontSize:12,color:COLORS.textMuted,marginBottom:8}}>{l.schritte.length} Schritte · {l.medikamente.length>0?l.medikamente.join(", "):"Algorithmus"}</div>
{LS_FLOWS[l.id] && <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:LS_FLOWS[l.id].color}}>
<svg width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="1" width="10" height="4" rx="1" fill={LS_FLOWS[l.id].color} opacity="0.6"/><polygon points="8,7 12,9.5 8,12 4,9.5" fill={LS_FLOWS[l.id].color} opacity="0.4"/><rect x="3" y="13" width="10" height="2" rx="1" fill={LS_FLOWS[l.id].color} opacity="0.3"/><line x1="8" y1="5" x2="8" y2="7" stroke={LS_FLOWS[l.id].color} strokeWidth="0.8"/><line x1="8" y1="12" x2="8" y2="13" stroke={LS_FLOWS[l.id].color} strokeWidth="0.8"/></svg>
Ablaufdiagramm verfügbar
</div>}
</Card>))}
{tab==="leitsymptome" && filteredLeit.length===0 && <EmptyState sub={debouncedSearch?`Keine Leitsymptome für "${debouncedSearch}" gefunden.`:"Keine Einträge in dieser Kategorie."}/>}
{tab==="bpr" && filteredBpr.map(b=>(<Card key={b.id} onClick={()=>{setDetail(b.id);window.scrollTo({top:0,behavior:'smooth'});}} style={{padding:16}}>
<Badge color={COLORS.green} bg={COLORS.green+"10"}>{b.kategorie}</Badge>
<div style={{fontSize:15,fontWeight:700,margin:"8px 0 4px"}}>{b.name}</div>
<div style={{fontSize:12,color:COLORS.textMuted,marginBottom:BPR_FLOWS[b.id]?8:0}}>{b.schritte.length} Schritte · {b.medikamente.length>0?b.medikamente.join(", "):"Algorithmus"}</div>
{BPR_FLOWS[b.id] && <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:BPR_FLOWS[b.id].color}}>
<svg width="16" height="16" viewBox="0 0 16 16"><rect x="3" y="1" width="10" height="4" rx="1" fill={BPR_FLOWS[b.id].color} opacity="0.6"/><polygon points="8,7 12,9.5 8,12 4,9.5" fill={BPR_FLOWS[b.id].color} opacity="0.4"/><rect x="3" y="13" width="10" height="2" rx="1" fill={BPR_FLOWS[b.id].color} opacity="0.3"/><line x1="8" y1="5" x2="8" y2="7" stroke={BPR_FLOWS[b.id].color} strokeWidth="0.8"/><line x1="8" y1="12" x2="8" y2="13" stroke={BPR_FLOWS[b.id].color} strokeWidth="0.8"/></svg>
Ablaufdiagramm verfügbar
</div>}
</Card>))}
{tab==="bpr" && filteredBpr.length===0 && <EmptyState sub={debouncedSearch?`Keine Behandlungspfade für "${debouncedSearch}" gefunden.`:"Keine Einträge in dieser Kategorie."}/>}
{tab==="ekg" && filteredEkg.map(e=>(
<Card key={e.id} onClick={()=>setDetail(e.id)} style={{padding:16}}>
<Badge color={"#e11d48"} bg={"#e11d4810"}>{e.kategorie}</Badge>
<div style={{fontSize:15,fontWeight:700,margin:"8px 0 4px"}}>{e.name}</div>
<div style={{margin:"8px 0",opacity:0.85}}><EcgDiagram ekgId={e.id} compact={true}/></div>
<div style={{fontSize:12,color:COLORS.textMuted}}>{e.merkmale[0]}</div>
{e.images && e.images.length>0 && <div style={{fontSize:11,color:"#e11d48",marginTop:6}}>{e.images.length} Original-EKG{e.images.length>1?"s":""}</div>}
</Card>
))}
{tab==="ekg" && filteredEkg.length===0 && <EmptyState sub={debouncedSearch?`Keine EKG-Befunde für "${debouncedSearch}" gefunden.`:"Keine Einträge in dieser Kategorie."}/>}
</div>
{tab==="sinnhaft" && <div style={{display:"grid",gap:8}}>
<div style={{padding:16,background:COLORS.accent+"08",borderRadius:12,border:`1px solid ${COLORS.accent}30`,marginBottom:8}}>
<div style={{fontSize:15,fontWeight:700,color:COLORS.accent,marginBottom:6}}> SINNHAFT-Schema</div>
<div style={{fontSize:13,color:COLORS.textMuted,lineHeight:1.6}}>Evidenzbasiertes Übergabeschema für die Schnittstelle Rettungsdienst → Notaufnahme. Entwickelt 2023 im Delphi-Verfahren mit 52 Experten (Gräff et al., Notfall Rettungsmed 2023).</div>
<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>{["S","I","N","N","H","A","F","T"].map((b,i)=><span key={i} style={{background:COLORS.accent+"20",color:COLORS.accent,padding:"2px 8px",borderRadius:6,fontSize:12,fontWeight:700}}>{b}</span>)}</div>
</div>
{filteredSinnhaft.map(s=>(
<div key={s.id} onClick={()=>{setDetail(s.id);window.scrollTo({top:0,behavior:'smooth'})}} style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:14,cursor:"pointer",transition:"all .2s",display:"flex",alignItems:"center",gap:12}}>
<div style={{width:42,height:42,borderRadius:10,background:COLORS.accent+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:COLORS.accent,flexShrink:0}}>{s.buchstabe}</div>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:15,fontWeight:600,color:COLORS.text}}>{s.name}</div>
<div style={{fontSize:12,color:COLORS.textDim,marginTop:2}}>{s.kategorie} · {s.kernpunkte.length} Kernpunkte</div>
</div>
<div style={{color:COLORS.textDim,fontSize:16}}>→</div>
</div>
))}
{filteredSinnhaft.length===0 && <EmptyState sub={debouncedSearch?`Keine SINNHAFT-Einträge für "${debouncedSearch}" gefunden.`:"Keine Einträge verfügbar."}/>}
</div>}
{tab==="werkzeuge" && <div style={{display:"grid",gap:8}}>
<div style={{padding:"8px 0",borderBottom:"1px solid "+COLORS.border,marginBottom:4}}>
<span style={{fontSize:12,fontWeight:700,color:COLORS.purple,textTransform:"uppercase"}}> Scores ({filteredScores.length})</span>
</div>
{filteredScores.map(s=>(
<Card key={s.id} onClick={()=>{setDetail(s.id);window.scrollTo({top:0,behavior:'smooth'});}} style={{padding:14}}>
<Badge color={COLORS.purple} bg={COLORS.purple+"10"}>{s.kategorie}</Badge>
<div style={{fontSize:15,fontWeight:700,margin:"6px 0 4px"}}>{s.name}</div>
<div style={{fontSize:12,color:COLORS.textMuted}}>{s.items.length} Parameter</div>
</Card>
))}
<div style={{padding:"8px 0",borderBottom:"1px solid "+COLORS.border,margin:"12px 0 4px"}}>
<span style={{fontSize:12,fontWeight:700,color:COLORS.green,textTransform:"uppercase"}}> Checklisten / SOPs ({filteredChecklists.length})</span>
</div>
{filteredChecklists.map(cl=>{
const totalChecks = cl.items.reduce((sum,g)=>sum+g.checks.length,0);
return (
<Card key={cl.id} onClick={()=>{setDetail(cl.id);window.scrollTo({top:0,behavior:'smooth'});}} style={{padding:14}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:22}}><Icon name={cl.iconName} size={18} color={cl.color}/></span>
<div style={{flex:1}}>
<Badge color={COLORS.green} bg={COLORS.green+"10"}>{cl.kategorie}</Badge>
<div style={{fontSize:15,fontWeight:700,margin:"6px 0 4px"}}>{cl.name}</div>
<div style={{fontSize:12,color:COLORS.textMuted}}>{cl.items.length} Gruppen · {totalChecks} Checks</div>
</div>
</div>
</Card>
);
})}
<div style={{padding:"8px 0",borderBottom:"1px solid "+COLORS.border,margin:"12px 0 4px"}}>
<span style={{fontSize:12,fontWeight:700,color:COLORS.orange,textTransform:"uppercase"}}> ABCDE-Schema ({filteredAbcde.length})</span>
</div>
{filteredAbcde.map(a=>(
<Card key={a.letter} onClick={()=>{setDetail(a.letter);window.scrollTo({top:0,behavior:'smooth'});}} style={{padding:14}}>
<div style={{display:"flex",alignItems:"center",gap:12}}>
<div style={{width:40,height:40,borderRadius:10,background:a.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:a.color}}>{a.letter}</div>
<div>
<div style={{fontSize:15,fontWeight:700}}>{a.title}</div>
<div style={{fontSize:12,color:COLORS.textMuted}}>{a.checks.length} Checks · {a.interventions.length} Interventionen</div>
</div>
</div>
</Card>
))}
{filteredTools.length===0 && <EmptyState sub={debouncedSearch?`Keine Werkzeuge für "${debouncedSearch}" gefunden.`:"Keine Einträge verfügbar."}/>}
</div>}
{tab==="recht" && filteredRecht.map(b=>(<Card key={b.id} onClick={()=>{setDetail(b.id);window.scrollTo({top:0,behavior:'smooth'});}} style={{padding:16}}>
<Badge color="#f59e0b" bg="#f59e0b10">{b.kategorie}</Badge>
<div style={{fontSize:15,fontWeight:700,margin:"8px 0 4px"}}>{b.name}</div>
<div style={{fontSize:12,color:COLORS.textMuted}}>{b.schritte.length} Schritte</div>
</Card>))}
{tab==="recht" && filteredRecht.length===0 && <EmptyState sub={debouncedSearch?`Keine Rechtsgrundlagen für "${debouncedSearch}" gefunden.`:"Keine Einträge in dieser Kategorie."}/>}
</div>
);
}
// ═══════════════════════════════════════════════════════
// TOOLS: SCORES, CHECKLISTEN, ABCDE
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
// DATA: SINNHAFT ÜBERGABE-TRAINER SZENARIEN
// ═══════════════════════════════════════════════════════
const SINNHAFT_SCENARIOS = [
{id:1,title:"STEMI im Büro",
vignette:"62-jähriger Herr Schmidt, retrosternaler Druck seit 14:30 Uhr mit Ausstrahlung in den linken Arm. Kaltschweißig. Keine Allergien. VE: Hypertonie, Hypercholesterinämie. Medikation: Ramipril, Simvastatin. EKG: ST-Hebung in II, III, aVF.",
vitals:{rr:"95/60",hf:"110",spo2:"94%",af:"22",gcs:"15",bz:"145 mg/dl",temp:"36,8°C"},
massnahmen:["ASS 250 mg p.o. um 14:50","Heparin 5.000 IE i.v. um 14:52","Morphin 3 mg i.v. um 14:55 → NRS 9→5","O₂ 6 l/min","VEL 500 ml i.v.","Katheteralarmierung um 14:48"],
items:[
{text:"Herr Schmidt, 62 Jahre, männlich",letter:"I",hint:"Identifikation: Geschlecht, Name, Alter"},
{text:"V.a. inferiorer STEMI seit 14:30 Uhr, Schmerz in Ruhe entstanden",letter:"N1",hint:"Notfallereignis: WAS, WANN, WIE"},
{text:"C: RR 95/60, HF 110, kaltschweißig – hämodynamisch grenzwertig",letter:"N2",hint:"Notfallpriorität: ABCDE-Befunde"},
{text:"ASS 250 mg um 14:50, Heparin 5.000 IE um 14:52, Morphin 3 mg → NRS 9→5",letter:"H",hint:"Handlungen: Maßnahmen + Dosis + Uhrzeit + Wirkung"},
{text:"Allergien: keine. VE: Hypertonie, Hyperlipidämie. Med: Ramipril, Simvastatin",letter:"A",hint:"Anamnese: Allergien, VE, Medikation"},
{text:"Übernehmendes Team wiederholt: Herr Schmidt, 62J, inferiorer STEMI, hämodynamisch grenzwertig, Loading-Dose gegeben",letter:"F",hint:"Fazit: Übernehmendes Team wiederholt Kernpunkte"}
]},
{id:2,title:"Schlaganfall mit Aphasie",
vignette:"75-jährige Frau Weber, seit ca. 10:15 Uhr Sprachstörung + rechte Hemiparese. Vom Ehemann bemerkt. Allergien: Penicillin. VE: VHF, Hypertonie. Medikation: Apixaban, Amlodipin. Letzte Apixaban-Einnahme: heute Morgen 8 Uhr.",
vitals:{rr:"195/105",hf:"88 (arrhythmisch)",spo2:"97%",af:"16",gcs:"13 (A4 V3 M6)",bz:"110 mg/dl",temp:"36,5°C"},
massnahmen:["Urapidil 12,5 mg i.v. um 10:35 → RR 170/90","O₂ 4 l/min","i.v.-Zugang rechts kubital","Stroke Unit vorangemeldet um 10:30","Bewusst KEINE Lyse-Vorbereitung (DOAK eingenommen!)"],
items:[
{text:"Frau Weber, 75 Jahre, weiblich",letter:"I",hint:"Identifikation"},
{text:"V.a. Schlaganfall seit 10:15 Uhr, Aphasie + Hemiparese rechts, Ehemann als Zeuge",letter:"N1",hint:"Notfallereignis: WAS, WANN, WIE"},
{text:"D: GCS 13, Aphasie, Hemiparese rechts. C: RR 195/105, HF 88 arrhythmisch (VHF)",letter:"N2",hint:"Notfallpriorität: pathologische ABCDE-Befunde"},
{text:"Urapidil 12,5 mg um 10:35 → RR 170/90. Keine Lyse-Vorbereitung – Apixaban heute 8 Uhr!",letter:"H",hint:"Handlungen + bewusst unterlassene Maßnahmen"},
{text:"Allergie: Penicillin! VE: VHF, Hypertonie. DOAK: Apixaban – letzte Einnahme heute 8 Uhr",letter:"A",hint:"Anamnese: Allergie, VE, Medikation (DOAK-Zeitpunkt!)"},
{text:"Raum für Fragen: Lyse trotz DOAK? Idarucizumab verfügbar? CT-Angio geplant?",letter:"T",hint:"Teamfragen: offene klinische Fragen"}
]},
{id:3,title:"Kindliche Reanimation",
vignette:"2-jähriger Max, von Mutter im Kinderbett leblos aufgefunden um 7:30 Uhr. Mutter hat sofort 112 gerufen und Laien-CPR begonnen. Bei Eintreffen: keine Atmung, kein Puls. Keine bekannten VE. Aktuell Infekt seit 3 Tagen.",
vitals:{rr:"-",hf:"-",spo2:"-",af:"-",gcs:"3",bz:"n.m.",temp:"37,8°C"},
massnahmen:["CPR 15:2 seit 7:32 (Laien-CPR ab ca. 7:31)","IO-Zugang prox. Tibia rechts um 7:38","Epinephrin 0,1 mg IO um 7:39 (10 µg/kgKG)","Asystolie durchgehend","Intubation 4,0 ohne Cuff um 7:42"],
items:[
{text:"RUHE bitte – Start der Übergabe!",letter:"S",hint:"Start: Ruhe herstellen, Übergabe ankündigen"},
{text:"Max, männlich, 2 Jahre, geschätztes Gewicht 10 kg",letter:"I",hint:"Identifikation: Bei Kindern auch Gewicht!"},
{text:"Kreislaufstillstand seit ca. 7:30 Uhr, Ursache unklar, Infekt seit 3 Tagen, im Bett aufgefunden",letter:"N1",hint:"Notfallereignis: WAS, WANN, WO, mögliche Ursache"},
{text:"CPR 15:2 seit 25 min, Epi 0,1 mg IO, Intubation 4,0, durchgehend Asystolie, kein ROSC",letter:"H",hint:"Handlungen: CPR-Details + Medikamente gewichtsbezogen"},
{text:"Keine bekannten VE, Infekt seit 3 Tagen, keine Allergien, Impfstatus unklar",letter:"A",hint:"Anamnese: VE, aktueller Infekt, Impfstatus"},
{text:"Wiederholt: Max, 2J, 10kg, Kreislaufstillstand, Asystolie, CPR 25 min, kein ROSC",letter:"F",hint:"Fazit: Übernehmendes Team wiederholt"}
]},
{id:4,title:"Anaphylaxie nach Wespenstich",
vignette:"34-jährige Frau Keller, Wespenstich am rechten Arm vor 15 min im Garten. Rasch zunehmende Atemnot, Gesichtsschwellung, Urtikaria. Bekannte Wespengiftallergie, Epi-Pen vorhanden aber nicht benutzt.",
vitals:{rr:"75/40",hf:"140",spo2:"88%",af:"28",gcs:"14",bz:"130 mg/dl",temp:"36,5°C"},
massnahmen:["Epi 0,5 mg i.m. um 15:10 → RR 90/55, SpO₂ 92%","Epi 0,5 mg i.m. Repetition um 15:15 → RR 100/65","VEL 1000 ml Druckinfusion","Prednisolon 250 mg i.v.","Dimetinden 4 mg i.v.","O₂ 15 l/min"],
items:[
{text:"Frau Keller, 34 Jahre, weiblich",letter:"I",hint:"Identifikation"},
{text:"Anaphylaxie Grad III nach Wespenstich vor 15 min, bekannte Allergie",letter:"N1",hint:"Notfallereignis: WAS, WIE (Auslöser!), WANN"},
{text:"A: Gesichtsschwellung. B: AF 28, SpO₂ 88%→92%. C: RR 75/40→100/65, HF 140",letter:"N2",hint:"Notfallpriorität: A+B+C = Lebensbedrohung"},
{text:"2x Epi 0,5 mg i.m. (15:10+15:15), VEL 1L, Predni 250 mg, Dimetinden – Besserung nach 2. Epi",letter:"H",hint:"Handlungen: Epi-Repetition + Wirkung!"},
{text:"Wespengiftallergie bekannt! Epi-Pen vorhanden, nicht genutzt. Keine VE, keine Dauermed.",letter:"A",hint:"Anamnese: Allergie, Epi-Pen-Status"},
{text:"Fragen? Monitoring min. 24h (biphasische Reaktion!). Allergologische Nachbetreuung planen.",letter:"T",hint:"Teamfragen: biphasische Reaktion bedenken!"}
]},
{id:5,title:"Polytrauma nach PKW-Unfall",
vignette:"28-jähriger Mann, Beifahrer PKW, Frontalzusammenprall ca. 80 km/h, nicht angegurtet. Bewusstlos. Große Kopfplatzwunde, instabiler Thorax links, gespanntes Abdomen.",
vitals:{rr:"80/50",hf:"135",spo2:"85%",af:"32",gcs:"6 (A1 V2 M3)",bz:"160 mg/dl",temp:"35,2°C"},
massnahmen:["Kopfplatzwunde komprimiert um 16:05","Beckenschlinge um 16:07","RSI + Intubation 7,5 um 16:12","Thoraxentlastung li 2.ICR um 16:15 → SpO₂ 80→91%","VEL 1,5L Druckinfusion","Permissive Hypotension Ziel 80-90 sys"],
items:[
{text:"5-Second-Round: Patient instabil – RUHE für strukturierte Übergabe!",letter:"S",hint:"Start: Auch beim Polytrauma erst Ruhe!"},
{text:"Mann, ca. 28 Jahre, Name unbekannt",letter:"I",hint:"Identifikation: Unbekannt aktiv kommunizieren!"},
{text:"Polytrauma nach PKW-Frontal 80 km/h, nicht angegurtet, bewusstlos seit 16:00",letter:"N1",hint:"Notfallereignis: Unfallmechanismus entscheidend!"},
{text:"xC: Kopfblutung. A: intubiert. B: Thoraxentlastung li, SpO₂ 91%. C: RR 80/50. D: GCS 6. E: 35,2°C",letter:"N2",hint:"Notfallpriorität: xABCDE beim Trauma!"},
{text:"RSI, Thoraxentlastung 2.ICR li, Beckenschlinge, 1,5L VEL, permissive Hypotension 80-90",letter:"H",hint:"Handlungen: Alle Interventionen"},
{text:"Name unbekannt, keine Angehörigen, keine Medikamente gefunden, Polizei ermittelt",letter:"A",hint:"Anamnese: Unbekannt aktiv kommunizieren!"}
]},
{id:6,title:"Septischer Schock bei Pneumonie",
vignette:"71-jähriger Herr Braun, seit 5 Tagen Husten und Fieber. Verwirrt. VE: COPD Gold III, Heim-O₂ 2L, DM Typ 2. Medikation: Tiotropium, Metformin. Allergie: Sulfonamide.",
vitals:{rr:"82/48",hf:"128",spo2:"86%",af:"26",gcs:"12 (A3 V4 M5)",bz:"220 mg/dl",temp:"39,4°C"},
massnahmen:["O₂ 10 l/min → SpO₂ 91%","VEL 500 ml Bolus → RR 88/52","VEL weitere 500 ml laufend","Keine Antibiotika (erst Blutkulturen!)","Keine BZ-Therapie (Stress-Hyperglykämie)"],
items:[
{text:"Herr Braun, 71 Jahre, männlich",letter:"I",hint:"Identifikation"},
{text:"V.a. septischer Schock bei Pneumonie, 5 Tage Husten+Fieber, heute akut verwirrt",letter:"N1",hint:"Notfallereignis: Verdachtsdiagnose + Fokus"},
{text:"qSOFA 3/3. B: SpO₂ 86%, AF 26. C: RR 82/48, HF 128. D: GCS 12, verwirrt. E: 39,4°C",letter:"N2",hint:"Notfallpriorität: qSOFA integrieren!"},
{text:"O₂ → SpO₂ 91%. 1L VEL → kaum RR-Anstieg. KEINE Antibiotika (Blutkulturen!). KEIN Insulin.",letter:"H",hint:"Handlungen: Wirkung + bewusst Unterlassenes!"},
{text:"Allergie: Sulfonamide! COPD Gold III, Heim-O₂. DM Typ 2. Keine MRSA bekannt.",letter:"A",hint:"Anamnese: Allergie für Antibiotikawahl!"},
{text:"Wiederholt: Braun, 71J, sept. Schock Pneumonie, qSOFA 3, Volumen unzureichend",letter:"F",hint:"Fazit: Closed Loop → Katecholamine nötig?"}
]},
{id:7,title:"Postpartale Blutung",
vignette:"30-jährige Frau Müller, G2P2, 40. SSW. Spontangeburt im RTW um 18:45. Gesunder Junge, APGAR 9/10/10. Plazenta nach 20 min nicht geboren, zunehmende vaginale Blutung, ca. 800 ml.",
vitals:{rr:"90/55",hf:"125",spo2:"98%",af:"20",gcs:"15",bz:"95 mg/dl",temp:"36,8°C"},
massnahmen:["Uterusmassage seit 19:05","Kind angelegt (Atonieprophylaxe)","2x großlumiger i.v.-Zugang","VEL 1000 ml Druckinfusion","NA angefordert für Oxytocin"],
items:[
{text:"Mutter: Frau Müller, 30J. Kind: Junge, 40. SSW, APGAR 9/10/10",letter:"I",hint:"Identifikation: ZWEI Patienten!"},
{text:"Spontangeburt 18:45. Postpartale Blutung ca. 800 ml, Plazenta nicht geboren",letter:"N1",hint:"Notfallereignis: Geburt + Komplikation"},
{text:"C Mutter: RR 90/55, HF 125 – Schockzeichen! Blutverlust 800 ml",letter:"N2",hint:"Notfallpriorität: Mutter C = Schock!"},
{text:"Uterusmassage, Kind angelegt, VEL 1L. Plazenta NICHT manuell entfernt!",letter:"H",hint:"Handlungen: Unterlassenes benennen!"},
{text:"G2P2, unauffällige SS, keine Gerinnungsstörung, Rh-positiv",letter:"A",hint:"Anamnese: Gravida/Para, Rhesus"},
{text:"Fragen? Oxytocin bereit? Blutkonserven? Gynäkologie informiert?",letter:"T",hint:"Teamfragen: Eskalation planen"}
]},
{id:8,title:"Status epilepticus",
vignette:"45-jähriger Herr Fischer, bekannte Epilepsie. Generalisierter Krampfanfall seit 11:22 Uhr (>8 min). Medikation: Levetiracetam 1000 mg 2x/d. Gestern Medikament vergessen.",
vitals:{rr:"160/95",hf:"115",spo2:"89%",af:"8",gcs:"3 (krampfend)",bz:"110 mg/dl",temp:"37,5°C"},
massnahmen:["Midazolam 10 mg intranasal um 11:32 → Krampf sistiert nach 2 min","O₂ 10 l/min","Seitenlage nach Krampfende","i.v.-Zugang","Keine Beißkeile!"],
items:[
{text:"Herr Fischer, 45 Jahre, männlich",letter:"I",hint:"Identifikation"},
{text:"Status epilepticus seit 11:22 (>8 min), bekannte Epilepsie, gestern Medikament vergessen",letter:"N1",hint:"Notfallereignis: Dauer + Ursache"},
{text:"D: GCS 3→postiktal. B: AF 8, SpO₂ 89%→96%. C: RR 160/95, HF 115",letter:"N2",hint:"Notfallpriorität: D + B beachten!"},
{text:"Midazolam 10 mg nasal 11:32 → Krampf sistiert nach 2 min. Keine Beißkeile!",letter:"H",hint:"Handlungen: Benzo + Wirkung + Unterlassenes"},
{text:"Epilepsie bekannt, Levetiracetam 2x1000 mg – gestern vergessen. Keine Allergien.",letter:"A",hint:"Anamnese: Medikation + Compliance"},
{text:"Wiederholt: Fischer, 45J, Status epi, sistiert nach Midazolam, postiktal",letter:"F",hint:"Fazit: Closed Loop"}
]}
];
function Tools({navigate}) {
const [tab, setTab] = useState("scores");
const [detail, setDetail] = useState(null);
const [scoreValues, setScoreValues] = useState({});
const [checked, setChecked] = useState({});
const [abcdeStep, setAbcdeStep] = useState(0);
const [abcdeChecked, setAbcdeChecked] = useState({});
// Score calculator
const calcScore = (scoreId) => {
const s = SCORES_DATA.find(x=>x.id===scoreId);
if(!s) return 0;
let total = 0;
s.items.forEach((item,i) => {
const val = scoreValues[scoreId+"_"+i];
if(val !== undefined) total += val;
});
return total;
};
const selectScore = (scoreId, itemIdx, value) => {
setScoreValues(prev => ({...prev, [scoreId+"_"+itemIdx]: value}));
};
const resetScore = (scoreId) => {
const s = SCORES_DATA.find(x=>x.id===scoreId);
const newVals = {...scoreValues};
s.items.forEach((_,i) => { delete newVals[scoreId+"_"+i]; });
setScoreValues(newVals);
};
const toggleCheck = (listId, groupIdx, checkIdx) => {
const key = listId+"_"+groupIdx+"_"+checkIdx;
setChecked(prev => ({...prev, [key]: !prev[key]}));
};
const resetChecklist = (listId) => {
const newChecked = {...checked};
Object.keys(newChecked).forEach(k => { if(k.startsWith(listId+"_")) delete newChecked[k]; });
setChecked(newChecked);
};
const getChecklistProgress = (listId) => {
const cl = CHECKLISTS_DATA.find(x=>x.id===listId);
if(!cl) return {done:0,total:0};
let total = 0, done = 0;
cl.items.forEach((g,gi) => g.checks.forEach((_,ci) => {
total++;
if(checked[listId+"_"+gi+"_"+ci]) done++;
}));
return {done, total};
};
const toggleAbcde = (stepId, idx) => {
const key = "abcde_"+stepId+"_"+idx;
setAbcdeChecked(prev => ({...prev, [key]: !prev[key]}));
};
// ---- SCORE DETAIL VIEW ----
if(detail && tab==="scores") {
const s = SCORES_DATA.find(x=>x.id===detail);
if(!s) { setDetail(null); return null; }
const total = calcScore(s.id);
const allSelected = s.items.every((_,i) => scoreValues[s.id+"_"+i] !== undefined);
return (
<div className="fade-in">
<Button onClick={()=>{setDetail(null);resetScore(s.id);}} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card style={{marginBottom:16,background:`linear-gradient(135deg,${COLORS.purple}10,${COLORS.card})`,borderColor:COLORS.purple+"30"}}>
<Badge color={COLORS.purple}>{s.kategorie}</Badge>
<h2 style={{fontSize:20,fontWeight:700,margin:"10px 0 6px"}}>{s.name}</h2>
<div style={{fontSize:13,color:COLORS.textMuted,lineHeight:1.5}}>{s.beschreibung}</div>
</Card>
{s.items.map((item,i) => (
<Card key={i} style={{marginBottom:10,borderColor:scoreValues[s.id+"_"+i]!==undefined?COLORS.purple+"40":COLORS.border}}>
<div style={{fontSize:13,fontWeight:700,marginBottom:8,color:COLORS.text}}>{item.name}</div>
<div style={{display:"flex",flexDirection:"column",gap:6}}>
{item.options.map((opt,oi) => {
const isSelected = scoreValues[s.id+"_"+i] === opt.value;
return (
<div key={oi} onClick={()=>selectScore(s.id, i, opt.value)}
style={{padding:"8px 12px",borderRadius:8,cursor:"pointer",
background:isSelected?COLORS.purple+"20":"transparent",
border:`1.5px solid ${isSelected?COLORS.purple:COLORS.border}`,
color:isSelected?COLORS.purple:COLORS.textMuted,fontWeight:isSelected?600:400,fontSize:13,
transition:"all .15s"}}>
<span style={{float:"right",fontWeight:700,opacity:.7}}>{opt.value}</span>
{opt.label}
</div>
);
})}
</div>
</Card>
))}
<Card style={{marginTop:16,position:"sticky",bottom:16,
background:allSelected?(s.color(total)+"15"):COLORS.card,
borderColor:allSelected?s.color(total):COLORS.border,
boxShadow:`0 4px 20px ${(allSelected?s.color(total):COLORS.purple)}30`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<div style={{fontSize:12,fontWeight:700,color:COLORS.textDim,textTransform:"uppercase",letterSpacing:.5}}>Ergebnis</div>
<div style={{fontSize:32,fontWeight:800,color:allSelected?s.color(total):COLORS.textDim}}>{total}</div>
</div>
<Button onClick={()=>resetScore(s.id)} variant="ghost" size="sm" style={{fontSize:12}}>↻ Reset</Button>
</div>
{allSelected && <div style={{marginTop:8,fontSize:13,lineHeight:1.5,color:s.color(total),fontWeight:600,padding:"8px 12px",background:s.color(total)+"10",borderRadius:8}}>
{s.interpret(total)}
</div>}
{!allSelected && <div style={{marginTop:6,fontSize:12,color:COLORS.textDim}}>Bitte alle Felder ausfüllen.</div>}
</Card>
</div>
);
}
// ---- CHECKLIST DETAIL VIEW ----
if(detail && tab==="checklisten") {
const cl = CHECKLISTS_DATA.find(x=>x.id===detail);
if(!cl) { setDetail(null); return null; }
const prog = getChecklistProgress(cl.id);
return (
<div className="fade-in">
<Button onClick={()=>{setDetail(null);resetChecklist(cl.id);}} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card style={{marginBottom:16,background:`linear-gradient(135deg,${COLORS.green}10,${COLORS.card})`,borderColor:COLORS.green+"30"}}>
<div style={{fontSize:24,marginBottom:6}}><Icon name={cl.iconName} size={18} color={cl.color}/></div>
<h2 style={{fontSize:20,fontWeight:700,marginBottom:6}}>{cl.name}</h2>
<ProgressBar value={prog.done} max={prog.total} color={COLORS.green} h={6}/>
<div style={{fontSize:12,color:COLORS.textMuted,marginTop:6}}>{prog.done} / {prog.total} erledigt</div>
</Card>
{cl.items.map((group,gi) => (
<Card key={gi} style={{marginBottom:12}}>
<h4 style={{fontSize:14,fontWeight:700,marginBottom:10,color:COLORS.text,borderBottom:`1px solid ${COLORS.border}`,paddingBottom:8}}>{group.group}</h4>
{group.checks.map((check,ci) => {
const isDone = checked[cl.id+"_"+gi+"_"+ci];
return (
<div key={ci} onClick={()=>toggleCheck(cl.id, gi, ci)}
style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",cursor:"pointer",
borderBottom:ci<group.checks.length-1?`1px solid ${COLORS.border}30`:"none"}}>
<div style={{width:22,height:22,borderRadius:6,border:`2px solid ${isDone?COLORS.green:COLORS.border}`,
background:isDone?COLORS.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",
flexShrink:0,marginTop:1,transition:"all .15s"}}>
{isDone && <span style={{color:"#fff",fontSize:14,fontWeight:700}}>✓</span>}
</div>
<div style={{fontSize:13,lineHeight:1.5,color:isDone?COLORS.textDim:COLORS.text,
textDecoration:isDone?"line-through":"none"}}>{check}</div>
</div>
);
})}
</Card>
))}
<div style={{display:"flex",gap:8,marginTop:12}}>
<Button onClick={()=>resetChecklist(cl.id)} variant="ghost" style={{flex:1}}>↻ Zurücksetzen</Button>
</div>
</div>
);
}
// ---- ABCDE INTERACTIVE VIEW ----
if(tab==="abcde" && detail==="active") {
const step = ABCDE_DATA[abcdeStep];
const allStepChecked = step.checks.every((_,i) => abcdeChecked["abcde_"+step.id+"_c"+i]);
return (
<div className="fade-in">
<Button onClick={()=>{setDetail(null);setAbcdeStep(0);setAbcdeChecked({});}} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<div style={{display:"flex",gap:6,marginBottom:16}}>
{ABCDE_DATA.map((s,i) => (
<div key={s.id} onClick={()=>setAbcdeStep(i)}
style={{flex:1,padding:"8px 4px",borderRadius:10,textAlign:"center",cursor:"pointer",
background:i===abcdeStep?s.color+"20":i<abcdeStep?COLORS.green+"15":"transparent",
border:`2px solid ${i===abcdeStep?s.color:i<abcdeStep?COLORS.green:COLORS.border}`,
transition:"all .15s"}}>
<div style={{fontSize:18,fontWeight:800,color:i===abcdeStep?s.color:i<abcdeStep?COLORS.green:COLORS.textDim}}>{s.letter}</div>
</div>
))}
</div>
<Card style={{marginBottom:12,background:`linear-gradient(135deg,${step.color}10,${COLORS.card})`,borderColor:step.color+"40"}}>
<h2 style={{fontSize:20,fontWeight:700,color:step.color}}>{step.title}</h2>
</Card>
<Card style={{marginBottom:12}}>
<h4 style={{fontSize:13,fontWeight:700,color:step.color,marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}> Checkliste</h4>
{step.checks.map((check,i) => {
const isDone = abcdeChecked["abcde_"+step.id+"_c"+i];
return (
<div key={i} onClick={()=>toggleAbcde(step.id+"_c", i)}
style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",cursor:"pointer",
borderBottom:i<step.checks.length-1?`1px solid ${COLORS.border}30`:"none"}}>
<div style={{width:22,height:22,borderRadius:6,border:`2px solid ${isDone?step.color:COLORS.border}`,
background:isDone?step.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
{isDone && <span style={{color:"#fff",fontSize:14,fontWeight:700}}>✓</span>}
</div>
<div style={{fontSize:13,lineHeight:1.5,color:isDone?COLORS.textDim:COLORS.text}}>{check}</div>
</div>
);
})}
</Card>
<Card style={{marginBottom:12}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.blue,marginBottom:10,textTransform:"uppercase",letterSpacing:.5}}> Interventionen</h4>
{step.interventions.map((int,i) => (
<div key={i} style={{fontSize:13,lineHeight:1.5,color:COLORS.textMuted,padding:"4px 0 4px 12px",borderLeft:`2px solid ${COLORS.blue}30`}}>• {int}</div>
))}
</Card>
<Card style={{marginBottom:16,background:COLORS.accent+"08",borderColor:COLORS.accent+"30"}}>
<h4 style={{fontSize:13,fontWeight:700,color:COLORS.accent,marginBottom:8}}> Red Flags</h4>
{step.redflags.map((rf,i) => (
<div key={i} style={{fontSize:13,lineHeight:1.5,color:COLORS.accent,padding:"4px 0",fontWeight:600}}> {rf}</div>
))}
</Card>
<div style={{display:"flex",gap:8}}>
{abcdeStep > 0 && <Button onClick={()=>setAbcdeStep(abcdeStep-1)} variant="ghost" style={{flex:1}}>← {ABCDE_DATA[abcdeStep-1].letter}</Button>}
{abcdeStep < ABCDE_DATA.length-1 && <Button onClick={()=>setAbcdeStep(abcdeStep+1)} style={{flex:1,background:allStepChecked?COLORS.green:COLORS.accent,color:"#fff"}}>
{ABCDE_DATA[abcdeStep+1].letter} →
</Button>}
{abcdeStep===ABCDE_DATA.length-1 && <Button onClick={()=>{setDetail(null);setAbcdeStep(0);setAbcdeChecked({});}} style={{flex:1,background:COLORS.green,color:"#fff"}}>
✓ Abgeschlossen
</Button>}
</div>
</div>
);
}
// ---- MAIN TOOLS OVERVIEW ----
const tabs = [
{id:"scores",label:"Scores",iconName:"target",color:COLORS.blue,count:SCORES_DATA.length},
{id:"checklisten",label:"Checklisten",iconName:"clipboard",color:COLORS.green,count:CHECKLISTS_DATA.length},
{id:"abcde",label:"ABCDE",iconName:"shield",color:COLORS.accent,count:5}
];
return (
<div className="fade-in">
<Button onClick={()=>navigate("dashboard")} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<h2 style={{fontSize:22,fontWeight:700,marginBottom:16}}> Werkzeuge</h2>
<div style={{display:"flex",gap:4,marginBottom:20,flexWrap:"wrap"}}>
{tabs.map(t=>(
<button key={t.id} onClick={()=>{setTab(t.id);setDetail(null);}} style={{padding:"8px 16px",borderRadius:10,border:`1px solid ${tab===t.id?COLORS.purple:COLORS.border}`,background:tab===t.id?COLORS.purple+"15":"transparent",color:tab===t.id?COLORS.purple:COLORS.textMuted,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
<Icon name={t.iconName} size={18} color={t.color}/> {t.label} ({t.count})
</button>
))}
</div>
<div className="card-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
{tab==="scores" && SCORES_DATA.map(s=>(
<Card key={s.id} onClick={()=>setDetail(s.id)} style={{padding:16,cursor:"pointer"}}>
<Badge color={COLORS.purple} bg={COLORS.purple+"10"}>{s.kategorie}</Badge>
<div style={{fontSize:15,fontWeight:700,margin:"8px 0 4px"}}>{s.name}</div>
<div style={{fontSize:12,color:COLORS.textMuted}}>{s.items.length} Kriterien</div>
</Card>
))}
{tab==="checklisten" && CHECKLISTS_DATA.map(cl=>{
const prog = getChecklistProgress(cl.id);
return (
<Card key={cl.id} onClick={()=>setDetail(cl.id)} style={{padding:16,cursor:"pointer"}}>
<div style={{fontSize:24,marginBottom:4}}><Icon name={cl.iconName} size={18} color={cl.color}/></div>
<div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{cl.name}</div>
<div style={{fontSize:12,color:COLORS.textMuted,marginBottom:6}}>{cl.kategorie}</div>
{prog.done>0 && <ProgressBar value={prog.done} max={prog.total} color={COLORS.green} h={4}/>}
</Card>
);
})}
{tab==="abcde" && (
<Card onClick={()=>{setDetail("active");setAbcdeStep(0);setAbcdeChecked({});}} style={{padding:20,cursor:"pointer",gridColumn:"1 / -1"}}>
<div style={{display:"flex",gap:8,marginBottom:12}}>
{ABCDE_DATA.map(s=>(
<div key={s.id} style={{width:44,height:44,borderRadius:12,background:s.color+"15",border:`2px solid ${s.color}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
<span style={{fontSize:20,fontWeight:800,color:s.color}}>{s.letter}</span>
</div>
))}
</div>
<div style={{fontSize:17,fontWeight:700,marginBottom:4}}>ABCDE-Schema interaktiv</div>
<div style={{fontSize:13,color:COLORS.textMuted}}>Strukturierte Patientenuntersuchung durcharbeiten mit Checklisten, Interventionen und Red Flags pro Schritt.</div>
</Card>
)}
{tab==="uebergabe" && !ueScenario && <div style={{display:"grid",gap:8}}>
<div style={{padding:16,background:"#8b5cf608",borderRadius:12,border:"1px solid #8b5cf620",marginBottom:8}}>
<div style={{fontSize:15,fontWeight:700,color:"#8b5cf6",marginBottom:6}}> Interaktiver Übergabe-Trainer</div>
<div style={{fontSize:13,color:COLORS.textMuted,lineHeight:1.6}}>Ordnen Sie die Informationen dem richtigen SINNHAFT-Buchstaben zu. Trainieren Sie die strukturierte Übergabe an realistischen Szenarien.</div>
</div>
{SINNHAFT_SCENARIOS.map(sc=>(
<Card key={sc.id} onClick={()=>{setUeScenario(sc);setUeAssignments({});setUeRevealed(false);}} style={{cursor:"pointer"}}>
<div style={{display:"flex",alignItems:"center",gap:12}}>
<div style={{width:42,height:42,borderRadius:10,background:"#8b5cf615",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}> </div>
<div style={{flex:1}}>
<div style={{fontSize:15,fontWeight:600,color:COLORS.text}}>{sc.title}</div>
<div style={{fontSize:12,color:COLORS.textDim,marginTop:2}}>{sc.items.length} Informationen zuordnen</div>
</div>
<div style={{color:COLORS.textDim}}>→</div>
</div>
</Card>
))}
</div>}
{tab==="uebergabe" && ueScenario && (()=>{
const sc = ueScenario;
const letterDefs = [{id:"S",label:"Start",color:"#ef4444"},{id:"I",label:"Identifikation",color:"#f59e0b"},{id:"N1",label:"Notfallereignis",color:"#3b82f6"},{id:"N2",label:"Notfallpriorität",color:"#06b6d4"},{id:"H",label:"Handlungen",color:"#10b981"},{id:"A",label:"Anamnese",color:"#8b5cf6"},{id:"F",label:"Fazit",color:"#ec4899"},{id:"T",label:"Teamfragen",color:"#f97316"}];
const usedLetters = letterDefs.filter(l=>sc.items.some(it=>it.letter===l.id));
const allAssigned = sc.items.every((_,i)=>ueAssignments[i]!==undefined);
const score = ueRevealed ? sc.items.filter((_,i)=>ueAssignments[i]===sc.items[i].letter).length : 0;
return <div className="fade-in">
<Button onClick={()=>setUeScenario(null)} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Card style={{marginBottom:16}}>
<h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}> {sc.title}</h3>
<div style={{fontSize:13,color:COLORS.textMuted,lineHeight:1.7,marginBottom:12}}>{sc.vignette}</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:6,marginBottom:12}}>
{Object.entries(sc.vitals).map(([k,v])=>(
<div key={k} style={{background:COLORS.card,border:"1px solid "+COLORS.border,borderRadius:8,padding:"6px 10px",fontSize:12}}>
<span style={{color:COLORS.textDim,textTransform:"uppercase"}}>{k}: </span>
<span style={{color:COLORS.text,fontWeight:600}}>{v}</span>
</div>
))}
</div>
<div style={{fontSize:12,color:COLORS.textDim}}>
<strong style={{color:COLORS.text}}>Durchgeführte Maßnahmen:</strong>
{sc.massnahmen.map((m,i)=><div key={i} style={{paddingLeft:8,marginTop:2}}>• {m}</div>)}
</div>
</Card>
<Card style={{marginBottom:16}}>
<h4 style={{fontSize:14,fontWeight:700,color:"#8b5cf6",marginBottom:4}}>Ordnen Sie jede Information dem richtigen SINNHAFT-Buchstaben zu:</h4>
<div style={{fontSize:12,color:COLORS.textDim,marginBottom:16}}>Tippen Sie auf den passenden Buchstaben für jede Aussage.</div>
{sc.items.map((item,idx)=>{
const assigned = ueAssignments[idx];
const isCorrect = ueRevealed && assigned === item.letter;
const isWrong = ueRevealed && assigned !== undefined && assigned !== item.letter;
const assignedDef = usedLetters.find(l=>l.id===assigned);
return <div key={idx} style={{marginBottom:12,padding:12,borderRadius:10,border:"1px solid "+(isCorrect?COLORS.green+"60":isWrong?COLORS.accent+"60":COLORS.border),background:isCorrect?COLORS.green+"08":isWrong?COLORS.accent+"08":"transparent",transition:"all .2s"}}>
<div style={{fontSize:14,color:COLORS.text,marginBottom:8,lineHeight:1.5,fontStyle:"italic"}}>"{item.text}"</div>
<div style={{display:"flex",flexWrap:"wrap",gap:4}}>
{usedLetters.map(l=>(
<button key={l.id} onClick={()=>{if(!ueRevealed) setUeAssignments(prev=>({...prev,[idx]:l.id}));}}
style={{padding:"4px 10px",borderRadius:6,border:"1px solid "+(assigned===l.id?l.color:COLORS.border),background:assigned===l.id?l.color+"20":"transparent",color:assigned===l.id?l.color:COLORS.textMuted,fontSize:11,fontWeight:600,cursor:ueRevealed?"default":"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .15s"}}>
{l.id==="N1"?"N₁ Ereignis":l.id==="N2"?"N₂ Priorität":l.id+" "+l.label}
</button>
))}
</div>
{ueRevealed && isWrong && <div style={{marginTop:6,fontSize:12,color:COLORS.accent}}>✗ Richtig: <strong>{usedLetters.find(l=>l.id===item.letter)?.label||item.letter}</strong> – {item.hint}</div>}
{ueRevealed && isCorrect && <div style={{marginTop:6,fontSize:12,color:COLORS.green}}>✓ Korrekt! {item.hint}</div>}
</div>;
})}
{!ueRevealed && <Button onClick={()=>setUeRevealed(true)} disabled={!allAssigned} style={{marginTop:8,width:"100%",opacity:allAssigned?1:0.5}}>
{allAssigned?"Auswertung anzeigen":"Bitte alle Informationen zuordnen"}
</Button>}
{ueRevealed && <div style={{marginTop:16,padding:16,borderRadius:12,background:score===sc.items.length?COLORS.green+"15":score>=sc.items.length-2?"#f59e0b15":COLORS.accent+"15",border:"1px solid "+(score===sc.items.length?COLORS.green+"40":score>=sc.items.length-2?"#f59e0b40":COLORS.accent+"40"),textAlign:"center"}}>
<div style={{fontSize:36,marginBottom:8}}>{score===sc.items.length?" ":score>=sc.items.length-2?" ":" "}</div>
<div style={{fontSize:20,fontWeight:700,color:score===sc.items.length?COLORS.green:score>=sc.items.length-2?"#f59e0b":COLORS.accent}}>
{score}/{sc.items.length} richtig
</div>
<div style={{fontSize:13,color:COLORS.textMuted,marginTop:4}}>
{score===sc.items.length?"Perfekte Übergabe!":score>=sc.items.length-2?"Fast perfekt – kleine Korrekturen oben.":"Schau dir die Korrekturen oben an und versuch es nochmal."}
</div>
<div style={{display:"flex",gap:8,marginTop:12,justifyContent:"center",flexWrap:"wrap"}}>
<Button onClick={()=>{setUeAssignments({});setUeRevealed(false);}}>Nochmal versuchen</Button>
<Button onClick={()=>setUeScenario(null)} variant="ghost">Anderes Szenario</Button>
</div>
</div>}
</Card>
</div>;
})()}
</div>
</div>
);
}
// ═══════════════════════════════════════════════════════
// GESAMTPRÜFUNG
// ═══════════════════════════════════════════════════════
function Exam({navigate,stats,setStats}) {
const [started, setStarted] = useState(false);
const [questions, setQuestions] = useState([]);
const [qi, setQi] = useState(0);
const [selected, setSelected] = useState(null);
const [score, setScore] = useState(0);
const [done, setDone] = useState(false);
const [answers, setAnswers] = useState([]);
const [timeLeft, setTimeLeft] = useState(40*60);
// Exam case state
const [examCase, setExamCase] = useState(null);
const [casePhase, setCasePhase] = useState(null); // null, "explore", "diagnose", "treat"
const [caseRevealed, setCaseRevealed] = useState({});
const [caseDiagSelected, setCaseDiagSelected] = useState(null);
const [caseDiagCorrect, setCaseDiagCorrect] = useState(null);
const [caseTreatStep, setCaseTreatStep] = useState(0);
const [caseTreatSelected, setCaseTreatSelected] = useState(null);
const [caseTreatScore, setCaseTreatScore] = useState(0);
const [caseDiagScore, setCaseDiagScore] = useState(0);
// Position where case appears (after question 15)
const CASE_AFTER_Q = 15;
const startExam = ()=>{
const shuffled = [...QUIZ_QUESTIONS].sort(()=>Math.random()-.5).slice(0,25);
const rc = EXAM_CASES[Math.floor(Math.random()*EXAM_CASES.length)];
setExamCase(rc);
setQuestions(shuffled);setQi(0);setSelected(null);setScore(0);setDone(false);setAnswers([]);
setTimeLeft(40*60);setStarted(true);
setCasePhase(null);setCaseRevealed({});setCaseDiagSelected(null);setCaseDiagCorrect(null);
setCaseTreatStep(0);setCaseTreatSelected(null);setCaseTreatScore(0);setCaseDiagScore(0);
};
const [timerWarning, setTimerWarning] = useState(null);
useEffect(()=>{
if(!started||done) return;
const t = setInterval(()=>{
setTimeLeft(tl=>{
if(tl<=1){setDone(true);return 0;}
if(tl===600) setTimerWarning("10 Minuten verbleibend");
if(tl===300) setTimerWarning("5 Minuten verbleibend!");
if(tl===60) setTimerWarning("Letzte Minute!");
return tl-1;
});
},1000);
return ()=>clearInterval(t);
},[started,done]);
useEffect(()=>{
if(!timerWarning) return;
const t = setTimeout(()=>setTimerWarning(null),3000);
return ()=>clearTimeout(t);
},[timerWarning]);
const answer = (idx)=>{
if(selected!==null) return;
setSelected(idx);
const correct = idx===questions[qi].correct;
if(correct) {setScore(s=>s+1);haptic("success");}
else haptic("error");
setAnswers(a=>[...a,{qId:questions[qi].id,selected:idx,correct,type:"quiz"}]);
};
const nextQ = ()=>{
// After question CASE_AFTER_Q, switch to case phase
if(qi+1===CASE_AFTER_Q && casePhase===null) {
setCasePhase("explore");
return;
}
if(qi+1>=questions.length){
finishExam();
return;
}
setQi(qi+1);setSelected(null);
};
const finishExam = ()=>{
const totalScore = score + caseDiagScore + caseTreatScore;
const linkedCase = CASES.find(c=>c.id===examCase.caseId);
const treatSteps = linkedCase ? linkedCase.steps.length : 0;
const totalQuestions = questions.length + 1 + treatSteps;
setDone(true);
setStats(s=>({...s,examScores:[...s.examScores,{date:new Date().toISOString(),score:totalScore,total:totalQuestions,pct:Math.round(totalScore/totalQuestions*100)}]}));
};
const mm = Math.floor(timeLeft/60);
const ss = timeLeft%60;
const timerColor = timeLeft<=60?COLORS.accent:timeLeft<=300?COLORS.orange:timeLeft<=600?"#eab308":COLORS.textMuted;
const timerBadge = <Badge color={timerColor}><span style={timeLeft<=300?{animation:timeLeft<=60?"pulse 0.8s infinite":"pulse 2s infinite"}:{}}>{String(mm).padStart(2,"0")}:{String(ss).padStart(2,"0")}</span></Badge>;
const timerToast = timerWarning ? (
<div className="fade-in" style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:9998,background:timeLeft<=60?COLORS.accent:timeLeft<=300?COLORS.orange:"#eab308",color:"#fff",padding:"10px 24px",borderRadius:12,fontSize:14,fontWeight:700,boxShadow:"0 4px 24px rgba(0,0,0,0.5)",pointerEvents:"none"}}>
{timerWarning}
</div>
) : null;
// ─── START SCREEN ───
if(!started) {
const bprNames = {};
BPR.forEach(b=>bprNames[b.id]=b.name);
LEITSYMPTOME.forEach(l=>bprNames[l.id]=l.name);
return (
<div className="fade-in" style={{textAlign:"center",paddingTop:40}}>
<div style={{fontSize:64,marginBottom:16}}> </div>
<h2 style={{fontSize:28,fontWeight:700}}>Prüfung</h2>
<p style={{color:COLORS.textMuted,margin:"12px 0 24px",maxWidth:540,marginLeft:"auto",marginRight:"auto",lineHeight:1.7}}>
25 Quiz-Fragen aus allen Kategorien + 1 Prüfungsfall mit Erkundung, Diagnosestellung und Behandlung. Zeitlimit: 40 Minuten. Bestehensgrenze: 70%.
</p>
<div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
<div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:"14px 20px",textAlign:"center"}}>
<div style={{fontSize:24,marginBottom:4}}> </div>
<div style={{fontSize:13,fontWeight:700,color:COLORS.blue}}>25 Quiz-Fragen</div>
<div style={{fontSize:11,color:COLORS.textDim}}>Alle Kategorien</div>
</div>
<div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:"14px 20px",textAlign:"center"}}>
<div style={{fontSize:24,marginBottom:4}}> </div>
<div style={{fontSize:13,fontWeight:700,color:COLORS.purple}}>1 Prüfungsfall</div>
<div style={{fontSize:11,color:COLORS.textDim}}>Erkundung → Diagnose → Behandlung</div>
</div>
<div style={{background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:"14px 20px",textAlign:"center"}}>
<div style={{fontSize:24,marginBottom:4}}> </div>
<div style={{fontSize:13,fontWeight:700,color:COLORS.orange}}>40 Minuten</div>
<div style={{fontSize:11,color:COLORS.textDim}}>Zeitlimit</div>
</div>
</div>
<div style={{display:"flex",gap:12,justifyContent:"center"}}>
<Button onClick={()=>navigate("dashboard")} variant="ghost"><Icon name="arrowLeft" size={14}/> Zurück</Button>
<Button onClick={startExam} size="lg">Prüfung starten</Button>
</div>
</div>
);}
// ─── DONE SCREEN ───
if(done) {
const linkedCase = CASES.find(c=>c.id===examCase.caseId);
const treatSteps = linkedCase ? linkedCase.steps.length : 0;
const totalScore = score + caseDiagScore + caseTreatScore;
const totalQuestions = questions.length + 1 + treatSteps;
const pct = Math.round(totalScore/totalQuestions*100);
const passed = pct >= 70;
const bprNames = {};
BPR.forEach(b=>bprNames[b.id]=b.name);
LEITSYMPTOME.forEach(l=>bprNames[l.id]=l.name);
return (
<div className="fade-in" style={{textAlign:"center",paddingTop:20}}>
<ScoreCircle pct={pct} size={160}/>
<h2 style={{fontSize:28,fontWeight:700,color:passed?COLORS.green:COLORS.accent,marginTop:20}}>{passed?"Bestanden!":"Nicht bestanden"}</h2>
<p style={{color:COLORS.textMuted,marginTop:8}}>{totalScore} von {totalQuestions} richtig · Bestehensgrenze: 70%</p>
<div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap",margin:"16px 0"}}>
<div style={{textAlign:"center",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:"12px 20px"}}>
<div style={{fontSize:11,color:COLORS.textDim}}>Quiz-Fragen</div>
<div style={{fontSize:20,fontWeight:700,color:COLORS.blue}}>{score}/{questions.length}</div>
</div>
<div style={{textAlign:"center",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:"12px 20px"}}>
<div style={{fontSize:11,color:COLORS.textDim}}>Diagnose</div>
<Badge color={caseDiagScore?COLORS.green:COLORS.accent}>{caseDiagScore?"✓ Korrekt":"✗ Falsch"}</Badge>
</div>
<div style={{textAlign:"center",background:COLORS.card,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:"12px 20px"}}>
<div style={{fontSize:11,color:COLORS.textDim}}>Behandlung</div>
<div style={{fontSize:20,fontWeight:700,color:COLORS.purple}}>{caseTreatScore}/{treatSteps}</div>
</div>
</div>
<div style={{maxWidth:600,margin:"20px auto 0",textAlign:"left"}}>
<h3 style={{fontSize:16,fontWeight:700,marginBottom:12}}>Ergebnisübersicht:</h3>
{answers.map((a,i)=>{
const isCase = a.type==="case";
const label = isCase ? a.label : (questions.find(q2=>q2.id===a.qId)||{}).q;
return (
<div key={i} style={{padding:"10px 14px",background:a.correct?COLORS.green+"10":COLORS.accent+"10",border:`1px solid ${a.correct?COLORS.green:COLORS.accent}20`,borderRadius:8,marginBottom:6,fontSize:13}}>
<span style={{color:a.correct?COLORS.green:COLORS.accent,fontWeight:700}}>{a.correct?"✓":"✗"}</span>
{isCase && <span style={{marginLeft:6,fontSize:10,fontWeight:700,color:COLORS.purple,background:COLORS.purple+"15",padding:"1px 6px",borderRadius:4}}>FALL</span>}
<span style={{marginLeft:8,color:COLORS.textMuted}}>{(label||"").substring(0,80)}{(label||"").length>80?"...":""}</span>
</div>
);
})}
</div>
<div style={{display:"flex",justifyContent:"center",gap:12,marginTop:24}}>
<Button onClick={()=>{setStarted(false);navigate("dashboard");}} variant="secondary">Dashboard</Button>
<Button onClick={()=>{setStarted(false);startExam();}}>Neue Prüfung</Button>
</div>
</div>
);
}
// ─── CASE PHASE (explore → diagnose → treat) ───
if(casePhase!==null && examCase) {
const ec = examCase;
const linkedCase = CASES.find(c=>c.id===ec.caseId);
const treatSteps = linkedCase ? linkedCase.steps : [];
const bprNames = {};
BPR.forEach(b=>bprNames[b.id]=b.name);
LEITSYMPTOME.forEach(l=>bprNames[l.id]=l.name);
// EXPLORE
if(casePhase==="explore") {
const exploreCategories = [
{key:"xabcde",iconName:"shield",label:"(x)ABCDE-Schema",color:"#ef4444",
render:()=>(
<div style={{display:"flex",flexDirection:"column",gap:8}}>
{[{k:"c",l:"<C> Kritische Blutung"},{k:"a",l:"A – Atemweg"},{k:"b",l:"B – Breathing"},{k:"c2",l:"C – Circulation"},{k:"d",l:"D – Disability"},{k:"e",l:"E – Exposure"}].map(item=>(
<div key={item.k} style={{background:COLORS.bg,padding:"8px 12px",borderRadius:8,border:`1px solid ${COLORS.border}`}}>
<div style={{fontSize:12,fontWeight:700,color:"#ef4444",marginBottom:4}}>{item.l}</div>
<LinkedText text={ec.xabcde[item.k]} navigate={navigate} style={{fontSize:13,color:COLORS.text,lineHeight:1.6}}/>
</div>
))}
</div>
)},
{key:"vitalzeichen",iconName:"heartPulse",label:"Vitalzeichen messen",color:COLORS.blue,
render:()=><div style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}>{ec.findings.vitalzeichen.split("|").map((v,i)=><div key={i} style={{padding:"4px 0",borderBottom:i<ec.findings.vitalzeichen.split("|").length-1?`1px solid ${COLORS.border}`:"none"}}>{v.trim()}</div>)}</div>},
{key:"anamnese",iconName:"clipboard",label:"Anamnese (SAMPLER)",color:COLORS.green,
render:()=><LinkedText text={ec.findings.anamnese} navigate={navigate} style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}/>},
{key:"inspektion",iconName:"eye",label:"Inspektion",color:COLORS.yellow,
render:()=><LinkedText text={ec.findings.inspektion} navigate={navigate} style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}/>},
{key:"auskultation",iconName:"ear",label:"Auskultation",color:"#8b5cf6",
render:()=><LinkedText text={ec.findings.auskultation} navigate={navigate} style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}/>},
{key:"ekg",iconName:"activity",label:"12-Kanal-EKG",color:COLORS.accent,
render:()=>{const ekgId=CASE_EKG_MAP[ec.caseId]||ec.findings.ekgType;const ekgData=ekgId?EKG_DATA.find(e=>e.id===ekgId):null;return(<div>{ekgId&&<div style={{marginBottom:10}}><EcgDiagram ekgId={ekgId}/></div>}<LinkedText text={ec.findings.ekg} navigate={navigate} style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}/>{ekgData&&ekgData.images&&<div style={{marginTop:12}}><EkgImageViewer images={ekgData.images}/></div>}</div>);}},
{key:"neurologie",iconName:"neurology",label:"Neurologie / Pupillen",color:"#06b6d4",
render:()=><LinkedText text={ec.findings.neurologie} navigate={navigate} style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}/>},
{key:"palpation",iconName:"hand",label:"Palpation / Pulsstatus",color:"#f97316",
render:()=><LinkedText text={ec.findings.palpation} navigate={navigate} style={{fontSize:13,lineHeight:1.8,color:COLORS.text}}/>},
];
if(ec.spezial && casePhase !== "explore") {
exploreCategories.push({key:"spezial",iconName:"star",label:ec.spezial.name,color:"#eab308",
render:()=><pre style={{fontSize:13,lineHeight:1.8,color:COLORS.text,fontFamily:"'DM Sans',sans-serif",whiteSpace:"pre-wrap"}}>{ec.spezial.result}</pre>});
}
const revealedCount = Object.keys(caseRevealed).length;
return (
<div className="fade-in">
{timerToast}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
<Badge color={COLORS.purple}> Prüfungsfall – Erkundung</Badge>
<div style={{display:"flex",gap:8}}>{timerBadge}<Badge color={COLORS.blue}>{score} Quiz-Punkte</Badge></div>
</div>
<Card style={{marginBottom:16,background:`linear-gradient(135deg,${COLORS.purple}08,${COLORS.card})`,borderColor:COLORS.purple+"30"}}>
<Badge color={COLORS.accent}> Einsatzmeldung</Badge>
<h3 style={{fontSize:17,fontWeight:700,margin:"6px 0",lineHeight:1.4}}>{ec.meldung}</h3>
</Card>
<Card style={{marginBottom:16,background:COLORS.bg,borderColor:COLORS.border}}>
<div style={{fontSize:11,fontWeight:700,color:COLORS.purple,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Eintreffen am Einsatzort</div>
<p style={{fontSize:14,lineHeight:1.7,color:COLORS.text}}>{ec.ankunft}</p>
</Card>
<h3 style={{fontSize:15,fontWeight:700,marginBottom:12}}> Erkundung – was möchten Sie tun?</h3>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
{exploreCategories.map(cat=>{
const isRevealed = caseRevealed[cat.key];
return (
<div key={cat.key} onClick={()=>{haptic("light");setCaseRevealed(r=>({...r,[cat.key]:true}))}} style={{background:isRevealed?cat.color+"08":COLORS.card,border:`2px solid ${isRevealed?cat.color+"40":COLORS.border}`,borderRadius:14,padding:14,cursor:"pointer",transition:"all .3s"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:isRevealed?10:0}}>
<span style={{fontSize:20}}><Icon name={cat.iconName} size={18} color={cat.color}/></span>
<span style={{fontSize:14,fontWeight:700,color:isRevealed?cat.color:COLORS.text}}>{cat.label}</span>
{isRevealed&&<span style={{marginLeft:"auto",fontSize:11,color:COLORS.green}}>✓</span>}
{!isRevealed&&<span style={{marginLeft:"auto",fontSize:11,color:COLORS.textDim}}>tippen</span>}
</div>
{isRevealed && <div style={{paddingTop:8,borderTop:`1px solid ${cat.color}20`}}>{cat.render()}</div>}
</div>
);
})}
</div>
<div style={{textAlign:"center",marginTop:24}}>
<Button onClick={()=>setCasePhase("diagnose")} size="lg" style={{background:`linear-gradient(135deg,${COLORS.purple},#7c3aed)`,fontSize:16,padding:"14px 32px"}}>
Verdachtsdiagnose stellen
</Button>
<p style={{fontSize:12,color:COLORS.textDim,marginTop:8}}>{revealedCount} von {exploreCategories.length} erkundet</p>
</div>
</div>
);
}
// DIAGNOSE
if(casePhase==="diagnose") {
const submitDiag = (idx)=>{
if(caseDiagSelected!==null) return;
setCaseDiagSelected(idx);
const correct = idx===ec.correctDiagnose;
setCaseDiagCorrect(correct);
if(correct) {setCaseDiagScore(1);haptic("success");}
else haptic("error");
setAnswers(a=>[...a,{type:"case",label:"Diagnose: "+ec.diagnoseOptionen[ec.correctDiagnose],selected:idx,correct}]);
};
return (
<div className="fade-in">
{timerToast}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
<Button onClick={()=>setCasePhase("explore")} variant="ghost" size="sm"><Icon name="arrowLeft" size={14}/> Zurück</Button>
<div style={{display:"flex",gap:8}}><Badge color={COLORS.purple}>Verdachtsdiagnose</Badge>{timerBadge}</div>
</div>
<Card style={{marginBottom:16,background:`linear-gradient(135deg,${COLORS.purple}08,${COLORS.card})`,borderColor:COLORS.purple+"30"}}>
<div style={{fontSize:11,fontWeight:700,color:COLORS.purple,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}> Einsatzmeldung</div>
<p style={{fontSize:14,color:COLORS.textMuted}}>{ec.meldung}</p>
</Card>
<Card>
<h3 style={{fontSize:17,fontWeight:700,marginBottom:16,lineHeight:1.4}}>Welche Verdachtsdiagnose stellen Sie?</h3>
<div style={{display:"flex",flexDirection:"column",gap:10}}>
{ec.diagnoseOptionen.map((o,i)=>{
let bg=COLORS.bg,border=COLORS.border,color=COLORS.text;
let anim="";
if(caseDiagSelected!==null){
if(i===ec.correctDiagnose){bg=COLORS.green+"20";border=COLORS.green;color=COLORS.green;anim="correct-pop";}
else if(i===caseDiagSelected&&i!==ec.correctDiagnose){bg=COLORS.accent+"20";border=COLORS.accent;color=COLORS.accent;anim="shake-anim";}
}
return(
<div key={i} className={anim} onClick={()=>submitDiag(i)} style={{padding:"14px 18px",background:bg,border:`2px solid ${border}`,borderRadius:12,cursor:caseDiagSelected===null?"pointer":"default",transition:"all .2s",color,fontWeight:caseDiagSelected!==null&&i===ec.correctDiagnose?700:400,position:"relative",overflow:"hidden"}}>
<span style={{fontWeight:700,marginRight:10,opacity:.5}}>{String.fromCharCode(65+i)}</span>{o}
{caseDiagSelected===i&&i===ec.correctDiagnose&&<ConfettiBurst active={true}/>}
</div>
);
})}
</div>
{caseDiagSelected!==null && (
<div style={{marginTop:16}}>
<Card style={{background:caseDiagCorrect?COLORS.green+"10":COLORS.accent+"10",borderColor:(caseDiagCorrect?COLORS.green:COLORS.accent)+"30"}}>
<div style={{fontSize:13,lineHeight:1.6,color:COLORS.textMuted}}>
<strong style={{color:caseDiagCorrect?COLORS.green:COLORS.accent}}>{caseDiagCorrect?"✓ Korrekte Diagnose!":"✗ Falsche Diagnose"}</strong>
<div style={{marginTop:8}}><LinkedText text={ec.diagnoseErklaerung} navigate={navigate}/></div>
</div>
</Card>
<div style={{marginTop:16,textAlign:"center"}}>
<Button onClick={()=>{setCasePhase("treat");setCaseTreatStep(0);setCaseTreatSelected(null);}} size="lg">
Weiter zur Behandlung →
</Button>
</div>
</div>
)}
</Card>
</div>
);
}
// TREAT
if(casePhase==="treat") {
if(treatSteps.length===0) {setCasePhase(null);setQi(CASE_AFTER_Q);setSelected(null);return null;}
const ts = treatSteps[caseTreatStep];
const answerTreat = (idx)=>{
if(caseTreatSelected!==null) return;
setCaseTreatSelected(idx);
const correct = idx===ts.correct;
if(correct) {setCaseTreatScore(s=>s+1);haptic("success");}
else haptic("error");
setAnswers(a=>[...a,{type:"case",label:ts.q,selected:idx,correct}]);
};
const nextTreat = ()=>{
if(caseTreatStep+1>=treatSteps.length){
// Case done → back to quiz
setCasePhase(null);setQi(CASE_AFTER_Q);setSelected(null);
return;
}
setCaseTreatStep(caseTreatStep+1);setCaseTreatSelected(null);
};
return (
<div className="fade-in">
{timerToast}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
<Badge color={COLORS.purple}> Prüfungsfall – Behandlung {caseTreatStep+1}/{treatSteps.length}</Badge>
<div style={{display:"flex",gap:8}}>{timerBadge}<Badge color={COLORS.blue}>{score} Quiz</Badge></div>
</div>
<Card style={{marginBottom:12,background:`linear-gradient(135deg,${caseDiagCorrect?COLORS.green:COLORS.accent}08,${COLORS.card})`,borderColor:(caseDiagCorrect?COLORS.green:COLORS.accent)+"30",padding:"12px 16px"}}>
<div style={{fontSize:12,color:caseDiagCorrect?COLORS.green:COLORS.accent,fontWeight:700}}>{caseDiagCorrect?"✓":"✗"} Diagnose: {ec.diagnoseOptionen[ec.correctDiagnose]}</div>
</Card>
<ProgressBar value={caseTreatStep+1} max={treatSteps.length} color={COLORS.purple} h={4}/>
<Card style={{marginTop:16}}>
<h3 style={{fontSize:16,fontWeight:600,marginBottom:16,lineHeight:1.5}}>{ts.q}</h3>
<div style={{display:"flex",flexDirection:"column",gap:10}}>
{ts.opts.map((o,i)=>{
let bg=COLORS.bg,border=COLORS.border,color=COLORS.text;
let anim="";
if(caseTreatSelected!==null){
if(i===ts.correct){bg=COLORS.green+"20";border=COLORS.green;color=COLORS.green;anim="correct-pop";}
else if(i===caseTreatSelected){bg=COLORS.accent+"20";border=COLORS.accent;color=COLORS.accent;anim="shake-anim";}
}
return(
<div key={i} className={anim} onClick={()=>answerTreat(i)} style={{padding:"12px 16px",background:bg,border:`2px solid ${border}`,borderRadius:12,cursor:caseTreatSelected===null?"pointer":"default",transition:"all .2s",color,fontWeight:caseTreatSelected!==null&&i===ts.correct?700:400}}>
<span style={{fontWeight:700,marginRight:10,opacity:.5}}>{String.fromCharCode(65+i)}</span>{o}
</div>
);
})}
</div>
{caseTreatSelected!==null && (
<div style={{marginTop:16}}>
<Card style={{background:COLORS.blue+"10",borderColor:COLORS.blue+"30"}}>
<div style={{fontSize:13,lineHeight:1.6,color:COLORS.textMuted}}>
<strong style={{color:COLORS.blue}}>Erläuterung:</strong> <LinkedText text={ts.explanation} navigate={navigate}/>
</div>
</Card>
<div style={{marginTop:12,display:"flex",justifyContent:"flex-end"}}>
<Button onClick={nextTreat}>{caseTreatStep+1>=treatSteps.length?"Weiter zu Quiz-Fragen →":"Nächste Frage →"}</Button>
</div>
</div>
)}
</Card>
</div>
);
}
}
// ─── QUIZ PHASE ───
const q = questions[qi];
const linkedCase = examCase ? CASES.find(c=>c.id===examCase.caseId) : null;
const treatLen = linkedCase ? linkedCase.steps.length : 0;
const totalItems = questions.length + 1 + treatLen;
const currentItem = casePhase===null&&qi>=CASE_AFTER_Q ? CASE_AFTER_Q + 1 + treatLen + (qi - CASE_AFTER_Q + 1) : qi + 1;
return (
<div className="fade-in">
{timerToast}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
<Badge color={COLORS.blue}>Frage {qi+1}/{questions.length}</Badge>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<Badge color={COLORS.green}>{score} richtig</Badge>
{timerBadge}
</div>
</div>
<ProgressBar value={currentItem} max={totalItems} color={COLORS.blue} h={4}/>
<Card style={{marginTop:16}}>
<Badge color={COLORS.textMuted}>{q.cat}</Badge>
<h3 style={{fontSize:17,fontWeight:600,margin:"14px 0 20px",lineHeight:1.5}}>{q.q}</h3>
<div style={{display:"flex",flexDirection:"column",gap:10}}>
{q.opts.map((o,i)=>{
let bg=COLORS.bg,border=COLORS.border,color=COLORS.text;
let anim="";
if(selected!==null){
if(i===q.correct){bg=COLORS.green+"20";border=COLORS.green;color=COLORS.green;anim="correct-pop";}
else if(i===selected&&i!==q.correct){bg=COLORS.accent+"20";border=COLORS.accent;color=COLORS.accent;anim="shake-anim";}
}
return(
<div key={i} className={anim} onClick={()=>answer(i)} style={{padding:"12px 16px",background:bg,border:`2px solid ${border}`,borderRadius:12,cursor:selected===null?"pointer":"default",transition:"all .2s",color,fontWeight:selected!==null&&i===q.correct?700:400}}>
<span style={{fontWeight:700,marginRight:10,opacity:.5}}>{String.fromCharCode(65+i)}</span>{o}
</div>
);
})}
</div>
{selected!==null && (
<div style={{marginTop:16}}>
{q.explanation && <Card style={{background:COLORS.blue+"10",borderColor:COLORS.blue+"30"}}>
<div style={{fontSize:13,lineHeight:1.6,color:COLORS.textMuted}}>
<strong style={{color:COLORS.blue}}>Erläuterung:</strong> {q.explanation}
</div>
</Card>}
<div style={{marginTop:12,textAlign:"right"}}>
<Button onClick={nextQ}>{qi+1>=questions.length?"Ergebnis":(qi+1===CASE_AFTER_Q?" Weiter zum Prüfungsfall":"Weiter →")}</Button>
</div>
</div>
)}
</Card>
</div>
);
}
// ═══════════════════════════════════════════════════════
// STATISTICS
// ═══════════════════════════════════════════════════════
function Statistics({stats,setStats,navigate}) {
const [confirmOpen, setConfirmOpen] = useState(false);
const pct = stats.quizTotal>0?Math.round(stats.quizCorrect/stats.quizTotal*100):0;
const weakMeds = QUIZ_QUESTIONS.filter(q=>stats.wrongQuestions.includes(q.id)&&q.cat==="Medikamente");
const weakInv = QUIZ_QUESTIONS.filter(q=>stats.wrongQuestions.includes(q.id)&&q.cat==="Invasive Maßnahmen");
const weakLeit = QUIZ_QUESTIONS.filter(q=>stats.wrongQuestions.includes(q.id)&&q.cat==="Leitsymptome");
const weakBpr = QUIZ_QUESTIONS.filter(q=>stats.wrongQuestions.includes(q.id)&&q.cat==="Behandlungspfade");
const weakEkg = QUIZ_QUESTIONS.filter(q=>stats.wrongQuestions.includes(q.id)&&q.cat==="EKG-Befunde");
const weakUe = QUIZ_QUESTIONS.filter(q=>stats.wrongQuestions.includes(q.id)&&q.cat==="Übergabe");
const weakWz = QUIZ_QUESTIONS.filter(q=>stats.wrongQuestions.includes(q.id)&&q.cat==="Werkzeuge");
const weakRecht = QUIZ_QUESTIONS.filter(q=>stats.wrongQuestions.includes(q.id)&&q.cat==="Recht & Aufklärung");
const reset = ()=>setConfirmOpen(true);
const doReset = ()=>{setStats({quizCorrect:0,quizTotal:0,casesCompleted:0,examScores:[],wrongQuestions:[]});setConfirmOpen(false);};
return (
<div className="fade-in">
<Button onClick={()=>navigate("dashboard")} variant="ghost" size="sm" style={{marginBottom:16}}><Icon name="arrowLeft" size={14}/> Zurück</Button>
<h2 style={{fontSize:22,fontWeight:700,marginBottom:20}}> Statistik</h2>
<div className="card-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginBottom:24}}>
{[{label:"Erfolgsquote",value:`${pct}%`,color:pct>=70?COLORS.green:COLORS.accent,iconName:"target"},
{label:"Fragen beantwortet",value:stats.quizTotal,color:COLORS.blue,iconName:"brain"},
{label:"Fälle abgeschlossen",value:stats.casesCompleted,color:COLORS.orange,iconName:"folder"},
].map((s,i)=>(
<Card key={i} style={{textAlign:"center",padding:20}}>
<div style={{fontSize:28,marginBottom:4}}><Icon name={s.iconName} size={18} color={s.color}/></div>
<div style={{fontSize:28,fontWeight:700,color:s.color}}>{s.value}</div>
<div style={{fontSize:12,color:COLORS.textDim}}>{s.label}</div>
</Card>
))}
</div>
{stats.examScores.length>0 && (
<Card style={{marginBottom:24}}>
<h3 style={{fontSize:16,fontWeight:700,marginBottom:16}}> Prüfungsergebnisse</h3>
{stats.examScores.map((e,i)=>(
<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<stats.examScores.length-1?`1px solid ${COLORS.border}`:"none"}}>
<span style={{fontSize:13,color:COLORS.textMuted}}>{new Date(e.date).toLocaleDateString("de-DE")}</span>
<div style={{display:"flex",alignItems:"center",gap:12}}>
<span style={{fontSize:13,color:COLORS.textMuted}}>{e.score}/{e.total}</span>
<Badge color={e.pct>=70?COLORS.green:COLORS.accent}>{e.pct}%</Badge>
</div>
</div>
))}
</Card>
)}
<Card style={{marginBottom:24}}>
<h3 style={{fontSize:16,fontWeight:700,marginBottom:16,color:COLORS.accent}}> Schwachstellen-Analyse</h3>
{stats.wrongQuestions.length===0 ? (
<p style={{color:COLORS.textMuted,fontSize:14}}>Noch keine Schwachstellen identifiziert. Starte ein Quiz!</p>
) : (
<div>
<div style={{marginBottom:16}}>
<Button onClick={()=>navigate("quiz","schwachstellen")} size="sm"><Icon name="target" size={14}/> Alle Schwachstellen trainieren ({stats.wrongQuestions.length})</Button>
</div>
{[{label:"Medikamente",catId:"Medikamente",items:weakMeds,color:COLORS.accent},{label:"Invasive Maßnahmen",catId:"Invasive Maßnahmen",items:weakInv,color:COLORS.blue},{label:"Leitsymptome",catId:"Leitsymptome",items:weakLeit,color:COLORS.orange},{label:"Krankheitsbilder",catId:"Behandlungspfade",items:weakBpr,color:COLORS.green},{label:"EKG-Befunde",catId:"EKG-Befunde",items:weakEkg,color:"#e11d48"},{label:"Übergabe",catId:"Übergabe",items:weakUe,color:"#8b5cf6"},{label:"Recht & Aufklärung",catId:"Recht & Aufklärung",items:weakRecht,color:"#f59e0b"}]
.filter(s=>s.items.length>0).map(s=>(
<div key={s.label} style={{marginBottom:16}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
<Badge color={s.color}>{s.label}</Badge>
<span style={{fontSize:12,color:COLORS.textDim}}>{s.items.length} Fragen falsch</span>
<Button onClick={()=>navigate("quiz","schwach_"+s.catId)} variant="ghost" size="sm" style={{marginLeft:"auto",fontSize:12}}>Trainieren →</Button>
</div>
{s.items.map(q=>(
<div key={q.id} style={{fontSize:13,color:COLORS.textMuted,padding:"6px 12px",borderLeft:`2px solid ${s.color}40`,marginBottom:4}}>
{q.q}
<div style={{fontSize:12,color:COLORS.green,marginTop:2}}>→ Korrekt: {q.opts[q.correct]}</div>
</div>
))}
</div>
))}
</div>
)}
</Card>
<Card style={{marginBottom:24}}>
<h3 style={{fontSize:16,fontWeight:700,marginBottom:16}}><Icon name="clock" size={16}/> Versionsverlauf</h3>
{VERSION_HISTORY.map((v,i)=>(
<div key={v.version} style={{marginBottom:16,paddingBottom:16,borderBottom:i<VERSION_HISTORY.length-1?`1px solid ${COLORS.border}`:"none"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
<Badge color={i===0?COLORS.green:COLORS.blue}>v{v.version}</Badge>
<span style={{fontSize:12,color:COLORS.textDim}}>{v.date}</span>
{i===0 && <Badge color={COLORS.green}>Aktuell</Badge>}
</div>
<ul style={{margin:0,paddingLeft:20}}>
{v.changes.map((c,j)=>(
<li key={j} style={{fontSize:13,color:COLORS.textMuted,marginBottom:4,lineHeight:1.5}}>{c}</li>
))}
</ul>
</div>
))}
</Card>
<FeedbackForm />
<div style={{display:"flex",justifyContent:"center",marginTop:24}}>
<Button onClick={reset} variant="ghost" size="sm"> Statistiken zurücksetzen</Button>
</div>
<ConfirmModal open={confirmOpen} title="Statistiken zurücksetzen?" message="Alle Quizergebnisse, Fallstatistiken und Prüfungsergebnisse werden unwiderruflich gelöscht." onConfirm={doReset} onCancel={()=>setConfirmOpen(false)}/>
</div>
);
}
// ═══════════════════════════════════════════════════════
// FEEDBACK FORM (Google Forms)
// ═══════════════════════════════════════════════════════
function FeedbackForm() {
const [expanded, setExpanded] = useState(false);
// ⚠️ HIER DEINE GOOGLE FORMS URL EINTRAGEN:
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfg4iu733QdhUMSu4jmjQ1uKJlRfSGkkraGu0dA_h2hxdIYIA/viewform?embedded=true";
return (
<Card style={{marginBottom:24,background:`linear-gradient(135deg,${COLORS.card},#131b35)`,border:`1px solid ${COLORS.border}`,overflow:"hidden"}}>
<div onClick={()=>setExpanded(!expanded)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
<div style={{display:"flex",alignItems:"center",gap:12}}>
<div style={{width:42,height:42,borderRadius:12,background:COLORS.purple+"15",display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${COLORS.purple}20`}}>
<Icon name="megaphone" size={20} color={COLORS.purple}/>
</div>
<div>
<h3 style={{fontSize:17,fontWeight:700}}>Feedback geben</h3>
<p style={{fontSize:12,color:COLORS.textDim,marginTop:2}}>Hilf uns, die App zu verbessern!</p>
</div>
</div>
<div style={{width:28,height:28,borderRadius:8,background:COLORS.border,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.3s",transform:expanded?"rotate(180deg)":"rotate(0deg)"}}>
<Icon name="chevronRight" size={16} color={COLORS.textMuted} style={{transform:"rotate(90deg)"}}/>
</div>
</div>
{expanded && (
<div className="fade-in" style={{marginTop:20,borderTop:`1px solid ${COLORS.border}`,paddingTop:20}}>
<iframe src={FORM_URL} width="100%" height="800" frameBorder="0" marginHeight="0" marginWidth="0"
style={{borderRadius:12,border:"none",background:"transparent",colorScheme:"dark"}}>
Wird geladen…
</iframe>
</div>
)}
</Card>
);
}

// Mount
var root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
