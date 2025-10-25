import { z } from 'zod';

export const WorkerSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  role: z.enum(['Operator', 'Technician', 'Supervisor']),
  shift: z.enum(['A', 'B', 'C']),
  status: z.enum(['Active', 'Off', 'OnLeave']),
  phone: z.string().min(10),
  badgeId: z.string().min(3),
  ppeCompliant: z.boolean(),
  createdAt: z.date(),
});

export const IncidentSchema = z.object({
  id: z.string(),
  type: z.enum(['Fall', 'Gas Alert', 'Zone Intrusion', 'Other']),
  severity: z.enum(['Low', 'Medium', 'High']),
  workerId: z.string().nullable(),
  zoneId: z.string().nullable(),
  timestamp: z.date(),
  notes: z.string(),
});

export const ZoneSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  type: z.enum(['Surface', 'Underground', 'Restricted']),
  beacons: z.array(z.string()).optional(),
  active: z.boolean(),
});

export const DeviceSchema = z.object({
  id: z.string(),
  type: z.enum(['SmartVest', 'UWB Anchor', 'Camera', 'Gateway']),
  serial: z.string().min(5),
  status: z.enum(['Online', 'Offline', 'Degraded']),
  zoneId: z.string().nullable(),
  lastSeen: z.date(),
});

export const AttendanceSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  checkIn: z.date(),
  checkOut: z.date().nullable(),
  method: z.enum(['NFC', 'BLE', 'Manual']),
});

export type Worker = z.infer<typeof WorkerSchema>;
export type Incident = z.infer<typeof IncidentSchema>;
export type Zone = z.infer<typeof ZoneSchema>;
export type Device = z.infer<typeof DeviceSchema>;
export type Attendance = z.infer<typeof AttendanceSchema>;

export type ThemeMode = 'light' | 'dark' | 'system';
export type PrimaryColor = 'blue' | 'green' | 'orange' | 'red' | 'slate';
