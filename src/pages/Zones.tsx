import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { Zone } from '@/types';
import { generateId } from '@/lib/utils';

export function Zones() {
  const { zones, addZone, updateZone, deleteZone } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [formData, setFormData] = useState<Partial<Zone>>({});

  const handleOpenModal = (zone?: Zone) => {
    if (zone) {
      setEditingZone(zone);
      setFormData(zone);
    } else {
      setEditingZone(null);
      setFormData({
        name: '',
        type: 'Surface',
        active: true,
        beacons: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingZone) {
      updateZone(editingZone.id, formData);
    } else {
      addZone({
        ...formData,
        id: generateId(),
      } as Zone);
    }

    setIsModalOpen(false);
    setEditingZone(null);
    setFormData({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this zone?')) {
      deleteZone(id);
    }
  };

  const toggleZoneActive = (zone: Zone) => {
    updateZone(zone.id, { active: !zone.active });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Zones & Geofences</h1>
          <p className="text-muted-foreground mt-1">Manage site zones and boundaries</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Zone
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => (
          <Card key={zone.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{zone.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{zone.type}</Badge>
                    <Badge variant={zone.active ? 'success' : 'secondary'}>
                      {zone.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenModal(zone)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(zone.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Beacons</p>
                  <p className="font-medium">
                    {zone.beacons?.length || 0} configured
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleZoneActive(zone)}
                  className="w-full"
                >
                  {zone.active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingZone ? 'Edit Zone' : 'Add Zone'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Zone Name</label>
            <Input
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Select
              required
              value={formData.type || 'Surface'}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as Zone['type'] })
              }
            >
              <option value="Surface">Surface</option>
              <option value="Underground">Underground</option>
              <option value="Restricted">Restricted</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active ?? true}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="h-4 w-4"
            />
            <label htmlFor="active" className="text-sm font-medium">
              Active
            </label>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingZone ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
