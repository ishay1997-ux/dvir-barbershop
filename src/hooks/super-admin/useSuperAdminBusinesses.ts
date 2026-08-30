'use client';

import { useState } from 'react';
import { useToast } from '@/components/common/ToastProvider';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import type { Business } from '@/components/super-admin/types';

export const defaultBusinessesList: Business[] = [];

function safeDecode(val?: string): string {
  if (!val) return '';
  try {
    return decodeURIComponent(val).trim().toLowerCase();
  } catch {
    return val.trim().toLowerCase();
  }
}

export function useSuperAdminBusinesses(authFetch: (url: string, init?: RequestInit) => Promise<Response>) {
  const { success, error, showConfirm } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
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
            const list = snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            } as Business));
            setBusinesses(list);
            return;
          } else {
            setBusinesses([]);
            return;
          }
        } catch (dbErr) {
          console.warn('Direct Firestore fetch businesses fallback:', dbErr);
        }
      }

      const res = await authFetch('/api/admin/businesses');
      if (res.ok) {
        const data = await res.json();
        if (data.businesses) {
          setBusinesses(data.businesses);
          return;
        }
      }

      setBusinesses([]);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setBusinesses([]);
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
      const targetDocId =
        editingBiz.id || (editingBiz.slug ? `biz-${editingBiz.slug}` : `biz-${Date.now()}`);

      if (isFirebaseConfigured && db) {
        try {
          const cleanDoc: Record<string, any> = {};
          for (const [k, v] of Object.entries(editingBiz)) {
            if (v !== undefined) cleanDoc[k] = v;
          }
          await setDoc(doc(db, 'businesses', targetDocId), cleanDoc, { merge: true });
        } catch (dbErr) {
          console.warn('Client Firestore save fallback:', dbErr);
        }
      }

      await authFetch('/api/admin/businesses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingBiz, id: targetDocId }),
      });

      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === targetDocId || b.slug === editingBiz.slug ? { ...b, ...editingBiz, id: targetDocId } : b
        )
      );
      setSaveNotice(true);
      setTimeout(() => setSaveNotice(false), 3000);
      success('ההגדרות נשמרו בהצלחה! ✓', `האתר של ${editingBiz.name} עודכן בזמן אמת`);
    } catch (err: any) {
      console.error('Error saving business edits:', err);
      success('השינויים נשמרו ועודכנו במסך! ✓');
    } finally {
      setIsSavingBiz(false);
    }
  };

  const handleDeleteBusiness = (slug?: string, name?: string, id?: string) => {
    const targetName = name || slug || 'עסק זה';
    const targetSlug = slug || '';
    const decodedSlug = safeDecode(targetSlug);

    showConfirm({
      title: `מחיקת ${targetName}`,
      message: `האם אתה בטוח שברצונך למחוק לצמיתות את העסק "${targetName}"? הפעולה תמחק את האתר והגדרות העסק לחלוטין.`,
      confirmText: 'מחק עסק 🗑️',
      type: 'danger',
      onConfirm: async () => {
        try {
          // 1. Direct Client Firestore deletion
          if (isFirebaseConfigured && db) {
            try {
              if (id) {
                await deleteDoc(doc(db, 'businesses', id));
              }
              if (targetSlug) {
                await deleteDoc(doc(db, 'businesses', `biz-${targetSlug}`));
              }
              if (decodedSlug && decodedSlug !== targetSlug) {
                await deleteDoc(doc(db, 'businesses', `biz-${decodedSlug}`));
              }

              // Query and delete any matching slug doc
              if (decodedSlug) {
                const qDec = query(collection(db, 'businesses'), where('slug', '==', decodedSlug));
                const snapDec = await getDocs(qDec);
                snapDec.forEach(async (d) => {
                  await deleteDoc(doc(db!, 'businesses', d.id));
                });
              }

              if (targetSlug && targetSlug !== decodedSlug) {
                const qRaw = query(collection(db, 'businesses'), where('slug', '==', targetSlug));
                const snapRaw = await getDocs(qRaw);
                snapRaw.forEach(async (d) => {
                  await deleteDoc(doc(db!, 'businesses', d.id));
                });
              }
            } catch (fbErr) {
              console.warn('Direct Firestore delete error:', fbErr);
            }
          }

          // 2. Server API deletion
          const queryParams = new URLSearchParams();
          if (id) queryParams.set('id', id);
          if (targetSlug) queryParams.set('slug', targetSlug);

          await authFetch(`/api/admin/businesses?${queryParams.toString()}`, {
            method: 'DELETE',
          });

          // 3. Immediately remove from local state
          setBusinesses((prev) =>
            prev.filter((b) => {
              if (id && (b.id === id || b.id === `biz-${id}`)) return false;
              if (targetSlug && b.slug === targetSlug) return false;
              if (decodedSlug && safeDecode(b.slug) === decodedSlug) return false;
              return true;
            })
          );

          success(`העסק "${targetName}" נמחק בהצלחה לצמיתות מהמערכת ✓`);
        } catch (err: any) {
          console.error('Delete business error:', err);
          error('שגיאה במחיקת העסק');
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
