'use client';

import React, { useState } from 'react';
import {
  GripVertical,
  Eye,
  EyeOff,
  Code,
  Sparkles,
  Smartphone,
  Monitor,
  RotateCcw,
  Check,
  Copy,
  Layers,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { BusinessLayoutConfig } from '@/types/business';

interface VisualPuckPageBuilderProps {
  layout: BusinessLayoutConfig;
  themeColor: string;
  businessName: string;
  adminTheme?: 'dark' | 'light';
  onChangeLayout: (newLayout: BusinessLayoutConfig) => void;
}

type SectionKey = 'hero' | 'services' | 'gallery' | 'bio' | 'reviews' | 'faqs' | 'branches';

interface SectionDefinition {
  id: SectionKey;
  label: string;
  desc: string;
  icon: string;
  canToggle: boolean;
}

const SECTION_DEFS: SectionDefinition[] = [
  { id: 'hero', label: 'סקשן הירו ראשי (Hero Banner)', desc: 'כותרת ראשית, סלוגן וכפתור זימון תור', icon: '👑', canToggle: false },
  { id: 'services', label: 'מחירון ושירותים (Services)', desc: 'רשימת השירותים, מחירים ומשכי זמן', icon: '✂️', canToggle: false },
  { id: 'gallery', label: 'גלריית עבודות ואינסטגרם (Gallery)', desc: 'תמונות ומהפכי תספורת', icon: '🖼️', canToggle: true },
  { id: 'bio', label: 'אודות והסטנדרטים (Bio & Story)', desc: 'סיפור העסק, שנות ניסיון והפילוסופיה', icon: '📖', canToggle: true },
  { id: 'reviews', label: 'המלצות וביקורות (Google Reviews)', desc: 'חוות דעת 5.0★ של לקוחות', icon: '⭐', canToggle: true },
  { id: 'faqs', label: 'שאלות נפוצות (FAQ Accordion)', desc: 'אקורדיון מענה לשאלות חוזרות', icon: '❓', canToggle: true },
  { id: 'branches', label: 'סניפים וניווט Waze (Branches)', desc: 'מיקום על מפה, שעות פעילות ודרכי הגעה', icon: '📍', canToggle: true },
];

export const VisualPuckPageBuilder: React.FC<VisualPuckPageBuilderProps> = ({
  layout,
  themeColor,
  businessName,
  adminTheme = 'light',
  onChangeLayout,
}) => {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Active section order
  const currentOrder: SectionKey[] = layout.sectionsOrder && layout.sectionsOrder.length > 0
    ? layout.sectionsOrder
    : ['hero', 'services', 'gallery', 'bio', 'reviews', 'faqs', 'branches'];

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentOrder.length) return;

    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIdx, 0, moved);

    onChangeLayout({
      ...layout,
      sectionsOrder: newOrder,
    });
  };

  const handleToggleSection = (secId: SectionKey) => {
    const keyMap: Record<string, keyof BusinessLayoutConfig> = {
      bio: 'showBio',
      branches: 'showBranches',
      reviews: 'showReviews',
      faqs: 'showFaqs',
    };
    const propKey = keyMap[secId];
    if (!propKey) return;

    const currentVal = layout[propKey] !== false;
    onChangeLayout({
      ...layout,
      [propKey]: !currentVal,
    });
  };

  const isSectionVisible = (secId: SectionKey): boolean => {
    if (secId === 'hero' || secId === 'services' || secId === 'gallery') return true;
    if (secId === 'bio') return layout.showBio !== false;
    if (secId === 'branches') return layout.showBranches !== false;
    if (secId === 'reviews') return layout.showReviews !== false;
    if (secId === 'faqs') return layout.showFaqs !== false;
    return true;
  };

  const jsonExportString = JSON.stringify(
    {
      puckSchemaVersion: '1.0',
      root: {
        title: businessName,
        themeColor,
        bgTheme: layout.bgTheme || 'dark-obsidian',
      },
      layout: {
        heroStyle: layout.heroStyle || 'hub-monogram',
        servicesStyle: layout.servicesStyle || 'cards-grid',
        cardStyle: layout.cardStyle || 'glass',
        sectionsOrder: currentOrder,
      },
    },
    null,
    2
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm text-teal-950">עורך ויזואלי Puck (Visual Block Editor)</h3>
            <p className="text-[11px] text-teal-700">
              שינוי סדר הבלוקים בעמוד בגרירה/חצים, הגדרת סגנונות וייצוא מבנה JSON נקי
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowJsonModal(true)}
            className="px-3 py-1.5 rounded-xl border border-teal-300 bg-white text-teal-800 text-xs font-bold flex items-center gap-1.5 hover:bg-teal-50 cursor-pointer shadow-xs"
          >
            <Code className="w-3.5 h-3.5 text-teal-600" />
            <span>Puck JSON Schema</span>
          </button>
        </div>
      </div>

      {/* Grid: Editor Controls (Left) & Live Visual Frame (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Section Blocks List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h4 className="font-black text-xs text-slate-700 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-teal-600" />
            <span>סדר הסקשנים בעמוד (סדר הופעה מלמעלה למטה):</span>
          </h4>

          <div className="space-y-2">
            {currentOrder.map((secKey, index) => {
              const def = SECTION_DEFS.find((d) => d.id === secKey) || {
                id: secKey,
                label: secKey,
                desc: '',
                icon: '📦',
                canToggle: true,
              };
              const visible = isSectionVisible(secKey);

              return (
                <div
                  key={secKey}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    visible
                      ? 'bg-white border-slate-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{def.icon}</span>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{def.label}</span>
                      <span className="text-[10px] text-slate-500 block">{def.desc}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Up / Down Controls */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveSection(index, 'up')}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      title="העבר למעלה"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={index === currentOrder.length - 1}
                      onClick={() => handleMoveSection(index, 'down')}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      title="העבר למטה"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Visibility Toggle */}
                    {def.canToggle && (
                      <button
                        type="button"
                        onClick={() => handleToggleSection(secKey)}
                        className={`p-1.5 rounded-lg border cursor-pointer ${
                          visible
                            ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                            : 'border-slate-200 text-slate-400 bg-slate-100'
                        }`}
                        title={visible ? 'הסתר סקשן' : 'הצג סקשן'}
                      >
                        {visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Live Interactive Visual Frame (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-4 border border-slate-800 text-white flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">תצוגה מקדימה חיה (Live Canvas)</span>
            </div>

            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-teal-600 text-white' : 'text-slate-400'
                }`}
                title="תצוגת מחשב"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-teal-600 text-white' : 'text-slate-400'
                }`}
                title="תצוגת מובייל"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div
            className={`mx-auto transition-all duration-300 bg-[#121212] border border-white/15 rounded-2xl overflow-hidden p-4 space-y-3 ${
              previewDevice === 'mobile' ? 'w-72 max-w-full' : 'w-full'
            }`}
          >
            {/* Visual Hero Mock */}
            <div
              className="rounded-xl p-4 text-center space-y-2 border"
              style={{
                borderColor: `${themeColor}40`,
                backgroundColor: `${themeColor}10`,
              }}
            >
              <div
                className="w-10 h-10 rounded-full mx-auto flex items-center justify-center font-black text-sm"
                style={{ backgroundColor: themeColor, color: '#000' }}
              >
                {businessName.trim().charAt(0)}
              </div>
              <h5 className="font-black text-sm text-white">{businessName}</h5>
              <div
                className="inline-block px-3 py-1 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: themeColor, color: '#000' }}
              >
                קביעת תור אונליין 24/7
              </div>
            </div>

            {/* Ordered Section Stack Preview */}
            <div className="space-y-1.5 text-[11px]">
              {currentOrder.map((secKey) => {
                if (!isSectionVisible(secKey)) return null;
                const def = SECTION_DEFS.find((d) => d.id === secKey);

                return (
                  <div
                    key={secKey}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>{def?.icon}</span>
                      <span className="font-bold text-slate-200">{def?.label.split('(')[0]}</span>
                    </div>
                    <span
                      className="text-[9px] px-2 py-0.5 rounded-md font-mono"
                      style={{ color: themeColor, backgroundColor: `${themeColor}20` }}
                    >
                      Puck::{secKey}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 mt-4 text-[10px] text-slate-400 text-center">
            השינויים נשמרים ישירות במודל ה-JSON ומסונכרנים לאתר הלקוח באוויר
          </div>
        </div>
      </div>

      {/* JSON Schema Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-teal-400" />
                <h4 className="font-bold text-sm">Puck JSON Configuration</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <pre className="bg-black/60 p-4 rounded-xl font-mono text-[11px] text-teal-300 max-h-72 overflow-y-auto" dir="ltr">
              {jsonExportString}
            </pre>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(jsonExportString);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'הועתק!' : 'העתק JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
