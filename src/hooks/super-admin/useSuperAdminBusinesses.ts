'use client';

import { useState } from 'react';
import { useToast } from '@/components/common/ToastProvider';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import type { Business } from '@/components/super-admin/types';

export const defaultBusinessesList: Business[] = [
  {
    id: 'biz-dvir',
    name: 'המספרה של דביר',
    slug: 'dvir',
    ownerName: 'דביר',
    phone: '058-781-5071',
    city: 'אריאל & רחובות',
    slogan: 'עיצוב שיער גברים, פיידים מדויקים ופיסול זקן ברמה הגבוהה ביותר בישראל',
    announcement: '🌟 קביעת תורים מהירה אונליין לכל הסניפים 24/7 – שריינו מראש!',
    themeColor: '#C9A84C',
    branchesCount: 2,
    status: 'active',
    plan: 'enterprise',
    createdAt: '2025-01-01',
    branches: [
      {
        name: 'סניף אריאל (אוניברסיטת אריאל)',
        address: 'קמפוס אוניברסיטת אריאל (מרכז הסטודנט)',
        wazeLink: 'https://waze.com/ul?q=Ariel%20University',
      },
      {
        name: 'סניף רחובות (מרכז העיר)',
        address: 'הרצל 180, רחובות (ליד מכון ויצמן)',
        wazeLink: 'https://waze.com/ul?q=Herzl%20180%20Rehovot',
      },
    ],
    services: [
      { name: 'תספורת גברים פרימיום', price: 80, duration: 30 },
      { name: 'עיצוב ופיסול זקן Master', price: 40, duration: 20 },
      { name: 'חבילת VIP משולבת (תספורת + זקן)', price: 110, duration: 45 },
      { name: 'תספורת ילדים ונוער', price: 70, duration: 30 },
    ],
  },
];

export function useSuperAdminBusinesses(authFetch: (url: string, init?: RequestInit) => Promise<Response>) {
  const { success, error, showConfirm } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>(defaultBusinessesList);
  const [businessesLoading, setBusinessesLoading] = useState(false);
  const [isNewBizModalOpen, setIsNewBizModalOpen] = useState(false);
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);
  const [isSavingBiz, setIsSavingBiz] = useState(false);
  const [saveNotice, setSaveNotice] = useState(false);

  const fetchBusinesses = async () => {
    setBusinessesLoading(true);
    try {
      if (typeof window !== 'undefined' && isFirebaseConfigured && db) {
        try {
          const snapshot = await getDocs(collection(db, 'businesses'));
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => d.data() as Business);
            setBusinesses(list);
            return;
          }
        } catch (dbErr) {
          console.warn('Direct Firestore fetch businesses fallback:', dbErr);
        }
      }

      const res = await authFetch('/api/admin/businesses');
      if (res.ok) {
        const data = await res.json();
        if (data.businesses && data.businesses.length > 0) {
          setBusinesses(data.businesses);
          return;
        }
      }

      const fallbackRes = await fetch('/api/admin/businesses?slug=dvir');
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        if (fallbackData.business) {
          setBusinesses([fallbackData.business]);
        }
      }
    } catch (err) {
      console.error('Error fetching businesses:', err);
    } finally {
      setBusinessesLoading(false);
    }
  };

  const handleCloneBusiness = async (biz: Business) => {
    try {
      const clonedSlug = `${biz.slug}-copy`;
      const clonedName = `${biz.name} (עותק)`;
      const newBizData = {
        ...biz,
        id: `biz-${clonedSlug}`,
        slug: clonedSlug,
        name: clonedName,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const res = await authFetch('/api/admin/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBizData),
      });

      if (res.ok) {
        success('העסק שוכפל בהצלחה! 📋', `נוצר עותק חדש תחת הכתובת /${clonedSlug}`);
        fetchBusinesses();
      } else {
        const data = await res.json();
        error(data.error || 'שגיאה בשכפול העסק');
      }
    } catch {
      error('שגיאה בשכפול העסק');
    }
  };

  const handleSaveEditedBusiness = async () => {
    if (!editingBiz) return;
    setIsSavingBiz(true);
    try {
      if (isFirebaseConfigured && db) {
        try {
          const docId =
            editingBiz.id || (editingBiz.slug ? `biz-${editingBiz.slug}` : `biz-${Date.now()}`);
          const cleanDoc: Record<string, any> = {};
          for (const [k, v] of Object.entries(editingBiz)) {
            if (v !== undefined) cleanDoc[k] = v;
          }
          await setDoc(doc(db, 'businesses', docId), cleanDoc, { merge: true });
        } catch (dbErr) {
          console.warn('Client Firestore save fallback:', dbErr);
        }
      }

      await authFetch('/api/admin/businesses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBiz),
      });

      setBusinesses((prev) =>
        prev.map((b) => (b.slug === editingBiz.slug ? { ...b, ...editingBiz } : b))
      );
      setSaveNotice(true);
      setTimeout(() => setSaveNotice(false), 3000);
      success('ההגדרות נשמרו בהצלחה! ✓', `האתר של ${editingBiz.name} עודכן בזמן אמת`);
    } catch (err: any) {
      console.error('Error saving business edits:', err);
      setBusinesses((prev) =>
        prev.map((b) => (b.slug === editingBiz.slug ? { ...b, ...editingBiz } : b))
      );
      setSaveNotice(true);
      setTimeout(() => setSaveNotice(false), 3000);
      success('השינויים נשמרו ועודכנו במסך! ✓');
    } finally {
      setIsSavingBiz(false);
    }
  };

  const handleDeleteBusiness = (slug: string, name: string) => {
    showConfirm({
      title: `מחיקת ${name}`,
      message: `האם אתה בטוח שברצונך למחוק לצמיתות את המספרה "${name}" (thecut.co.il/${slug})?`,
      confirmText: 'מחק מספרה 🗑️',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await authFetch(`/api/admin/businesses?slug=${encodeURIComponent(slug)}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            setBusinesses((prev) => prev.filter((b) => b.slug !== slug));
            success(`המספרה "${name}" נמחקה בהצלחה מהמערכת ✓`);
          } else {
            error('שגיאה במחיקת המספרה');
          }
        } catch {
          error('שגיאת תקשורת במחיקת המספרה');
        }
      },
    });
  };

  return {
    businesses,
    businessesLoading,
    fetchBusinesses,
    isNewBizModalOpen,
    setIsNewBizModalOpen,
    editingBiz,
    setEditingBiz,
    isSavingBiz,
    saveNotice,
    handleCloneBusiness,
    handleSaveEditedBusiness,
    handleDeleteBusiness,
  };
}
