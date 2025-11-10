# Dynamic AQS CRM - Project Structure

## Directory Overview

```
dynamic-aqs-crm/
├── .github/              # GitHub configuration
│   └── workflows/        # CI/CD workflows
├── docs/                 # Documentation
├── mobile/               # React Native mobile app
├── public/               # Static assets
├── scripts/              # Deployment and utility scripts
├── src/                  # Main application source
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and services
│   ├── styles/           # Global styles
│   ├── theme/            # Mantine theme configuration
│   └── types/            # TypeScript type definitions
└── ...config files       # Configuration files
```

## Core Directories

### `/src/app` - Next.js Pages (App Router)
- `/(standalone)/` - Standalone pages (login, landing)
- `/admin/` - Admin dashboard and settings
- `/assets/` - Asset management
- `/commercial/` - Commercial CRM features
- `/communication/` - Communication hub
- `/customers/` - Customer management
- `/dashboard/` - Main dashboard
- `/dealer/` - Dealer portal
- `/email/` - Email management
- `/leads/` - Lead management
- `/mobile/` - Mobile-specific pages
- `/notifications/` - Notification center
- `/reports/` - Reporting and analytics
- `/settings/` - User settings
- `/training/` - Training management

### `/src/components` - React Components
Organized by feature/domain:
- `activities/` - Activity tracking components
- `admin/` - Admin-specific components
- `assets/` - Asset management UI
- `auth/` - Authentication components
- `commercial/` - Commercial CRM components
- `communication/` - Communication components
- `customers/` - Customer management UI
- `dashboard/` - Dashboard widgets
- `dealer/` - Dealer portal components
- `email/` - Email UI components
- `layout/` - Layout components (AppLayout, Navbar, etc.)
- `leads/` - Lead management UI
- `notifications/` - Notification components
- `providers/` - React context providers
- `reports/` - Reporting components
- `territories/` - Territory management
- `training/` - Training components
- `ui/` - Reusable UI components

### `/src/lib` - Utilities & Services
- `accessibility/` - Accessibility utilities
- `mockData/` - Mock data for development
- `performance/` - Performance optimization utilities
- `responsive/` - Responsive design utilities
- `services/` - API services and business logic
- `utils/` - General utility functions

### `/mobile` - React Native Mobile App
- `src/components/` - Mobile components
- `src/contexts/` - Mobile contexts
- `src/navigation/` - Navigation configuration
- `src/screens/` - Mobile screens
- `src/services/` - Mobile services

### `/docs` - Documentation
- Project documentation
- API documentation
- Deployment guides
- Development guides

### `/scripts` - Utility Scripts
- Deployment scripts
- Database migration scripts
- Build scripts

### `/public` - Static Assets
- Images
- Fonts
- Static files
- `_redirects` - Netlify redirects

## Configuration Files

### Build & Deploy
- `next.config.ts` - Next.js configuration
- `netlify.toml` - Netlify deployment config
- `package.json` - Project dependencies and scripts

### TypeScript
- `tsconfig.json` - TypeScript configuration
- `next-env.d.ts` - Next.js type declarations

### Testing
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Jest setup

### Code Quality
- `eslint.config.mjs` - ESLint configuration
- `.gitignore` - Git ignore rules

### Styling
- `postcss.config.mjs` - PostCSS configuration
- `src/app/globals.css` - Global styles

## Key Features by Directory

### Customer Management (`/customers`)
- Customer list and details
- Territory management
- Customer activities
- Onboarding workflows

### Commercial CRM (`/commercial`)
- Manufacturer reps management
- Opportunities pipeline
- Engineer ratings
- Organizations hierarchy
- Commercial reports

### Asset Management (`/assets`)
- Asset tracking
- Maintenance scheduling
- Asset analytics
- QR code generation

### Training Management (`/training`)
- Training programs
- Course management
- Progress tracking
- Certifications

### Communication (`/communication`)
- Email integration
- SMS messaging
- In-app notifications
- Communication history

### Reporting (`/reports`)
- Custom reports
- Analytics dashboards
- Data exports
- Performance metrics

## Development Workflow

1. **Local Development**: `npm run dev`
2. **Build**: `npm run build`
3. **Test**: `npm test`
4. **Deploy**: Push to GitHub → Netlify auto-deploys

## Environment Variables

See `.env.example` for required environment variables.

## Mobile App

The React Native mobile app is located in `/mobile` and shares types and some services with the main web app.

## Documentation

All project documentation is in `/docs`:
- Deployment guides
- API documentation
- Feature documentation
- Development guides
