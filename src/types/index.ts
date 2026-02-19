export interface CampingItem {
  id: string;
  name: string;
  emoji?: string;
}

export interface CampingZone {
  id: string;
  name: string;
  emoji: string;
  color: string;
  glowColor: string;
  items: CampingItem[];
}

export interface ZoneState {
  checkedItems: Set<string>;
}

export interface AppState {
  zones: Record<string, ZoneState>;
  nightMode: boolean;
  activeZoneId: string | null;
}

export type StateListener = (state: AppState) => void;
