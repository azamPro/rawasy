import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { DataTable, Column } from '@/components/DataTable';
import type { Attendance } from '@/types';
import { generateId, formatDateTime, calculateHours } from '@/lib/utils';

export function Attendance() {
  const { attendance, workers, addAttendance } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Attendance>>({});

  const handleOpenModal = () => {
    setFormData({
      workerId: workers[0]?.id || '',
      checkIn: new Date(),
      checkOut: null,
      method: 'Manual',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAttendance({
      ...formData,
      id: generateId(),
    } as Attendance);
    setIsModalOpen(false);
    setFormData({});
  };

  const getWorkerName = (workerId: string) => {
    return workers.find((w) => w.id === workerId)?.name || 'Unknown';
  };

  const columns: Column<Attendance>[] = [
    {
      key: 'workerId',
      label: 'Worker',
      sortable: true,
      render: (att) => getWorkerName(att.workerId),
    },
    {
      key: 'checkIn',
      label: 'Check In',
      sortable: true,
      render: (att) => formatDateTime(att.checkIn),
    },
    {
      key: 'checkOut',
      label: 'Check Out',
      sortable: true,
      render: (att) => (att.checkOut ? formatDateTime(att.checkOut) : '-'),
    },
    {
      key: 'hours',
      label: 'Hours',
      render: (att) => calculateHours(att.checkIn, att.checkOut).toFixed(1),
    },
    {
      key: 'method',
      label: 'Method',
      sortable: true,
    },
  ];

  const stats = useMemo(() => {
    const totalHours = attendance.reduce(
      (sum, att) => sum + calculateHours(att.checkIn, att.checkOut),
      0
    );
    const avgHours = attendance.length > 0 ? totalHours / attendance.length : 0;

    return {
      totalRecords: attendance.length,
      avgHours: avgHours.toFixed(1),
    };
  }, [attendance]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground mt-1">Track worker check-ins and hours</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus className="h-4 w-4 mr-2" />
          Manual Check-in
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Total Records</p>
          <p className="text-2xl font-bold mt-1">{stats.totalRecords}</p>
        </div>
        <div className="p-4 border border-border rounded-lg">
          <p className="text-sm text-muted-foreground">Average Hours</p>
          <p className="text-2xl font-bold mt-1">{stats.avgHours}</p>
        </div>
      </div>

      <DataTable
        data={attendance}
        columns={columns}
        searchKeys={['method']}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Manual Check-in"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Worker</label>
            <Select
              required
              value={formData.workerId || ''}
              onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
            >
              {workers.map((worker) => (
                <option key={worker.id} value={worker.id}>
                  {worker.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Method</label>
            <Select
              required
              value={formData.method || 'Manual'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  method: e.target.value as Attendance['method'],
                })
              }
            >
              <option value="NFC">NFC</option>
              <option value="BLE">BLE</option>
              <option value="Manual">Manual</option>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Check In</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
