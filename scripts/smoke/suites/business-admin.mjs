export const businessAdminSuite = {
  id: 'admin',
  title: 'Business Merchant Admin Portal (מערכת ניהול פנימית לעסק)',
  description: 'Verifies the merchant dashboard, calendar views, customer lists, and authentication entrypoints.',
  targets: [
    {
      name: 'Business Admin Login Page',
      path: '/admin/login',
      expectedStatus: 200,
      expectedContentType: 'text/html',
      maxLatencyMs: 3000,
    },
    {
      name: 'Business Dashboard Overview',
      path: '/admin',
      expectedStatus: 200,
      expectedContentType: 'text/html',
      maxLatencyMs: 3000,
    },
    {
      name: 'Interactive Appointments Calendar',
      path: '/admin/appointments',
      expectedStatus: 200,
      expectedContentType: 'text/html',
      maxLatencyMs: 3000,
    },
    {
      name: 'CRM Customers Management',
      path: '/admin/customers',
      expectedStatus: 200,
      expectedContentType: 'text/html',
      maxLatencyMs: 3000,
    },
    {
      name: 'Business Shop Settings',
      path: '/admin/settings',
      expectedStatus: 200,
      expectedContentType: 'text/html',
      maxLatencyMs: 3000,
    },
  ],
};
