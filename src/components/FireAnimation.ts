// FireAnimation: the CSS keyframes are in style.css
// This component ensures the fire elements exist and manages any JS-side enhancement

export class FireAnimation {
  private svgContainer: HTMLElement;

  constructor(svgContainer: HTMLElement) {
    this.svgContainer = svgContainer;
    // Flames are part of the SVG markup built in CampsiteMap
    // This class just exposes control if needed
  }

  // Called when night mode changes - CSS handles the opacity via --flame-opacity
  // but we can enhance with a glow effect on the fogon SVG group
  setNightMode(isNight: boolean): void {
    const fogonGlow = this.svgContainer.querySelector<SVGCircleElement>('.fogon-glow');
    if (fogonGlow) {
      fogonGlow.style.opacity = isNight ? '0.15' : '0';
    }
  }
}
