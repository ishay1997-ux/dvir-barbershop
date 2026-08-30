'use client';

import { useState } from 'react';
import { useToast } from '@/components/common/ToastProvider';
import type { BugReport } from '@/components/super-admin/types';

export function useSuperAdminReportsLeads(authFetch: (url: string, init?: RequestInit) => Promise<Response>) {
  const { success, error, showConfirm } = useToast();

  // Leads
  const [leads, setLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);

  const fetchLeads = async () => {
    setLeadsLoading(true);
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLeadsLoading(false);
    }
  };

  // Reports
  const [reports, setReports] = useState<BugReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');

  const fetchReports = async () => {
    setReportsLoading(true);
    try {
      const res = await authFetch('/api/bug-reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setReportsLoading(false);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: BugReport['status']) => {
    try {
      await authFetch('/api/bug-reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reportId, status: newStatus }),
      });
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
      const statusLabel =
        newStatus === 'new' ? 'חדש 🟢' : newStatus === 'in_progress' ? 'בטיפול 🟡' : 'טופל ונסגר ⚪';
      success('סטטוס הפנייה עודכן בהצלחה', `הסטטוס שונה ל-${statusLabel}`);
    } catch {
      error('שגיאה בעדכון סטטוס הפנייה');
    }
  };

  const handleDeleteReport = (reportId: string) => {
    showConfirm({
      title: 'מחיקת דיווח תקלה',
      message: 'האם למחוק דיווח זה לצמיתות מרשימת הפניות?',
      confirmText: 'מחק דיווח 🗑️',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await authFetch(`/api/bug-reports?id=${encodeURIComponent(reportId)}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            setReports((prev) => prev.filter((r) => r.id !== reportId));
            success('הדיווח נמחק בהצלחה ✓');
          } else {
            error('שגיאה במחיקת הדיווח');
          }
        } catch {
          error('שגיאת תקשורת במחיקת הדיווח');
        }
      },
    });
  };

  return {
    leads,
    leadsLoading,
    fetchLeads,
    reports,
    reportsLoading,
    statusFilter,
    setStatusFilter,
    fetchReports,
    handleStatusChange,
    handleDeleteReport,
  };
}
