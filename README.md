# Nurse Home Admin Dashboard

A React + Vite admin dashboard for managing nurses, patients, service requests, payments, and complaints for the Nurse Home platform.

## Tech Stack

- **React 18.3.1** - UI framework
- **Vite 6.3.5** - Build tool and dev server
- **React Router 7.13.0** - Client-side routing
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Recharts** - Charts and data visualization

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── App.jsx                    # Main app component
│   │   ├── routes.js                  # Router configuration
│   │   ├── components/                # Shared components
│   │   │   ├── Layout.jsx            # Main layout with sidebar
│   │   │   ├── NotificationDropdown.jsx
│   │   │   └── ProfileDropdown.jsx
│   │   └── pages/                     # All page components
│   │       ├── Dashboard.jsx
│   │       ├── NurseVerification.jsx
│   │       ├── UsersManagement.jsx
│   │       ├── ServiceRequests.jsx
│   │       ├── PaymentTransactions.jsx
│   │       ├── ComplaintsSupport.jsx
│   │       ├── NotificationsAnnouncements.jsx
│   │       ├── Reports.jsx
│   │       ├── AdminManagement.jsx
│   │       └── Settings.jsx
│   └── styles/
│       ├── index.css                  # Global styles
│       ├── fonts.css                  # Font imports
│       └── theme.css                  # Tailwind theme tokens
├── vite.config.js                     # Vite configuration
└── package.json                       # Dependencies
```

## Features

### 1. Dashboard
- Real-time statistics (patients, nurses, pending verifications, requests)
- Service request status distribution (pie chart)
- Weekly activity trends (line chart)
- Recent activity log

### 2. Nurse Verification
- Review nurse registration applications
- View uploaded documents
- Approve or reject with reasons
- Filter by status (Pending/Approved/Rejected)

### 3. Users Management
- Manage patients and nurses accounts
- Separate tabs for patients and nurses
- Suspend/activate user accounts
- Password reset functionality

### 4. Service Requests
- View all service requests
- Assign nurses to requests
- Track request status (Pending/Assigned/In Progress/Completed/Cancelled)
- Cancel or reassign requests

### 5. Payment & Transactions
- Financial overview (revenue, commissions, payouts)
- Transaction history with search and filters
- Status tracking (Paid/Pending/Refunded/Failed)
- Recent financial activity log

### 6. Complaints & Support
- Handle user complaints
- Categorize complaints (Service Quality/Billing/Technical/Other)
- Respond to complaints
- Mark as resolved

### 7. Notifications & Announcements
- Send notifications to all users, nurses only, or patients only
- Quick templates for common notifications
- View recently sent notifications
- Target audience statistics

### 8. Reports & Analytics
- Monthly usage reports with charts
- Revenue trends
- Nurse performance summary
- Export reports as PDF or CSV

### 9. Admin Management
- Create new admin accounts
- View admin activity log
- Manage administrator permissions

### 10. Settings
- Platform settings (auto-assignment, verification requirements)
- Security settings (2FA, session timeout, password policies)
- Notification preferences
- Audit logs

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd nurse-home-admin-dashboard
   ```

2. Install dependencies
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Start the development server
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. Open your browser to the URL shown in the terminal (typically http://localhost:5173)

### Building for Production

```bash
pnpm run build
# or
npm run build
```

The built files will be in the `dist` directory.

## Mock Data

All pages currently use mock data for demonstration purposes. The data structures are designed to match the expected format from an ASP.NET Core Web API backend.

### Example Data Structure (Transaction)
```javascript
{
  transactionId: "TXN001234",
  bookingId: "BK2025001",
  patientName: "John Smith",
  nurseName: "Nurse Emily Chen",
  serviceName: "Home Care",
  totalAmount: 120,
  platformCommission: 18,
  nurseAmount: 102,
  paymentStatus: "Paid",
  paymentMethod: "Credit Card",
  transactionDate: "2026-04-02 10:30 AM"
}
```

## Backend Integration

This dashboard is designed to work with an ASP.NET Core Web API backend. To integrate:

1. Replace mock data with API calls
2. Add authentication/authorization
3. Set up API base URL in environment variables
4. Handle loading states and error responses
5. Implement real-time updates (SignalR/WebSockets)

### Recommended API Structure
```
/api/nurses
/api/patients  
/api/service-requests
/api/transactions
/api/complaints
/api/notifications
/api/reports
/api/admins
/api/settings
```

## Color Scheme

- Primary: `#1F7A8C` (Teal blue)
- Primary Dark: `#18626F`
- Background: Gray-50
- Text: Gray-800

## Known Limitations

- All data is currently mocked
- No authentication implemented
- No real-time updates
- Export functions are placeholders
- File uploads are simulated

## Future Enhancements

- Real API integration
- Authentication (JWT/OAuth)
- Real-time notifications (SignalR)
- Advanced filtering and sorting
- Data export functionality
- Multi-language support
- Dark mode
- Mobile responsive improvements

## Team Notes

- **No TypeScript** - This project uses plain JavaScript (JSX) for easier team collaboration
- **Tailwind v4** - Uses the latest Tailwind CSS version with updated syntax
- **Mock First** - All features have working mock data for immediate testing
- **Component-Based** - Each page is a separate component for easy maintenance
- **Ready for Backend** - Data structures match expected API responses

## License

Internal use only - Nurse Home platform.
