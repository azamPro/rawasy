import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable, Column } from '@/components/DataTable';
import type { Device } from '@/types';
import { generateId, formatDateTime } from '@/lib/utils';

export function Devices() {
  const { devices, zones, addDevice, updateDevice, deleteDevice } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<Partial<Device>>({});
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      if (filterType && device.type !== filterType) return false;
      if (filterStatus && device.status !== filterStatus) return false;
      return true;
    });
  }, [devices, filterType, filterStatus]);

  const handleOpenModal = (device?: Device) => {
    if (device) {
      setEditingDevice(device);
      setFormData(device);
    } else {
      setEditingDevice(null);
      setFormData({
        type: 'SmartVest',
        serial: '',
        status: 'Online',
        zoneId: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingDevice) {
      updateDevice(editingDevice.id, formData);
    } else {
      addDevice({
        ...formData,
        id: generateId(),
        lastSeen: new Date(),
      } as Device);
    }

    setIsModalOpen(false);
    setEditingDevice(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      deleteDevice(id);
    }
  };

  const getZoneName = (zoneId: string | null) => {
    if (!zoneId) return '-';
    return zones.find((z) => z.id === zoneId)?.name || 'Unknown';
  };

  const getStatusVariant = (status: Device['status']) => {
    switch (status) {
      case 'Online':
        return 'success';
      case 'Offline':
        return 'error';
      case 'Degraded':
        return 'warning';
    }
  };

  const columns: Column<Device>[] = [
    {
      key: 'type',
      label: 'Type',
      sortable: true,
    },
    {
      key: 'serial',
      label: 'Serial',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (device) => (
        <Badge variant={getStatusVariant(device.status)}>{device.status}</Badge>
      ),
    },
    {
      key: 'zoneId',
      label: 'Zone',
      render: (device) => getZoneName(device.zoneId),
    },
    {
      key: 'lastSeen',
      label: 'Last Seen',
      sortable: true,
      render: (device) => formatDateTime(device.lastSeen),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (device) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(device);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(device.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Devices</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage IoT devices</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Register Device
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-48"
        >
          <option value="">All Types</option>
          <option value="SmartVest">SmartVest</option>
          <option value="UWB Anchor">UWB Anchor</option>
          <option value="Camera">Camera</option>
          <option value="Gateway">Gateway</option>
        </Select>

        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-48"
        >
          <option value="">All Statuses</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
          <option value="Degraded">Degraded</option>
        </Select>
      </div>

      <DataTable
        data={filteredDevices}
        columns={columns}
        searchKeys={['type', 'serial']}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDevice ? 'Edit Device' : 'Register Device'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Select
              required
              value={formData.type || 'SmartVest'}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as Device['type'] })
              }
            >
              <option value="SmartVest">SmartVest</option>
              <option value="UWB Anchor">UWB Anchor</option>
              <option value="Camera">Camera</option>
              <option value="Gateway">Gateway</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Serial Number</label>
            <Input
              required
              value={formData.serial || ''}
              onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              required
              value={formData.status || 'Online'}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as Device['status'] })
              }
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Degraded">Degraded</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Zone (Optional)</label>
            <Select
              value={formData.zoneId || ''}
              onChange={(e) =>
                setFormData({ ...formData, zoneId: e.target.value || null })
              }
            >
              <option value="">None</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingDevice ? 'Update' : 'Register'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
