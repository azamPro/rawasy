import { useMemo } from 'react';
import { FileDown } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAppStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function Reports() {
  const { incidents, workers } = useAppStore();

  const incidentsByType = useMemo(() => {
    const counts = incidents.reduce((acc, inc) => {
      acc[inc.type] = (acc[inc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([type, count]) => ({
      name: type,
      value: count,
    }));
  }, [incidents]);

  const incidentsBySeverity = useMemo(() => {
    const counts = incidents.reduce((acc, inc) => {
      acc[inc.severity] = (acc[inc.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([severity, count]) => ({
      severity,
      count,
    }));
  }, [incidents]);

  const ppeByShift = useMemo(() => {
    const shifts = ['A', 'B', 'C'];
    return shifts.map((shift) => {
      const shiftWorkers = workers.filter((w) => w.shift === shift);
      const compliant = shiftWorkers.filter((w) => w.ppeCompliant).length;
      const total = shiftWorkers.length;
      return {
        shift: `Shift ${shift}`,
        compliance: total > 0 ? Math.round((compliant / total) * 100) : 0,
      };
    });
  }, [workers]);


  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) => headers.map((h) => row[h]).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Analytics and insights</p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            exportToCSV(
              incidents.map((i) => ({
                type: i.type,
                severity: i.severity,
                timestamp: i.timestamp.toISOString(),
              })),
              'incidents.csv'
            )
          }
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Incidents by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incidentsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  fontSize={12}
                />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Incidents by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incidentsBySeverity}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {incidentsBySeverity.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">PPE Compliance by Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ppeByShift}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="shift"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  fontSize={12}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar
                  dataKey="compliance"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
