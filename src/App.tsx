import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppStore } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Workers } from './pages/Workers';
import { Incidents } from './pages/Incidents';
import { Zones } from './pages/Zones';
import { Devices } from './pages/Devices';
import { Attendance } from './pages/Attendance';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

const colorSchemes = {
  blue: {
    primary: '217 91% 60%',
    'primary-foreground': '0 0% 100%',
  },
  green: {
    primary: '142 76% 36%',
    'primary-foreground': '0 0% 100%',
  },
  orange: {
    primary: '24 95% 53%',
    'primary-foreground': '0 0% 100%',
  },
  red: {
    primary: '0 84% 60%',
    'primary-foreground': '0 0% 100%',
  },
  slate: {
    primary: '215 20% 40%',
    'primary-foreground': '0 0% 100%',
  },
};

function App() {
  const { initialize, themeMode, primaryColor } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      themeMode === 'dark' ||
      (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);
  }, [themeMode]);

  useEffect(() => {
    const root = document.documentElement;
    const scheme = colorSchemes[primaryColor];
    Object.entries(scheme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [primaryColor]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/zones" element={<Zones />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
