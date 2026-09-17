// Curated Meme Emojis & High-Resolution Vector Stickers

export const MEME_EMOJIS = [
  { emoji: '😂', name: 'Joy / Laughing' },
  { emoji: '💀', name: 'Skull / Dead' },
  { emoji: '🔥', name: 'Fire / Lit' },
  { emoji: '🤡', name: 'Clown' },
  { emoji: '🕶️', name: 'Sunglasses' },
  { emoji: '🧢', name: 'Cap / No Cap' },
  { emoji: '👑', name: 'Crown' },
  { emoji: '💯', name: '100 Percent' },
  { emoji: '💥', name: 'Boom' },
  { emoji: '🚀', name: 'To The Moon' },
  { emoji: '👀', name: 'Eyes' },
  { emoji: '🗿', name: 'Moai / Chad' },
  { emoji: '🧠', name: 'Galaxy Brain' },
  { emoji: '🤯', name: 'Mind Blown' },
  { emoji: '🐸', name: 'Pepe Frog' },
  { emoji: '💸', name: 'Flying Money' },
  { emoji: '⚡', name: 'Lightning' },
  { emoji: '🍕', name: 'Pizza' }
];

export const MEME_STICKERS = [
  {
    id: 'memeify-mascot',
    name: 'Memeify Mascot',
    category: 'badge',
    imageSrc: '/logo.jpg',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="48" fill="#3b82f6"/><text x="50" y="55" font-family="sans-serif" font-size="16" font-weight="bold" fill="#fff" text-anchor="middle">Memeify</text></svg>`
  },
  {
    id: 'thug-glasses',
    name: 'Thug Life Shades',
    category: 'accessories',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" width="200" height="60">
      <!-- 8-Bit Pixel Sunglasses -->
      <rect x="10" y="10" width="80" height="35" fill="#000000"/>
      <rect x="110" y="10" width="80" height="35" fill="#000000"/>
      <rect x="80" y="15" width="40" height="10" fill="#000000"/>
      <!-- Pixel Glare / Highlights -->
      <rect x="20" y="15" width="10" height="8" fill="#ffffff"/>
      <rect x="30" y="23" width="10" height="8" fill="#ffffff"/>
      <rect x="40" y="31" width="10" height="8" fill="#ffffff"/>
      <rect x="120" y="15" width="10" height="8" fill="#ffffff"/>
      <rect x="130" y="23" width="10" height="8" fill="#ffffff"/>
      <rect x="140" y="31" width="10" height="8" fill="#ffffff"/>
    </svg>`
  },
  {
    id: 'gold-crown',
    name: 'Golden Crown',
    category: 'accessories',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" width="120" height="100">
      <defs>
        <linearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="50%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
      </defs>
      <!-- Crown points -->
      <polygon points="10,80 15,30 38,55 60,15 82,55 105,30 110,80" fill="url(#crownGrad)" stroke="#854d0e" stroke-width="3"/>
      <!-- Jewels -->
      <circle cx="15" cy="28" r="6" fill="#ef4444"/>
      <circle cx="60" cy="14" r="7" fill="#3b82f6"/>
      <circle cx="105" cy="28" r="6" fill="#ef4444"/>
      <circle cx="38" cy="70" r="5" fill="#10b981"/>
      <circle cx="60" cy="70" r="6" fill="#ec4899"/>
      <circle cx="82" cy="70" r="5" fill="#10b981"/>
      <rect x="10" y="78" width="100" height="12" rx="4" fill="#a16207" stroke="#713f12" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'wasted-stamp',
    name: 'WASTED Badge',
    category: 'meme',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="240" height="70">
      <defs>
        <linearGradient id="wastedGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#dc2626"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="232" height="62" rx="8" fill="rgba(0,0,0,0.85)" stroke="#ef4444" stroke-width="3"/>
      <text x="120" y="48" font-family="'Impact', 'Arial Black', sans-serif" font-size="40" font-weight="900" fill="url(#wastedGrad)" stroke="#ffffff" stroke-width="1.5" text-anchor="middle" letter-spacing="4">WASTED</text>
    </svg>`
  },
  {
    id: 'speech-bubble',
    name: 'Speech Bubble',
    category: 'dialog',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="160" height="120">
      <path d="M 20,20 Q 80,10 140,20 Q 155,50 140,80 Q 80,90 45,80 L 20,110 L 30,75 Q 5,50 20,20 Z" fill="#ffffff" stroke="#0f172a" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="55" cy="50" r="5" fill="#0f172a"/>
      <circle cx="80" cy="50" r="5" fill="#0f172a"/>
      <circle cx="105" cy="50" r="5" fill="#0f172a"/>
    </svg>`
  },
  {
    id: 'deal-with-it',
    name: 'DEAL WITH IT Banner',
    category: 'meme',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 60" width="260" height="60">
      <rect x="0" y="0" width="260" height="60" rx="6" fill="#000000"/>
      <rect x="4" y="4" width="252" height="52" rx="4" fill="none" stroke="#eab308" stroke-width="3" stroke-dasharray="6 4"/>
      <text x="130" y="42" font-family="'Impact', 'Arial Black', sans-serif" font-size="30" font-weight="900" fill="#facc15" text-anchor="middle" letter-spacing="3">DEAL WITH IT</text>
    </svg>`
  },
  {
    id: 'fire-badge',
    name: 'Fire / Lit Badge',
    category: 'meme',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <defs>
        <linearGradient id="fireOuter" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#b91c1c"/>
          <stop offset="50%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#facc15"/>
        </linearGradient>
      </defs>
      <!-- Outer Flame -->
      <path d="M 50,5 C 65,30 90,45 90,70 C 90,90 70,98 50,98 C 30,98 10,90 10,70 C 10,48 35,32 50,5 Z" fill="url(#fireOuter)"/>
      <!-- Inner Flame -->
      <path d="M 50,40 C 60,55 75,65 75,80 C 75,92 65,96 50,96 C 35,96 25,92 25,80 C 25,65 40,55 50,40 Z" fill="#fef08a"/>
    </svg>`
  }
];

export function svgToStickerUrl(svgString) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
}
