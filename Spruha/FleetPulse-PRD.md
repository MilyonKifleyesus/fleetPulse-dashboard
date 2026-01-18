# FleetPulse Dashboard - Product Requirements Document

## 1. Product Overview

FleetPulse is a comprehensive fleet management dashboard application built with Angular 19. It provides real-time monitoring, management, and analytics for fleet operations including vehicle tracking, maintenance scheduling, route optimization, and cost management.

## 2. Core Purpose

The application enables fleet managers to:

- Monitor vehicle health and status in real-time
- Track maintenance schedules and work orders
- Analyze fleet performance metrics
- Manage operational costs
- Customize dashboard layouts for personalized workflows

## 3. Key Features

### 3.1 Customizable Workspace Dashboard

- **Drag-and-Drop Widget System**: Users can rearrange widgets by dragging them
- **Resizable Widgets**: Adjust widget sizes by dragging corners/edges
- **Edit/View Mode Toggle**: Switch between customization mode (Ctrl/Cmd + E) and view mode
- **Persistent Layout**: Widget positions and sizes saved to localStorage
- **Widget Types**: Support for various widget types (charts, tables, metrics cards)

### 3.2 Vehicle Management

- **Vehicle Status Tracking**: Monitor vehicles in four states:
  - Active: Vehicles in operation
  - Maintenance: Vehicles undergoing maintenance
  - Standby: Vehicles available but not in use
  - Critical: Vehicles requiring immediate attention
- **Health Score System**: Each vehicle has a health score (0-100) indicating overall condition
- **Work Order Management**: Track maintenance work orders per vehicle
- **Location Tracking**: Monitor vehicle locations
- **Cost Tracking**: Track operational costs per vehicle

### 3.3 Analytics & Reporting

- **Dashboard Statistics**:
  - Total fleet units with trend indicators
  - Maintenance efficiency metrics
  - Operational cost tracking
  - Efficiency index (average health score)
  - Status distribution charts
  - Utilization percentage
- **Historical Data**: Track performance over time periods
- **Performance Metrics**: Calculate and display key performance indicators
- **Company Statistics**: Multi-company fleet management support

### 3.4 User Interface

- **Theme Support**: Dark/light theme toggle
- **Color Scheme**:
  - Primary: #5ad85a (green)
  - Accent: #6ee755 (lighter green)
  - Status Colors:
    - Optimal: #6ee755
    - Warning: #eab308
    - Critical: #ef4444
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern Angular Components**: Built with Angular 19 using standalone components

## 4. Technical Architecture

### 4.1 Technology Stack

- **Framework**: Angular 19
- **Language**: TypeScript
- **Authentication**: Firebase Authentication
- **State Management**: Services with localStorage persistence
- **Layout System**: CSS Grid
- **Charts**: ApexCharts
- **UI Components**: Angular Bootstrap (ng-bootstrap)

### 4.2 Key Services

- **WorkspaceStateService**: Manages workspace state with localStorage
- **GridLayoutService**: Handles CSS Grid calculations and auto-arrangement
- **WorkspaceModeService**: Manages edit/view mode toggling
- **FleetService**: Manages vehicle data, statistics, and activities
- **AuthService**: Handles user authentication

### 4.3 Data Storage

- **Local Storage**: Widget layouts, workspace configurations, and user preferences. All dashboard layout customizations (widget positions, sizes, visibility states) are persisted in browser localStorage with automatic save on changes. This ensures layout memory persists across browser sessions.

- **Firebase**: User authentication data (user profiles, session tokens, authentication state). Currently, Firebase is used exclusively for authentication purposes.

- **Vehicle Data Storage**: Vehicle data, telemetry, and fleet metrics are currently served from mock data sources for prototyping purposes. The application uses in-memory data structures and local state management services. Future implementations will support:
  - **Option A (Production)**: Persistent storage in Firebase Firestore or Cloud Firestore with real-time sync, user-scoped collections (per userId), and offline persistence with conflict resolution.
  - **Option B (External API)**: RESTful API integration with server-side caching strategies (Redis/CDN), client-side caching (service worker/IndexedDB), and periodic background sync.
  - **Current (Prototype)**: In-memory mock data only, regenerated on application reload.

**Storage Strategy by Data Type:**
- **Widget Layouts & Dashboard Config**: Browser localStorage (immediate persistence, no server round-trip)
- **User Authentication**: Firebase Authentication (managed service, secure token handling)
- **Vehicle Telemetry (Future)**: TBD based on production requirements - will be documented in deployment checklist
- **User-Modified Config**: Stored alongside layouts in localStorage; future migrations to cloud storage will maintain backward compatibility

**Offline/Sync Behavior:**
- Dashboard layouts work fully offline (localStorage-based)
- Authentication requires network connectivity (Firebase)
- Vehicle data sync strategy will be defined in production architecture phase

**Security & Permissions:**
- localStorage data is scoped per browser/origin (no cross-site access)
- Firebase Authentication enforces user identity and session management
- Future vehicle data storage will implement user-based access controls and field-level security rules

**Scalability & Retention:**
- localStorage: Limited to ~5-10MB per origin; suitable for user preferences and layouts
- Firebase: Scalable cloud infrastructure with automatic scaling
- Production vehicle data storage will implement data retention policies (e.g., 90-day rolling window for telemetry, indefinite retention for critical events)

## 5. User Workflows

### 5.1 Login Flow

1. User navigates to login page
2. Enters credentials (email/password)
3. Authenticates via Firebase or local validation
4. Redirects to dashboard on successful login

### 5.2 Dashboard Customization Flow

1. User navigates to `/dashboard`
2. Clicks "Edit Mode" button or presses Ctrl/Cmd + E
3. Widgets become draggable and resizable
4. User arranges widgets to preferred layout
5. User resizes widgets as needed
6. Layout automatically saves to localStorage
7. User exits edit mode to view customized dashboard

### 5.3 Vehicle Monitoring Flow

1. User views dashboard with fleet metrics
2. Sees overview cards showing:
   - Total vehicles
   - Vehicles requiring maintenance
   - Operational costs
   - Efficiency index
3. Views detailed vehicle list with status indicators
4. Clicks on vehicle to see detailed information
5. Reviews health scores and maintenance schedules

### 5.4 Maintenance Management Flow

1. System identifies vehicles requiring maintenance
2. Displays maintenance alerts on dashboard
3. User reviews work order history
4. Tracks maintenance efficiency metrics

## 6. Widget System

### 6.1 Widget Frame Features

- Standard container for all widgets
- Header with title and action buttons
- Minimize/maximize functionality
- Delete button (in edit mode)
- Settings button (in edit mode)
- Resize handles (in edit mode)

### 6.2 Widget Types

- **Metric Cards**: Display key statistics (total vehicles, costs, etc.)
- **Charts**: Visualize data (status distribution, historical trends)
- **Tables**: Show detailed vehicle/activity lists
- **Status Indicators**: Visual health score displays

### 6.3 Widget Constraints

- Minimum size: 2 columns × 2 rows
- Maximum size: 12 columns × 8 rows
- Grid system: 12 columns by default
- Auto-arrangement: Widgets automatically move to new rows when needed

## 7. Data Models

### 7.1 Vehicle

- ID, Vehicle ID
- Status (Active/Maintenance/Standby/Critical)
- Health Score (0-100)
- Work Order Count
- Location
- Cost
- Company ID and Name
- Days Between Work Orders
- Timestamps

### 7.2 Dashboard Stats

- Total Fleet Units (with trend)
- Maintenance Efficiency (with trend)
- Operational Cost (with trend)
- Efficiency Index (with trend)
- Status Distribution
- Utilization Percentage

### 7.3 Activity

- Activity type
- Description
- Timestamp
- Related vehicle/company

## 8. Authentication

- **Primary Method**: Firebase Authentication provides production-grade user authentication with secure token management, session persistence, and identity verification. All authentication requests are validated through Firebase Auth service endpoints.

- **Fallback Mechanism**: A local validation fallback exists for development and testing purposes only. The fallback is triggered under the following conditions:
  - **Development Mode**: When running in local development environment (e.g., `ng serve` or when `environment.production === false`)
  - **Firebase Service Unavailable**: When Firebase Authentication service is unreachable or returns network errors (detected via timeout/error handlers)
  - **Feature Flag**: When explicitly enabled via environment configuration flag (e.g., `ENABLE_LOCAL_AUTH_FALLBACK=true`)

- **Local Validation Implementation**: The fallback uses an ephemeral, in-memory user store that is cleared on application reload. It performs basic credential validation against hardcoded test accounts or environment-configured credentials. This fallback:
  - **MUST be disabled in production** via environment configuration
  - Generates mock authentication tokens with limited scope (development/testing only)
  - Does not persist user sessions across browser restarts in fallback mode
  - Logs all authentication attempts when fallback is used (for audit purposes)
  - Implements rate limiting to prevent brute-force attempts (max 5 attempts per minute per IP)
  - Has a maximum session duration of 24 hours (auto-expiration)

- **Security Safeguards for Fallback**:
  - Rate limiting: Maximum 5 login attempts per minute per IP address
  - Audit logging: All fallback authentication attempts are logged with timestamp, IP address, and outcome
  - Token expiration: Fallback tokens expire after 24 hours (shorter than production Firebase tokens)
  - Limited scope: Fallback tokens have reduced permissions (read-only access in some areas)
  - Secure storage: Even fallback tokens are stored securely (HttpOnly cookies or secure localStorage)
  - Alerting: Development teams are alerted when fallback authentication is triggered in non-local environments
  - **Production Enforcement**: The fallback mechanism MUST be explicitly disabled in production builds via environment checks and deployment verification scripts

- **Default Test Account (Development/Demo Only)**:
  > **⚠️ WARNING: This test account is for development and demonstration purposes only. It MUST be disabled or removed in production deployments.**
  - Email: spruko@admin.com
  - Password: sprukoadmin
  - **Usage Restrictions**: This account should only be available when running in development mode or when explicitly enabled via feature flags. Production deployments must enforce:
    - Removal of hardcoded test credentials from production builds
    - Environment-specific credential configuration (loaded from secure environment variables or configuration files)
    - Deployment checklist verification that demo accounts are disabled
    - Test account management system for development environments (separate from production auth)

- **Test Account Management**:
  - Test accounts should be managed through environment configuration files (not hardcoded)
  - Implement account rotation policies for test credentials
  - Use privileged-access controls (PAM) for test account usage tracking
  - Document test account lifecycle (creation, expiration, revocation) in security documentation
  - Ensure test accounts are excluded from production authentication flows via build-time checks

- **Session Management**: Handled by Firebase Auth in production; ephemeral sessions in fallback mode

- **Route Protection**: Dashboard requires authentication. Unauthenticated users are redirected to login page. Authentication state is checked on route navigation and page refresh.

## 9. Performance Requirements

- **Auto-refresh**: Data refreshes every 5 minutes
- **Smooth Animations**: Widget movement uses CSS transitions
- **Local Storage**: Fast access to saved layouts
- **Responsive**: Loads quickly on all device types

## 10. Future Enhancements (Potential)

- Real-time vehicle tracking via GPS
- Route optimization algorithms
- Predictive maintenance using AI
- Advanced reporting and exports
- Multi-user collaboration features
- Mobile app integration
- API integrations with fleet management systems

## 11. Testing Considerations

- Test dashboard customization workflows
- Verify widget drag-and-drop functionality
- Test responsive design on various screen sizes
- Validate authentication flows
- Test data persistence (localStorage)
- Verify chart rendering and data visualization
- Test edit/view mode transitions
- Validate form inputs and error handling
