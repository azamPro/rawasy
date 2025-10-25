import { useMemo } from 'react';
import { Users, MapPin, AlertTriangle, Shield } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppStore } from '@/store';
import { KPICard } from '@/components/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';
import type { Incident } from '@/types';

export function Dashboard() {
  const { workers, zones, incidents } = useAppStore();

  const activeWorkers = useMemo(
    () => workers.filter((w) => w.status === 'Active').length,
    [workers]
  );

  const activeZones = useMemo(
    () => zones.filter((z) => z.active).length,
    [zones]
  );

  const last24hIncidents = useMemo(() => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return incidents.filter((i) => i.timestamp.getTime() > oneDayAgo).length;
  }, [incidents]);

  const ppeCompliance = useMemo(() => {
    if (workers.length === 0) return 0;
    const compliant = workers.filter((w) => w.ppeCompliant).length;
    return Math.round((compliant / workers.length) * 100);
  }, [workers]);

  const recentIncidents = useMemo(
    () => incidents.slice(0, 5),
    [incidents]
  );

  const incidentsByType = useMemo(() => {
    const counts = incidents.reduce((acc, inc) => {
      acc[inc.type] = (acc[inc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
    }));
  }, [incidents]);

  const complianceTrend = useMemo(() => {
    const days = 7;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        compliance: Math.round(85 + Math.random() * 10),
      });
    }

    return data;
  }, []);

  const getSeverityVariant = (severity: Incident['severity']) => {
    switch (severity) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real-time overview of site operations
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Workers"
          value={activeWorkers}
          icon={Users}
          trend={{ value: 5, isPositive: true }}
        />
        <KPICard
          title="Active Zones"
          value={activeZones}
          icon={MapPin}
          trend={{ value: 2, isPositive: true }}
        />
        <KPICard
          title="Incidents (24h)"
          value={last24hIncidents}
          icon={AlertTriangle}
          trend={{ value: 12, isPositive: false }}
        />
        <KPICard
          title="PPE Compliance"
          value={`${ppeCompliance}%`}
          icon={Shield}
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  <AlertTriangle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{incident.type}</p>
                      <Badge variant={getSeverityVariant(incident.severity)}>
                        {incident.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTime(incident.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Incidents by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={incidentsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="type"
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
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">PPE Compliance Trend (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={complianceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  fontSize={12}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  fontSize={12}
                  domain={[75, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="compliance"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
