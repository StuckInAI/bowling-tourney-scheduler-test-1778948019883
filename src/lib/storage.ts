const STORAGE_KEY = 'bowling_app_state';

export function saveState<T>(value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function loadState<T>(): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error('Failed to load state:', e);
    return null;
  }
}
