import type { AppState } from '../types/index.js';
import type { StateManager } from '../state/StateManager.js';
import { campingZones } from '../data/campingData.js';

export class Sidebar {
  private sidebarEl: HTMLElement;
  private overlayEl: HTMLElement;
  private stateManager: StateManager;
  private currentZoneId: string | null = null;

  constructor(sidebarEl: HTMLElement, overlayEl: HTMLElement, stateManager: StateManager) {
    this.sidebarEl = sidebarEl;
    this.overlayEl = overlayEl;
    this.stateManager = stateManager;

    this.overlayEl.addEventListener('click', () => {
      this.stateManager.setActiveZone(null);
    });

    this.stateManager.subscribe(state => this.update(state));
    this.update(this.stateManager.getState());
  }

  private update(state: AppState): void {
    if (state.activeZoneId !== this.currentZoneId) {
      this.currentZoneId = state.activeZoneId;
      if (state.activeZoneId) {
        this.openZone(state.activeZoneId, state);
      } else {
        this.close();
      }
    } else if (state.activeZoneId) {
      // Zone is same, update checklist items
      this.updateChecklist(state.activeZoneId, state);
    }
  }

  private openZone(zoneId: string, state: AppState): void {
    const zone = campingZones.find(z => z.id === zoneId);
    if (!zone) return;

    const progress = this.stateManager.getZoneProgress(zoneId);
    const pct = progress.total > 0 ? (progress.checked / progress.total) * 100 : 0;

    this.sidebarEl.innerHTML = `
      <div class="sidebar-header">
        <span class="sidebar-zone-emoji">${zone.emoji}</span>
        <div class="sidebar-zone-info">
          <div class="sidebar-zone-name">${zone.name}</div>
          <div class="sidebar-zone-progress">${progress.checked} de ${progress.total} items empacados</div>
        </div>
        <button class="sidebar-close-btn" aria-label="Cerrar panel" id="sidebar-close">✕</button>
      </div>
      <div class="sidebar-zone-progress-bar">
        <div class="sidebar-zone-progress-bar-fill" style="width: ${pct}%; background: ${zone.color};"></div>
      </div>
      <div class="sidebar-items" role="list" aria-label="Items de ${zone.name}">
        ${zone.items.map(item => {
          const checked = state.zones[zoneId]?.checkedItems.has(item.id) ?? false;
          return `
          <label class="checklist-item${checked ? ' checked' : ''}" role="listitem" data-item-id="${item.id}">
            <input type="checkbox" ${checked ? 'checked' : ''} aria-label="${item.name}" data-zone="${zoneId}" data-item="${item.id}"/>
            <span class="checklist-item-emoji">${item.emoji ?? ''}</span>
            <span class="checklist-item-name">${item.name}</span>
          </label>`;
        }).join('')}
      </div>
    `;

    // Attach close button
    const closeBtn = this.sidebarEl.querySelector('#sidebar-close');
    closeBtn?.addEventListener('click', () => {
      this.stateManager.setActiveZone(null);
    });

    // Attach checkbox listeners
    const checkboxes = this.sidebarEl.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const zId = cb.dataset['zone'];
        const iId = cb.dataset['item'];
        if (zId && iId) {
          this.stateManager.toggleItem(zId, iId);
        }
      });
    });

    this.sidebarEl.classList.add('open');
    this.overlayEl.classList.add('visible');

    // Focus the sidebar for accessibility
    setTimeout(() => {
      const closeButton = this.sidebarEl.querySelector<HTMLButtonElement>('#sidebar-close');
      closeButton?.focus();
    }, 310);
  }

  private close(): void {
    this.sidebarEl.classList.remove('open');
    this.overlayEl.classList.remove('visible');
  }

  private updateChecklist(zoneId: string, state: AppState): void {
    const zone = campingZones.find(z => z.id === zoneId);
    if (!zone) return;

    const progress = this.stateManager.getZoneProgress(zoneId);
    const pct = progress.total > 0 ? (progress.checked / progress.total) * 100 : 0;

    // Update progress text
    const progressText = this.sidebarEl.querySelector('.sidebar-zone-progress');
    if (progressText) {
      progressText.textContent = `${progress.checked} de ${progress.total} items empacados`;
    }

    // Update progress bar
    const progressBar = this.sidebarEl.querySelector<HTMLElement>('.sidebar-zone-progress-bar-fill');
    if (progressBar) {
      progressBar.style.width = `${pct}%`;
    }

    // Update individual items
    const items = this.sidebarEl.querySelectorAll<HTMLElement>('.checklist-item');
    items.forEach(item => {
      const itemId = item.dataset['itemId'];
      if (!itemId) return;
      const checked = state.zones[zoneId]?.checkedItems.has(itemId) ?? false;
      const checkbox = item.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (checkbox) checkbox.checked = checked;
      item.classList.toggle('checked', checked);
    });
  }
}
