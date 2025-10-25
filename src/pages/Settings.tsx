import { useAppStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import type { PrimaryColor } from '@/types';

const primaryColors: { value: PrimaryColor; label: string; color: string }[] = [
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'green', label: 'Green', color: '#10b981' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'red', label: 'Red', color: '#ef4444' },
  { value: 'slate', label: 'Slate', color: '#64748b' },
];

export function Settings() {
  const { themeMode, setThemeMode, primaryColor, setPrimaryColor, resetData } =
    useAppStore();

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all demo data? This cannot be undone.')) {
      resetData();
      alert('Demo data has been reset successfully!');
    }
  };

  const handleExportData = () => {
    const state = useAppStore.getState();
    const data = {
      workers: state.workers,
      incidents: state.incidents,
      zones: state.zones,
      devices: state.devices,
      attendance: state.attendance,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wsi-admin-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme Mode</label>
              <Select
                value={themeMode}
                onChange={(e) => setThemeMode(e.target.value as typeof themeMode)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="grid grid-cols-5 gap-2">
                {primaryColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setPrimaryColor(color.value)}
                    className={`h-12 rounded-lg border-2 transition-all ${
                      primaryColor === color.value
                        ? 'border-foreground scale-105'
                        : 'border-border hover:border-foreground/50'
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Reset all data to default demo values
              </p>
              <Button variant="destructive" onClick={handleResetData}>
                Reset Demo Data
              </Button>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Export all data as JSON file
              </p>
              <Button variant="outline" onClick={handleExportData}>
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Build</span>
              <span className="text-sm font-medium">Production</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Keyboard Shortcuts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Search</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">/</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">New item</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">N</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Toggle theme</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">T</kbd>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
