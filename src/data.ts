/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book } from './types';

// Human-readable SVGs representing the exact book cover design aesthetics requested
const DIGA_SEU_NOME_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_diga" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0F031E" />
      <stop offset="50%" stop-color="#1A0D2E" />
      <stop offset="100%" stop-color="#05010B" />
    </linearGradient>
    <radialGradient id="glow_diga" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.30" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>
  
  <rect width="400" height="600" fill="url(#bg_diga)" />
  <rect width="400" height="600" fill="url(#glow_diga)" />
  
  <path d="M 50 100 L 350 500" stroke="#EF4444" stroke-width="2" opacity="0.15" />
  <path d="M 350 80 L 50 550" stroke="#EF4444" stroke-width="1.5" opacity="0.12" />
  <circle cx="200" cy="320" r="120" fill="none" stroke="#EF4444" stroke-width="1" stroke-dasharray="10,15" opacity="0.18" />
  
  <g transform="rotate(-15 200 450)">
    <rect x="-100" y="420" width="600" height="40" fill="#FACC15" />
    <path d="M-100 420 L-60 420 L-100 460 Z M-20 420 L20 420 L-20 460 L-60 460 Z M60 420 L100 420 L60 460 L20 460 Z M140 420 L180 420 L140 460 L100 460 Z M220 420 L260 420 L220 460 L180 460 Z M300 420 L340 420 L300 460 L260 460 Z M380 420 L420 420 L380 460 L340 460 Z M460 420 L500 420 L460 460 L420 460 Z M540 420 L580 420 L540 460 L500 460 Z" fill="#000" />
    <text x="200" y="446" font-family="'Courier New', monospace" font-size="13" font-weight="900" fill="#000000" text-anchor="middle" letter-spacing="3.5">POLICIA - CENA DO CRIME - PERIGO</text>
  </g>
  
  <g transform="rotate(10 200 150)">
    <rect x="-100" y="120" width="600" height="30" fill="#FACC15" />
    <path d="M-100 120 L-80 120 L-100 150 Z M-40 120 L-0 120 L-40 150 L-80 150 Z M20 120 L60 120 L20 150 L-20 150 Z M80 120 L120 120 L80 150 L40 150 Z M140 120 L180 120 L140 150 L100 150 Z M200 120 L240 120 L200 150 L160 150 Z M260 120 L300 120 L260 150 L220 150 Z M320 120 L360 120 L320 150 L280 150 Z M380 120 L420 120 L380 150 L340 150 Z M440 120 L480 120 L440 150 L400 150 Z" fill="#000000" />
    <text x="200" y="140" font-family="'Courier New', monospace" font-size="9.5" font-weight="950" fill="#000000" text-anchor="middle" letter-spacing="2">DO NOT CROSS - CRIME SCENE</text>
  </g>

  <g transform="translate(200, 310)">
    <path d="M -10 20 L -10 -15 C -10 -30 10 -30 10 -15 L 10 20 Z" fill="#D97706" opacity="0.8" />
    <rect x="-10" y="15" width="20" height="10" fill="#F59E0B" opacity="0.9" />
    <line x1="-10" y1="18" x2="10" y2="18" stroke="#78350F" stroke-width="1.5" />
    
    <path d="M -25 5 C -25 -10 -5 -25 20 -15 C 25 -5 15 25 -5 15" stroke="#7C3AED" stroke-width="2" fill="none" opacity="0.4" />
    <path d="M -15 15 C -15 -3 -3 -15 15 -7 C 18 2 10 20 -2 12" stroke="#7C3AED" stroke-width="2" fill="none" opacity="0.5" stroke-dasharray="2,2" />

    <circle cx="0" cy="0" r="45" fill="none" stroke="#94A3B8" stroke-width="6" />
    <circle cx="0" cy="0" r="42" fill="#38BDF8" fill-opacity="0.15" stroke="#E2E8F0" stroke-width="1" />
    <rect x="-4" y="42" width="8" height="40" fill="#475569" transform="rotate(-45 0 42)" />
    <rect x="-5" y="65" width="10" height="20" fill="#1E293B" transform="rotate(-45 0 42)" />
    <path d="M -30 -10 A 35 35 0 0 1 -5 -33" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5" />
  </g>

  <text x="200" y="215" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2" opacity="0"></text>
  <text x="200" y="258" font-family="'Impact', 'Arial Black', sans-serif" font-size="44" font-weight="900" fill="#EF4444" text-anchor="middle" letter-spacing="3" opacity="0"></text>
  
  <text x="200" y="495" font-family="'Courier New', monospace" font-size="11" font-weight="bold" fill="#94A3B8" text-anchor="middle" letter-spacing="1" opacity="0"></text>
  <text x="200" y="520" font-family="'Georgia', serif" font-size="17" font-weight="bold" fill="#F8FAFC" text-anchor="middle" letter-spacing="2" opacity="0"></text>

  <line x1="120" y1="535" x2="280" y2="535" stroke="#EF4444" stroke-width="1.5" opacity="0.5" />
  <circle cx="200" cy="535" r="3" fill="#EF4444" />
</svg>
`;

const MON_AMOUR_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
  <defs>
    <linearGradient id="gothicBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14011B" />
      <stop offset="40%" stop-color="#08000C" />
      <stop offset="100%" stop-color="#2D001F" />
    </linearGradient>
    <radialGradient id="neonGlow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#EC4899" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="400" height="600" fill="url(#gothicBg)" />
  <rect width="400" height="600" fill="url(#neonGlow)" />

  <path d="M 50 500 Q 150 400 100 250 T 250 50" fill="none" stroke="#F472B6" stroke-width="1" opacity="0.1" />
  <path d="M 350 500 Q 250 380 300 220 T 150 80" fill="none" stroke="#F472B6" stroke-width="1" opacity="0.08" />

  <path d="M 80 180 C 70 190 90 200 95 185 C 90 175 85 175 80 180 Z" fill="#9D174D" opacity="0.6" transform="rotate(25 80 180)" />
  <path d="M 320 140 C 310 150 330 160 335 145 C 330 135 325 135 320 140 Z" fill="#BE185D" opacity="0.5" transform="rotate(-40 320 140)" />
  <path d="M 120 420 C 110 430 130 440 135 425 C 130 415 125 415 120 420 Z" fill="#9D174D" opacity="0.4" transform="rotate(15 120 420)" />

  <g transform="translate(200, 310)">
    <circle cx="0" cy="0" r="70" fill="#EC4899" opacity="0.1" />
    
    <rect x="-70" y="-85" width="140" height="170" rx="35" fill="none" stroke="#BE185D" stroke-width="1.5" opacity="0.3" stroke-dasharray="5,3" />
    <rect x="-65" y="-80" width="130" height="160" rx="30" fill="none" stroke="#BE185D" stroke-width="1" opacity="0.2" />

    <path d="M -30 -30 C -30 -55 30 -55 30 -30 C 30 -15 25 -5 20 0 L 20 15 C 20 25 -20 25 -20 15 L -20 0 C -25 -5 -30 -15 -30 -30 Z" fill="#FCE7F3" fill-opacity="0.9" />
    <rect x="-10" y="15" width="20" height="6" fill="none" stroke="#470024" stroke-width="1" />
    <line x1="-5" y1="15" x2="-5" y2="21" stroke="#470024" />
    <line x1="0" y1="15" x2="0" y2="21" stroke="#470024" />
    <line x1="5" y1="15" x2="5" y2="21" stroke="#470024" />
    <path d="M -5 -10 L 5 -10 L 0 -17 Z" fill="#14011B" />
    <circle cx="-11" cy="-22" r="8" fill="#14011B" />
    <circle cx="11" cy="-22" r="8" fill="#14011B" />
    <circle cx="-11" cy="-22" r="2" fill="#EC4899" />
    <circle cx="11" cy="-22" r="2" fill="#EC4899" />
    
    <g transform="translate(18, -35)">
      <circle cx="0" cy="0" r="14" fill="#9D174D" />
      <path d="M-6 -6 C-4 -12 4 -12 6 -6 C12 -4 12 4 6 6 C4 12 -4 12 -6 6 C-12 4 -12 -4 -6 -6 Z" fill="#BE185D" />
      <circle cx="0" cy="0" r="6" fill="#F472B6" />
      <path d="M -14 -12 C -20 -15 -20 -5 -12 -5" fill="none" stroke="#15803D" stroke-width="1.5" />
    </g>

    <path d="M -50 40 Q -30 20 0 45" fill="none" stroke="#470024" stroke-width="2" />
    <path d="M 0 45 Q 30 20 50 40" fill="none" stroke="#470024" stroke-width="2" />
    <polygon points="-25,32 -28,26 -22,31" fill="#BE185D" />
    <polygon points="25,32 28,26 22,31" fill="#BE185D" />
  </g>

  <text x="200" y="190" font-family="'Georgia', serif" font-weight="900" font-size="52" fill="#EC4899" text-anchor="middle" letter-spacing="6" opacity="0"></text>
  <text x="200" y="245" font-family="'Georgia', serif" font-weight="900" font-size="52" fill="#FFFFFF" text-anchor="middle" letter-spacing="8" opacity="0"></text>

  <text x="200" y="495" font-family="'Courier New', monospace" font-size="9.5" font-weight="900" fill="#F472B6" text-anchor="middle" letter-spacing="2" opacity="0"></text>
  <text x="200" y="522" font-family="'Georgia', serif" font-size="18" font-weight="bold" fill="#FCE7F3" text-anchor="middle" letter-spacing="3" opacity="0"></text>

  <line x1="140" y1="540" x2="260" y2="540" stroke="#BE185D" stroke-width="1" opacity="0.6" />
  <path d="M 200 534 L 200 546 M 194 540 L 206 540" stroke="#EC4899" stroke-width="1.5" />
</svg>
`;

const LACOS_INVISIVEIS_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
  <defs>
    <linearGradient id="slateBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#181E29" />
      <stop offset="50%" stop-color="#0E121A" />
      <stop offset="100%" stop-color="#05070B" />
    </linearGradient>
    <radialGradient id="redGlow" cx="50%" cy="52%" r="45%">
      <stop offset="0%" stop-color="#EF4444" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="400" height="600" fill="url(#slateBg)" />
  <rect width="400" height="600" fill="url(#redGlow)" />

  <path d="M -10 300 C 100 280 200 320 410 300" fill="none" stroke="#4B5563" stroke-width="0.5" opacity="0.3" />
  <path d="M -10 315 C 100 295 200 335 410 315" fill="none" stroke="#4B5563" stroke-width="0.5" opacity="0.25" />
  <path d="M -10 285 C 100 265 200 305 410 285" fill="none" stroke="#4B5563" stroke-width="0.5" opacity="0.2" />

  <g transform="translate(200, 310)">
    <path d="M -60 -50 C -50 -40 -30 -25 -10 -15 C -20 -15 -35 -20 -45 -15 C -55 -10 -40 0 -30 -3 C -10 5 -5 15 5 5 C -5 2 -15 -2 -20 -8 C -25 -14 -15 -18 -5 -5 C 5 5 15 15 25 10 C 35 5 25 -5 15 -15 C 5 -25 -25 -45 -45 -60" fill="#E2E8F0" fill-opacity="0.85" />
    <path d="M 60 50 C 50 40 30 25 10 15 C 20 15 35 20 45 15 C 55 10 40 0 30 3 C 10 -5 5 -15 -5 -5 C 5 -2 15 2 20 8 C 25 14 15 18 5 5 C -5 -5 -15 -15 -25 -10 C -35 -5 -25 5 -15 15 C -5 25 25 45 45 60" fill="#CBD5E1" fill-opacity="0.85" transform="scale(-1, -1)" />

    <path d="M -35 -25 C -5 -10 10 -5 35 25" fill="none" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round" />
    <path d="M 35 25 C 45 30 50 15 35 18 C 20 20 30 30 40 25" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" />
    <path d="M -20 -15 C 0 0 5 12 0 25" fill="none" stroke="#B91C1C" stroke-width="1.5" opacity="0.8" />
    <path d="M -10 -25 C -5 -5 12 0 20 15" fill="none" stroke="#B91C1C" stroke-width="1.5" opacity="0.8" />
  </g>

  <text x="200" y="185" font-family="'Georgia', serif" font-weight="bold" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="4" opacity="0"></text>
  <text x="200" y="235" font-family="'Georgia', serif" font-weight="bold" font-size="38" fill="#EF4444" text-anchor="middle" letter-spacing="5" opacity="0"></text>

  <text x="200" y="495" font-family="'Courier New', monospace" font-size="9.5" font-weight="bold" fill="#94A3B8" text-anchor="middle" letter-spacing="1.5" opacity="0"></text>
  <text x="200" y="522" font-family="'Georgia', serif" font-size="18" font-weight="bold" fill="#F8FAFC" text-anchor="middle" letter-spacing="2" opacity="0"></text>

  <line x1="160" y1="540" x2="240" y2="540" stroke="#475569" stroke-width="1" opacity="0.5" />
  <polygon points="200,537 203,540 200,543 197,540" fill="#EF4444" />
</svg>
`;

const createCoverUrl = (svgContent: string): string => {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent.trim())))}`;
};

export const DIGA_SEU_NOME_COVER = createCoverUrl(DIGA_SEU_NOME_SVG);
export const MON_AMOUR_COVER = createCoverUrl(MON_AMOUR_SVG);
export const LACOS_INVISIVEIS_COVER = createCoverUrl(LACOS_INVISIVEIS_SVG);

export const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Diga Seu Nome',
    author: 'guigoto monteiro',
    price: 49.90,
    description: 'Um sádico colecionador de segredos espalha fitas de investigação e mistérios pela cidade. Quando cada pista exige desvendar os meandros de sua própria mente, falar a verdade de sua identidade torna-se a única arma de sobrevivência.',
    isAuthored: true,
    category: 'Thriller Psicológico',
    discount: 10,
    coverImage: DIGA_SEU_NOME_COVER,
    coverStyle: {
      gradientStart: '#0F031E',
      gradientEnd: '#05010B',
      iconName: 'Eye',
      textColor: '#FFFFFF'
    },
    likes: 450,
    stars: 5,
    commentsList: [
      {
        id: 'c101',
        author: 'Felipe Sales',
        text: 'Instigante ao extremo! Demorei algumas páginas para entender o que era real, recomendo demais.',
        date: 'Hoje às 10:44'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Mon Amour',
    author: 'guigoto monteiro',
    price: 54.00,
    description: 'Um sombrio dark romance que transita entre a obsessão extrema e a atração devastadora. Diante das rachaduras da sanidade e de um pacto inquebrável, dois mundos colidem perigosamente sob o sussurro de uma paixão fatal.',
    isAuthored: true,
    category: 'Dark Romance',
    discount: 15,
    coverImage: MON_AMOUR_COVER,
    coverStyle: {
      gradientStart: '#14011B',
      gradientEnd: '#2D001F',
      iconName: 'Heart',
      textColor: '#FFFFFF'
    },
    likes: 620,
    stars: 5,
    commentsList: [
      {
        id: 'c102',
        author: 'Bia Menezes',
        text: 'A química cruel e fascinante desse romance me prendeu do início ao fim! Uma obra prima do dark romance.',
        date: 'Ontem às 21:12'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Laços Invisíveis',
    author: 'guigoto monteiro',
    price: 47.90,
    description: 'Duas vidas ligadas por um pacto implacável e um fio vermelho de obsessão. Um suspense psicológico perturbador que explora o controle mental, as armadilhas da dependência emocional e os segredos criminais de um passado insolúvel.',
    isAuthored: true,
    category: 'Thriller Psicológico',
    discount: 0,
    coverImage: LACOS_INVISIVEIS_COVER,
    coverStyle: {
      gradientStart: '#181E29',
      gradientEnd: '#05070B',
      iconName: 'Fingerprint',
      textColor: '#FFFFFF'
    },
    likes: 312,
    stars: 5,
    commentsList: [
      {
        id: 'c103',
        author: 'Dr. Heitor',
        text: 'Excelente profundidade nos distúrbios e na trama investigativa. O guigoto sabe como prender o leitor pelo pescoço.',
        date: 'Há 2 dias'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

export const COVER_GRADIENTS = [
  { start: '#1E1B4B', end: '#030712', name: 'Mar Profundo (Azul Noir)' },
  { start: '#881337', end: '#110005', name: 'Veludo Vermelho (Dark Romance)' },
  { start: '#374151', end: '#111827', name: 'Cinza Profiler (Forense)' },
  { start: '#B45309', end: '#291300', name: 'Mostarda Conspiratório' },
  { start: '#991B1B', end: '#110000', name: 'Crime Scene (Alerta Vermelho)' },
  { start: '#4C1D95', end: '#0F051D', name: 'Roxo Delírio (Psicológico)' },
  { start: '#111827', end: '#020617', name: 'Abismo Mental (Cinzento)' },
  { start: '#155E75', end: '#022C22', name: 'Ciano Neon (Gossip/Obsessão)' }
];

export const COVER_ICONS = [
  'Brain',
  'Heart',
  'Fingerprint',
  'Key',
  'Mic',
  'Eye',
  'Glasses',
  'Search',
  'BookOpen',
  'FileText',
  'Timer',
  'AlertTriangle'
];

