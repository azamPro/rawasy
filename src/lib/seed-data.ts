import type { Worker, Incident, Zone, Device, Attendance } from '@/types';

const generateId = () => Math.random().toString(36).substring(2, 11);

const names = [
  'John Smith', 'Maria Garcia', 'David Chen', 'Sarah Johnson', 'Michael Brown',
  'Lisa Wang', 'James Wilson', 'Emma Davis', 'Robert Lee', 'Jennifer Taylor',
  'William Anderson', 'Jessica Martinez', 'Thomas Rodriguez', 'Amanda White',
  'Daniel Kim', 'Ashley Thompson', 'Christopher Moore', 'Michelle Lewis',
  'Matthew Clark', 'Stephanie Hall', 'Anthony Allen', 'Laura Young',
  'Mark King', 'Karen Wright'
];

export function generateWorkers(): Worker[] {
  const roles: Worker['role'][] = ['Operator', 'Technician', 'Supervisor'];
  const shifts: Worker['shift'][] = ['A', 'B', 'C'];
  const statuses: Worker['status'][] = ['Active', 'Off', 'OnLeave'];

  return names.map((name, i) => ({
    id: generateId(),
    name,
    role: roles[i % roles.length],
    shift: shifts[i % shifts.length],
    status: i < 18 ? 'Active' : statuses[i % statuses.length],
    phone: `555-${String(1000 + i).padStart(4, '0')}`,
    badgeId: `WSI-${String(1000 + i)}`,
    ppeCompliant: Math.random() > 0.2,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
  }));
}

export function generateZones(): Zone[] {
  const zones = [
    { name: 'North Pit', type: 'Surface' as const },
    { name: 'South Pit', type: 'Surface' as const },
    { name: 'East Mining Area', type: 'Surface' as const },
    { name: 'Shaft A Level 1', type: 'Underground' as const },
    { name: 'Shaft A Level 2', type: 'Underground' as const },
    { name: 'Shaft B Level 1', type: 'Underground' as const },
    { name: 'Processing Plant', type: 'Surface' as const },
    { name: 'Storage Area', type: 'Restricted' as const },
    { name: 'Hazmat Zone', type: 'Restricted' as const },
    { name: 'Equipment Yard', type: 'Surface' as const },
  ];

  return zones.map((z, i) => ({
    id: generateId(),
    name: z.name,
    type: z.type,
    beacons: Array.from({ length: Math.floor(Math.random() * 4) + 2 }, (_, j) => `BCN-${i}-${j}`),
    active: Math.random() > 0.1,
  }));
}

export function generateDevices(zones: Zone[]): Device[] {
  const devices: Device[] = [];
  const types: Device['type'][] = ['SmartVest', 'UWB Anchor', 'Camera', 'Gateway'];
  const statuses: Device['status'][] = ['Online', 'Offline', 'Degraded'];

  for (let i = 0; i < 18; i++) {
    const type = types[i % types.length];
    const status = i < 14 ? 'Online' : statuses[i % statuses.length];
    const zoneId = i < 15 ? zones[i % zones.length].id : null;

    devices.push({
      id: generateId(),
      type,
      serial: `${type.substring(0, 3).toUpperCase()}-${String(10000 + i)}`,
      status,
      zoneId,
      lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    });
  }

  return devices;
}

export function generateIncidents(workers: Worker[], zones: Zone[]): Incident[] {
  const incidents: Incident[] = [];
  const types: Incident['type'][] = ['Fall', 'Gas Alert', 'Zone Intrusion', 'Other'];
  const severities: Incident['severity'][] = ['Low', 'Medium', 'High'];

  for (let i = 0; i < 40; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const workerId = Math.random() > 0.3 ? workers[Math.floor(Math.random() * workers.length)].id : null;
    const zoneId = Math.random() > 0.2 ? zones[Math.floor(Math.random() * zones.length)].id : null;

    incidents.push({
      id: generateId(),
      type,
      severity,
      workerId,
      zoneId,
      timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
      notes: `${type} incident reported. ${severity} severity level.`,
    });
  }

  return incidents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generateAttendance(workers: Worker[]): Attendance[] {
  const attendance: Attendance[] = [];
  const methods: Attendance['method'][] = ['NFC', 'BLE', 'Manual'];

  const activeWorkers = workers.filter(w => w.status === 'Active');

  for (let day = 0; day < 14; day++) {
    activeWorkers.forEach((worker) => {
      if (Math.random() > 0.1) {
        const checkIn = new Date(Date.now() - day * 24 * 60 * 60 * 1000);
        checkIn.setHours(7 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);

        const checkOut = Math.random() > 0.05 ? new Date(checkIn.getTime() + (8 + Math.random() * 2) * 60 * 60 * 1000) : null;

        attendance.push({
          id: generateId(),
          workerId: worker.id,
          checkIn,
          checkOut,
          method: methods[Math.floor(Math.random() * methods.length)],
        });
      }
    });
  }

  return attendance.sort((a, b) => b.checkIn.getTime() - a.checkIn.getTime());
}

export function generateAllData() {
  const workers = generateWorkers();
  const zones = generateZones();
  const devices = generateDevices(zones);
  const incidents = generateIncidents(workers, zones);
  const attendance = generateAttendance(workers);

  return { workers, zones, devices, incidents, attendance };
}
