// Built-in iconic meme templates
// Using high-fidelity SVGs to guarantee instant loading, crisp rendering at all DPIs, and zero network dependency.

export const BUILT_IN_TEMPLATES = [
  {
    id: 'drake',
    name: 'Drake Hotline Bling',
    category: 'comparison',
    width: 800,
    height: 800,
    description: 'Rejecting top option, approving bottom option',
    defaultTopText: 'WRITING CODE ALL AT ONCE',
    defaultBottomText: 'TESTING FEATURE BY FEATURE',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ca8a04"/>
          <stop offset="100%" stop-color="#a16207"/>
        </linearGradient>
        <linearGradient id="jacket" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#c2410c"/>
        </linearGradient>
      </defs>
      <!-- Top Half (Dislike) -->
      <rect x="0" y="0" width="400" height="400" fill="url(#wall)"/>
      <rect x="400" y="0" width="400" height="400" fill="#ffffff"/>
      <line x1="0" y1="400" x2="800" y2="400" stroke="#334155" stroke-width="4"/>
      <line x1="400" y1="0" x2="400" y2="800" stroke="#334155" stroke-width="4"/>

      <!-- Drake Top Character (Turning away / Shielding hand) -->
      <!-- Body -->
      <path d="M 80,400 Q 150,220 260,250 Q 340,280 370,400 Z" fill="url(#jacket)"/>
      <circle cx="210" cy="180" r="55" fill="#8d5b4c"/> <!-- Head -->
      <path d="M 160,165 Q 210,130 260,165 Q 260,200 240,215 Q 180,215 160,165 Z" fill="#18181b"/> <!-- Hair/Beard -->
      <circle cx="210" cy="180" r="50" fill="#a26c58"/> <!-- Face -->
      <!-- Beard & Mustache -->
      <path d="M 180,185 Q 210,230 240,185 Q 235,225 210,230 Q 185,225 180,185 Z" fill="#18181b"/>
      <!-- Eyes closed disgusted -->
      <path d="M 185,175 Q 195,170 202,176" stroke="#27272a" stroke-width="3" fill="none"/>
      <path d="M 218,176 Q 225,170 235,175" stroke="#27272a" stroke-width="3" fill="none"/>
      <!-- Hand refusing/shielding -->
      <path d="M 250,260 Q 320,220 340,180 Q 355,200 330,240 Q 290,290 250,290 Z" fill="url(#jacket)"/>
      <circle cx="340" cy="180" r="24" fill="#a26c58"/>
      <!-- Palm outward lines -->
      <path d="M 330,170 L 350,160 M 335,178 L 355,172 M 333,188 L 352,185" stroke="#78350f" stroke-width="2"/>

      <!-- Bottom Half (Like / Approving) -->
      <rect x="0" y="400" width="400" height="400" fill="url(#wall)"/>
      <rect x="400" y="400" width="400" height="400" fill="#ffffff"/>

      <!-- Drake Bottom Character (Smiling & Pointing) -->
      <path d="M 70,800 Q 140,610 270,640 Q 350,670 380,800 Z" fill="url(#jacket)"/>
      <circle cx="210" cy="570" r="55" fill="#8d5b4c"/>
      <circle cx="210" cy="570" r="50" fill="#a26c58"/>
      <!-- Hair & Beard -->
      <path d="M 160,555 Q 210,520 260,555 Q 260,590 240,605 Q 180,605 160,555 Z" fill="#18181b"/>
      <path d="M 180,575 Q 210,620 240,575 Q 235,618 210,622 Q 185,618 180,575 Z" fill="#18181b"/>
      <!-- Eyes happy squint -->
      <path d="M 186,564 Q 196,560 204,565" stroke="#27272a" stroke-width="3" fill="none"/>
      <path d="M 218,565 Q 226,560 236,564" stroke="#27272a" stroke-width="3" fill="none"/>
      <!-- Big Smile -->
      <path d="M 195,585 Q 210,605 225,585" stroke="#ffffff" stroke-width="4" fill="#881337"/>
      <!-- Hand Pointing at top right -->
      <path d="M 260,670 Q 330,640 360,600 Q 375,615 350,655 Q 310,700 270,700 Z" fill="url(#jacket)"/>
      <circle cx="360" cy="600" r="22" fill="#a26c58"/>
      <!-- Finger pointer -->
      <rect x="360" y="585" width="40" height="14" rx="7" transform="rotate(-30 360 585)" fill="#a26c58"/>
    </svg>`
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons',
    category: 'choice',
    width: 800,
    height: 700,
    description: 'Sweating guy struggling to choose between two red buttons',
    defaultTopText: 'FIX BUGS',
    defaultBottomText: 'ADD NEW FEATURES',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 700" width="800" height="700">
      <defs>
        <radialGradient id="btnGrad" cx="35%" cy="35%">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="80%" stop-color="#991b1b"/>
          <stop offset="100%" stop-color="#7f1d1d"/>
        </radialGradient>
        <linearGradient id="consoleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
      </defs>
      <!-- Top panel: Control Console with 2 buttons -->
      <rect x="0" y="0" width="800" height="340" fill="#334155"/>
      <polygon points="40,300 120,40 680,40 760,300" fill="url(#consoleGrad)" stroke="#1e293b" stroke-width="6"/>

      <!-- Left Button Base & Button -->
      <ellipse cx="270" cy="180" rx="90" ry="60" fill="#1e293b"/>
      <ellipse cx="270" cy="165" rx="80" ry="50" fill="url(#btnGrad)"/>
      <ellipse cx="255" cy="150" rx="35" ry="18" fill="#fca5a5" opacity="0.6"/>

      <!-- Right Button Base & Button -->
      <ellipse cx="530" cy="180" rx="90" ry="60" fill="#1e293b"/>
      <ellipse cx="530" cy="165" rx="80" ry="50" fill="url(#btnGrad)"/>
      <ellipse cx="515" cy="150" rx="35" ry="18" fill="#fca5a5" opacity="0.6"/>

      <!-- Divider line -->
      <line x1="0" y1="340" x2="800" y2="340" stroke="#0f172a" stroke-width="6"/>

      <!-- Bottom panel: Sweating Guy -->
      <rect x="0" y="340" width="800" height="360" fill="#1e293b"/>
      <!-- Red Shirt Guy -->
      <path d="M 180,700 Q 300,480 400,480 Q 500,480 620,700 Z" fill="#dc2626"/>
      <!-- Face & Head -->
      <ellipse cx="400" cy="460" rx="110" ry="120" fill="#fed7aa"/>
      <path d="M 290,420 Q 400,350 510,420 Q 520,360 400,340 Q 280,360 290,420 Z" fill="#451a03"/> <!-- Hair -->
      <!-- Sweating forehead & Furrowed brows -->
      <path d="M 340,430 Q 370,445 390,440" stroke="#7c2d12" stroke-width="5" fill="none"/>
      <path d="M 460,430 Q 430,445 410,440" stroke="#7c2d12" stroke-width="5" fill="none"/>
      <!-- Stressed eyes -->
      <ellipse cx="365" cy="460" rx="14" ry="16" fill="#ffffff" stroke="#7c2d12" stroke-width="3"/>
      <circle cx="367" cy="460" r="7" fill="#0f172a"/>
      <ellipse cx="435" cy="460" rx="14" ry="16" fill="#ffffff" stroke="#7c2d12" stroke-width="3"/>
      <circle cx="433" cy="460" r="7" fill="#0f172a"/>
      <!-- Trembling Mouth -->
      <path d="M 370,515 Q 385,505 400,515 Q 415,525 430,515" stroke="#7c2d12" stroke-width="4" fill="none"/>
      <!-- Sweat Drops dripping -->
      <path d="M 480,410 C 495,430 495,445 480,445 C 465,445 465,430 480,410 Z" fill="#38bdf8"/>
      <path d="M 320,440 C 330,455 330,465 320,465 C 310,465 310,455 320,440 Z" fill="#38bdf8"/>
      <!-- Hand wiping forehead with cloth -->
      <path d="M 450,560 Q 520,490 520,420 Q 480,430 460,460 Z" fill="#fed7aa"/>
      <ellipse cx="500" cy="440" rx="35" ry="25" fill="#f8fafc" stroke="#94a3b8" stroke-width="3"/>
    </svg>`
  },
  {
    id: 'distracted-bf',
    name: 'Distracted Boyfriend',
    category: 'reaction',
    width: 900,
    height: 600,
    description: 'Man looking at another woman while his girlfriend looks shocked',
    defaultTopText: 'NEW FRAMEWORK',
    defaultBottomText: 'MY CURRENT STACK',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600">
      <defs>
        <linearGradient id="bgStreet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#cbd5e1"/>
          <stop offset="100%" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
      <!-- Background street / sunny day -->
      <rect x="0" y="0" width="900" height="600" fill="url(#bgStreet)"/>
      <rect x="0" y="480" width="900" height="120" fill="#64748b"/>
      <!-- Background storefronts -->
      <rect x="50" y="80" width="220" height="360" fill="#475569" opacity="0.4"/>
      <rect x="340" y="60" width="240" height="380" fill="#334155" opacity="0.3"/>
      <rect x="640" y="100" width="200" height="340" fill="#475569" opacity="0.4"/>

      <!-- Woman in Red (Left - The Distraction) walking away looking back -->
      <ellipse cx="230" cy="180" rx="38" ry="45" fill="#fed7aa"/>
      <!-- Brown Long Hair -->
      <path d="M 180,180 Q 230,120 280,170 Q 290,260 260,280 Q 200,240 180,180 Z" fill="#713f12"/>
      <!-- Sassy side glance face -->
      <ellipse cx="245" cy="180" rx="35" ry="42" fill="#fed7aa"/>
      <circle cx="255" cy="175" r="4" fill="#0f172a"/>
      <path d="M 248,195 Q 260,202 268,192" stroke="#dc2626" stroke-width="3" fill="none"/>
      <!-- Red Dress -->
      <path d="M 210,230 Q 260,250 280,330 L 300,500 L 190,500 L 195,330 Z" fill="#ef4444"/>
      <!-- Legs walking -->
      <rect x="205" y="500" width="25" height="100" fill="#fed7aa"/>
      <rect x="250" y="500" width="25" height="100" fill="#fbcfe8"/>

      <!-- Boyfriend (Center) checking her out -->
      <!-- Blue plaid shirt -->
      <path d="M 430,230 Q 510,210 570,250 L 590,500 L 410,500 Z" fill="#2563eb"/>
      <line x1="430" y1="280" x2="570" y2="280" stroke="#1e40af" stroke-width="6"/>
      <line x1="430" y1="360" x2="570" y2="360" stroke="#1e40af" stroke-width="6"/>
      <line x1="480" y1="230" x2="480" y2="500" stroke="#1e40af" stroke-width="6"/>
      <!-- Head turning all the way to left -->
      <ellipse cx="480" cy="165" rx="42" ry="46" fill="#fed7aa"/>
      <path d="M 440,150 Q 480,110 525,140 Q 535,180 500,165 Z" fill="#451a03"/>
      <!-- Jaw drop / lustful eyes staring left -->
      <circle cx="455" cy="160" r="5" fill="#0f172a"/>
      <path d="M 445,185 Q 460,200 475,185" stroke="#7c2d12" stroke-width="3" fill="#ffffff"/>

      <!-- Girlfriend (Right) holding his arm, totally appalled -->
      <!-- Arm holding him -->
      <path d="M 590,300 Q 640,280 690,300" stroke="#fed7aa" stroke-width="24" stroke-linecap="round" fill="none"/>
      <!-- Cyan/Teal Top -->
      <path d="M 680,240 Q 750,230 810,260 L 820,500 L 670,500 Z" fill="#0d9488"/>
      <!-- Shocked outraged face -->
      <ellipse cx="740" cy="170" rx="40" ry="45" fill="#fed7aa"/>
      <path d="M 690,160 Q 740,110 790,150 Q 800,230 760,260 Q 700,240 690,160 Z" fill="#854d0e"/>
      <!-- Shocked wide open mouth & glaring eyes -->
      <ellipse cx="715" cy="165" rx="8" ry="10" fill="#ffffff" stroke="#7c2d12" stroke-width="2"/>
      <circle cx="713" cy="165" r="4" fill="#0f172a"/>
      <ellipse cx="745" cy="165" rx="8" ry="10" fill="#ffffff" stroke="#7c2d12" stroke-width="2"/>
      <circle cx="743" cy="165" r="4" fill="#0f172a"/>
      <ellipse cx="730" cy="195" rx="14" ry="12" fill="#881337"/>
    </svg>`
  },
  {
    id: 'buff-doge',
    name: 'Buff Doge vs Cheems',
    category: 'comparison',
    width: 800,
    height: 600,
    description: 'Gigachad Buff Doge in the past vs Small Crying Cheems today',
    defaultTopText: 'CODING IN 1999',
    defaultBottomText: 'CODING TODAY',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <rect x="0" y="0" width="400" height="600" fill="#e2e8f0"/>
      <rect x="400" y="0" width="400" height="600" fill="#cbd5e1"/>
      <line x1="400" y1="0" x2="400" y2="600" stroke="#64748b" stroke-width="4"/>

      <!-- Buff Doge (Left) -->
      <!-- Massive muscular torso -->
      <path d="M 80,480 Q 60,260 200,220 Q 340,260 320,480 Z" fill="#d97706"/>
      <!-- Pectorals and 8-pack abs lines -->
      <path d="M 140,300 Q 200,340 260,300" stroke="#78350f" stroke-width="5" fill="none"/>
      <line x1="200" y1="300" x2="200" y2="480" stroke="#78350f" stroke-width="5"/>
      <line x1="160" y1="360" x2="240" y2="360" stroke="#78350f" stroke-width="4"/>
      <line x1="160" y1="410" x2="240" y2="410" stroke="#78350f" stroke-width="4"/>
      <!-- Massive Biceps -->
      <circle cx="90" cy="300" r="55" fill="#f59e0b"/>
      <circle cx="310" cy="300" r="55" fill="#f59e0b"/>
      <!-- Doge Head -->
      <circle cx="200" cy="160" r="55" fill="#f59e0b"/>
      <!-- Doge Ears -->
      <polygon points="150,130 170,70 190,120" fill="#b45309"/>
      <polygon points="210,120 230,70 250,130" fill="#b45309"/>
      <!-- Doge Snout & Confident Eyes -->
      <ellipse cx="200" cy="175" rx="25" ry="20" fill="#fef3c7"/>
      <polygon points="195,165 205,165 200,175" fill="#18181b"/>
      <circle cx="180" cy="150" r="6" fill="#18181b"/>
      <circle cx="220" cy="150" r="6" fill="#18181b"/>

      <!-- Cheems (Right) - Small, round, sad crying doge -->
      <ellipse cx="580" cy="440" rx="90" ry="80" fill="#f59e0b"/>
      <!-- Sad head -->
      <circle cx="560" cy="340" r="50" fill="#f59e0b"/>
      <!-- Tiny floppy ears -->
      <polygon points="520,320 535,280 550,310" fill="#b45309"/>
      <polygon points="570,310 585,280 600,320" fill="#b45309"/>
      <!-- Slanted teary eyes -->
      <ellipse cx="545" cy="335" rx="5" ry="7" fill="#18181b"/>
      <ellipse cx="575" cy="335" rx="5" ry="7" fill="#18181b"/>
      <!-- Tear drops -->
      <circle cx="538" cy="348" r="4" fill="#38bdf8"/>
      <circle cx="582" cy="348" r="4" fill="#38bdf8"/>
      <!-- Chubby cheeks snout -->
      <ellipse cx="560" cy="355" rx="22" ry="16" fill="#fef3c7"/>
      <polygon points="555,348 565,348 560,356" fill="#18181b"/>
      <!-- Quivering mouth -->
      <path d="M 552,365 Q 560,360 568,365" stroke="#78350f" stroke-width="3" fill="none"/>
    </svg>`
  },
  {
    id: 'roll-safe',
    name: 'Roll Safe (Think About It)',
    category: 'smart',
    width: 700,
    height: 700,
    description: 'Man tapping his head with a knowing smile',
    defaultTopText: 'CANNOT HAVE BUGS',
    defaultBottomText: 'IF YOU DONNOT WRITE CODE',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" width="700" height="700">
      <defs>
        <radialGradient id="halo" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="700" height="700" fill="url(#halo)"/>
      <!-- Black Leather Jacket -->
      <path d="M 120,700 Q 220,440 370,440 Q 520,440 620,700 Z" fill="#18181b"/>
      <!-- Gold Chain -->
      <path d="M 310,480 Q 370,550 430,480" stroke="#eab308" stroke-width="12" fill="none"/>
      <!-- Head -->
      <ellipse cx="370" cy="310" rx="130" ry="145" fill="#78350f"/>
      <path d="M 235,270 Q 370,180 505,270 Q 510,180 370,160 Q 230,180 235,270 Z" fill="#09090b"/> <!-- Hair -->
      <!-- Mustache & Smile -->
      <path d="M 330,370 Q 370,390 410,370" stroke="#1c1917" stroke-width="8" stroke-linecap="round"/>
      <path d="M 335,385 Q 370,415 405,385" stroke="#ffffff" stroke-width="6" fill="#450a0a"/>
      <!-- Knowing squinting eyes -->
      <path d="M 305,295 Q 330,285 350,300" stroke="#1c1917" stroke-width="5" fill="none"/>
      <circle cx="330" cy="302" r="5" fill="#09090b"/>
      <path d="M 390,300 Q 410,285 435,295" stroke="#1c1917" stroke-width="5" fill="none"/>
      <circle cx="410" cy="302" r="5" fill="#09090b"/>
      <!-- Hand with finger tapping temple -->
      <path d="M 490,440 L 460,330 Q 450,270 430,260 Q 420,275 435,310 L 460,440 Z" fill="#78350f"/>
      <ellipse cx="430" cy="265" rx="16" ry="12" fill="#854d0e"/>
      <!-- Little idea spark near temple -->
      <circle cx="415" cy="235" r="4" fill="#facc15"/>
      <line x1="415" y1="220" x2="415" y2="210" stroke="#facc15" stroke-width="3"/>
      <line x1="430" y1="230" x2="440" y2="225" stroke="#facc15" stroke-width="3"/>
    </svg>`
  },
  {
    id: 'blank-slate',
    name: 'Custom / Blank Poster',
    category: 'canvas',
    width: 800,
    height: 800,
    description: 'Clean dark slate canvas with modern subtle gradient',
    defaultTopText: 'YOUR TITLE HERE',
    defaultBottomText: 'SUBTITLE OR SLOGAN',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
      <defs>
        <linearGradient id="blankGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="800" height="800" fill="url(#blankGrad)"/>
      <rect x="30" y="30" width="740" height="740" rx="20" fill="none" stroke="#6366f1" stroke-width="2" stroke-dasharray="12 8" opacity="0.3"/>
    </svg>`
  }
];

export function getTemplateById(id) {
  return BUILT_IN_TEMPLATES.find(t => t.id === id) || BUILT_IN_TEMPLATES[0];
}

export function svgToDataUrl(svgString) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
}
