export function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function loadState<T>(key: string): T | null {
  try {
    const val = localStorage.getItem(key);
    return val ? (JSON.parse(val) as T) : null;
  } catch {
    return null;
  }
}
