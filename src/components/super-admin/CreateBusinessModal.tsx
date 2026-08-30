'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { generateTailoredBusinessConfig } from '@/lib/archetypes';
import { useToast } from '@/components/common/ToastProvider';
import type { Business, ServiceItem, BranchItem } from './types';
import { Step1ArchetypeAndBasics } from './create-modal/Step1ArchetypeAndBasics';
import { Step2ArchetypeAndBranding } from './create-modal/Step2ArchetypeAndBranding';
import { Step3ServicesAndReview } from './create-modal/Step3ServicesAndReview';
import { CreateSuccessScreen } from './create-modal/CreateSuccessScreen';

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
  const { success, error } = useToast();

  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [newBizName, setNewBizName] = useState('');
  const [newBizSlug, setNewBizSlug] = useState('');
  const [newBizOwner, setNewBizOwner] = useState('');
  const [newBizPhone, setNewBizPhone] = useState('');
  const [newBizCity, setNewBizCity] = useState('');
  const [newBizInstagram, setNewBizInstagram] = useState('');
  const [newBizPlan] = useState<'pro' | 'starter' | 'enterprise'>('pro');
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
          <CreateSuccessScreen
            adminTheme={adminTheme}
            createdBusinessResult={createdBusinessResult}
            onClose={onClose}
          />
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

            {/* STEP 1 */}
            {wizardStep === 1 && (
              <Step1ArchetypeAndBasics
                adminTheme={adminTheme}
                newBizName={newBizName}
                setNewBizName={setNewBizName}
                newBizSlug={newBizSlug}
                setNewBizSlug={setNewBizSlug}
                newBizOwner={newBizOwner}
                setNewBizOwner={setNewBizOwner}
                newBizPhone={newBizPhone}
                setNewBizPhone={setNewBizPhone}
                newBizCity={newBizCity}
                setNewBizCity={setNewBizCity}
                newBizInstagram={newBizInstagram}
                setNewBizInstagram={setNewBizInstagram}
                onNext={() => {
                  if (!newBizName || !newBizSlug || !newBizPhone) {
                    error('נא למלא שם עסק, מזהה קישור וטלפון');
                    return;
                  }
                  syncArchetypeDefaults(newBizArchetype);
                  setWizardStep(2);
                }}
              />
            )}

            {/* STEP 2 */}
            {wizardStep === 2 && (
              <Step2ArchetypeAndBranding
                adminTheme={adminTheme}
                newBizArchetype={newBizArchetype}
                setNewBizArchetype={setNewBizArchetype}
                newBizThemeColor={newBizThemeColor}
                setNewBizThemeColor={setNewBizThemeColor}
                syncArchetypeDefaults={syncArchetypeDefaults}
                onPrev={() => setWizardStep(1)}
                onNext={() => setWizardStep(3)}
              />
            )}

            {/* STEP 3 */}
            {wizardStep === 3 && (
              <Step3ServicesAndReview
                adminTheme={adminTheme}
                newBizSlogan={newBizSlogan}
                setNewBizSlogan={setNewBizSlogan}
                newBizServices={newBizServices}
                setNewBizServices={setNewBizServices}
                newBizCity={newBizCity}
                newBizThemeColor={newBizThemeColor}
                newBizSlug={newBizSlug}
                isCreatingBiz={isCreatingBiz}
                onPrev={() => setWizardStep(2)}
              />
            )}
          </form>
        )}
      </div>
    </div>
  );
};
