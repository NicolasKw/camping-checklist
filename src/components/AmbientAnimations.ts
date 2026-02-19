export class AmbientAnimations {
  private svgContainer: HTMLElement;

  constructor(svgContainer: HTMLElement) {
    this.svgContainer = svgContainer;
    this.addBirds();
  }

  private addBirds(): void {
    const birdsGroup = this.svgContainer.querySelector('#ambient-birds');
    if (!birdsGroup) return;

    const birdsData = [
      { begin: '0s', dur: '18s', path: 'M -20,80 C 100,50 300,110 500,60 C 700,20 850,90 920,70' },
      { begin: '5s', dur: '22s', path: 'M -20,120 C 150,90 350,140 550,100 C 720,65 860,120 920,100' },
      { begin: '10s', dur: '25s', path: 'M -20,50 C 200,30 400,80 600,45 C 780,15 880,65 920,50' },
      { begin: '15s', dur: '20s', path: 'M -20,160 C 120,130 320,170 520,140 C 700,110 840,155 920,140' },
    ];

    birdsGroup.innerHTML = birdsData.map((b, i) =>
      `<g opacity="${0.6 + i * 0.1}">
        <animateMotion dur="${b.dur}" begin="${b.begin}" repeatCount="indefinite">
          <mpath href="#bird-path-${i}"/>
        </animateMotion>
        ${this.buildBirdShape()}
      </g>
      <path id="bird-path-${i}" d="${b.path}" fill="none" class="bird-path"/>`
    ).join('');
  }

  private buildBirdShape(): string {
    // Simple bird: two curved wings
    return `
      <g transform="scale(0.8)">
        <path d="M 0,0 C -8,-5 -16,-2 -20,2 C -16,0 -8,1 0,0" fill="#2c2c2c"/>
        <path d="M 0,0 C 8,-5 16,-2 20,2 C 16,0 8,1 0,0" fill="#2c2c2c"/>
      </g>`;
  }
}
