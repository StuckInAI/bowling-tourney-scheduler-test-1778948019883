const STORAGE_KEY = 'bowling_app_state';

export function loadState<T = unknown>(): T | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as T;
  } catch {
    return null;
  }
}

export function saveState<T = unknown>(value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // ignore
  }
}
