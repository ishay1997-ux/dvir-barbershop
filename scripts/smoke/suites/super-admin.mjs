export const superAdminSuite = {
  id: 'super',
  title: 'Super-Admin Platform Hub & Internal APIs (סופר-אדמין וניהול פלטפורמה)',
  description: 'Verifies the super-admin master panel, multi-tenant businesses endpoint, leads, and bug reporting channels.',
  targets: [
    {
      name: 'Super Admin Master Hub',
      path: '/super-admin',
      expectedStatus: 200,
      expectedContentType: 'text/html',
      maxLatencyMs: 3500,
    },
    {
      name: 'Appointments Core API Health',
      path: '/api/appointments',
      expectedStatus: 200,
      expectedContentType: 'application/json',
      maxLatencyMs: 2500,
    },
    {
      name: 'Leads Ingestion Validation Guard',
      path: '/api/leads',
      method: 'POST',
      body: { businessName: '', ownerName: '', phone: '' },
      expectedStatus: 400,
      expectedContentType: 'application/json',
      maxLatencyMs: 2000,
    },
    {
      name: 'Bug Reports Validation Guard',
      path: '/api/bug-reports',
      method: 'POST',
      body: { fullName: '', phone: '', message: '' },
      expectedStatus: 400,
      expectedContentType: 'application/json',
      maxLatencyMs: 2000,
    },
  ],
};
