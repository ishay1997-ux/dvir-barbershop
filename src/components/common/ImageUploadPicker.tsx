'use client';

import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, Image as ImageIcon, Check } from 'lucide-react';

interface ImageUploadPickerProps {
  label: string;
  sublabel?: string;
  value?: string;
  onChange: (url: string) => void;
  themeColor?: string;
  placeholder?: string;
}

export function ImageUploadPicker({
  label,
  sublabel,
  value,
  onChange,
  themeColor = '#C9A84C',
  placeholder = 'https://...',
}: ImageUploadPickerProps) {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('גודל הקובץ המקסימלי הוא 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('גודל הקובץ המקסימלי הוא 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2 text-right" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-slate-200 block">{label}</label>
          {sublabel && <p className="text-[10px] text-slate-400">{sublabel}</p>}
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-700/60 text-[10px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'upload' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>העלאת קובץ</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'url' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>קישור URL</span>
          </button>
        </div>
      </div>

      {/* Image Preview if value exists */}
      {value ? (
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-white/10 shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-white block truncate">תמונה / לוגו נבחר</span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> מוצג באתר
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold transition-colors cursor-pointer"
            >
              החלף
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors cursor-pointer"
              title="הסר תמונה"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Upload / URL Input Area */
        <div>
          {mode === 'upload' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-400 bg-indigo-950/40 scale-[1.01]'
                  : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-8 h-8 rounded-full bg-slate-700/60 flex items-center justify-center mx-auto mb-2 text-slate-300">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white block">
                לחץ להעלאת לוגו / תמונה מהמכשיר
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                תומך ב-PNG, JPG, WebP עד 3MB (כולל שקיפות)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-400 font-mono text-left"
                dir="ltr"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 transition-colors cursor-pointer"
              >
                שמור
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUploadPicker;

