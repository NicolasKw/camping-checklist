import type { AppState } from '../types/index.js';
import type { StateManager } from '../state/StateManager.js';

export class ProgressBar {
  private container: HTMLElement;
  private stateManager: StateManager;
  private fillEl: HTMLElement | null = null;
  private labelEl: HTMLElement | null = null;

  constructor(container: HTMLElement, stateManager: StateManager) {
    this.container = container;
    this.stateManager = stateManager;
    this.render();
    this.stateManager.subscribe(state => this.update(state));
    this.update(this.stateManager.getState());
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="progress-bar-wrapper">
        <div class="progress-bar-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Progreso general">
          <div class="progress-bar-fill"></div>
        </div>
        <span class="progress-bar-label">0%</span>
      </div>
    `;
    this.fillEl = this.container.querySelector('.progress-bar-fill');
    this.labelEl = this.container.querySelector('.progress-bar-label');
  }

  private update(_state: AppState): void {
    const { checked, total } = this.stateManager.getTotalProgress();
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

    if (this.fillEl) {
      this.fillEl.style.width = `${pct}%`;
    }
    if (this.labelEl) {
      this.labelEl.textContent = `${pct}%`;
    }

    const track = this.container.querySelector('[role="progressbar"]');
    if (track) {
      track.setAttribute('aria-valuenow', String(pct));
    }
  }
}
