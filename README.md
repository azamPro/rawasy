# WSI Admin Dashboard Prototype

A modern, responsive admin dashboard for worker safety intelligence with complete CRUD functionality and data persistence.

## Features

- **Dashboard**: Real-time KPIs, recent incidents, charts, and analytics
- **Workers**: Full CRUD management with filters and search
- **Incidents**: Log and track safety incidents with severity levels
- **Zones**: Manage site zones and geofences
- **Devices**: Monitor IoT devices across zones
- **Attendance**: Track worker check-ins and hours
- **Reports**: Data analytics with export functionality
- **Settings**: Theme customization and data management

## Tech Stack

- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Zustand for state management
- React Router for navigation
- Recharts for data visualization
- Zod for schema validation
- React Hook Form for form handling

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Data Persistence

All data is stored in localStorage under the key `wsi-admin`. The app seeds demo data on first load with:
- 24 workers across roles and shifts
- 10 zones (surface, underground, restricted)
- 18 IoT devices
- 40 incidents over the last 14 days
- 100+ attendance records

## Theming

- Light/Dark/System theme modes
- 5 primary color schemes (Blue, Green, Orange, Red, Slate)
- All colors use CSS variables for easy customization

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── store/           # Zustand state management
├── types/           # TypeScript types and Zod schemas
├── lib/             # Utilities and seed data
└── index.css        # Global styles and theme variables
```