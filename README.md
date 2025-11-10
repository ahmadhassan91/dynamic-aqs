# 🚀 Dynamic AQS CRM

A comprehensive Customer Relationship Management system built with Next.js 14, TypeScript, and Mantine UI.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)

## ✨ Features

### Customer Management
- 📊 Customer profiles and relationship tracking
- 🗺️ Territory management
- 📈 Customer activity tracking
- ✅ Onboarding workflows

### Commercial CRM
- 🏢 Manufacturer reps management
- 💼 Opportunities pipeline
- ⭐ Engineer ratings
- 🏛️ Organizations hierarchy
- 📊 Commercial reporting

### Asset Management
- 📦 Asset tracking and maintenance
- 🔧 Service scheduling
- 📱 QR code generation
- 📈 Asset analytics

### Training Management
- 📚 Training programs
- 🎓 Course management
- 📊 Progress tracking
- 🏆 Certifications

### Communication Hub
- 📧 Email integration
- 💬 SMS messaging
- 🔔 In-app notifications
- 📜 Communication history

### Reporting & Analytics
- 📊 Custom reports
- 📈 Analytics dashboards
- 📥 Data exports
- 🎯 Performance metrics

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [Mantine v7](https://mantine.dev/)
- **Icons**: [Tabler Icons](https://tabler-icons.io/)
- **Styling**: CSS Modules + Global CSS

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: NextAuth.js

### Mobile
- **Framework**: React Native
- **Navigation**: React Navigation
- **State Management**: React Context

### Development Tools
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Package Manager**: npm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/dynamic-aqs-crm.git
   cd dynamic-aqs-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_URL="http://localhost:3001"
   NEXTAUTH_SECRET="your-secret-here"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
dynamic-aqs-crm/
├── .github/          # GitHub workflows and configuration
├── docs/             # Documentation files
├── mobile/           # React Native mobile app
├── public/           # Static assets
├── scripts/          # Deployment and utility scripts
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utilities and services
│   ├── styles/       # Global styles
│   ├── theme/        # Mantine theme
│   └── types/        # TypeScript types
└── ...config files
```

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed structure documentation.

## 🌐 Deployment

### Deploy to Netlify

1. **Connect your GitHub repository to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

2. **Configure build settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18

3. **Set environment variables**
   - Go to Site settings → Environment variables
   - Add all variables from `.env.example`

4. **Deploy**
   - Push to `main` branch to trigger automatic deployment

See [docs/NETLIFY_DEPLOYMENT_GUIDE.md](docs/NETLIFY_DEPLOYMENT_GUIDE.md) for detailed instructions.

### Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
chmod +x scripts/deploy-to-netlify.sh
./scripts/deploy-to-netlify.sh
```

## 📚 Documentation

- [Project Structure](docs/PROJECT_STRUCTURE.md) - Detailed directory structure
- [Deployment Guide](docs/NETLIFY_DEPLOYMENT_GUIDE.md) - Netlify deployment instructions
- [Commercial Features](docs/COMMERCIAL_QUICK_REFERENCE.md) - Commercial CRM documentation
- [Development Phases](docs/) - Project development history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI powered by [Mantine](https://mantine.dev/)
- Icons from [Tabler Icons](https://tabler-icons.io/)

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

**Note**: This is a production CRM system. Please ensure all sensitive data is properly secured and never commit credentials to the repository.
