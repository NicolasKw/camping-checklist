import type { AppState } from '../types/index.js';
import type { StateManager } from '../state/StateManager.js';

export class DayNightToggle {
  private container: HTMLElement;
  private stateManager: StateManager;
  private inputEl: HTMLInputElement | null = null;

  constructor(container: HTMLElement, stateManager: StateManager) {
    this.container = container;
    this.stateManager = stateManager;
    this.render();
    this.stateManager.subscribe(state => this.update(state));
    this.update(this.stateManager.getState());
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="toggle-wrapper">
        <span class="toggle-label">☀️</span>
        <label class="toggle-switch" aria-label="Modo noche">
          <input type="checkbox" id="night-mode-input"/>
          <span class="toggle-slider"></span>
        </label>
        <span class="toggle-label">🌙</span>
      </div>
    `;

    this.inputEl = this.container.querySelector('#night-mode-input');
    this.inputEl?.addEventListener('change', () => {
      this.stateManager.toggleNightMode();
    });
  }

  private update(state: AppState): void {
    if (this.inputEl) {
      this.inputEl.checked = state.nightMode;
    }
    // Apply theme to <html>
    document.documentElement.dataset['theme'] = state.nightMode ? 'night' : '';
  }
}
