'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Key,
  Check,
} from 'lucide-react';
import { BUSINESS_ARCHETYPES, THEME_PALETTES, generateTailoredBusinessConfig } from '@/lib/archetypes';
import { useToast } from '@/components/common/ToastProvider';
import type { Business, ServiceItem, BranchItem } from './types';

interface CreateBusinessModalProps {
  adminTheme: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
  onCreateSuccess: (biz: Business) => void;
}

export const CreateBusinessModal: React.FC<CreateBusinessModalProps> = ({
  adminTheme,
  isOpen,
  onClose,
  onCreateSuccess,
}) => {
  const router = useRouter();
  const { success, error } = useToast();

  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [newBizName, setNewBizName] = useState('');
  const [newBizSlug, setNewBizSlug] = useState('');
  const [newBizOwner, setNewBizOwner] = useState('');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizCity, setNewBizCity] = useState('');
  const [newBizInstagram, setNewBizInstagram] = useState('');
  const [newBizPlan, setNewBizPlan] = useState<'pro' | 'starter' | 'enterprise'>('pro');
  const [newBizArchetype, setNewBizArchetype] = useState<string>('mens-barbershop');
  const [newBizThemeColor, setNewBizThemeColor] = useState<string>('#C9A84C');
  const [newBizSlogan, setNewBizSlogan] = useState('');
  const [newBizAnnouncement, setNewBizAnnouncement] = useState('');
  const [newBizServices, setNewBizServices] = useState<ServiceItem[]>([]);
  const [newBizBranches, setNewBizBranches] = useState<BranchItem[]>([]);
  const [isCreatingBiz, setIsCreatingBiz] = useState(false);
  const [createdBusinessResult, setCreatedBusinessResult] = useState<Business | null>(null);

  if (!isOpen) return null;

  const syncArchetypeDefaults = (archetypeId: string) => {
    const config = generateTailoredBusinessConfig({
      name: newBizName || 'המספרה',
      slug: newBizSlug || 'new-biz',
      ownerName: newBizOwner || 'הספר',
      city: newBizCity || 'ישראל',
      phone: newBizPhone || '050-0000000',
      archetypeId,
      themeColor: newBizThemeColor,
    });
    setNewBizThemeColor(config.themeColor || '#C9A84C');
    setNewBizSlogan(config.slogan || '');
    setNewBizAnnouncement(config.announcement || '');
    setNewBizServices(config.services || []);
    setNewBizBranches(config.branches || []);
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName || !newBizSlug || !newBizPhone) {
      error('נא למלא את כל שדות החובה המסומנים בכוכבית');
      return;
    }

    setIsCreatingBiz(true);
    try {
      const tailoredConfig = generateTailoredBusinessConfig({
        name: newBizName,
        slug: newBizSlug,
        ownerName: newBizOwner,
        city: newBizCity,
        phone: newBizPhone,
        archetypeId: newBizArchetype,
        themeColor: newBizThemeColor,
      });

      const newBizPayload: Business = {
        id: `biz-${newBizSlug}`,
        name: newBizName,
        slug: newBizSlug,
        ownerName: newBizOwner,
        phone: newBizPhone,
        city: newBizCity,
        slogan: newBizSlogan || tailoredConfig.slogan,
        announcement: newBizAnnouncement || tailoredConfig.announcement,
        themeColor: newBizThemeColor || tailoredConfig.themeColor,
        instagramUrl: newBizInstagram ? `https://instagram.com/${newBizInstagram.replace('@', '')}` : '',
        whatsappNumber: newBizPhone,
        status: 'active',
        plan: newBizPlan,
        createdAt: new Date().toISOString(),
        branches: newBizBranches.length > 0 ? newBizBranches : tailoredConfig.branches,
        services: newBizServices.length > 0 ? newBizServices : tailoredConfig.services,
        layout: tailoredConfig.layout,
      };

      const res = await fetch('/api/admin/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBizPayload),
      });

      if (res.ok) {
        success('האתר הוקם בהצלחה! 🚀', `כתובת האתר: thecut.co.il/${newBizSlug}`);
        setCreatedBusinessResult(newBizPayload);
        onCreateSuccess(newBizPayload);
      } else {
        const data = await res.json();
        error('שגיאה ביצירת עסק', data.error || 'נסה שוב');
      }
    } catch {
      error('שגיאת תקשורת', 'נא לנסות שוב');
    } finally {
      setIsCreatingBiz(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      dir="rtl"
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className={`relative max-w-xl w-full border-2 rounded-3xl p-6 shadow-2xl z-10 my-auto text-right transition-colors ${
          adminTheme === 'light'
            ? 'bg-white border-[#C9A84C] text-slate-900'
            : 'bg-[#1C1C1C] border-[#C9A84C]/50 text-white'
        }`}
      >
        {createdBusinessResult ? (
          /* SUCCESS SCREEN */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl font-black shadow-lg animate-bounce">
              ✓
            </div>

            <div>
              <h3
                className={`text-xl font-black ${
                  adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                }`}
              >
                האתר של {createdBusinessResult.name} מוכן באוויר! 🎉
              </h3>
              <p
                className={`text-xs mt-1 ${
                  adminTheme === 'light' ? 'text-slate-600' : 'text-[#9E9891]'
                }`}
              >
                כל הסקשנים, המחירון המותאם, גלריית העבודות וטפסי הזמנת התורים נוצרו באופן מלא.
              </p>
            </div>

            <div
              className={`p-4 rounded-2xl border text-right space-y-2 text-xs font-mono ${
                adminTheme === 'light'
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-[#141414] border-white/10 text-zinc-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>🌐 כתובת דף הבית:</span>
                <span className="font-bold text-[#C9A84C]" dir="ltr">
                  thecut.co.il/{createdBusinessResult.slug}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>📱 טלפון לזימונים:</span>
                <span>{createdBusinessResult.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🎨 סגנון נבחר:</span>
                <span>{createdBusinessResult.ownerName}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Link
                href={`/${createdBusinessResult.slug}`}
                target="_blank"
                className="flex-1 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <ExternalLink className="w-4 h-4" /> צפה באתר החדש עכשיו
              </Link>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('thecut_admin_authenticated', 'true');
                  }
                  router.push('/admin');
                }}
                className={`flex-1 py-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  adminTheme === 'light'
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-emerald-950/50 hover:bg-emerald-900/70 text-emerald-400 border-emerald-500/40'
                }`}
              >
                <Key className="w-4 h-4" /> כניסה לפאנל הניהול
              </button>

              <button
                onClick={onClose}
                className={`px-4 py-3 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
                  adminTheme === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-white/10 hover:bg-white/15 text-zinc-300'
                }`}
              >
                סגור
              </button>
            </div>
          </div>
        ) : (
          /* WIZARD FORM */
          <form onSubmit={handleCreateBusiness} className="space-y-4">
            {/* Modal Header */}
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
              }`}
            >
              <div className="flex items-center gap-2 text-[#C9A84C]">
                <Sparkles className="w-5 h-5" />
                <div>
                  <h3
                    className={`text-base font-black ${
                      adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    הקמת אתר מספרה מותאם אישית
                  </h3>
                  <span
                    className={`text-[11px] ${
                      adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                    }`}
                  >
                    אשף הקמה חכם ב-3 שלבים
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                  adminTheme === 'light'
                    ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Wizard Steps Indicator */}
            <div
              className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs font-bold ${
                adminTheme === 'light'
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-[#141414] border-white/10'
              }`}
            >
              <div
                className={`flex items-center gap-1.5 ${
                  wizardStep === 1
                    ? 'text-[#B89230]'
                    : adminTheme === 'light'
                    ? 'text-slate-400'
                    : 'text-zinc-500'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    wizardStep === 1
                      ? 'bg-[#C9A84C] text-black font-black'
                      : adminTheme === 'light'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  1
                </span>
                <span>פרטי עסק</span>
              </div>
              <span className={adminTheme === 'light' ? 'text-slate-300' : 'text-zinc-600'}>←</span>
              <div
                className={`flex items-center gap-1.5 ${
                  wizardStep === 2
                    ? 'text-[#B89230]'
                    : adminTheme === 'light'
                    ? 'text-slate-400'
                    : 'text-zinc-500'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    wizardStep === 2
                      ? 'bg-[#C9A84C] text-black font-black'
                      : adminTheme === 'light'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  2
                </span>
                <span>סגנון ומיתוג</span>
              </div>
              <span className={adminTheme === 'light' ? 'text-slate-300' : 'text-zinc-600'}>←</span>
              <div
                className={`flex items-center gap-1.5 ${
                  wizardStep === 3
                    ? 'text-[#B89230]'
                    : adminTheme === 'light'
                    ? 'text-slate-400'
                    : 'text-zinc-500'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    wizardStep === 3
                      ? 'bg-[#C9A84C] text-black font-black'
                      : adminTheme === 'light'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  3
                </span>
                <span>מחירון וסיום</span>
              </div>
            </div>

            {/* STEP 1: BASIC BUSINESS DETAILS */}
            {wizardStep === 1 && (
              <div className="space-y-3 text-xs">
                <div>
                  <label
                    className={`block font-bold mb-1 ${
                      adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
                    }`}
                  >
                    שם העסק / המספרה *
                  </label>
                  <input
                    type="text"
                    value={newBizName}
                    onChange={(e) => {
                      setNewBizName(e.target.value);
                      if (
                        !newBizSlug ||
                        newBizSlug === newBizName.toLowerCase().replace(/\s+/g, '-')
                      ) {
                        setNewBizSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-_]/g, '-')
                            .replace(/-+/g, '-')
                        );
                      }
                    }}
                    placeholder="למשל: אלון קוצץ עיצוב שיער"
                    required
                    className={`w-full rounded-xl px-3.5 py-2.5 text-sm outline-none border transition-colors ${
                      adminTheme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                        : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block font-bold mb-1 ${
                      adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
                    }`}
                  >
                    מזהה קישור ייחודי (Slug) *
                  </label>
                  <div
                    className={`flex items-center rounded-xl px-3 py-2 text-sm border transition-colors ${
                      adminTheme === 'light'
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-[#141414] border-white/15'
                    }`}
                    dir="ltr"
                  >
                    <span
                      className={`text-xs mr-1 ${
                        adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'
                      }`}
                    >
                      thecut.co.il/
                    </span>
                    <input
                      type="text"
                      value={newBizSlug}
                      onChange={(e) =>
                        setNewBizSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))
                      }
                      placeholder="alon-cut"
                      required
                      className={`flex-1 bg-transparent outline-none text-xs font-bold text-right ${
                        adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label
                      className={`block font-bold mb-1 ${
                        adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
                      }`}
                    >
                      שם בעל העסק *
                    </label>
                    <input
                      type="text"
                      value={newBizOwner}
                      onChange={(e) => setNewBizOwner(e.target.value)}
                      placeholder="למשל: אלון"
                      required
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block font-bold mb-1 ${
                        adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
                      }`}
                    >
                      טלפון ראשי (לוואטסאפ) *
                    </label>
                    <input
                      type="tel"
                      value={newBizPhone}
                      onChange={(e) => setNewBizPhone(e.target.value)}
                      placeholder="050-1234567"
                      required
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label
                      className={`block font-bold mb-1 ${
                        adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
                      }`}
                    >
                      עיר / כתובת ראשי *
                    </label>
                    <input
                      type="text"
                      value={newBizCity}
                      onChange={(e) => setNewBizCity(e.target.value)}
                      placeholder="למשל: ראשון לציון"
                      required
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block font-bold mb-1 ${
                        adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
                      }`}
                    >
                      אינסטגרם (אופציונלי)
                    </label>
                    <input
                      type="text"
                      value={newBizInstagram}
                      onChange={(e) => setNewBizInstagram(e.target.value)}
                      placeholder="@barber_alon"
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs outline-none border transition-colors ${
                        adminTheme === 'light'
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                          : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!newBizName || !newBizSlug || !newBizPhone) {
                        error('נא למלא שם עסק, מזהה קישור וטלפון');
                        return;
                      }
                      syncArchetypeDefaults(newBizArchetype);
                      setWizardStep(2);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <span>המשך לבחירת סגנון ומיתוג</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ARCHETYPE STYLE & COLOR PALETTE */}
            {wizardStep === 2 && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label
                    className={`block font-bold mb-1.5 ${
                      adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
                    }`}
                  >
                    בחר את אופי וסגנון המספרה:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.values(BUSINESS_ARCHETYPES).map((arch) => (
                      <div
                        key={arch.id}
                        onClick={() => {
                          setNewBizArchetype(arch.id);
                          syncArchetypeDefaults(arch.id);
                        }}
                        className={`p-3 rounded-2xl border text-right cursor-pointer transition-all ${
                          newBizArchetype === arch.id
                            ? 'bg-amber-500/10 border-[#C9A84C] shadow-xs ring-1 ring-[#C9A84C]'
                            : adminTheme === 'light'
                            ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
                            : 'bg-[#141414] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-base">{arch.icon}</span>
                          {newBizArchetype === arch.id && (
                            <span className="text-emerald-600 font-bold text-[10px]">נבחר ✓</span>
                          )}
                        </div>
                        <h4
                          className={`font-black text-xs mb-0.5 ${
                            adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {arch.name}
                        </h4>
                        <p
                          className={`text-[11px] leading-tight ${
                            adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                          }`}
                        >
                          {arch.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    className={`block font-bold mb-1.5 ${
                      adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
                    }`}
                  >
                    בחר פלטת צבעי יוקרה לאתר:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {THEME_PALETTES.map((pal) => (
                      <div
                        key={pal.id}
                        onClick={() => setNewBizThemeColor(pal.color)}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                          newBizThemeColor === pal.color
                            ? 'bg-amber-500/10 border-[#C9A84C] shadow-xs'
                            : adminTheme === 'light'
                            ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            : 'bg-[#141414] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-full shadow-xs"
                          style={{ backgroundColor: pal.color }}
                        />
                        <span
                          className={`text-[11px] font-bold truncate ${
                            adminTheme === 'light' ? 'text-slate-800' : 'text-white'
                          }`}
                        >
                          {pal.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setWizardStep(1)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1 transition-colors ${
                      adminTheme === 'light'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-white/10 hover:bg-white/15 text-zinc-300'
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" /> חזרה
                  </button>

                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <span>המשך לסקירת מחירון וסיום</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRMATION & SERVICES */}
            {wizardStep === 3 && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label
                    className={`block font-bold mb-1 ${
                      adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
                    }`}
                  >
                    סלוגן לעמוד הבית:
                  </label>
                  <input
                    type="text"
                    value={newBizSlogan}
                    onChange={(e) => setNewBizSlogan(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs outline-none border transition-colors ${
                      adminTheme === 'light'
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#C9A84C]'
                        : 'bg-[#141414] border-white/15 text-white focus:border-[#C9A84C]'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block font-bold mb-1 ${
                      adminTheme === 'light' ? 'text-slate-700' : 'text-gray-300'
                    }`}
                  >
                    מחירון שירותים שנוצר אוטומטית (ניתן לעריכה):
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {newBizServices.map((srv, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between gap-2 p-2 rounded-xl border ${
                          adminTheme === 'light'
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-[#141414] border-white/10'
                        }`}
                      >
                        <input
                          type="text"
                          value={srv.name}
                          onChange={(e) => {
                            const updated = [...newBizServices];
                            updated[idx].name = e.target.value;
                            setNewBizServices(updated);
                          }}
                          className={`flex-1 bg-transparent font-bold text-xs outline-none ${
                            adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                          }`}
                        />
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={srv.price}
                            onChange={(e) => {
                              const updated = [...newBizServices];
                              updated[idx].price = Number(e.target.value);
                              setNewBizServices(updated);
                            }}
                            className={`w-14 rounded-lg px-1.5 py-1 text-center font-bold text-xs outline-none border ${
                              adminTheme === 'light'
                                ? 'bg-white border-slate-300 text-[#967425]'
                                : 'bg-[#222] border-white/15 text-[#C9A84C]'
                            }`}
                          />
                          <span
                            className={
                              adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'
                            }
                          >
                            ₪
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className={`p-3 rounded-2xl border space-y-1 ${
                    adminTheme === 'light'
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-[#141414] border-white/10'
                  }`}
                >
                  <div className="flex justify-between">
                    <span
                      className={adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}
                    >
                      סניף ראשי:
                    </span>
                    <strong
                      className={adminTheme === 'light' ? 'text-slate-900' : 'text-white'}
                    >
                      {newBizCity}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}
                    >
                      צבע מיתוג:
                    </span>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: newBizThemeColor }}
                      />
                      <span
                        className={`font-bold ${
                          adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {newBizThemeColor}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'}
                    >
                      כתובת אתר חי:
                    </span>
                    <strong
                      className={adminTheme === 'light' ? 'text-[#967425]' : 'text-[#C9A84C]'}
                      dir="ltr"
                    >
                      thecut.co.il/{newBizSlug}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1 transition-colors ${
                      adminTheme === 'light'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-white/10 hover:bg-white/15 text-zinc-300'
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" /> חזרה
                  </button>

                  <button
                    type="submit"
                    disabled={isCreatingBiz}
                    className="px-6 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-black text-xs transition-colors shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingBiz ? 'מקים אתר...' : 'הקם אתר מספרה מושלם באוויר 🎉'}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
