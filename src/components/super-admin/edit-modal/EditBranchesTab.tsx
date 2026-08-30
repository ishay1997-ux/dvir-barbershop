'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Business, BranchItem } from '../types';

interface EditBranchesTabProps {
  editingBiz: Business;
  adminTheme: 'dark' | 'light';
  setEditingBiz: (biz: Business) => void;
}

export const EditBranchesTab: React.FC<EditBranchesTabProps> = ({
  editingBiz,
  adminTheme,
  setEditingBiz,
}) => {
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');

  return (
    <div className="space-y-3.5 text-xs">
      <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
        {editingBiz.branches?.map((br, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
              adminTheme === 'light'
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#141414] border-white/10'
            }`}
          >
            <div className="flex-1 space-y-1">
              <input
                type="text"
                value={br.name}
                onChange={(e) => {
                  const updated = [...(editingBiz.branches || [])];
                  updated[idx].name = e.target.value;
                  setEditingBiz({ ...editingBiz, branches: updated });
                }}
                placeholder="שם הסניף"
                className={`w-full font-bold text-xs bg-transparent outline-none ${
                  adminTheme === 'light' ? 'text-slate-900' : 'text-white'
                }`}
              />
              <input
                type="text"
                value={br.address}
                onChange={(e) => {
                  const updated = [...(editingBiz.branches || [])];
                  updated[idx].address = e.target.value;
                  setEditingBiz({ ...editingBiz, branches: updated });
                }}
                placeholder="כתובת הסניף"
                className={`w-full text-[11px] bg-transparent outline-none ${
                  adminTheme === 'light' ? 'text-slate-500' : 'text-zinc-400'
                }`}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const updated = editingBiz.branches?.filter((_, i) => i !== idx);
                setEditingBiz({ ...editingBiz, branches: updated });
              }}
              className="p-1 text-zinc-400 hover:text-rose-500 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add new branch */}
      <div
        className={`pt-2 border-t space-y-2 ${
          adminTheme === 'light' ? 'border-slate-200' : 'border-white/10'
        }`}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            placeholder="שם סניף חדש..."
            className={`flex-1 rounded-xl px-3 py-2 text-xs outline-none border ${
              adminTheme === 'light'
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-[#1C1C1C] border-white/15 text-white'
            }`}
          />
          <input
            type="text"
            value={newBranchAddress}
            onChange={(e) => setNewBranchAddress(e.target.value)}
            placeholder="כתובת..."
            className={`flex-1 rounded-xl px-3 py-2 text-xs outline-none border ${
              adminTheme === 'light'
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-[#1C1C1C] border-white/15 text-white'
            }`}
          />
          <button
            type="button"
            onClick={() => {
              if (!newBranchName.trim()) return;
              const current = editingBiz.branches ? [...editingBiz.branches] : [];
              current.push({
                name: newBranchName.trim(),
                address: newBranchAddress.trim(),
              });
              setEditingBiz({ ...editingBiz, branches: current });
              setNewBranchName('');
              setNewBranchAddress('');
            }}
            className="px-3 py-2 bg-[#C9A84C] hover:bg-[#DFCA85] text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            + הוסף
          </button>
        </div>
      </div>
    </div>
  );
};
