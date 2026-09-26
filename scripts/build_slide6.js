import fs from 'fs';
import path from 'path';

const imgPath = 'c:/Users/TUF/Downloads/triangle-properties-grade5/triangle-properties-grade5/src/assets/story/2.png';
const base64 = fs.readFileSync(imgPath).toString('base64');
const dataUri = 'data:image/png;base64,' + base64;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="#2a1254"/>
      <stop offset="55%" stop-color="#14072f"/>
      <stop offset="100%" stop-color="#0a0319"/>
    </radialGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="900" fill="url(#bgGrad)"/>

  <!-- Background Ambient Stars -->
  <g fill="#fde047" opacity="0.6">
    <circle cx="120" cy="80" r="3"/>
    <circle cx="240" cy="140" r="2"/>
    <circle cx="1080" cy="100" r="3.5"/>
    <circle cx="960" cy="60" r="2"/>
    <circle cx="80" cy="650" r="2.5"/>
    <circle cx="1120" cy="720" r="3"/>
    <circle cx="180" cy="820" r="2"/>
    <circle cx="1020" cy="830" r="2.5"/>
  </g>

  <!-- Top Title Banner Pill -->
  <g transform="translate(600, 48)" text-anchor="middle">
    <rect x="-260" y="-28" width="520" height="52" rx="26" fill="#1e0e45" stroke="#a855f7" stroke-width="2.5" filter="url(#glow)"/>
    <text y="7" fill="#fde047" font-family="'Nunito', system-ui, sans-serif" font-size="24" font-weight="900" letter-spacing="1.5">
      ✨ EVERY TRIANGLE'S SECRET ✨
    </text>
  </g>

  <!-- Centered Hero Illustration (Owl, Triangle & Angle Sum Banner) -->
  <g filter="url(#glow)">
    <image href="${dataUri}" x="50" y="85" width="1100" height="440" preserveAspectRatio="xMidYMid meet"/>
  </g>

  <!-- Bottom Interactive Callout Card -->
  <g transform="translate(600, 695)">
    <!-- Card Frame -->
    <rect x="-480" y="-125" width="960" height="230" rx="28" fill="#160838" stroke="#facc15" stroke-width="3" filter="url(#glow)"/>
    
    <!-- Top Pill inside card -->
    <rect x="-200" y="-148" width="400" height="44" rx="22" fill="#facc15"/>
    <text x="0" y="-119" fill="#0c0424" font-family="'Nunito', system-ui, sans-serif" font-size="19" font-weight="900" text-anchor="middle" letter-spacing="1">
      ANGLE SUM PROPERTY
    </text>

    <!-- Formula Headline -->
    <text x="0" y="-55" fill="#ffffff" font-family="'Nunito', system-ui, sans-serif" font-size="36" font-weight="900" text-anchor="middle">
      ∠A + ∠B + ∠C = <tspan fill="#facc15" font-size="44">180°</tspan>
    </text>

    <!-- Subtitle explanation -->
    <text x="0" y="-8" fill="#e2e8f0" font-family="'Nunito', system-ui, sans-serif" font-size="21" font-weight="800" text-anchor="middle">
      True for <tspan fill="#38bdf8">EVERY</tspan> triangle: tiny, huge, acute, right, or obtuse!
    </text>

    <!-- 3 Angle Color Badges -->
    <g transform="translate(0, 48)" text-anchor="middle">
      <!-- Angle A -->
      <rect x="-310" y="-20" width="190" height="40" rx="20" fill="#065f46" stroke="#34d399" stroke-width="2"/>
      <text x="-215" y="6" fill="#a7f3d0" font-family="'Nunito', sans-serif" font-size="17" font-weight="900">∠A = 65°</text>

      <text x="-95" y="8" fill="#fde047" font-family="'Nunito', sans-serif" font-size="26" font-weight="900">+</text>

      <!-- Angle B -->
      <rect x="-65" y="-20" width="190" height="40" rx="20" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
      <text x="30" y="6" fill="#bfdbfe" font-family="'Nunito', sans-serif" font-size="17" font-weight="900">∠B = 75°</text>

      <text x="150" y="8" fill="#fde047" font-family="'Nunito', sans-serif" font-size="26" font-weight="900">+</text>

      <!-- Angle C -->
      <rect x Seine="180" x="180" y="-20" width="190" height="40" rx="20" fill="#78350f" stroke="#fbbf24" stroke-width="2"/>
      <text x="275" y="6" fill="#fde68a" font-family="'Nunito', sans-serif" font-size="17" font-weight="900">∠C = 40°</text>
    </g>
  </g>
</svg>`;

const outPath = path.resolve('public/assets/images/slide6.svg');
fs.writeFileSync(outPath, svg);
console.log('Done! Generated:', outPath, 'Length:', svg.length);
