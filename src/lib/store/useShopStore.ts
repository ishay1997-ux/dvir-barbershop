'use client';

import { useState, useEffect } from 'react';
import { getBusinessBySlug } from '../business-service';
import type {
  Branch,
  Service,
  Barber,
  Customer,
  ShopSettings,
  ProductAddon,
  WaitlistEntry,
  HaircutFormula,
} from '../types';
import {
  INITIAL_BRANCHES,
  INITIAL_SERVICES,
  INITIAL_BARBERS,
  INITIAL_CUSTOMERS,
  INITIAL_SETTINGS,
  INITIAL_PRODUCT_ADDONS,
  INITIAL_WAITLIST,
} from './initial-data';

export function useShopStore() {
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [barbers, setBarbers] = useState<Barber[]>(INITIAL_BARBERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [settings, setSettings] = useState<ShopSettings>(INITIAL_SETTINGS);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(INITIAL_WAITLIST);
  const [productAddons, setProductAddons] = useState<ProductAddon[]>(INITIAL_PRODUCT_ADDONS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const CURRENT_STORE_VERSION = 'v4_high_value_suite';
      const storedVersion = localStorage.getItem('thecut_version');
      if (storedVersion !== CURRENT_STORE_VERSION) {
        localStorage.setItem('thecut_version', CURRENT_STORE_VERSION);
      }

      const storedBranches = localStorage.getItem('thecut_branches');
      const storedServices = localStorage.getItem('thecut_services');
      const storedBarbers = localStorage.getItem('thecut_barbers');
      const storedCustomers = localStorage.getItem('thecut_customers');
      const storedSettings = localStorage.getItem('thecut_settings');
      const storedWaitlist = localStorage.getItem('thecut_waitlist');
      const storedAddons = localStorage.getItem('thecut_product_addons');

      if (storedBranches) setBranches(JSON.parse(storedBranches));
      if (storedServices) setServices(JSON.parse(storedServices));
      if (storedBarbers) setBarbers(JSON.parse(storedBarbers));
      if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
      if (storedWaitlist) setWaitlist(JSON.parse(storedWaitlist));
      if (storedAddons) setProductAddons(JSON.parse(storedAddons));
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setSettings({
          ...INITIAL_SETTINGS,
          ...parsed,
          dailyOverrides: parsed.dailyOverrides || {},
        });
      }
      setIsLoaded(true);
    }
  }, []);

  // Save actions
  const saveBranches = (newBranches: Branch[]) => {
    setBranches(newBranches);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thecut_branches', JSON.stringify(newBranches));
      window.dispatchEvent(new Event('thecut_store_updated'));
    }
  };

  const saveServices = (newServices: Service[]) => {
    setServices(newServices);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thecut_services', JSON.stringify(newServices));
      window.dispatchEvent(new Event('thecut_store_updated'));
    }
  };

  const saveBarbers = (newBarbers: Barber[]) => {
    setBarbers(newBarbers);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thecut_barbers', JSON.stringify(newBarbers));
      window.dispatchEvent(new Event('thecut_store_updated'));
    }
  };

  const saveCustomers = (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thecut_customers', JSON.stringify(newCustomers));
      window.dispatchEvent(new Event('thecut_store_updated'));
    }
  };

  const saveSettings = (newSettings: ShopSettings) => {
    setSettings(newSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thecut_settings', JSON.stringify(newSettings));
      window.dispatchEvent(new Event('thecut_store_updated'));
    }
  };

  const saveWaitlist = (newWaitlist: WaitlistEntry[]) => {
    setWaitlist(newWaitlist);
    if (typeof window !== 'undefined') {
      localStorage.setItem('thecut_waitlist', JSON.stringify(newWaitlist));
      window.dispatchEvent(new Event('thecut_store_updated'));
    }
  };

  const addToWaitlist = (entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'status'>) => {
    const newEntry: WaitlistEntry = {
      ...entry,
      id: `w-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'waiting',
    };
    const updated = [newEntry, ...waitlist];
    saveWaitlist(updated);
    return newEntry;
  };

  const removeFromWaitlist = (id: string) => {
    const updated = waitlist.filter((w) => w.id !== id);
    saveWaitlist(updated);
  };

  const updateWaitlistStatus = (id: string, status: WaitlistEntry['status']) => {
    const updated = waitlist.map((w) => (w.id === id ? { ...w, status } : w));
    saveWaitlist(updated);
  };

  const updateCustomerFormula = (phone: string, formula: HaircutFormula) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const updated = customers.map((c) => {
      const cClean = c.phone.replace(/\D/g, '');
      if (cClean.endsWith(cleanPhone) || cleanPhone.endsWith(cClean)) {
        return {
          ...c,
          haircutFormula: {
            ...c.haircutFormula,
            ...formula,
            updatedAt: new Date().toISOString(),
          },
        };
      }
      return c;
    });
    saveCustomers(updated);
  };

  const loadBusinessPreset = async (slug: string) => {
    if (!slug) return;
    try {
      const biz = await getBusinessBySlug(slug);
      if (!biz) return;

      const newSettings: ShopSettings = {
        ...INITIAL_SETTINGS,
        shopName: biz.name,
        ownerName: biz.ownerName || 'מנהל ראשי',
        mainPhone: biz.phone || '052-1234567',
        phone: biz.phone || '052-1234567',
        themeColor: biz.themeColor || '#C9A84C',
        slogan: biz.slogan || '',
        announcement: biz.announcement || '',
        testimonials: (biz.testimonials as any) || INITIAL_SETTINGS.testimonials,
        faqs: (biz.faqs as any) || INITIAL_SETTINGS.faqs,
        layout: (biz.layout as any) || INITIAL_SETTINGS.layout,
      };

      const newServices: Service[] = (biz.services || []).map((s: any, idx: number) => ({
        id: s.id || `srv-${idx + 1}`,
        name: s.name,
        description: s.description || '',
        duration: s.duration || 30,
        price: s.price || 100,
        category: s.category || 'general',
        icon: s.icon || '✨',
        isActive: true,
      }));

      const newBranches: Branch[] = (biz.branches || []).map((b: any, idx: number) => ({
        id: b.id || `br-${idx + 1}`,
        name: b.name,
        city: b.city || biz.city || '',
        address: b.address || '',
        shortDescription: b.shortDescription || '',
        wazeUrl: b.wazeUrl || 'https://waze.com',
        activeDays: b.activeDays || [0, 1, 2, 3, 4],
        phone: b.phone || biz.phone || '052-1234567',
        isActive: true,
      }));

      setSettings(newSettings);
      setServices(newServices);
      setBranches(newBranches);

      if (typeof window !== 'undefined') {
        localStorage.setItem('thecut_active_slug', slug);
        localStorage.setItem('thecut_settings', JSON.stringify(newSettings));
        localStorage.setItem('thecut_services', JSON.stringify(newServices));
        localStorage.setItem('thecut_branches', JSON.stringify(newBranches));
        window.dispatchEvent(new Event('thecut_store_updated'));
      }
    } catch (err) {
      console.error('Failed to load business preset into store:', err);
    }
  };

  return {
    branches,
    services,
    barbers,
    customers,
    settings,
    waitlist,
    productAddons,
    isLoaded,
    saveBranches,
    saveServices,
    saveBarbers,
    saveCustomers,
    saveSettings,
    saveWaitlist,
    addToWaitlist,
    removeFromWaitlist,
    updateWaitlistStatus,
    updateCustomerFormula,
    loadBusinessPreset,
  };
}
