import './style.css';
import { StateManager } from './state/StateManager.js';
import { CampsiteMap } from './components/CampsiteMap.js';
import { Sidebar } from './components/Sidebar.js';
import { ProgressBar } from './components/ProgressBar.js';
import { DayNightToggle } from './components/DayNightToggle.js';
import { FireAnimation } from './components/FireAnimation.js';
import { AmbientAnimations } from './components/AmbientAnimations.js';
import { campingZones } from './data/campingData.js';

// ── Bootstrap ────────────────────────────────────────────────

const stateManager = new StateManager();

// Map
const mapContainer = document.getElementById('campsite-map')!;
new CampsiteMap(mapContainer, stateManager);

// Sidebar
const sidebarEl = document.getElementById('sidebar')!;
const overlayEl = document.getElementById('sidebar-overlay')!;
new Sidebar(sidebarEl, overlayEl, stateManager);

// Header Progress Bar
const progressBarContainer = document.getElementById('progress-bar-container')!;
new ProgressBar(progressBarContainer, stateManager);

// Day/Night Toggle
const toggleContainer = document.getElementById('day-night-toggle')!;
const toggle = new DayNightToggle(toggleContainer, stateManager);

// Fire & Ambient (init after map renders SVG)
setTimeout(() => {
  const fireAnim = new FireAnimation(mapContainer);
  new AmbientAnimations(mapContainer);

  // Keep fire updated on theme changes
  stateManager.subscribe(state => {
    fireAnim.setNightMode(state.nightMode);
    // Apply immediately on first load too
  });
  fireAnim.setNightMode(stateManager.getState().nightMode);
}, 50);

// ── Reset ────────────────────────────────────────────────────

const resetBtn = document.getElementById('reset-btn')!;
const resetModal = document.getElementById('reset-modal')!;
const modalCancel = document.getElementById('modal-cancel')!;
const modalConfirm = document.getElementById('modal-confirm')!;

resetBtn.addEventListener('click', () => {
  resetModal.hidden = false;
  modalConfirm.focus();
});

modalCancel.addEventListener('click', () => {
  resetModal.hidden = true;
  resetBtn.focus();
});

modalConfirm.addEventListener('click', () => {
  stateManager.reset();
  resetModal.hidden = true;
  resetBtn.focus();
});

// Close modal on backdrop click
resetModal.addEventListener('click', (e) => {
  if (e.target === resetModal) {
    resetModal.hidden = true;
  }
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!resetModal.hidden) {
      resetModal.hidden = true;
      return;
    }
    if (stateManager.getState().activeZoneId) {
      stateManager.setActiveZone(null);
    }
  }
});

// ── Print ────────────────────────────────────────────────────

const printBtn = document.getElementById('print-btn')!;
printBtn.addEventListener('click', () => {
  buildPrintContent();
  window.print();
});

function buildPrintContent(): void {
  // Remove previous print content if any
  const existing = document.getElementById('print-content');
  existing?.remove();

  const state = stateManager.getState();
  const div = document.createElement('div');
  div.id = 'print-content';
  div.className = 'print-list';

  div.innerHTML = campingZones.map(zone => {
    const zoneState = state.zones[zone.id];
    return `
      <div class="print-zone">
        <h3>${zone.emoji} ${zone.name}</h3>
        ${zone.items.map(item => {
          const isChecked = zoneState?.checkedItems.has(item.id) ?? false;
          return `
          <div class="print-item">
            <div class="print-checkbox${isChecked ? ' checked' : ''}"></div>
            <span>${item.emoji ?? ''} ${item.name}</span>
          </div>`;
        }).join('')}
      </div>`;
  }).join('');

  document.body.appendChild(div);
}

// Apply initial theme from persisted state
const initialState = stateManager.getState();
document.documentElement.dataset['theme'] = initialState.nightMode ? 'night' : '';

// Suppress unused warning - toggle is used for side effects
void toggle;
