'use client';

import { useState } from 'react';
import { useToast } from '@/components/common/ToastProvider';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';

export function useSuperAdminUsers(authFetch: (url: string, init?: RequestInit) => Promise<Response>) {
  const { success, error, showConfirm } = useToast();
  const [managedUsers, setManagedUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'super_admin' | 'business_admin'>('business_admin');
  const [newUserDisplayName, setNewUserDisplayName] = useState('');
  const [newUserBusinessSlugs, setNewUserBusinessSlugs] = useState('dvir');
  const [isAddingUser, setIsAddingUser] = useState(false);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      if (typeof window !== 'undefined' && isFirebaseConfigured && db) {
        try {
          const snapshot = await getDocs(collection(db, 'users'));
          if (!snapshot.empty) {
            const list = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
            setManagedUsers(list);
            return;
          }
        } catch (clientErr) {
          console.warn('Direct client firestore fetch users fallback:', clientErr);
        }
      }

      const res = await authFetch('/api/auth/users');
      if (res.ok) {
        const data = await res.json();
        setManagedUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUserEmail.trim() || !newUserEmail.includes('@')) {
      error('אימייל לא תקין', 'אנא הזן כתובת אימייל חוקית');
      return;
    }
    setIsAddingUser(true);
    const parsedSlugs = newUserBusinessSlugs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const finalSlugs =
      parsedSlugs.length > 0
        ? parsedSlugs
        : newUserRole === 'business_admin'
        ? ['dvir']
        : [];

    try {
      if (typeof window !== 'undefined' && isFirebaseConfigured && db) {
        try {
          const preRegId = `pre_${newUserEmail.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')}`;
          await setDoc(doc(db, 'users', preRegId), {
            email: newUserEmail.toLowerCase().trim(),
            role: newUserRole,
            displayName: newUserDisplayName.trim() || newUserEmail.split('@')[0],
            businessSlugs: finalSlugs,
            createdAt: new Date().toISOString(),
            preRegistered: true,
          });
        } catch (clientDbErr) {
          console.warn('Direct client firestore user write:', clientDbErr);
        }
      }

      await authFetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail.trim(),
          role: newUserRole,
          displayName: newUserDisplayName.trim() || newUserEmail.split('@')[0],
          businessSlugs: finalSlugs,
        }),
      });

      success(
        'משתמש נוסף בהצלחה! ✓',
        `${newUserEmail} נרשם כ-${
          newUserRole === 'super_admin' ? 'מנהל-על' : 'מנהל עסק'
        } עבור ${finalSlugs.join(', ') || 'המספרה של דביר'}`
      );
      setNewUserEmail('');
      setNewUserDisplayName('');
      setNewUserBusinessSlugs('dvir');
      fetchUsers();
    } catch {
      error('שגיאת תקשורת');
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleDeleteUser = (uid: string, email: string) => {
    showConfirm({
      title: 'מחיקת משתמש',
      message: `האם למחוק את המשתמש ${email}? לא יוכל להתחבר יותר למערכת.`,
      confirmText: 'מחק משתמש',
      type: 'danger',
      onConfirm: async () => {
        try {
          const res = await authFetch(`/api/auth/users?uid=${uid}`, { method: 'DELETE' });
          if (res.ok) {
            success('משתמש נמחק בהצלחה');
            fetchUsers();
          } else {
            const data = await res.json();
            error('שגיאה במחיקה', data.error);
          }
        } catch {
          error('שגיאת תקשורת');
        }
      },
    });
  };

  return {
    managedUsers,
    usersLoading,
    newUserEmail,
    setNewUserEmail,
    newUserRole,
    setNewUserRole,
    newUserDisplayName,
    setNewUserDisplayName,
    newUserBusinessSlugs,
    setNewUserBusinessSlugs,
    isAddingUser,
    fetchUsers,
    handleAddUser,
    handleDeleteUser,
  };
}
