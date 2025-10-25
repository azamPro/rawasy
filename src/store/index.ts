import { create } from 'zustand';
import type { Worker, Incident, Zone, Device, Attendance, ThemeMode, PrimaryColor } from '@/types';
import { loadFromStorage, saveToStorage, clearStorage } from '@/lib/storage';
import { generateAllData } from '@/lib/seed-data';

interface AppState {
  workers: Worker[];
  incidents: Incident[];
  zones: Zone[];
  devices: Device[];
  attendance: Attendance[];
  themeMode: ThemeMode;
  primaryColor: PrimaryColor;
  sidebarOpen: boolean;

  addWorker: (worker: Worker) => void;
  updateWorker: (id: string, worker: Partial<Worker>) => void;
  deleteWorker: (id: string) => void;

  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, incident: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;

  addZone: (zone: Zone) => void;
  updateZone: (id: string, zone: Partial<Zone>) => void;
  deleteZone: (id: string) => void;

  addDevice: (device: Device) => void;
  updateDevice: (id: string, device: Partial<Device>) => void;
  deleteDevice: (id: string) => void;

  addAttendance: (attendance: Attendance) => void;
  updateAttendance: (id: string, attendance: Partial<Attendance>) => void;
  deleteAttendance: (id: string) => void;

  setThemeMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: PrimaryColor) => void;
  toggleSidebar: () => void;

  resetData: () => void;
  initialize: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  workers: [],
  incidents: [],
  zones: [],
  devices: [],
  attendance: [],
  themeMode: 'light',
  primaryColor: 'blue',
  sidebarOpen: true,

  addWorker: (worker) => {
    set((state) => {
      const newWorkers = [...state.workers, worker];
      saveToStorage({ ...state, workers: newWorkers });
      return { workers: newWorkers };
    });
  },

  updateWorker: (id, updates) => {
    set((state) => {
      const newWorkers = state.workers.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      );
      saveToStorage({ ...state, workers: newWorkers });
      return { workers: newWorkers };
    });
  },

  deleteWorker: (id) => {
    set((state) => {
      const newWorkers = state.workers.filter((w) => w.id !== id);
      saveToStorage({ ...state, workers: newWorkers });
      return { workers: newWorkers };
    });
  },

  addIncident: (incident) => {
    set((state) => {
      const newIncidents = [incident, ...state.incidents];
      saveToStorage({ ...state, incidents: newIncidents });
      return { incidents: newIncidents };
    });
  },

  updateIncident: (id, updates) => {
    set((state) => {
      const newIncidents = state.incidents.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      );
      saveToStorage({ ...state, incidents: newIncidents });
      return { incidents: newIncidents };
    });
  },

  deleteIncident: (id) => {
    set((state) => {
      const newIncidents = state.incidents.filter((i) => i.id !== id);
      saveToStorage({ ...state, incidents: newIncidents });
      return { incidents: newIncidents };
    });
  },

  addZone: (zone) => {
    set((state) => {
      const newZones = [...state.zones, zone];
      saveToStorage({ ...state, zones: newZones });
      return { zones: newZones };
    });
  },

  updateZone: (id, updates) => {
    set((state) => {
      const newZones = state.zones.map((z) =>
        z.id === id ? { ...z, ...updates } : z
      );
      saveToStorage({ ...state, zones: newZones });
      return { zones: newZones };
    });
  },

  deleteZone: (id) => {
    set((state) => {
      const newZones = state.zones.filter((z) => z.id !== id);
      saveToStorage({ ...state, zones: newZones });
      return { zones: newZones };
    });
  },

  addDevice: (device) => {
    set((state) => {
      const newDevices = [...state.devices, device];
      saveToStorage({ ...state, devices: newDevices });
      return { devices: newDevices };
    });
  },

  updateDevice: (id, updates) => {
    set((state) => {
      const newDevices = state.devices.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      );
      saveToStorage({ ...state, devices: newDevices });
      return { devices: newDevices };
    });
  },

  deleteDevice: (id) => {
    set((state) => {
      const newDevices = state.devices.filter((d) => d.id !== id);
      saveToStorage({ ...state, devices: newDevices });
      return { devices: newDevices };
    });
  },

  addAttendance: (attendance) => {
    set((state) => {
      const newAttendance = [attendance, ...state.attendance];
      saveToStorage({ ...state, attendance: newAttendance });
      return { attendance: newAttendance };
    });
  },

  updateAttendance: (id, updates) => {
    set((state) => {
      const newAttendance = state.attendance.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      );
      saveToStorage({ ...state, attendance: newAttendance });
      return { attendance: newAttendance };
    });
  },

  deleteAttendance: (id) => {
    set((state) => {
      const newAttendance = state.attendance.filter((a) => a.id !== id);
      saveToStorage({ ...state, attendance: newAttendance });
      return { attendance: newAttendance };
    });
  },

  setThemeMode: (mode) => {
    set({ themeMode: mode });
    localStorage.setItem('theme-mode', mode);
  },

  setPrimaryColor: (color) => {
    set({ primaryColor: color });
    localStorage.setItem('primary-color', color);
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  resetData: () => {
    clearStorage();
    const data = generateAllData();
    set(data);
    saveToStorage(data);
  },

  initialize: () => {
    const stored = loadFromStorage();
    if (stored) {
      set(stored);
    } else {
      get().resetData();
    }

    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
    const savedColor = localStorage.getItem('primary-color') as PrimaryColor;

    if (savedTheme) set({ themeMode: savedTheme });
    if (savedColor) set({ primaryColor: savedColor });
  },
}));
