'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Business, ServiceItem } from '../types';

interface EditServicesTabProps {
  editingBiz: Business;
  adminTheme: 'dark' | 'light';
  setEditingBiz: (biz: Business) => void;
}

export const EditServicesTab: React.FC<EditServicesTabProps> = ({
  editingBiz,
  adminTheme,
  setEditingBiz,
}) => {
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(80);
  const [newServiceDuration, setNewServiceDuration] = useState<number>(30);

  return (
    <div className="space-y-3.5 text-xs">
      <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
        {editingBiz.services?.map((srv, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border ${
              adminTheme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-900'
                : 'bg-[#141414] border-white/10 text-white'
            }`}
          >
            <div className="flex-1">
              <input
                type="text"
                value={srv.name}
                onChange={(e) => {
                  const updated = [...(editingBiz.services || [])];
                  updated[idx].name = e.target.value;
                  setEditingBiz({ ...editingBiz, services: updated });
                }}
                className={`w-full bg-transparent font-bold text-xs outline-none ${
                  adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                }`}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={srv.price}
                onChange={(e) => {
                  const updated = [...(editingBiz.services || [])];
                  updated[idx].price = Number(e.target.value);
                  setEditingBiz({ ...editingBiz, services: updated });
                }}
                className={`w-16 rounded-lg px-2 py-1 text-center font-bold text-xs outline-none border ${
                  adminTheme === 'light'
                    ? 'bg-white border-slate-300 text-[#967425]'
                    : 'bg-[#222] border-white/15 text-[#C9A84C]'
                }`}
              />
              <span className={adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}>
                ₪
              </span>
              <input
                type="number"
                value={srv.duration}
                onChange={(e) => {
                  const updated = [...(editingBiz.services || [])];
                  updated[idx].duration = Number(e.target.value);
                  setEditingBiz({ ...editingBiz, services: updated });
                }}
                className={`w-14 rounded-lg px-1.5 py-1 text-center text-xs outline-none border ${
                  adminTheme === 'light'
                    ? 'bg-white border-slate-300 text-slate-800'
                    : 'bg-[#222] border-white/15 text-white'
                }`}
              />
              <span
                className={`text-[10px] ${
                  adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'
                }`}
              >
                דק׳
              </span>
              <button
                type="button"
                onClick={() => {
                  const updated = editingBiz.services?.filter((_, i) => i !== idx);
                  setEditingBiz({ ...editingBiz, services: updated });
                }}
                className="p-1 text-zinc-400 hover:text-rose-500 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add new service row */}
      <div
        className={`pt-2 border-t flex items-center gap-2 ${
          adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
        }`}
      >
        <input
          type="text"
          value={newServiceName}
          onChange={(e) => setNewServiceName(e.target.value)}
          placeholder="שם שירות חדש..."
          className={`flex-1 rounded-xl px-3 py-2 text-xs outline-none border transition-colors ${
            adminTheme === 'light'
              ? 'bg-white border-slate-200 text-slate-900 focus:border-[#C9A84C]'
              : 'bg-[#1C1C1C] border-white/15 text-white focus:border-[#C9A84C]'
          }`}
        />
        <input
          type="number"
          value={newServicePrice}
          onChange={(e) => setNewServicePrice(Number(e.target.value))}
          placeholder="מחיר"
          className={`w-16 rounded-xl px-2 py-2 text-center text-xs outline-none border ${
            adminTheme === 'light'
              ? 'bg-white border-slate-200 text-slate-900'
              : 'bg-[#1C1C1C] border-white/15 text-white'
          }`}
        />
        <span className={adminTheme === 'light' ? 'text-slate-400' : 'text-zinc-500'}>₪</span>
        <button
          type="button"
          onClick={() => {
            if (!newServiceName.trim()) return;
            const current = editingBiz.services ? [...editingBiz.services] : [];
            current.push({
              name: newServiceName.trim(),
              price: newServicePrice,
              duration: newServiceDuration,
            });
            setEditingBiz({ ...editingBiz, services: current });
            setNewServiceName('');
          }}
          className="px-3 py-2 bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          + הוסף
        </button>
      </div>
    </div>
  );
};
