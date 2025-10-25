const STORAGE_KEY = 'wsi-admin';

export interface StorageData {
  workers: any[];
  zones: any[];
  devices: any[];
  incidents: any[];
  attendance: any[];
}

function reviveDates(key: string, value: any) {
  const dateFields = ['createdAt', 'timestamp', 'lastSeen', 'checkIn', 'checkOut'];
  if (dateFields.includes(key) && typeof value === 'string') {
    return new Date(value);
  }
  return value;
}

export function loadFromStorage(): StorageData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data, reviveDates);
  } catch (error) {
    console.error('Failed to load from storage:', error);
    return null;
  }
}

export function saveToStorage(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}
