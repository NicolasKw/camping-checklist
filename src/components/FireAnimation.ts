export class FireAnimation {
  private svgContainer: HTMLElement;

  constructor(svgContainer: HTMLElement) {
    this.svgContainer = svgContainer;
  }

  setNightMode(isNight: boolean): void {
    const fogonGlow = this.svgContainer.querySelector<SVGCircleElement>('.fogon-glow');
    if (fogonGlow) {
      fogonGlow.style.opacity = isNight ? '0.22' : '0.08';
    }
  }
}
