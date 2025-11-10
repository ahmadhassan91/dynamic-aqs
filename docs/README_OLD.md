# Dynamic AQS CRM

A comprehensive Customer Relationship Management system built for Dynamic AQS to manage customer relationships, lead generation, training programs, and dealer operations.

## Features

- **Customer Management**: 360-degree customer view with activity tracking
- **Lead Management**: Automated lead processing and onboarding workflows
- **Training Management**: Comprehensive training program tracking
- **Mobile Application**: Field operations support with offline capabilities
- **Dealer Portal**: Self-service portal for dealer ordering and account management
- **Reporting & Analytics**: Real-time dashboards and customizable reports
- **Integration Ready**: Built for seamless integration with Acumatica ERP, HubSpot, and other systems

## Technology Stack

- **Frontend**: Next.js 16 with TypeScript
- **UI Framework**: Mantine UI with custom theme
- **Icons**: Tabler Icons
- **Mock Data**: Faker.js for realistic testing scenarios
- **Testing**: Jest with React Testing Library
- **Styling**: Tailwind CSS + Mantine components

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dynamic-aqs-crm
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable UI components
│   ├── auth/              # Authentication forms
│   ├── layout/            # Layout components (AppLayout, Navigation)
│   └── ui/                # Basic UI components (Logo, etc.)
├── lib/                   # Utility libraries
│   └── mockData/          # Mock data generators and providers
├── theme/                 # Mantine theme configuration
└── __tests__/             # Test files
```

## Authentication Pages

The system includes complete authentication UI:

- **Login**: `/auth/login`
- **Registration**: `/auth/register` 
- **Forgot Password**: `/auth/forgot-password`

## Mock Data

The application includes comprehensive mock data generators for:

- 500+ mock customers with varied profiles and territories
- 200+ mock leads in different pipeline stages
- 300+ training sessions with completion tracking
- 400+ orders with full lifecycle data
- User management with role-based access

## Design System

Built with Mantine UI featuring:

- Custom Dynamic AQS brand colors
- Consistent spacing and typography
- Responsive design components
- Accessible UI patterns
- Dark/light mode support

## Testing

Run tests with:
```bash
npm test
```

Tests include:
- Component rendering tests
- Form validation tests
- Mock data generation tests

## Development Guidelines

1. **Components**: Use Mantine components as the foundation
2. **Styling**: Combine Mantine's built-in styling with Tailwind for custom needs
3. **State Management**: Use React hooks and context for state management
4. **Testing**: Write tests for critical business logic and user interactions
5. **Mock Data**: Use the provided mock data generators for consistent testing

## Next Steps

This foundation provides:
- ✅ Project setup with Next.js, TypeScript, and Mantine
- ✅ Design system with consistent theming
- ✅ Responsive layout and navigation structure
- ✅ Authentication UI components
- ✅ Mock data generators for realistic testing
- ✅ Testing setup with Jest

Ready for implementation of specific CRM features as defined in the project specifications.