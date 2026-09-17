// Built-in iconic meme templates using authentic user-provided high-resolution meme images,
// with SVG fallback for offline / test environments.

export const BUILT_IN_TEMPLATES = [
  {
    id: 'drake',
    name: 'Drake Hotline Bling',
    category: 'comparison',
    imageSrc: '/templates/drake.png',
    width: 500,
    height: 500,
    description: 'Rejecting top option, approving bottom option',
    defaultTopText: 'WRITING CODE ALL AT ONCE',
    defaultBottomText: 'TESTING FEATURE BY FEATURE',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500"><rect width="500" height="500" fill="#ca8a04"/><text x="250" y="250" fill="#ffffff" font-size="24" text-anchor="middle">Drake Hotline Bling</text></svg>`
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons',
    category: 'choice',
    imageSrc: '/templates/two-buttons.png',
    width: 500,
    height: 757,
    description: 'Sweating guy struggling to choose between two red buttons',
    defaultTopText: 'FIX BUGS',
    defaultBottomText: 'SHIP NEW FEATURES',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 757" width="500" height="757"><rect width="500" height="757" fill="#334155"/><text x="250" y="378" fill="#ffffff" font-size="24" text-anchor="middle">Two Buttons</text></svg>`
  },
  {
    id: 'distracted-bf',
    name: 'Distracted Boyfriend',
    category: 'reaction',
    imageSrc: '/templates/distracted-bf.png',
    width: 750,
    height: 500,
    description: 'Man looking at another woman while his girlfriend looks shocked',
    defaultTopText: 'NEW FRAMEWORK',
    defaultBottomText: 'MY WORKING CODE',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" width="750" height="500"><rect width="750" height="500" fill="#64748b"/><text x="375" y="250" fill="#ffffff" font-size="24" text-anchor="middle">Distracted Boyfriend</text></svg>`
  },
  {
    id: 'left-exit-12',
    name: 'Left Exit 12 (Drifting Car)',
    category: 'choice',
    imageSrc: '/templates/left-exit-12.png',
    width: 524,
    height: 500,
    description: 'Car swerving off the highway towards the exit ramp',
    defaultTopText: 'CONTINUE STRAIGHT',
    defaultBottomText: 'SWERVE HARD TO EXIT',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 524 500" width="524" height="500"><rect width="524" height="500" fill="#047857"/><text x="262" y="250" fill="#ffffff" font-size="24" text-anchor="middle">Left Exit 12</text></svg>`
  },
  {
    id: 'grus-plan',
    name: "Gru's Plan",
    category: 'reaction',
    imageSrc: '/templates/grus-plan.png',
    width: 700,
    height: 449,
    description: 'Gru presenting his plan with excitement, then shocked on panel 3 & 4',
    defaultTopText: 'BUILD A MEME GENERATOR',
    defaultBottomText: 'USER LOVES IT',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 449" width="700" height="449"><rect width="700" height="449" fill="#1e293b"/><text x="350" y="225" fill="#ffffff" font-size="24" text-anchor="middle">Gru's Plan</text></svg>`
  }
];

export function getTemplateById(id) {
  return BUILT_IN_TEMPLATES.find(t => t.id === id) || BUILT_IN_TEMPLATES[0];
}

export function svgToDataUrl(svgString) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
}

export function getTemplateUrl(template) {
  return template.imageSrc || svgToDataUrl(template.svg);
}
