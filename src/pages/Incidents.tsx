import { useState, useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { DataTable, Column } from '@/components/DataTable';
import type { Incident } from '@/types';
import { generateId, formatDateTime } from '@/lib/utils';

export function Incidents() {
  const { incidents, workers, zones, addIncident, deleteIncident } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Incident>>({});
  const [filterType, setFilterType] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('');

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      if (filterType && incident.type !== filterType) return false;
      if (filterSeverity && incident.severity !== filterSeverity) return false;
      return true;
    });
  }, [incidents, filterType, filterSeverity]);

  const handleOpenModal = () => {
    setFormData({
      type: 'Other',
      severity: 'Low',
      workerId: null,
      zoneId: null,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIncident({
      ...formData,
      id: generateId(),
      timestamp: new Date(),
    } as Incident);
    setIsModalOpen(false);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this incident?')) {
      deleteIncident(id);
    }
  };

  const getWorkerName = (workerId: string | null) => {
    if (!workerId) return '-';
    return workers.find((w) => w.id === workerId)?.name || 'Unknown';
  };

  const getZoneName = (zoneId: string | null) => {
    if (!zoneId) return '-';
    return zones.find((z) => z.id === zoneId)?.name || 'Unknown';
  };

  const getSeverityVariant = (severity: Incident['severity']) => {
    switch (severity) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
    }
  };

  const columns: Column<Incident>[] = [
    {
      key: 'type',
      label: 'Type',
      sortable: true,
    },
    {
      key: 'severity',
      label: 'Severity',
      sortable: true,
      render: (incident) => (
        <Badge variant={getSeverityVariant(incident.severity)}>
          {incident.severity}
        </Badge>
      ),
    },
    {
      key: 'workerId',
      label: 'Worker',
      render: (incident) => getWorkerName(incident.workerId),
    },
    {
      key: 'zoneId',
      label: 'Zone',
      render: (incident) => getZoneName(incident.zoneId),
    },
    {
      key: 'timestamp',
      label: 'Time',
      sortable: true,
      render: (incident) => formatDateTime(incident.timestamp),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (incident) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(incident.id);
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Incidents</h1>
          <p className="text-muted-foreground mt-1">Track and manage safety incidents</p>
        </div>
        <Button onClick={handleOpenModal}>
          <Plus className="h-4 w-4 mr-2" />
          Log Incident
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-48"
        >
          <option value="">All Types</option>
          <option value="Fall">Fall</option>
          <option value="Gas Alert">Gas Alert</option>
          <option value="Zone Intrusion">Zone Intrusion</option>
          <option value="Other">Other</option>
        </Select>

        <Select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="w-48"
        >
          <option value="">All Severities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </Select>
      </div>

      <DataTable
        data={filteredIncidents}
        columns={columns}
        searchKeys={['type', 'notes']}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Incident"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select
                required
                value={formData.type || 'Other'}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as Incident['type'] })
                }
              >
                <option value="Fall">Fall</option>
                <option value="Gas Alert">Gas Alert</option>
                <option value="Zone Intrusion">Zone Intrusion</option>
                <option value="Other">Other</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Severity</label>
              <Select
                required
                value={formData.severity || 'Low'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    severity: e.target.value as Incident['severity'],
                  })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Worker (Optional)</label>
              <Select
                value={formData.workerId || ''}
                onChange={(e) =>
                  setFormData({ ...formData, workerId: e.target.value || null })
                }
              >
                <option value="">None</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name}
                  </option>
                ))}
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
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Log Incident</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
