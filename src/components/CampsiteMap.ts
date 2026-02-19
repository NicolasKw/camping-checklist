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
<svg viewBox="0 0 900 700" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa interactivo del campamento">
  <defs>
    <!-- Sky gradient -->
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--sky-top)" />
      <stop offset="100%" stop-color="var(--sky-bottom)" />
    </linearGradient>

    <!-- Ground texture -->
    <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7daa7d" />
      <stop offset="100%" stop-color="#5a8a5a" />
    </linearGradient>
    [data-theme="night"] #groundGrad stop:nth-child(1) { stop-color: #2d4a2d; }

    <!-- Shadow filter -->
    <filter id="dropShadowOlive" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#6b7c45" flood-opacity="0.7"/>
    </filter>
    <filter id="dropShadowOrange" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="8" flood-color="#e07b39" flood-opacity="0.8"/>
    </filter>
    <filter id="dropShadowKhaki" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#c8a84b" flood-opacity="0.7"/>
    </filter>
    <filter id="dropShadowBrown" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#8b6347" flood-opacity="0.7"/>
    </filter>
    <filter id="dropShadowBlue" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#4a7fa5" flood-opacity="0.7"/>
    </filter>
    <filter id="dropShadowGreen" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#4a8c5c" flood-opacity="0.7"/>
    </filter>
    <filter id="dropShadowRed" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#c0392b" flood-opacity="0.7"/>
    </filter>

    <!-- Clip for birds -->
    <clipPath id="skyClip">
      <rect x="0" y="0" width="900" height="260"/>
    </clipPath>
  </defs>

  <!-- === BACKGROUND === -->
  <!-- Sky -->
  <rect width="900" height="700" fill="url(#skyGrad)" rx="12"/>

  <!-- Stars (night mode) -->
  <g class="stars-group">
    ${this.buildStars()}
  </g>

  <!-- Moon (night mode) -->
  <circle cx="820" cy="60" r="28" fill="#f5f0c8" opacity="var(--moon-opacity)" class="moon" style="transition: opacity var(--transition-speed) ease;"/>
  <circle cx="832" cy="50" r="22" fill="var(--sky-top)" opacity="var(--moon-opacity)" class="moon" style="transition: opacity var(--transition-speed) ease, fill var(--transition-speed) ease;"/>

  <!-- Ground -->
  <ellipse cx="450" cy="560" rx="430" ry="160" fill="#6aab6a" opacity="0.7"/>
  <rect x="0" y="460" width="900" height="240" fill="#5a9a5a" rx="0"/>
  <rect x="0" y="460" width="900" height="240" fill="url(#groundGrad)" opacity="0.5"/>

  <!-- Trees decoration top -->
  ${this.buildTrees()}

  <!-- Paths between zones -->
  <g stroke="var(--path-color)" stroke-width="6" fill="none" opacity="0.6" stroke-linecap="round">
    <path d="M 310 360 Q 350 400 410 420"/>
    <path d="M 560 380 Q 520 410 510 430"/>
    <path d="M 440 300 L 440 340"/>
    <path d="M 210 450 Q 300 460 380 470"/>
    <path d="M 680 350 Q 700 400 680 450"/>
    <path d="M 200 340 Q 240 370 300 370"/>
  </g>

  <!-- Ambient birds group -->
  <g id="ambient-birds" clip-path="url(#skyClip)"></g>

  <!-- === ZONES === -->

  <!-- CARPA (top center) -->
  <g id="zone-carpa" class="zone-area" tabindex="0" role="button" aria-label="Zona Carpa - click para ver items"
     data-zone="carpa" data-filter="dropShadowOlive">
    <g class="zone-fill-group">
      <!-- Tent base -->
      <ellipse cx="440" cy="200" rx="85" ry="60" fill="#5c6b35" opacity="0.85" class="zone-fill"/>
      <!-- Tent triangle shape -->
      <polygon points="440,120 365,220 515,220" fill="#7a8c45" opacity="0.9" class="zone-fill"/>
      <polygon points="440,135 390,215 490,215" fill="#9aac55" opacity="0.7" class="zone-fill"/>
      <!-- Tent door -->
      <ellipse cx="440" cy="215" rx="18" ry="22" fill="#3a4520" opacity="0.8"/>
      <!-- Guy ropes -->
      <line x1="440" y1="120" x2="390" y2="90" stroke="#8b7355" stroke-width="1.5" opacity="0.6"/>
      <line x1="440" y1="120" x2="490" y2="90" stroke="#8b7355" stroke-width="1.5" opacity="0.6"/>
      <circle cx="390" cy="90" r="3" fill="#8b7355" opacity="0.6"/>
      <circle cx="490" cy="90" r="3" fill="#8b7355" opacity="0.6"/>
    </g>
    <!-- Hover label -->
    <text x="440" y="265" text-anchor="middle" class="zone-label" fill="#3a4520" font-size="14" font-weight="700">⛺ Carpa</text>
    <!-- Badge -->
    <g id="badge-carpa" transform="translate(510, 135)">
      <circle r="16" class="zone-badge-circle" fill="#6b7c45"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/6</text>
    </g>
  </g>

  <!-- FOGON (center) -->
  <g id="zone-fogon" class="zone-area" tabindex="0" role="button" aria-label="Zona Fogón - click para ver items"
     data-zone="fogon" data-filter="dropShadowOrange">
    <g class="zone-fill-group">
      <!-- Stone circle -->
      <circle cx="450" cy="395" r="48" fill="#6b5a3a" opacity="0.85" class="zone-fill"/>
      <circle cx="450" cy="395" r="38" fill="#4a3a25" opacity="0.9" class="zone-fill"/>
      <!-- Stones around -->
      ${this.buildStones(450, 395, 44, 10)}
      <!-- Embers -->
      <circle cx="450" cy="398" r="14" fill="#cc4400" opacity="0.8"/>
      <circle cx="450" cy="398" r="9" fill="#ff6600" opacity="0.9"/>
      <!-- Logs -->
      <rect x="428" y="400" width="44" height="7" rx="3" fill="#5a3a1a" opacity="0.8" transform="rotate(-25, 450, 398)"/>
      <rect x="428" y="400" width="44" height="7" rx="3" fill="#6b4a2a" opacity="0.8" transform="rotate(25, 450, 398)"/>
      <!-- Flames -->
      <g id="fire-group">
        <ellipse cx="443" cy="380" rx="7" ry="18" fill="#ff4500" class="flame flame-1" opacity="var(--flame-opacity)" transform-origin="443px 395px"/>
        <ellipse cx="450" cy="374" rx="8" ry="22" fill="#ff6600" class="flame flame-2" opacity="var(--flame-opacity)" transform-origin="450px 395px"/>
        <ellipse cx="457" cy="381" rx="6" ry="16" fill="#ffaa00" class="flame flame-3" opacity="var(--flame-opacity)" transform-origin="457px 395px"/>
        <!-- Inner bright flames -->
        <ellipse cx="447" cy="383" rx="4" ry="12" fill="#ffcc00" class="flame flame-2" opacity="calc(var(--flame-opacity) * 0.8)" transform-origin="447px 395px"/>
        <ellipse cx="453" cy="385" rx="3" ry="10" fill="#ffe066" class="flame flame-1" opacity="calc(var(--flame-opacity) * 0.7)" transform-origin="453px 395px"/>
      </g>
      <!-- Glow (night) -->
      <circle cx="450" cy="395" r="55" fill="#ff4500" opacity="0" class="fogon-glow" style="mix-blend-mode: screen;"/>
    </g>
    <text x="450" y="455" text-anchor="middle" class="zone-label" fill="#6b5a3a" font-size="14" font-weight="700">🔥 Fogón</text>
    <g id="badge-fogon" transform="translate(492, 355)">
      <circle r="16" class="zone-badge-circle" fill="#e07b39"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/6</text>
    </g>
  </g>

  <!-- COCINA (right center) -->
  <g id="zone-cocina" class="zone-area" tabindex="0" role="button" aria-label="Zona Cocina - click para ver items"
     data-zone="cocina" data-filter="dropShadowKhaki">
    <g class="zone-fill-group">
      <!-- Table top view -->
      <rect x="600" y="340" width="130" height="90" rx="8" fill="#c8a84b" opacity="0.85" class="zone-fill"/>
      <rect x="606" y="346" width="118" height="78" rx="6" fill="#d4b85a" opacity="0.7" class="zone-fill"/>
      <!-- Table legs visible from top -->
      <circle cx="610" cy="352" r="5" fill="#8b7340" opacity="0.7"/>
      <circle cx="720" cy="352" r="5" fill="#8b7340" opacity="0.7"/>
      <circle cx="610" cy="424" r="5" fill="#8b7340" opacity="0.7"/>
      <circle cx="720" cy="424" r="5" fill="#8b7340" opacity="0.7"/>
      <!-- Items on table -->
      <rect x="620" y="358" width="28" height="20" rx="4" fill="#9a7a30" opacity="0.6"/>
      <circle cx="680" cy="368" r="12" fill="#9a7a30" opacity="0.5"/>
      <rect x="700" y="358" width="14" height="24" rx="3" fill="#7a5a20" opacity="0.6"/>
      <!-- Bench left -->
      <rect x="575" y="355" width="20" height="60" rx="5" fill="#a08030" opacity="0.7"/>
      <!-- Bench right -->
      <rect x="735" y="355" width="20" height="60" rx="5" fill="#a08030" opacity="0.7"/>
    </g>
    <text x="665" y="465" text-anchor="middle" class="zone-label" fill="#7a6020" font-size="14" font-weight="700">🍳 Cocina</text>
    <g id="badge-cocina" transform="translate(738, 338)">
      <circle r="16" class="zone-badge-circle" fill="#c8a84b"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/9</text>
    </g>
  </g>

  <!-- ALMACENAMIENTO (left center) -->
  <g id="zone-almacenamiento" class="zone-area" tabindex="0" role="button" aria-label="Zona Almacenamiento - click para ver items"
     data-zone="almacenamiento" data-filter="dropShadowBrown">
    <g class="zone-fill-group">
      <!-- Storage area -->
      <rect x="155" y="340" width="110" height="90" rx="8" fill="#8b6347" opacity="0.85" class="zone-fill"/>
      <!-- Boxes/items -->
      <rect x="168" y="352" width="30" height="25" rx="3" fill="#c8956a" opacity="0.8"/>
      <rect x="202" y="352" width="30" height="25" rx="3" fill="#a87050" opacity="0.8"/>
      <rect x="236" y="352" width="22" height="25" rx="3" fill="#b07860" opacity="0.8"/>
      <!-- Backpack icon top view -->
      <ellipse cx="185" cy="400" rx="18" ry="20" fill="#7a5035" opacity="0.9"/>
      <ellipse cx="185" cy="395" rx="13" ry="14" fill="#9a6040" opacity="0.8"/>
      <rect x="177" y="413" width="16" height="6" rx="3" fill="#7a5035" opacity="0.8"/>
      <!-- Rope coil -->
      <circle cx="230" cy="400" r="14" fill="none" stroke="#c8a870" stroke-width="3" opacity="0.8"/>
      <circle cx="230" cy="400" r="9" fill="none" stroke="#c8a870" stroke-width="2" opacity="0.7"/>
      <circle cx="230" cy="400" r="4" fill="#c8a870" opacity="0.7"/>
    </g>
    <text x="210" y="453" text-anchor="middle" class="zone-label" fill="#5a3a20" font-size="14" font-weight="700">🎒 Almacenamiento</text>
    <g id="badge-almacenamiento" transform="translate(272, 338)">
      <circle r="16" class="zone-badge-circle" fill="#8b6347"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/5</text>
    </g>
  </g>

  <!-- HIGIENE (bottom left) -->
  <g id="zone-higiene" class="zone-area" tabindex="0" role="button" aria-label="Zona Higiene - click para ver items"
     data-zone="higiene" data-filter="dropShadowBlue">
    <g class="zone-fill-group">
      <!-- Bathroom/hygiene area -->
      <rect x="130" y="490" width="115" height="85" rx="10" fill="#4a7fa5" opacity="0.8" class="zone-fill"/>
      <!-- Privacy screen lines -->
      <rect x="130" y="490" width="8" height="85" rx="4" fill="#357090" opacity="0.7"/>
      <rect x="237" y="490" width="8" height="85" rx="4" fill="#357090" opacity="0.7"/>
      <!-- Hygiene icons simplified -->
      <circle cx="175" cy="530" r="18" fill="#357090" opacity="0.6"/>
      <rect x="165" y="516" width="20" height="28" rx="4" fill="#5a90b5" opacity="0.7"/>
      <circle cx="220" cy="525" r="12" fill="#5a90b5" opacity="0.6"/>
      <rect x="213" y="536" width="14" height="20" rx="3" fill="#4a80a0" opacity="0.6"/>
      <!-- Water drops -->
      <ellipse cx="155" cy="555" rx="5" ry="7" fill="#87ceeb" opacity="0.7"/>
      <ellipse cx="167" cy="560" rx="4" ry="6" fill="#87ceeb" opacity="0.6"/>
    </g>
    <text x="187" y="595" text-anchor="middle" class="zone-label" fill="#1a4a6a" font-size="14" font-weight="700">🚿 Higiene</text>
    <g id="badge-higiene" transform="translate(252, 488)">
      <circle r="16" class="zone-badge-circle" fill="#4a7fa5"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/7</text>
    </g>
  </g>

  <!-- SENDEROS (right, trails) -->
  <g id="zone-senderos" class="zone-area" tabindex="0" role="button" aria-label="Zona Senderos - click para ver items"
     data-zone="senderos" data-filter="dropShadowGreen">
    <g class="zone-fill-group">
      <!-- Trail path -->
      <path d="M 730 280 Q 770 320 750 370 Q 730 420 760 460 L 820 460 Q 850 420 830 370 Q 810 320 840 280 Z"
            fill="#4a8c5c" opacity="0.8" class="zone-fill"/>
      <!-- Path markers -->
      <circle cx="750" cy="300" r="6" fill="#ff4444" opacity="0.8"/>
      <circle cx="745" cy="340" r="6" fill="#ff4444" opacity="0.8"/>
      <circle cx="755" cy="380" r="6" fill="#ff4444" opacity="0.8"/>
      <circle cx="760" cy="420" r="6" fill="#ff4444" opacity="0.8"/>
      <!-- Trail line -->
      <path d="M 750 295 Q 742 325 748 355 Q 753 385 758 415" stroke="#ffaaaa" stroke-width="2" fill="none" opacity="0.7" stroke-dasharray="6,4"/>
      <!-- Compass icon -->
      <circle cx="810" cy="330" r="20" fill="#2d6a3a" opacity="0.8"/>
      <circle cx="810" cy="330" r="16" fill="#3a8a4a" opacity="0.7"/>
      <polygon points="810,316 813,330 810,344 807,330" fill="white" opacity="0.9"/>
      <polygon points="810,316 813,330 810,344 807,330" fill="#cc3333" opacity="0.9"
               transform="rotate(180, 810, 330)"/>
      <!-- Trees along trail -->
      <circle cx="780" cy="310" r="10" fill="#2d5a2d" opacity="0.8"/>
      <circle cx="790" cy="360" r="9" fill="#3a6a3a" opacity="0.8"/>
      <circle cx="785" cy="410" r="10" fill="#2d5a2d" opacity="0.8"/>
    </g>
    <text x="785" y="478" text-anchor="middle" class="zone-label" fill="#1a4a2a" font-size="14" font-weight="700">🧭 Senderos</text>
    <g id="badge-senderos" transform="translate(845, 280)">
      <circle r="16" class="zone-badge-circle" fill="#4a8c5c"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/6</text>
    </g>
  </g>

  <!-- BOTIQUIN (bottom right) -->
  <g id="zone-botiquin" class="zone-area" tabindex="0" role="button" aria-label="Zona Botiquín - click para ver items"
     data-zone="botiquin" data-filter="dropShadowRed">
    <g class="zone-fill-group">
      <!-- First aid box -->
      <rect x="600" y="490" width="95" height="80" rx="8" fill="#c0392b" opacity="0.85" class="zone-fill"/>
      <rect x="606" y="496" width="83" height="68" rx="6" fill="#d44333" opacity="0.7" class="zone-fill"/>
      <!-- Cross symbol -->
      <rect x="638" y="510" width="22" height="40" rx="4" fill="white" opacity="0.9"/>
      <rect x="626" y="522" width="46" height="16" rx="4" fill="white" opacity="0.9"/>
      <!-- Corner details -->
      <circle cx="614" cy="504" r="4" fill="#a02020" opacity="0.7"/>
      <circle cx="681" cy="504" r="4" fill="#a02020" opacity="0.7"/>
      <circle cx="614" cy="556" r="4" fill="#a02020" opacity="0.7"/>
      <circle cx="681" cy="556" r="4" fill="#a02020" opacity="0.7"/>
    </g>
    <text x="647" y="592" text-anchor="middle" class="zone-label" fill="#7a1010" font-size="14" font-weight="700">🩺 Botiquín</text>
    <g id="badge-botiquin" transform="translate(702, 488)">
      <circle r="16" class="zone-badge-circle" fill="#c0392b"/>
      <text text-anchor="middle" dy="4" class="zone-badge-text">0/5</text>
    </g>
  </g>

  <!-- Lake decoration -->
  <ellipse cx="550" cy="250" rx="60" ry="35" fill="#5ba3cc" opacity="0.5"/>
  <ellipse cx="548" cy="248" rx="48" ry="26" fill="#7ab8d8" opacity="0.4"/>
  <!-- Lake shimmer -->
  <line x1="520" y1="245" x2="540" y2="242" stroke="white" stroke-width="1.5" opacity="0.5"/>
  <line x1="545" y1="252" x2="568" y2="248" stroke="white" stroke-width="1.5" opacity="0.4"/>

  <!-- Mountain silhouette in background -->
  <polygon points="50,300 130,180 210,300" fill="#4a6a4a" opacity="0.4"/>
  <polygon points="100,300 200,150 300,300" fill="#3a5a3a" opacity="0.35"/>
  <polygon points="10,300 80,200 160,300" fill="#5a7a5a" opacity="0.3"/>

  <!-- Small decorative details -->
  <!-- Rock cluster near fogon -->
  <ellipse cx="510" cy="410" rx="8" ry="5" fill="#7a7a6a" opacity="0.5"/>
  <ellipse cx="525" cy="415" rx="6" ry="4" fill="#8a8a7a" opacity="0.5"/>
  <!-- Flower patches -->
  <circle cx="350" cy="480" r="3" fill="#ffaacc" opacity="0.7"/>
  <circle cx="358" cy="476" r="3" fill="#ffbbdd" opacity="0.7"/>
  <circle cx="345" cy="475" r="2.5" fill="#ff99bb" opacity="0.7"/>
  <circle cx="580" cy="490" r="3" fill="#ffdd88" opacity="0.7"/>
  <circle cx="588" cy="486" r="2.5" fill="#ffcc66" opacity="0.7"/>
</svg>`;
  }

  private buildStars(): string {
    const stars: string[] = [];
    const positions = [
      [50, 40], [120, 25], [200, 55], [280, 30], [360, 45], [450, 20],
      [530, 50], [620, 35], [700, 55], [780, 25], [850, 45],
      [80, 80], [160, 65], [340, 75], [480, 85], [660, 70], [820, 80],
      [30, 110], [250, 95], [400, 100], [590, 90], [750, 105], [880, 90],
    ];
    for (const [x, y] of positions) {
      const size = Math.random() * 1.5 + 0.8;
      stars.push(`<circle cx="${x}" cy="${y}" r="${size.toFixed(1)}" fill="white" class="star"/>`);
    }
    return stars.join('\n    ');
  }

  private buildStones(cx: number, cy: number, r: number, count: number): string {
    const stones: string[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      stones.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="7" ry="5" fill="#888876" opacity="0.8" transform="rotate(${((angle * 180) / Math.PI).toFixed(0)}, ${x.toFixed(1)}, ${y.toFixed(1)})"/>`);
    }
    return stones.join('\n      ');
  }

  private buildTrees(): string {
    const treePositions = [
      [30, 280], [60, 250], [90, 270],
      [820, 250], [855, 270], [880, 245],
      [320, 130], [350, 110], [370, 140],
    ];
    return treePositions.map(([x, y]) => {
      const s = 0.7 + Math.random() * 0.6;
      return `
  <g transform="translate(${x}, ${y}) scale(${s.toFixed(2)})">
    <circle cx="0" cy="-12" r="18" fill="#3a6a2a" opacity="0.85"/>
    <circle cx="-8" cy="-4" r="14" fill="#4a7a3a" opacity="0.8"/>
    <circle cx="8" cy="-4" r="14" fill="#3a6a2a" opacity="0.8"/>
    <circle cx="0" cy="4" r="16" fill="#4a8a3a" opacity="0.75"/>
    <rect x="-4" y="14" width="8" height="12" rx="2" fill="#5a3a1a" opacity="0.7"/>
  </g>`;
    }).join('');
  }

  private getFilterForZone(zoneId: string): string {
    const filterMap: Record<string, string> = {
      carpa: 'dropShadowOlive',
      fogon: 'dropShadowOrange',
      cocina: 'dropShadowKhaki',
      almacenamiento: 'dropShadowBrown',
      higiene: 'dropShadowBlue',
      senderos: 'dropShadowGreen',
      botiquin: 'dropShadowRed',
    };
    return filterMap[zoneId] ?? 'dropShadowOlive';
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
        if (fillGroup) {
          (fillGroup as SVGGElement).style.filter = `url(#${filterId})`;
        }
      });

      zone.addEventListener('mouseleave', () => {
        const fillGroup = zone.querySelector('.zone-fill-group');
        if (fillGroup) {
          (fillGroup as SVGGElement).style.filter = '';
        }
      });

      zone.addEventListener('click', () => {
        this.stateManager.setActiveZone(zoneId);
      });

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

    // Update night/day (CSS var on html handles visual, but update SVG ground colors)
    const groundEl = this.svgEl.querySelector('rect[fill="url(#groundGrad)"]');
    if (groundEl) {
      groundEl.setAttribute('opacity', state.nightMode ? '0.3' : '0.5');
    }

    // Update badges
    for (const zone of campingZones) {
      const badge = this.svgEl.querySelector(`#badge-${zone.id}`);
      if (!badge) continue;
      const textEl = badge.querySelector<SVGTextElement>('.zone-badge-text');
      const circleEl = badge.querySelector<SVGCircleElement>('.zone-badge-circle');
      const progress = this.stateManager.getZoneProgress(zone.id);
      const pct = progress.total > 0 ? progress.checked / progress.total : 0;

      if (textEl) {
        textEl.textContent = `${progress.checked}/${progress.total}`;
      }
      if (circleEl) {
        // Color: grey if 0%, zone color if partial, green if complete
        if (progress.checked === 0) {
          circleEl.setAttribute('fill', zone.color);
          circleEl.setAttribute('opacity', '0.7');
        } else if (progress.checked === progress.total) {
          circleEl.setAttribute('fill', '#22aa55');
          circleEl.setAttribute('opacity', '1');
        } else {
          // Interpolate
          circleEl.setAttribute('fill', zone.color);
          circleEl.setAttribute('opacity', (0.7 + pct * 0.3).toFixed(2));
        }
      }
    }

    // Highlight active zone
    if (this.svgEl) {
      const allZones = this.svgEl.querySelectorAll<SVGGElement>('.zone-area');
      allZones.forEach(z => {
        const fillGroup = z.querySelector('.zone-fill-group');
        if (fillGroup) {
          const zoneId = z.dataset['zone'];
          if (zoneId && zoneId === state.activeZoneId) {
            const filterId = this.getFilterForZone(zoneId);
            (fillGroup as SVGGElement).style.filter = `url(#${filterId})`;
          } else {
            (fillGroup as SVGGElement).style.filter = '';
          }
        }
      });
    }
  }
}
