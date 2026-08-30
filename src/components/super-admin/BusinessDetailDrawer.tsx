'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  ExternalLink,
  Edit,
  Key,
  MessageCircle,
  Copy,
  Check,
  Building2,
  Phone,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Download,
  Share2,
  Clock,
  Globe,
  Navigation,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import type { Business } from './types';

interface BusinessDetailDrawerProps {
  business: Business | null;
  adminTheme: 'dark' | 'light';
  onClose: () => void;
  onOpenEditModal: (biz: Business) => void;
}

export const BusinessDetailDrawer: React.FC<BusinessDetailDrawerProps> = ({
  business,
  adminTheme,
  onClose,
  onOpenEditModal,
}) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  if (!business) return null;

  const bizColor = business.themeColor || '#C9A84C';
  const initial = (business.name || 'ע').trim().charAt(0);
  const bookingUrl = `https://thecut.co.il/${business.slug}`;
  const adminUrl = `https://thecut.co.il/admin/login`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(label);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const rawPhone = (business.phone || '').replace(/\D/g, '').replace(/^0/, '972');

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className={`relative max-w-2xl w-full rounded-3xl border shadow-2xl z-10 my-auto text-right overflow-hidden transition-all max-h-[90vh] flex flex-col ${
          adminTheme === 'light'
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#15161A] border-white/10 text-white'
        }`}
      >
        {/* Top Header Card */}
        <div
          className="p-6 border-b flex items-start justify-between relative overflow-hidden"
          style={{
            background:
              adminTheme === 'light'
                ? `linear-gradient(135deg, ${bizColor}12 0%, #FFFFFF 100%)`
                : `linear-gradient(135deg, ${bizColor}20 0%, #15161A 100%)`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 shadow-md"
              style={{
                backgroundColor: bizColor,
                color: '#000',
              }}
            >
              {initial}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black">{business.name}</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    business.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 border border-amber-300'
                  }`}
                >
                  {business.status === 'active' ? '● פעיל באוויר' : business.status}
                </span>
                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                    business.plan === 'team'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : business.plan === 'starter'
                      ? 'bg-slate-100 text-slate-700 border border-slate-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  {business.plan || 'pro'} Plan
                </span>
              </div>

              <span className="text-xs font-mono text-slate-500 block" dir="ltr">
                thecut.co.il/{business.slug}
              </span>

              {business.slogan && (
                <p className="text-xs text-slate-600 dark:text-zinc-300 italic pt-1">
                  "{business.slogan}"
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Link
              href={`/${business.slug}`}
              target="_blank"
              className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all text-center"
            >
              <ExternalLink className="w-4 h-4" />
              <span>צפה באתר לקוחות</span>
            </Link>

            <button
              onClick={() => {
                onClose();
                onOpenEditModal(business);
              }}
              className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer text-center dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              <Edit className="w-4 h-4" />
              <span>ערוך והתאם אישית</span>
            </button>

            <Link
              href="/admin"
              className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all text-center"
            >
              <Key className="w-4 h-4" />
              <span>פאנל ניהול אדמין</span>
            </Link>

            <a
              href={`https://wa.me/${rawPhone}?text=${encodeURIComponent(
                `היי ${business.ownerName || 'יקר/ה'}! 🎉\nהאתר והמערכת שלך עבור "${business.name}" מוכנים באוויר!\n\n🌐 אתר הלקוחות להזמנת תורים:\nhttps://thecut.co.il/${business.slug}\n\n🔐 פאנל הניהול והיומן שלך:\nhttps://thecut.co.il/admin/login`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] border border-[#25D366]/30 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>וואטסאפ לבעלים</span>
            </a>
          </div>

          {/* Links Box */}
          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              adminTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'
            }`}
          >
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
              🔗 קישורים ישירים לשיתוף:
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-white dark:bg-black/30 p-2.5 rounded-xl border border-slate-200/80 dark:border-white/10">
                <div className="truncate pl-2">
                  <span className="text-slate-400 text-[10px] block">אתר הזמנת תורים ללקוחות:</span>
                  <span className="font-mono font-bold text-indigo-600 truncate block" dir="ltr">
                    {bookingUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(bookingUrl, 'booking')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedUrl === 'booking' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUrl === 'booking' ? 'הועתק!' : 'העתק'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between bg-white dark:bg-black/30 p-2.5 rounded-xl border border-slate-200/80 dark:border-white/10">
                <div className="truncate pl-2">
                  <span className="text-slate-400 text-[10px] block">כניסה לניהול יומן לבעל העסק:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-zinc-200 truncate block" dir="ltr">
                    {adminUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(adminUrl, 'admin')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedUrl === 'admin' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUrl === 'admin' ? 'הועתק!' : 'העתק'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* General Info */}
            <div
              className={`p-4 rounded-2xl border space-y-2.5 ${
                adminTheme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
              }`}
            >
              <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>פרטי העסק והבעלים:</span>
              </h4>

              <div className="space-y-1.5 text-slate-600 dark:text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">מנהל העסק:</span>
                  <strong className="text-slate-900 dark:text-white">{business.ownerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">טלפון:</span>
                  <strong className="font-mono" dir="ltr">{business.phone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">עיר / אזור:</span>
                  <span>{business.city || 'ישראל'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">צבע מיתוג:</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border shadow-xs"
                      style={{ backgroundColor: bizColor }}
                    />
                    <span className="font-mono font-bold" dir="ltr">{bizColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social & Contact */}
            <div
              className={`p-4 rounded-2xl border space-y-2.5 ${
                adminTheme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
              }`}
            >
              <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-indigo-600" />
                <span>רשתות ודרכי הגעה:</span>
              </h4>

              <div className="space-y-1.5 text-slate-600 dark:text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">אינסטגרם:</span>
                  <span>{business.instagramHandle ? `@${business.instagramHandle}` : 'לא הוגדר'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">סניפים פעילים:</span>
                  <strong className="text-slate-900 dark:text-white">{business.branches?.length || 1} סניפים</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">שירותים במחירון:</span>
                  <strong className="text-slate-900 dark:text-white">{business.services?.length || 3} שירותים</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">תאריך הקמה:</span>
                  <span>{business.createdAt || '2026'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Services List Preview */}
          {business.services && business.services.length > 0 && (
            <div
              className={`p-4 rounded-2xl border space-y-2.5 ${
                adminTheme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
              }`}
            >
              <h4 className="font-black text-slate-900 dark:text-white text-xs flex items-center justify-between">
                <span>✂️ מחירון שירותים ({business.services.length}):</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {business.services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200/70 dark:border-white/5"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{srv.name}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {srv.duration} דקות
                      </span>
                    </div>
                    <span className="font-bold text-emerald-600 text-sm">{srv.price} ₪</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Branches List Preview */}
          {business.branches && business.branches.length > 0 && (
            <div
              className={`p-4 rounded-2xl border space-y-2.5 ${
                adminTheme === 'light' ? 'bg-white border-slate-200' : 'bg-white/5 border-white/10'
              }`}
            >
              <h4 className="font-black text-slate-900 dark:text-white text-xs flex items-center justify-between">
                <span>📍 סניפי העסק ({business.branches.length}):</span>
              </h4>

              <div className="space-y-2 text-xs">
                {business.branches.map((br, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200/70 dark:border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{br.name}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {br.address}
                      </span>
                    </div>

                    {br.wazeLink && (
                      <a
                        href={br.wazeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 text-[11px] font-bold border border-sky-200 flex items-center gap-1 hover:bg-sky-100"
                      >
                        <Navigation className="w-3 h-3" /> Waze
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-between ${
            adminTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/10'
          }`}
        >
          <button
            onClick={() => {
              const dataStr =
                'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(business, null, 2));
              const a = document.createElement('a');
              a.setAttribute('href', dataStr);
              a.setAttribute('download', `${business.slug}-backup.json`);
              document.body.appendChild(a);
              a.click();
              a.remove();
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>הורד גיבוי JSON</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer dark:bg-white/10 dark:hover:bg-white/20"
          >
            סגור כרטיס
          </button>
        </div>
      </div>
    </div>
  );
};
