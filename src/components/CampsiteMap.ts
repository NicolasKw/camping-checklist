import type { AppState } from '../types/index.js';
import type { StateManager } from '../state/StateManager.js';
import { campingZones } from '../data/campingData.js';

export class CampsiteMap {
  private container: HTMLElement;
  private stateManager: StateManager;
  private svgEl: SVGSVGElement | null = null;

  constructor(container: HTMLElement, stateManager: StateManager) {
    this.container = container;
    this.stateManager = stateManager;
    this.render();
    this.stateManager.subscribe(state => this.update(state));
  }

  private render(): void {
    this.container.innerHTML = this.buildSVG();
    this.svgEl = this.container.querySelector('svg');
    this.attachEventListeners();
    this.update(this.stateManager.getState());
  }

  private buildSVG(): string {
    return `
<svg viewBox="0 0 900 700" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa mágico del campamento de Hogwarts">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--sky-top)" />
      <stop offset="100%" stop-color="var(--sky-bottom)" />
    </linearGradient>
    <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#141e08" />
      <stop offset="100%" stop-color="#0a1205" />
    </linearGradient>
    <linearGradient id="lakeGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#060318" />
      <stop offset="100%" stop-color="#0a0528" />
    </linearGradient>
    <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f5f0c8" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#f5f0c8" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="candleGlow" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#c8802a" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#c8802a" stop-opacity="0" />
    </radialGradient>

    <!-- Zone filters — magical glows -->
    <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#c9a84c" flood-opacity="0.75"/>
    </filter>
    <filter id="glowPurple" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#7b2fbf" flood-opacity="0.80"/>
    </filter>
    <filter id="glowAmber" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#c89028" flood-opacity="0.75"/>
    </filter>
    <filter id="glowBlue" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#3a6ab0" flood-opacity="0.75"/>
    </filter>
    <filter id="glowGreen" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="9" flood-color="#1a8030" flood-opacity="0.70"/>
    </filter>
    <filter id="glowTeal" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#1e8060" flood-opacity="0.75"/>
    </filter>
    <filter id="glowRed" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#9b1c1c" flood-opacity="0.75"/>
    </filter>
    <filter id="glowCamara" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="9" flood-color="#1a6040" flood-opacity="0.78"/>
    </filter>
    <filter id="glowQuidditch" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#3a6a10" flood-opacity="0.75"/>
    </filter>

    <clipPath id="skyClip">
      <rect x="0" y="0" width="900" height="280"/>
    </clipPath>
  </defs>

  <!-- ═══ SKY ═══ -->
  <rect width="900" height="700" fill="url(#skyGrad)" rx="10"/>

  <!-- Stars -->
  <g class="stars-group">
    ${this.buildStars()}
  </g>

  <!-- Moon -->
  <circle cx="820" cy="58" r="40" fill="url(#moonGlow)" opacity="var(--moon-opacity)"/>
  <circle cx="820" cy="58" r="26" fill="#f8f2d0" opacity="var(--moon-opacity)" style="transition: opacity var(--transition-speed) ease;"/>
  <circle cx="832" cy="48" r="20" fill="var(--sky-top)" opacity="var(--moon-opacity)" style="transition: opacity var(--transition-speed) ease, fill var(--transition-speed) ease;"/>

  <!-- ═══ HOGWARTS CASTLE ═══ -->
  <g id="hogwarts-castle" opacity="0.92">
    <!-- Outer walls suggestion -->
    <rect x="295" y="195" width="345" height="20" fill="#06040e" opacity="0.6"/>

    <!-- Main Great Hall body -->
    <rect x="315" y="145" width="305" height="55" fill="#08061a"/>
    <rect x="322" y="152" width="291" height="45" fill="#0c0a22" opacity="0.7"/>

    <!-- Battlements on main hall -->
    ${this.buildBattlements(315, 138, 305, 12, 18)}

    <!-- Far left tower -->
    <rect x="295" y="88" width="26" height="60" fill="#07051a"/>
    <polygon points="295,88 308,68 321,88" fill="#09071e"/>
    <rect x="300" y="100" width="6" height="9" rx="1" fill="#c8902a" opacity="0.55"/>
    <rect x="310" y="100" width="6" height="9" rx="1" fill="#c8902a" opacity="0.45"/>

    <!-- Left tower -->
    <rect x="348" y="58" width="36" height="90" fill="#08061a"/>
    <polygon points="348,58 366,34 384,58" fill="#0b091e"/>
    <rect x="354" y="72" width="7" height="11" rx="1" fill="#c8902a" opacity="0.65"/>
    <rect x="367" y="72" width="7" height="11" rx="1" fill="#c8902a" opacity="0.60"/>
    <rect x="354" y="96" width="7" height="10" rx="1" fill="#c8902a" opacity="0.50"/>
    <rect x="367" y="96" width="7" height="10" rx="1" fill="#c8902a" opacity="0.45"/>
    <!-- Left tower battlements -->
    ${this.buildBattlements(348, 52, 36, 8, 10)}

    <!-- Central main tower (tallest) -->
    <rect x="430" y="22" width="46" height="125" fill="#09071c"/>
    <polygon points="430,22 453,2 476,22" fill="#0c0a20"/>
    <!-- Pennant -->
    <polygon points="453,2 453,18 465,10" fill="#7b0000" opacity="0.8"/>
    <rect x="437" y="38" width="8" height="13" rx="1" fill="#c8902a" opacity="0.70"/>
    <rect x="452" y="38" width="8" height="13" rx="1" fill="#c8902a" opacity="0.75"/>
    <rect x="462" y="38" width="8" height="13" rx="1" fill="#c8902a" opacity="0.65"/>
    <rect x="437" y="65" width="8" height="12" rx="1" fill="#c8902a" opacity="0.60"/>
    <rect x="452" y="65" width="8" height="12" rx="1" fill="#c8902a" opacity="0.65"/>
    <rect x="462" y="65" width="8" height="12" rx="1" fill="#c8902a" opacity="0.55"/>
    <rect x="437" y="92" width="8" height="11" rx="1" fill="#c8902a" opacity="0.50"/>
    <rect x="452" y="92" width="8" height="11" rx="1" fill="#c8902a" opacity="0.55"/>
    <!-- Central battlements -->
    ${this.buildBattlements(430, 16, 46, 9, 12)}

    <!-- Right tower -->
    <rect x="542" y="50" width="36" height="98" fill="#08061a"/>
    <polygon points="542,50 560,28 578,50" fill="#0b091e"/>
    <rect x="548" y="64" width="7" height="11" rx="1" fill="#c8902a" opacity="0.60"/>
    <rect x="561" y="64" width="7" height="11" rx="1" fill="#c8902a" opacity="0.65"/>
    <rect x="548" y="90" width="7" height="10" rx="1" fill="#c8902a" opacity="0.48"/>
    <rect x="561" y="90" width="7" height="10" rx="1" fill="#c8902a" opacity="0.52"/>
    ${this.buildBattlements(542, 44, 36, 8, 10)}

    <!-- Astronomy tower (circular top) -->
    <rect x="592" y="40" width="28" height="108" fill="#07051a"/>
    <circle cx="606" cy="40" r="16" fill="#08061c"/>
    <polygon points="592,40 606,18 620,40" fill="#0b091e"/>
    <rect x="597" y="58" width="7" height="10" rx="1" fill="#c8902a" opacity="0.60"/>
    <rect x="610" y="58" width="7" height="10" rx="1" fill="#c8902a" opacity="0.55"/>
    <rect x="597" y="82" width="7" height="9" rx="1" fill="#c8902a" opacity="0.45"/>
    <rect x="610" y="82" width="7" fill="#c8902a" height="9" rx="1" opacity="0.42"/>

    <!-- Great Hall windows -->
    <rect x="330" y="158" width="10" height="16" rx="2" fill="#c8902a" opacity="0.50"/>
    <rect x="352" y="158" width="10" height="16" rx="2" fill="#c8902a" opacity="0.55"/>
    <rect x="374" y="158" width="10" height="16" rx="2" fill="#c8902a" opacity="0.48"/>
    <rect x="430" y="158" width="10" height="16" rx="2" fill="#c8902a" opacity="0.52"/>
    <rect x="452" y="158" width="10" height="16" rx="2" fill="#c8902a" opacity="0.58"/>
    <rect x="474" y="158" width="10" height="16" rx="2" fill="#c8902a" opacity="0.50"/>
    <rect x="510" y="158" width="10" height="16" rx="2" fill="#c8902a" opacity="0.55"/>
    <rect x="532" y="158" width="10" height="16" rx="2" fill="#c8902a" opacity="0.48"/>
    <rect x="554" y="158" width="10" height="16" rx="2" fill="#c8902a" opacity="0.52"/>

    <!-- Castle gate/entrance -->
    <rect x="436" y="168" width="36" height="32" rx="18" fill="#04030a"/>
    <rect x="440" y="172" width="28" height="28" rx="14" fill="#04030a"/>

    <!-- Ambient warm glow from castle windows -->
    <ellipse cx="453" cy="175" rx="140" ry="45" fill="url(#candleGlow)"/>
  </g>

  <!-- ═══ BLACK LAKE ═══ -->
  <g id="black-lake">
    <ellipse cx="130" cy="240" rx="128" ry="85" fill="url(#lakeGrad)" opacity="0.95"/>
    <ellipse cx="125" cy="235" rx="108" ry="70" fill="#08041e" opacity="0.8"/>
    <!-- Subtle ripples -->
    <ellipse cx="118" cy="248" rx="68" ry="18" fill="none" stroke="#1a1050" stroke-width="1" opacity="0.5"/>
    <ellipse cx="125" cy="260" rx="88" ry="24" fill="none" stroke="#140c40" stroke-width="1" opacity="0.35"/>
    <!-- Castle reflection (blurry) -->
    <rect x="380" y="248" width="110" height="30" fill="#0d0a24" opacity="0.3" transform="skewX(-15) translate(-260, 0)"/>
    <!-- Moon reflection -->
    <ellipse cx="148" cy="255" rx="12" ry="5" fill="#f5f0c8" opacity="0.12"/>
    <!-- Lake shimmer -->
    <line x1="75" y1="235" x2="100" y2="230" stroke="#2a1a60" stroke-width="1.5" opacity="0.4"/>
    <line x1="115" y1="244" x2="145" y2="238" stroke="#2a1a60" stroke-width="1.5" opacity="0.35"/>
    <line x1="158" y1="252" x2="178" y2="246" stroke="#2a1a60" stroke-width="1.5" opacity="0.3"/>
    <text x="130" y="298" text-anchor="middle" fill="#2a1a60" font-size="10" font-family="'Cinzel', serif" font-style="italic" opacity="0.55" letter-spacing="0.1em">Lago Negro</text>
  </g>

  <!-- Ambient birds/owls group -->
  <g id="ambient-birds" clip-path="url(#skyClip)"></g>

  <!-- ═══ GROUND ═══ -->
  <rect x="0" y="380" width="900" height="320" fill="#0e1608" rx="0"/>
  <rect x="0" y="380" width="900" height="320" fill="url(#groundGrad)" opacity="0.7"/>
  <!-- Ground horizon line -->
  <path d="M 0 380 Q 200 372 450 376 Q 680 380 900 374" fill="none" stroke="#1a2a0a" stroke-width="2" opacity="0.5"/>

  <!-- ═══ FORBIDDEN FOREST ═══ -->
  <g id="forbidden-forest">
    <!-- Dense forest mass -->
    <ellipse cx="845" cy="300" rx="75" ry="220" fill="#030805" opacity="0.97"/>
    <ellipse cx="870" cy="320" rx="55" ry="200" fill="#020603" opacity="0.95"/>
    <!-- Individual gnarled trees -->
    ${this.buildForestTrees()}
    <!-- Eerie glow from within forest -->
    <ellipse cx="828" cy="360" rx="40" ry="80" fill="#0a2a0a" opacity="0.3"/>
    <ellipse cx="818" cy="400" rx="25" ry="50" fill="#143014" opacity="0.2"/>
    <!-- Forest boundary -->
    <path d="M 770 200 Q 790 280 775 360 Q 760 440 780 520 Q 790 580 770 640"
          fill="none" stroke="#0d1a0d" stroke-width="3" opacity="0.6"/>
  </g>

  <!-- ═══ COBBLESTONE PATHS ═══ -->
  <g stroke="#2a2030" stroke-width="8" fill="none" opacity="0.6" stroke-linecap="round" stroke-dasharray="14,6">
    <!-- Castle to tent -->
    <path d="M 453 215 L 445 260"/>
    <!-- Tent to cauldron -->
    <path d="M 445 295 L 450 350"/>
    <!-- Cauldron to feast table -->
    <path d="M 498 390 Q 550 390 595 385"/>
    <!-- Cauldron to trunk -->
    <path d="M 402 390 Q 350 388 295 380"/>
    <!-- Left to hygiene -->
    <path d="M 220 440 Q 200 460 195 490"/>
    <!-- Right to infirmary -->
    <path d="M 680 440 Q 670 460 660 490"/>
    <!-- Cauldron to forest path -->
    <path d="M 500 400 Q 620 420 720 390"/>
    <!-- Cauldron to chamber -->
    <path d="M 450 440 L 450 505"/>
  </g>
  <!-- Stone texture on paths -->
  <g stroke="#1e1828" stroke-width="3" fill="none" opacity="0.35" stroke-linecap="round" stroke-dasharray="6,10">
    <path d="M 453 215 L 445 260"/>
    <path d="M 445 295 L 450 350"/>
    <path d="M 498 390 Q 550 390 595 385"/>
    <path d="M 402 390 Q 350 388 295 380"/>
    <path d="M 450 440 L 450 505"/>
  </g>

  <!-- ═══ ZONE: TIENDA MÁGICA (carpa) ═══ -->
  <g id="zone-carpa" class="zone-area" tabindex="0" role="button"
     aria-label="Tienda Mágica — click para ver items" data-zone="carpa" data-filter="glowGold">
    <g class="zone-fill-group">
      <!-- Tent shadow/base -->
      <ellipse cx="445" cy="285" rx="72" ry="18" fill="#030208" opacity="0.6"/>
      <!-- Tent body (right panel) -->
      <polygon points="445,120 375,278 515,278" fill="#6b1a1a" opacity="0.88" class="zone-fill"/>
      <!-- Tent left panel (lighter) -->
      <polygon points="445,120 375,278 410,278 445,145" fill="#8b2222" opacity="0.82" class="zone-fill"/>
      <!-- Tent right panel -->
      <polygon points="445,120 515,278 480,278 445,145" fill="#7a1c1c" opacity="0.82" class="zone-fill"/>
      <!-- Gold stripe detail -->
      <polygon points="445,120 440,135 450,135" fill="#c9a84c" opacity="0.6"/>
      <line x1="445" y1="120" x2="375" y2="278" stroke="#c9a84c" stroke-width="1" opacity="0.25"/>
      <line x1="445" y1="120" x2="515" y2="278" stroke="#c9a84c" stroke-width="1" opacity="0.25"/>
      <line x1="445" y1="120" x2="415" y2="278" stroke="#c9a84c" stroke-width="0.8" opacity="0.18"/>
      <line x1="445" y1="120" x2="475" y2="278" stroke="#c9a84c" stroke-width="0.8" opacity="0.18"/>
      <!-- Star motifs on tent -->
      <text x="420" y="185" font-size="12" fill="#c9a84c" opacity="0.35" text-anchor="middle">✦</text>
      <text x="468" y="200" font-size="10" fill="#c9a84c" opacity="0.30" text-anchor="middle">✦</text>
      <text x="440" y="230" font-size="9" fill="#c9a84c" opacity="0.25" text-anchor="middle">✧</text>
      <!-- Tent entrance -->
      <ellipse cx="445" cy="276" rx="22" ry="14" fill="#1a0808" opacity="0.9"/>
      <!-- Interior warm glow -->
      <ellipse cx="445" cy="260" rx="40" ry="18" fill="#ff8800" opacity="0.06"/>
      <!-- Tent pole peak pennant -->
      <polygon points="445,120 445,107 460,113" fill="#c9a84c" opacity="0.65"/>
      <!-- Guy ropes -->
      <line x1="445" y1="120" x2="398" y2="95" stroke="#5a4020" stroke-width="1.5" opacity="0.5"/>
      <line x1="445" y1="120" x2="492" y2="95" stroke="#5a4020" stroke-width="1.5" opacity="0.5"/>
      <circle cx="398" cy="95" r="3" fill="#5a4020" opacity="0.5"/>
      <circle cx="492" cy="95" r="3" fill="#5a4020" opacity="0.5"/>
    </g>
    <text x="445" y="318" text-anchor="middle" class="zone-label"
          fill="#c9a84c" font-size="13" font-weight="700" font-family="'Cinzel', serif" letter-spacing="0.04em">🏕️ Tienda Mágica</text>
    <g id="badge-carpa" transform="translate(512, 132)">
      <circle r="16" class="zone-badge-circle" fill="#9b2626"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/6</text>
    </g>
  </g>

  <!-- ═══ ZONE: EL CALDERO (fogon) ═══ -->
  <g id="zone-fogon" class="zone-area" tabindex="0" role="button"
     aria-label="El Caldero — click para ver items" data-zone="fogon" data-filter="glowPurple">
    <g class="zone-fill-group">
      <!-- Cauldron shadow -->
      <ellipse cx="450" cy="432" rx="52" ry="12" fill="#030208" opacity="0.55"/>
      <!-- Stone ring -->
      ${this.buildStones(450, 415, 46, 10)}
      <!-- Cauldron body (wide at bottom, narrower at top) -->
      <path d="M 408 410 Q 400 368 450 360 Q 500 368 492 410 Q 482 434 450 434 Q 418 434 408 410 Z"
            fill="#12101e" opacity="0.95" class="zone-fill"/>
      <!-- Cauldron rim -->
      <ellipse cx="450" cy="408" rx="42" ry="12" fill="#1e1c32" opacity="0.95" class="zone-fill"/>
      <!-- Cauldron legs -->
      <rect x="428" y="430" width="9" height="12" rx="3" fill="#0c0a1a" opacity="0.9"/>
      <rect x="446" y="432" width="9" height="10" rx="3" fill="#0c0a1a" opacity="0.9"/>
      <rect x="464" y="430" width="9" height="12" rx="3" fill="#0c0a1a" opacity="0.9"/>
      <!-- Bubbling liquid inside -->
      <ellipse cx="450" cy="405" rx="34" ry="9" fill="#0a1e14" opacity="0.9"/>
      <circle cx="434" cy="403" r="5" fill="#14401e" opacity="0.7"/>
      <circle cx="452" cy="400" r="6" fill="#0e3018" opacity="0.8"/>
      <circle cx="464" cy="404" r="4" fill="#18501e" opacity="0.6"/>
      <!-- Magical steam -->
      <ellipse cx="445" cy="365" rx="8" ry="3" fill="#4ecdc4" opacity="0.12"/>
      <ellipse cx="456" cy="360" rx="6" ry="2.5" fill="#7b2fbf" opacity="0.10"/>
      <!-- Magical flames: purple & teal -->
      <g id="fire-group">
        <ellipse cx="438" cy="380" rx="7" ry="22" fill="#7b00ff" class="flame flame-1"
                 opacity="var(--flame-opacity)" transform-origin="438px 400px"/>
        <ellipse cx="450" cy="373" rx="8" ry="28" fill="#4ecdc4" class="flame flame-2"
                 opacity="var(--flame-opacity)" transform-origin="450px 400px"/>
        <ellipse cx="462" cy="381" rx="6" ry="20" fill="#00cc66" class="flame flame-3"
                 opacity="var(--flame-opacity)" transform-origin="462px 400px"/>
        <!-- Inner bright core -->
        <ellipse cx="445" cy="383" rx="4" ry="14" fill="#c0ffee" class="flame flame-2"
                 opacity="calc(var(--flame-opacity) * 0.65)" transform-origin="445px 400px"/>
        <ellipse cx="454" cy="386" rx="3" ry="11" fill="#ffffff" class="flame flame-1"
                 opacity="calc(var(--flame-opacity) * 0.45)" transform-origin="454px 400px"/>
      </g>
      <!-- Purple magic glow -->
      <circle cx="450" cy="400" r="58" fill="#5500cc" opacity="0" class="fogon-glow" style="mix-blend-mode: screen;"/>
    </g>
    <text x="450" y="460" text-anchor="middle" class="zone-label"
          fill="#a070e0" font-size="13" font-weight="700" font-family="'Cinzel', serif" letter-spacing="0.04em">🧪 El Caldero</text>
    <g id="badge-fogon" transform="translate(494, 360)">
      <circle r="16" class="zone-badge-circle" fill="#2a1a5c"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/6</text>
    </g>
  </g>

  <!-- ═══ ZONE: MESA DEL FESTÍN (cocina) ═══ -->
  <g id="zone-cocina" class="zone-area" tabindex="0" role="button"
     aria-label="Mesa del Festín — click para ver items" data-zone="cocina" data-filter="glowAmber">
    <g class="zone-fill-group">
      <!-- Table shadow -->
      <ellipse cx="665" cy="445" rx="78" ry="12" fill="#030208" opacity="0.5"/>
      <!-- Long feast table (dark oak) -->
      <rect x="592" y="355" width="146" height="82" rx="6" fill="#2a1e08" opacity="0.92" class="zone-fill"/>
      <rect x="598" y="361" width="134" height="70" rx="4" fill="#3a2810" opacity="0.80" class="zone-fill"/>
      <!-- Table wood grain suggestion -->
      <line x1="598" y1="375" x2="732" y2="375" stroke="#4a3418" stroke-width="0.8" opacity="0.4"/>
      <line x1="598" y1="390" x2="732" y2="390" stroke="#4a3418" stroke-width="0.8" opacity="0.35"/>
      <line x1="598" y1="405" x2="732" y2="405" stroke="#4a3418" stroke-width="0.8" opacity="0.4"/>
      <line x1="598" y1="420" x2="732" y2="420" stroke="#4a3418" stroke-width="0.8" opacity="0.35"/>
      <!-- Table legs -->
      <rect x="602" y="428" width="10" height="18" rx="3" fill="#221605" opacity="0.9"/>
      <rect x="718" y="428" width="10" height="18" rx="3" fill="#221605" opacity="0.9"/>
      <!-- Goblets & platters on table -->
      <ellipse cx="625" cy="388" rx="9" ry="7" fill="#c9a84c" opacity="0.55"/>
      <rect x="621" y="381" width="8" height="10" rx="2" fill="#c9a84c" opacity="0.40"/>
      <ellipse cx="665" cy="388" rx="14" ry="9" fill="#5a3a10" opacity="0.65"/>
      <ellipse cx="665" cy="385" rx="11" ry="7" fill="#7a5018" opacity="0.55"/>
      <ellipse cx="705" cy="388" rx="9" ry="7" fill="#c9a84c" opacity="0.55"/>
      <rect x="701" y="381" width="8" height="10" rx="2" fill="#c9a84c" opacity="0.40"/>
      <ellipse cx="645" cy="415" rx="10" ry="7" fill="#6a4010" opacity="0.6"/>
      <ellipse cx="685" cy="415" rx="10" ry="7" fill="#6a4010" opacity="0.6"/>
      <!-- Floating candles above table (simplified) -->
      <rect x="620" y="343" width="5" height="12" rx="1" fill="#f0d060" opacity="0.50"/>
      <ellipse cx="622" cy="342" rx="4" ry="2" fill="#ffee88" opacity="0.55"/>
      <rect x="660" y="340" width="5" height="14" rx="1" fill="#f0d060" opacity="0.55"/>
      <ellipse cx="662" cy="339" rx="4" ry="2" fill="#ffee88" opacity="0.60"/>
      <rect x="700" y="343" width="5" height="12" rx="1" fill="#f0d060" opacity="0.50"/>
      <ellipse cx="702" cy="342" rx="4" ry="2" fill="#ffee88" opacity="0.55"/>
      <!-- Bench left -->
      <rect x="570" y="368" width="18" height="56" rx="4" fill="#3a2808" opacity="0.80"/>
      <!-- Bench right -->
      <rect x="742" y="368" width="18" height="56" rx="4" fill="#3a2808" opacity="0.80"/>
    </g>
    <text x="665" y="474" text-anchor="middle" class="zone-label"
          fill="#c9a84c" font-size="13" font-weight="700" font-family="'Cinzel', serif" letter-spacing="0.04em">🍖 Mesa del Festín</text>
    <g id="badge-cocina" transform="translate(744, 353)">
      <circle r="16" class="zone-badge-circle" fill="#7a5a10"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/9</text>
    </g>
  </g>

  <!-- ═══ ZONE: BAÚL ENCANTADO (almacenamiento) ═══ -->
  <g id="zone-almacenamiento" class="zone-area" tabindex="0" role="button"
     aria-label="Baúl Encantado — click para ver items" data-zone="almacenamiento" data-filter="glowGold">
    <g class="zone-fill-group">
      <!-- Trunk shadow -->
      <ellipse cx="213" cy="443" rx="65" ry="12" fill="#030208" opacity="0.5"/>
      <!-- Trunk base body -->
      <rect x="155" y="358" width="116" height="78" rx="6" fill="#2a1a08" opacity="0.92" class="zone-fill"/>
      <rect x="161" y="364" width="104" height="66" rx="4" fill="#3a240c" opacity="0.80" class="zone-fill"/>
      <!-- Metal hasps/straps -->
      <rect x="155" y="380" width="116" height="6" rx="2" fill="#c9a84c" opacity="0.35"/>
      <rect x="155" y="410" width="116" height="6" rx="2" fill="#c9a84c" opacity="0.35"/>
      <rect x="207" y="358" width="12" height="78" rx="2" fill="#c9a84c" opacity="0.25"/>
      <!-- Lock -->
      <rect x="204" y="390" width="18" height="16" rx="4" fill="#c9a84c" opacity="0.55"/>
      <rect x="207" y="388" width="12" height="6" rx="6" fill="none" stroke="#c9a84c" stroke-width="2" opacity="0.55"/>
      <!-- Corner reinforcements -->
      <rect x="155" y="358" width="12" height="12" rx="0" fill="#c9a84c" opacity="0.30"/>
      <rect x="259" y="358" width="12" height="12" rx="0" fill="#c9a84c" opacity="0.30"/>
      <rect x="155" y="424" width="12" height="12" rx="0" fill="#c9a84c" opacity="0.30"/>
      <rect x="259" y="424" width="12" height="12" rx="0" fill="#c9a84c" opacity="0.30"/>
      <!-- Magical glow around edges -->
      <rect x="153" y="356" width="120" height="82" rx="7" fill="none"
            stroke="#c9a84c" stroke-width="1" opacity="0.20"/>
      <!-- Items beside trunk -->
      <circle cx="152" cy="408" r="14" fill="none" stroke="#c9a84c" stroke-width="2" opacity="0.45"/>
      <circle cx="152" cy="408" r="9" fill="none" stroke="#c9a84c" stroke-width="1.5" opacity="0.35"/>
      <circle cx="152" cy="408" r="4" fill="#c9a84c" opacity="0.35"/>
      <!-- Rope coil -->
      <circle cx="278" cy="400" r="16" fill="none" stroke="#8a6820" stroke-width="3" opacity="0.6"/>
      <circle cx="278" cy="400" r="10" fill="none" stroke="#8a6820" stroke-width="2" opacity="0.5"/>
      <circle cx="278" cy="400" r="4" fill="#8a6820" opacity="0.5"/>
    </g>
    <text x="213" y="468" text-anchor="middle" class="zone-label"
          fill="#c9a84c" font-size="13" font-weight="700" font-family="'Cinzel', serif" letter-spacing="0.04em">🧳 Baúl Encantado</text>
    <g id="badge-almacenamiento" transform="translate(278, 356)">
      <circle r="16" class="zone-badge-circle" fill="#5c3a1e"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/5</text>
    </g>
  </g>

  <!-- ═══ ZONE: BAÑOS ENCANTADOS (higiene) ═══ -->
  <g id="zone-higiene" class="zone-area" tabindex="0" role="button"
     aria-label="Baños Encantados — click para ver items" data-zone="higiene" data-filter="glowBlue">
    <g class="zone-fill-group">
      <!-- Stone walls -->
      <rect x="128" y="492" width="122" height="88" rx="8" fill="#0e1830" opacity="0.90" class="zone-fill"/>
      <rect x="134" y="498" width="110" height="76" rx="6" fill="#14203a" opacity="0.75" class="zone-fill"/>
      <!-- Stone wall texture suggestion -->
      <rect x="128" y="492" width="10" height="88" rx="4" fill="#0a1225" opacity="0.70"/>
      <rect x="240" y="492" width="10" height="88" rx="4" fill="#0a1225" opacity="0.70"/>
      <line x1="128" y1="522" x2="250" y2="522" stroke="#0a1225" stroke-width="1.5" opacity="0.45"/>
      <line x1="128" y1="552" x2="250" y2="552" stroke="#0a1225" stroke-width="1.5" opacity="0.45"/>
      <!-- Basin -->
      <ellipse cx="172" cy="532" rx="22" ry="16" fill="#0e2840" opacity="0.85"/>
      <ellipse cx="172" cy="530" rx="16" ry="11" fill="#142e4a" opacity="0.80"/>
      <!-- Water shimmer -->
      <ellipse cx="170" cy="528" rx="10" ry="5" fill="#3a70a0" opacity="0.30"/>
      <!-- Bottles/supplies -->
      <rect x="212" y="502" width="10" height="22" rx="4" fill="#3a6090" opacity="0.65"/>
      <ellipse cx="217" cy="500" rx="5" ry="3" fill="#4a70a0" opacity="0.55"/>
      <rect x="226" y="506" width="8" height="18" rx="3" fill="#2a5080" opacity="0.65"/>
      <!-- Blue water drops -->
      <ellipse cx="152" cy="558" rx="5" ry="7" fill="#4a80b0" opacity="0.50"/>
      <ellipse cx="164" cy="563" rx="4" ry="6" fill="#3a70a0" opacity="0.45"/>
      <!-- Curtain/privacy screen -->
      <path d="M 128 492 Q 140 520 130 550 Q 138 575 128 580"
            fill="none" stroke="#1a2a50" stroke-width="4" opacity="0.50"/>
    </g>
    <text x="189" y="600" text-anchor="middle" class="zone-label"
          fill="#4a80b0" font-size="13" font-weight="700" font-family="'Cinzel', serif" letter-spacing="0.04em">🛁 Baños Encantados</text>
    <g id="badge-higiene" transform="translate(257, 490)">
      <circle r="16" class="zone-badge-circle" fill="#1a3560"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/7</text>
    </g>
  </g>

  <!-- ═══ ZONE: BOSQUE PROHIBIDO (senderos) ═══ -->
  <g id="zone-senderos" class="zone-area" tabindex="0" role="button"
     aria-label="Bosque Prohibido — click para ver items" data-zone="senderos" data-filter="glowGreen">
    <g class="zone-fill-group">
      <!-- Forest zone fill -->
      <path d="M 720 285 Q 762 310 748 375 Q 735 440 762 480 L 825 475 Q 840 438 828 372 Q 815 308 845 285 Z"
            fill="#070f04" opacity="0.88" class="zone-fill"/>
      <!-- Eerie glow within -->
      <ellipse cx="775" cy="385" rx="30" ry="70" fill="#0a2a0a" opacity="0.50"/>
      <!-- Gnarled trees in zone -->
      ${this.buildZoneTree(748, 310, 0.8)}
      ${this.buildZoneTree(780, 340, 0.9)}
      ${this.buildZoneTree(760, 390, 0.85)}
      ${this.buildZoneTree(795, 420, 0.75)}
      ${this.buildZoneTree(752, 445, 0.8)}
      <!-- Path into forest (glowing markers) -->
      <path d="M 720 390 Q 742 390 762 395 Q 778 400 795 398"
            stroke="#2a6a2a" stroke-width="2" fill="none" opacity="0.5" stroke-dasharray="8,5"/>
      <!-- Glowing mushrooms as trail markers -->
      <ellipse cx="728" cy="396" rx="6" ry="3" fill="#2a8a2a" opacity="0.65"/>
      <rect x="727" y="393" width="3" height="6" rx="1" fill="#1a5a1a" opacity="0.7"/>
      <ellipse cx="744" cy="398" rx="5" ry="3" fill="#2a8a2a" opacity="0.60"/>
      <rect x="743" y="395" width="3" height="5" rx="1" fill="#1a5a1a" opacity="0.65"/>
      <ellipse cx="760" cy="400" rx="5" ry="3" fill="#3a9a3a" opacity="0.65"/>
      <rect x="759" y="397" width="3" height="5" rx="1" fill="#1a5a1a" opacity="0.65"/>
      <!-- Eyes in the dark (subtle) -->
      <ellipse cx="808" cy="355" rx="3" ry="2" fill="#aaff44" opacity="0.35"/>
      <ellipse cx="816" cy="355" rx="3" ry="2" fill="#aaff44" opacity="0.35"/>
      <ellipse cx="800" cy="410" rx="2.5" ry="1.8" fill="#aaff44" opacity="0.25"/>
      <ellipse cx="806" cy="410" rx="2.5" ry="1.8" fill="#aaff44" opacity="0.25"/>
    </g>
    <text x="778" y="496" text-anchor="middle" class="zone-label"
          fill="#2a8030" font-size="13" font-weight="700" font-family="'Cinzel', serif" letter-spacing="0.04em">🌲 Bosque Prohibido</text>
    <g id="badge-senderos" transform="translate(848, 283)">
      <circle r="16" class="zone-badge-circle" fill="#0d2a0d"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/6</text>
    </g>
  </g>

  <!-- ═══ ZONE: ENFERMERÍA DE CAMPO (botiquin) ═══ -->
  <g id="zone-botiquin" class="zone-area" tabindex="0" role="button"
     aria-label="Enfermería de Campo — click para ver items" data-zone="botiquin" data-filter="glowTeal">
    <g class="zone-fill-group">
      <!-- Medical tent background -->
      <rect x="594" y="492" width="108" height="82" rx="8" fill="#0c2018" opacity="0.90" class="zone-fill"/>
      <rect x="600" y="498" width="96" height="70" rx="6" fill="#122818" opacity="0.78" class="zone-fill"/>
      <!-- Cross symbol — magical healing version -->
      <rect x="638" y="510" width="22" height="46" rx="4" fill="#2a8060" opacity="0.85"/>
      <rect x="626" y="522" width="46" height="22" rx="4" fill="#2a8060" opacity="0.85"/>
      <!-- Cross inner glow -->
      <rect x="640" y="512" width="18" height="42" rx="3" fill="#3aa070" opacity="0.55"/>
      <rect x="628" y="524" width="42" height="18" rx="3" fill="#3aa070" opacity="0.55"/>
      <!-- Potion bottle (left) -->
      <rect x="602" y="502" width="12" height="24" rx="4" fill="#1a5040" opacity="0.75"/>
      <ellipse cx="608" cy="500" rx="6" ry="3" fill="#2a6050" opacity="0.70"/>
      <ellipse cx="608" cy="515" rx="5" ry="7" fill="#24604a" opacity="0.55"/>
      <!-- Potion bottle (right) -->
      <rect x="688" y="506" width="10" height="20" rx="3" fill="#1a4a38" opacity="0.75"/>
      <ellipse cx="693" cy="504" rx="5" ry="2.5" fill="#2a5a48" opacity="0.70"/>
      <!-- Teal glow around cross -->
      <rect x="624" y="508" width="50" height="50" rx="6" fill="none"
            stroke="#2a8060" stroke-width="1" opacity="0.30"/>
    </g>
    <text x="648" y="594" text-anchor="middle" class="zone-label"
          fill="#2a8060" font-size="13" font-weight="700" font-family="'Cinzel', serif" letter-spacing="0.04em">⚕️ Enfermería</text>
    <g id="badge-botiquin" transform="translate(708, 490)">
      <circle r="16" class="zone-badge-circle" fill="#1e5a4a"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/5</text>
    </g>
  </g>

  <!-- ═══ ZONE: CAMPO DE QUIDDITCH (quidditch) ═══ -->
  <g id="zone-quidditch" class="zone-area" tabindex="0" role="button"
     aria-label="Campo de Quidditch — click para ver items" data-zone="quidditch" data-filter="glowQuidditch">
    <g class="zone-fill-group">
      <!-- Ground shadow beneath field -->
      <ellipse cx="338" cy="570" rx="62" ry="10" fill="#030208" opacity="0.50"/>
      <!-- Field base — dark turf oval -->
      <ellipse cx="338" cy="532" rx="56" ry="44" fill="#0d1a07" opacity="0.94" class="zone-fill"/>
      <!-- Field volume layer — subtle grass texture -->
      <ellipse cx="338" cy="530" rx="50" ry="39" fill="#111f08" opacity="0.88" class="zone-fill"/>
      <!-- Field inner green surface -->
      <ellipse cx="338" cy="529" rx="44" ry="34" fill="#142508" opacity="0.92" class="zone-fill"/>
      <!-- Field boundary line -->
      <ellipse cx="338" cy="529" rx="44" ry="34" fill="none" stroke="#3a6a10" stroke-width="1.2" opacity="0.60"/>
      <!-- Center circle -->
      <ellipse cx="338" cy="529" rx="14" ry="11" fill="none" stroke="#3a6a10" stroke-width="1" opacity="0.50"/>
      <!-- Center spot -->
      <circle cx="338" cy="529" r="2.5" fill="#3a6a10" opacity="0.55"/>
      <!-- Midfield line (longitudinal) -->
      <line x1="294" y1="529" x2="382" y2="529" stroke="#3a6a10" stroke-width="0.9" opacity="0.40"/>
      <!-- Midfield line (lateral) -->
      <line x1="338" y1="496" x2="338" y2="562" stroke="#3a6a10" stroke-width="0.9" opacity="0.35"/>
      <!-- Left goal post (3 hoops) -->
      <rect x="291" y="510" width="4" height="38" rx="2" fill="#1e3a0a" opacity="0.90"/>
      <ellipse cx="293" cy="506" rx="7" ry="5" fill="none" stroke="#3a6a10" stroke-width="2" opacity="0.82"/>
      <ellipse cx="293" cy="517" rx="6" ry="4" fill="none" stroke="#3a6a10" stroke-width="1.8" opacity="0.72"/>
      <ellipse cx="293" cy="527" rx="5.5" ry="3.5" fill="none" stroke="#3a6a10" stroke-width="1.5" opacity="0.62"/>
      <!-- Right goal post (3 hoops) -->
      <rect x="384" y="510" width="4" height="38" rx="2" fill="#1e3a0a" opacity="0.90"/>
      <ellipse cx="386" cy="506" rx="7" ry="5" fill="none" stroke="#3a6a10" stroke-width="2" opacity="0.82"/>
      <ellipse cx="386" cy="517" rx="6" ry="4" fill="none" stroke="#3a6a10" stroke-width="1.8" opacity="0.72"/>
      <ellipse cx="386" cy="527" rx="5.5" ry="3.5" fill="none" stroke="#3a6a10" stroke-width="1.5" opacity="0.62"/>
      <!-- Broom silhouette (diagonal, flying) -->
      <line x1="305" y1="497" x2="352" y2="515" stroke="#5a3a10" stroke-width="3" stroke-linecap="round" opacity="0.78"/>
      <!-- Broom bristles -->
      <line x1="352" y1="515" x2="358" y2="511" stroke="#6a4a18" stroke-width="2" stroke-linecap="round" opacity="0.65"/>
      <line x1="352" y1="515" x2="359" y2="515" stroke="#6a4a18" stroke-width="1.5" stroke-linecap="round" opacity="0.60"/>
      <line x1="352" y1="515" x2="357" y2="519" stroke="#6a4a18" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>
      <circle cx="305" cy="497" r="2" fill="#7a5020" opacity="0.60"/>
      <!-- Golden Snitch -->
      <circle cx="364" cy="500" r="5" fill="#c9a84c" opacity="0.82"/>
      <circle cx="364" cy="500" r="3" fill="#e8c870" opacity="0.70"/>
      <!-- Snitch wings (tiny) -->
      <ellipse cx="356" cy="499" rx="5" ry="2.5" fill="#c9a84c" opacity="0.45" transform="rotate(-15, 356, 499)"/>
      <ellipse cx="372" cy="499" rx="5" ry="2.5" fill="#c9a84c" opacity="0.45" transform="rotate(15, 372, 499)"/>
      <!-- Snitch glow pulse -->
      <circle cx="364" cy="500" r="8" fill="#c9a84c" opacity="0.12">
        <animate attributeName="r" values="8;12;8" dur="2.4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.12;0.22;0.12" dur="2.4s" repeatCount="indefinite"/>
      </circle>
      <!-- Crowd stands suggestion (top arc) -->
      <path d="M 286 527 Q 290 490 338 482 Q 386 490 390 527"
            fill="#0c1806" opacity="0.70" stroke="#1e3a0a" stroke-width="1"/>
      <!-- Stand detail rows -->
      <path d="M 290 520 Q 314 500 338 496 Q 362 500 386 520"
            fill="none" stroke="#1e3a0a" stroke-width="0.8" opacity="0.40"/>
      <path d="M 292 512 Q 315 494 338 490 Q 361 494 384 512"
            fill="none" stroke="#1e3a0a" stroke-width="0.8" opacity="0.30"/>
    </g>
    <text x="338" y="592" text-anchor="middle" class="zone-label"
          fill="#3a6a10" font-size="13" font-weight="700" font-family="'Cinzel', serif" letter-spacing="0.04em">🧹 Campo de Quidditch</text>
    <g id="badge-quidditch" transform="translate(395, 458)">
      <circle r="16" class="zone-badge-circle" fill="#3a6a10"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/6</text>
    </g>
  </g>

  <!-- ═══ ZONE: CÁMARA SECRETA (camara) ═══ -->
  <g id="zone-camara" class="zone-area" tabindex="0" role="button"
     aria-label="Cámara Secreta — click para ver items" data-zone="camara" data-filter="glowCamara">
    <g class="zone-fill-group">
      <!-- Stone floor shadow -->
      <ellipse cx="450" cy="583" rx="64" ry="12" fill="#030208" opacity="0.50"/>
      <!-- Outer stone arch -->
      <path d="M 392 582 L 392 538 Q 392 510 450 510 Q 508 510 508 538 L 508 582 Z"
            fill="#0e1a10" opacity="0.92" class="zone-fill"/>
      <!-- Inner arch depth -->
      <path d="M 402 582 L 402 541 Q 402 520 450 520 Q 498 520 498 541 L 498 582 Z"
            fill="#080f08" opacity="0.96" class="zone-fill"/>
      <!-- Abyss within -->
      <path d="M 412 582 L 412 545 Q 412 528 450 528 Q 488 528 488 545 L 488 582 Z"
            fill="#030508" opacity="0.98" class="zone-fill"/>
      <!-- Stone block texture on arch sides -->
      <line x1="392" y1="548" x2="508" y2="548" stroke="#1a2a1a" stroke-width="1.5" opacity="0.38"/>
      <line x1="392" y1="563" x2="508" y2="563" stroke="#1a2a1a" stroke-width="1.5" opacity="0.38"/>
      <line x1="418" y1="538" x2="418" y2="582" stroke="#1a2a1a" stroke-width="1" opacity="0.28"/>
      <line x1="482" y1="538" x2="482" y2="582" stroke="#1a2a1a" stroke-width="1" opacity="0.28"/>
      <!-- Serpent carvings on arch sides -->
      <path d="M 393 542 Q 385 552 393 562 Q 401 572 393 582"
            fill="none" stroke="#2a6040" stroke-width="2.5" stroke-linecap="round" opacity="0.58"/>
      <path d="M 507 542 Q 515 552 507 562 Q 499 572 507 582"
            fill="none" stroke="#2a6040" stroke-width="2.5" stroke-linecap="round" opacity="0.58"/>
      <!-- Keystone serpent eyes -->
      <ellipse cx="443" cy="517" rx="3" ry="2.2" fill="#aaff88" opacity="0.52"/>
      <ellipse cx="457" cy="517" rx="3" ry="2.2" fill="#aaff88" opacity="0.52"/>
      <!-- Slytherin crest on keystone -->
      <ellipse cx="450" cy="523" rx="14" ry="10" fill="#0d2018" opacity="0.75"/>
      <path d="M 443 519 Q 450 515 457 519 Q 453 527 450 529 Q 447 527 443 519 Z"
            fill="#1a4028" opacity="0.60"/>
      <!-- Eerie green glow from the abyss -->
      <ellipse cx="450" cy="565" rx="28" ry="16" fill="#0a3020" opacity="0.45"/>
      <ellipse cx="450" cy="574" rx="38" ry="9" fill="#0a2818" opacity="0.60"/>
      <!-- Rune markers on stone -->
      <text x="405" y="558" fill="#2a6040" font-size="9" opacity="0.40" font-family="serif">ᚢ</text>
      <text x="487" y="558" fill="#2a6040" font-size="9" opacity="0.40" font-family="serif">ᚾ</text>
    </g>
    <text x="450" y="607" text-anchor="middle" class="zone-label"
          fill="#2a7050" font-size="13" font-weight="700" font-family="'Cinzel', serif"
          letter-spacing="0.04em">🐍 Cámara Secreta</text>
    <g id="badge-camara" transform="translate(510, 508)">
      <circle r="16" class="zone-badge-circle" fill="#1a3828"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/6</text>
    </g>
  </g>

  <!-- ═══ DECORATIVE DETAILS ═══ -->
  <!-- Floating magical orbs near cauldron -->
  <circle cx="408" cy="355" r="4" fill="#7b00ff" opacity="0.35">
    <animate attributeName="opacity" values="0.35;0.65;0.35" dur="2.8s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="355;349;355" dur="2.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="496" cy="348" r="3.5" fill="#4ecdc4" opacity="0.30">
    <animate attributeName="opacity" values="0.30;0.60;0.30" dur="3.2s" begin="0.8s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="348;342;348" dur="3.2s" begin="0.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="388" cy="370" r="3" fill="#00cc66" opacity="0.28">
    <animate attributeName="opacity" values="0.28;0.55;0.28" dur="2.5s" begin="1.5s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="370;364;370" dur="2.5s" begin="1.5s" repeatCount="indefinite"/>
  </circle>

  <!-- Stone rune markers on paths -->
  <rect x="448" y="313" width="8" height="10" rx="1" fill="#3a2a18" opacity="0.55"/>
  <text x="452" y="322" text-anchor="middle" fill="#c9a84c" font-size="7" opacity="0.45">ᚱ</text>
  <rect x="530" y="390" width="8" height="10" rx="1" fill="#3a2a18" opacity="0.55"/>
  <text x="534" y="399" text-anchor="middle" fill="#c9a84c" font-size="7" opacity="0.45">ᚹ</text>
  <rect x="370" y="390" width="8" height="10" rx="1" fill="#3a2a18" opacity="0.55"/>
  <text x="374" y="399" text-anchor="middle" fill="#c9a84c" font-size="7" opacity="0.45">ᚠ</text>
</svg>`;
  }

  private buildStars(): string {
    const positions = [
      [42, 35, 1.4, 2.8], [118, 22, 1.2, 3.5], [195, 48, 1.0, 2.2],
      [272, 28, 1.5, 4.0], [354, 42, 1.1, 3.1], [448, 18, 1.6, 2.6],
      [524, 45, 1.0, 3.8], [614, 30, 1.3, 2.4], [692, 50, 1.2, 3.3],
      [754, 22, 1.4, 2.9], [72, 72, 1.0, 3.6], [152, 60, 1.2, 2.7],
      [238, 85, 0.9, 4.2], [332, 68, 1.3, 3.0], [472, 80, 1.1, 2.5],
      [566, 65, 1.0, 3.7], [648, 82, 1.2, 2.2], [28, 105, 1.1, 4.0],
      [200, 92, 1.3, 3.4], [390, 98, 0.9, 2.8], [580, 88, 1.1, 3.1],
      [738, 96, 1.0, 2.6], [870, 72, 1.3, 3.9], [320, 112, 0.8, 4.3],
      [486, 105, 1.2, 2.9], [700, 108, 0.9, 3.5], [64, 130, 1.0, 2.3],
      [160, 120, 1.1, 3.8], [420, 118, 0.9, 4.1], [850, 105, 1.2, 2.7],
    ];
    return positions.map(([x, y, r, dur], i) => {
      const delay = (i * 0.37) % 3;
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="white" class="star star-twinkle"
        style="--tw-dur: ${dur}s; --tw-delay: ${delay.toFixed(1)}s;"/>`;
    }).join('\n    ');
  }

  private buildBattlements(x: number, y: number, width: number, merlonW: number, gapW: number): string {
    const result: string[] = [];
    let cx = x;
    while (cx < x + width - merlonW) {
      result.push(`<rect x="${cx}" y="${y}" width="${merlonW}" height="10" fill="#08061a"/>`);
      cx += merlonW + gapW;
    }
    return result.join('');
  }

  private buildStones(cx: number, cy: number, r: number, count: number): string {
    const stones: string[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const rot = ((angle * 180) / Math.PI).toFixed(0);
      stones.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="8" ry="5" fill="#18151e" opacity="0.85" transform="rotate(${rot}, ${x.toFixed(1)}, ${y.toFixed(1)})"/>`);
    }
    return stones.join('\n      ');
  }

  private buildForestTrees(): string {
    const trees = [
      [765, 230, 1.0], [795, 215, 1.1], [818, 228, 0.9],
      [835, 208, 1.0], [855, 220, 0.95], [872, 240, 0.85],
      [750, 270], [810, 258], [840, 262],
    ];
    return trees.map(([x, y, s = 0.9]) => this.buildGnarledTree(x as number, y as number, s)).join('');
  }

  private buildZoneTree(x: number, y: number, s: number): string {
    return this.buildGnarledTree(x, y, s);
  }

  private buildGnarledTree(x: number, y: number, s: number): string {
    return `<g transform="translate(${x}, ${y}) scale(${s})">
      <rect x="-3" y="-28" width="6" height="28" rx="2" fill="#050a03" opacity="0.9"/>
      <line x1="0" y1="-20" x2="-14" y2="-33" stroke="#050a03" stroke-width="3" stroke-linecap="round"/>
      <line x1="0" y1="-20" x2="11" y2="-32" stroke="#050a03" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="0" y1="-12" x2="-9" y2="-22" stroke="#050a03" stroke-width="2" stroke-linecap="round"/>
      <line x1="0" y1="-16" x2="8" y2="-25" stroke="#050a03" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="-11" cy="-37" rx="12" ry="9" fill="#030803"/>
      <ellipse cx="9" cy="-36" rx="11" ry="9" fill="#020703"/>
      <ellipse cx="0" cy="-41" rx="13" ry="11" fill="#040904"/>
      <ellipse cx="-6" cy="-24" rx="9" ry="7" fill="#030803"/>
    </g>`;
  }

  private getFilterForZone(zoneId: string): string {
    const filterMap: Record<string, string> = {
      carpa: 'glowGold',
      fogon: 'glowPurple',
      cocina: 'glowAmber',
      almacenamiento: 'glowGold',
      higiene: 'glowBlue',
      senderos: 'glowGreen',
      botiquin: 'glowTeal',
      quidditch: 'glowQuidditch',
      camara: 'glowCamara',
    };
    return filterMap[zoneId] ?? 'glowGold';
  }

  private attachEventListeners(): void {
    if (!this.svgEl) return;

    const zones = this.svgEl.querySelectorAll<SVGGElement>('.zone-area');
    zones.forEach(zone => {
      const zoneId = zone.dataset['zone'];
      if (!zoneId) return;
      const filterId = this.getFilterForZone(zoneId);

      zone.addEventListener('mouseenter', () => {
        const fillGroup = zone.querySelector('.zone-fill-group');
        if (fillGroup) (fillGroup as SVGGElement).style.filter = `url(#${filterId})`;
      });
      zone.addEventListener('mouseleave', () => {
        const fillGroup = zone.querySelector('.zone-fill-group');
        if (fillGroup) {
          const zId = zone.dataset['zone'];
          const state = this.stateManager.getState();
          (fillGroup as SVGGElement).style.filter =
            zId === state.activeZoneId ? `url(#${filterId})` : '';
        }
      });
      zone.addEventListener('click', () => this.stateManager.setActiveZone(zoneId));
      zone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.stateManager.setActiveZone(zoneId);
        }
      });
    });
  }

  private update(state: AppState): void {
    if (!this.svgEl) return;

    // Update zone badges
    for (const zone of campingZones) {
      const badge = this.svgEl.querySelector(`#badge-${zone.id}`);
      if (!badge) continue;
      const textEl = badge.querySelector<SVGTextElement>('.zone-badge-text');
      const circleEl = badge.querySelector<SVGCircleElement>('.zone-badge-circle');
      const progress = this.stateManager.getZoneProgress(zone.id);
      const pct = progress.total > 0 ? progress.checked / progress.total : 0;

      if (textEl) textEl.textContent = `${progress.checked}/${progress.total}`;
      if (circleEl) {
        if (progress.checked === progress.total && progress.total > 0) {
          circleEl.setAttribute('fill', '#c9a84c'); // gold when complete
          circleEl.setAttribute('opacity', '1');
        } else {
          circleEl.setAttribute('fill', zone.color);
          circleEl.setAttribute('opacity', (0.65 + pct * 0.35).toFixed(2));
        }
      }
    }

    // Highlight active zone
    const allZones = this.svgEl.querySelectorAll<SVGGElement>('.zone-area');
    allZones.forEach(z => {
      const fillGroup = z.querySelector('.zone-fill-group');
      if (!fillGroup) return;
      const zoneId = z.dataset['zone'];
      if (zoneId && zoneId === state.activeZoneId) {
        (fillGroup as SVGGElement).style.filter = `url(#${this.getFilterForZone(zoneId)})`;
      } else {
        (fillGroup as SVGGElement).style.filter = '';
      }
    });
  }
}
