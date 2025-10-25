import { useState, useMemo } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DataTable, Column } from '@/components/DataTable';
import type { Worker } from '@/types';
import { generateId } from '@/lib/utils';

export function Workers() {
  const { workers, addWorker, updateWorker, deleteWorker } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [formData, setFormData] = useState<Partial<Worker>>({});
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterShift, setFilterShift] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      if (filterRole && worker.role !== filterRole) return false;
      if (filterShift && worker.shift !== filterShift) return false;
      if (filterStatus && worker.status !== filterStatus) return false;
      return true;
    });
  }, [workers, filterRole, filterShift, filterStatus]);

  const handleOpenModal = (worker?: Worker) => {
    if (worker) {
      setEditingWorker(worker);
      setFormData(worker);
    } else {
      setEditingWorker(null);
      setFormData({
        name: '',
        role: 'Operator',
        shift: 'A',
        status: 'Active',
        phone: '',
        badgeId: '',
        ppeCompliant: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingWorker) {
      updateWorker(editingWorker.id, formData);
    } else {
      addWorker({
        ...formData,
        id: generateId(),
        createdAt: new Date(),
      } as Worker);
    }

    setIsModalOpen(false);
    setEditingWorker(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this worker?')) {
      deleteWorker(id);
    }
  };

  const columns: Column<Worker>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
    },
    {
      key: 'badgeId',
      label: 'Badge ID',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
    },
    {
      key: 'shift',
      label: 'Shift',
      sortable: true,
      render: (worker) => <Badge variant="secondary">{worker.shift}</Badge>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (worker) => (
        <Badge
          variant={
            worker.status === 'Active'
              ? 'success'
              : worker.status === 'Off'
              ? 'secondary'
              : 'warning'
          }
        >
          {worker.status}
        </Badge>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
    },
    {
      key: 'ppeCompliant',
      label: 'PPE',
      render: (worker) => (
        <Badge variant={worker.ppeCompliant ? 'success' : 'error'}>
          {worker.ppeCompliant ? 'Compliant' : 'Non-compliant'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (worker) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenModal(worker);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(worker.id);
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
          <h1 className="text-3xl font-bold">Workers</h1>
          <p className="text-muted-foreground mt-1">Manage site personnel</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Worker
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-40"
        >
          <option value="">All Roles</option>
          <option value="Operator">Operator</option>
          <option value="Technician">Technician</option>
          <option value="Supervisor">Supervisor</option>
        </Select>

        <Select
          value={filterShift}
          onChange={(e) => setFilterShift(e.target.value)}
          className="w-40"
        >
          <option value="">All Shifts</option>
          <option value="A">Shift A</option>
          <option value="B">Shift B</option>
          <option value="C">Shift C</option>
        </Select>

        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-40"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Off">Off</option>
          <option value="OnLeave">On Leave</option>
        </Select>
      </div>

      <DataTable
        data={filteredWorkers}
        columns={columns}
        searchKeys={['name', 'badgeId', 'phone']}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWorker ? 'Edit Worker' : 'Add Worker'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <Select
                required
                value={formData.role || 'Operator'}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as Worker['role'] })
                }
              >
                <option value="Operator">Operator</option>
                <option value="Technician">Technician</option>
                <option value="Supervisor">Supervisor</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Shift</label>
              <Select
                required
                value={formData.shift || 'A'}
                onChange={(e) =>
                  setFormData({ ...formData, shift: e.target.value as Worker['shift'] })
                }
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select
                required
                value={formData.status || 'Active'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Worker['status'] })
                }
              >
                <option value="Active">Active</option>
                <option value="Off">Off</option>
                <option value="OnLeave">On Leave</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Badge ID</label>
              <Input
                required
                value={formData.badgeId || ''}
                onChange={(e) => setFormData({ ...formData, badgeId: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              required
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ppeCompliant"
              checked={formData.ppeCompliant ?? true}
              onChange={(e) =>
                setFormData({ ...formData, ppeCompliant: e.target.checked })
              }
              className="h-4 w-4"
            />
            <label htmlFor="ppeCompliant" className="text-sm font-medium">
              PPE Compliant
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingWorker ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
