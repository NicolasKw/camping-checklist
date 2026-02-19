import type { AppState, StateListener, ZoneState } from '../types/index.js';
import { campingZones } from '../data/campingData.js';

const STORAGE_KEY = 'camping-checklist-state';

function createInitialState(): AppState {
  const zones: Record<string, ZoneState> = {};
  for (const zone of campingZones) {
    zones[zone.id] = { checkedItems: new Set<string>() };
  }
  return { zones, nightMode: false, activeZoneId: null };
}

function serializeState(state: AppState): string {
  const serializable = {
    nightMode: state.nightMode,
    zones: Object.fromEntries(
      Object.entries(state.zones).map(([id, zs]) => [id, Array.from(zs.checkedItems)])
    ),
  };
  return JSON.stringify(serializable);
}

function deserializeState(json: string): Partial<AppState> {
  const parsed = JSON.parse(json) as { nightMode?: boolean; zones?: Record<string, string[]> };
  const zones: Record<string, ZoneState> = {};
  if (parsed.zones) {
    for (const [id, items] of Object.entries(parsed.zones)) {
      zones[id] = { checkedItems: new Set(items) };
    }
  }
  return { nightMode: parsed.nightMode ?? false, zones };
}

export class StateManager {
  private state: AppState;
  private listeners: StateListener[] = [];

  constructor() {
    this.state = createInitialState();
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const partial = deserializeState(raw);
      if (partial.nightMode !== undefined) {
        this.state.nightMode = partial.nightMode;
      }
      if (partial.zones) {
        for (const [id, zs] of Object.entries(partial.zones)) {
          if (this.state.zones[id]) {
            this.state.zones[id] = zs;
          }
        }
      }
    } catch {
      // ignore corrupt storage
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, serializeState(this.state));
    } catch {
      // ignore storage errors
    }
  }

  getState(): AppState {
    return this.state;
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  setActiveZone(zoneId: string | null): void {
    this.state.activeZoneId = zoneId;
    this.notify();
  }

  toggleItem(zoneId: string, itemId: string): void {
    const zoneState = this.state.zones[zoneId];
    if (!zoneState) return;
    if (zoneState.checkedItems.has(itemId)) {
      zoneState.checkedItems.delete(itemId);
    } else {
      zoneState.checkedItems.add(itemId);
    }
    this.saveToStorage();
    this.notify();
  }

  toggleNightMode(): void {
    this.state.nightMode = !this.state.nightMode;
    this.saveToStorage();
    this.notify();
  }

  reset(): void {
    for (const zoneId of Object.keys(this.state.zones)) {
      this.state.zones[zoneId] = { checkedItems: new Set<string>() };
    }
    this.state.activeZoneId = null;
    this.saveToStorage();
    this.notify();
  }

  getZoneProgress(zoneId: string): { checked: number; total: number } {
    const zone = campingZones.find(z => z.id === zoneId);
    if (!zone) return { checked: 0, total: 0 };
    const zoneState = this.state.zones[zoneId];
    return {
      checked: zoneState ? zoneState.checkedItems.size : 0,
      total: zone.items.length,
    };
  }

  getTotalProgress(): { checked: number; total: number } {
    let checked = 0;
    let total = 0;
    for (const zone of campingZones) {
      const p = this.getZoneProgress(zone.id);
      checked += p.checked;
      total += p.total;
    }
    return { checked, total };
  }
}
