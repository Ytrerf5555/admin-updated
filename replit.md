# Hotel Order Management System

## Overview

This is a full-stack hotel order management system built with React (frontend), Express.js (backend), and Firebase (real-time database). The application provides a comprehensive dashboard for hotel staff to manage orders, billing, and service requests in real-time.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Updates**: Firebase Firestore listeners for live data synchronization

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: Dual setup - Drizzle ORM configured for PostgreSQL with current Firebase Firestore implementation
- **API Design**: RESTful API structure with `/api` prefix
- **Session Management**: In-memory storage with extensible interface for database integration
- **Development**: Hot reload with Vite integration

### Database Strategy
- **Current**: Firebase Firestore for real-time capabilities
- **Future Migration Path**: PostgreSQL with Drizzle ORM (configuration already in place)
- **Schema Management**: Shared TypeScript schemas with Zod validation

## Key Components

### Data Models
- **Orders**: Complete order lifecycle management (waiting → preparing → ready → delivered → paid)
- **Service Requests**: Customer service requests (water, cleaning, assistance, etc.)
- **Statistics**: Real-time dashboard metrics and analytics

### Core Features
1. **Live Orders Panel**: Real-time order tracking with status updates
2. **Billing Manager**: Payment processing and invoice management
3. **Service Requests**: Customer assistance and maintenance requests
4. **Quick Stats Dashboard**: Key performance indicators and metrics
5. **Responsive Design**: Mobile-first approach with desktop optimization

### UI Components
- Comprehensive design system using shadcn/ui
- Custom components for order management workflows
- Real-time notifications and toast messages
- Interactive data tables and status indicators

## Data Flow

### Real-time Synchronization
1. Firebase Firestore provides real-time listeners for orders and service requests
2. Frontend automatically updates when data changes in the database
3. Optimistic updates for immediate user feedback
4. Error handling with user-friendly notifications

### Order Management Flow
1. Orders arrive in "waiting" status
2. Kitchen staff can update to "preparing" → "ready"
3. Service staff marks as "delivered"
4. Billing staff processes payment and marks as "paid"
5. Real-time dashboard updates reflect all changes instantly

### Service Request Flow
1. Customer service requests are received in real-time
2. Staff can view request details and priority
3. Requests can be dismissed when completed
4. Dashboard shows pending request count

## External Dependencies

### Core Libraries
- **UI Framework**: React 18 with TypeScript
- **Database**: Firebase Firestore (current), Drizzle ORM + PostgreSQL (configured)
- **UI Components**: Radix UI primitives with shadcn/ui
- **Styling**: Tailwind CSS with custom theme
- **Validation**: Zod schemas for type-safe data validation
- **State Management**: TanStack React Query
- **Date Handling**: date-fns for date utilities

### Development Tools
- **Build System**: Vite with React plugin
- **Type Checking**: TypeScript with strict configuration
- **Development Server**: Express with Vite middleware integration
- **Error Overlay**: Replit-specific development tools

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds optimized React application to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database Migrations**: Drizzle Kit for PostgreSQL schema management

### Environment Configuration
- **Development**: Uses Firebase with environment variables
- **Production**: Node.js server with PostgreSQL database
- **Database URL**: Required environment variable for PostgreSQL connection

### Scalability Considerations
- Modular architecture supports easy feature additions
- Database abstraction layer allows switching between Firebase and PostgreSQL
- Component-based UI system enables rapid development
- Real-time capabilities scale with Firebase infrastructure

### Migration Path
The application is designed to migrate from Firebase to PostgreSQL:
1. Database schemas are already defined with Drizzle
2. Storage interface abstracts database operations
3. Environment variables control database selection
4. Gradual migration possible without breaking changes