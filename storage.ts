import type { WellnessState } from "./types";

const KEY = "nutritrack-state-v2";

export const emptyState: WellnessState = {
  meals: [],
  waterLogs: [],
  eyeBreaks: [],
};

export function loadState(): WellnessState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState;
    return JSON.parse(raw) as WellnessState;
  } catch {
    return emptyState;
  }
}

export function saveState(state: WellnessState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
