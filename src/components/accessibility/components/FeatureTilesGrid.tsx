'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TileItem } from '../types';
import { A11Y_I18N } from '../i18n';

interface FeatureTilesGridProps {
  tiles: TileItem[];
  hoveredTile: TileItem | null;
  setHoveredTile: (tile: TileItem | null) => void;
  t: typeof A11Y_I18N.he;
  isRtl: boolean;
}

export const FeatureTilesGrid: React.FC<FeatureTilesGridProps> = ({
  tiles,
  hoveredTile,
  setHoveredTile,
  t,
  isRtl,
}) => {
  return (
    <>
      {/* 1. Dynamic Hover Tooltip Banner */}
      <div className="min-h-[44px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {hoveredTile ? (
            <motion.div
              key={hoveredTile.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="w-full bg-[#085B7A] text-white p-2.5 px-3.5 rounded-xl shadow-lg text-center text-xs font-semibold leading-relaxed border border-white/20"
            >
              <strong className="text-amber-300 ml-1">{hoveredTile.title}:</strong>
              <span>{hoveredTile.desc}</span>
            </motion.div>
          ) : (
            <div className="w-full bg-slate-100 text-slate-600 p-2.5 px-3.5 rounded-xl text-center text-xs font-medium border border-slate-200">
              {t.hoverPrompt}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. 14 Core Features Grid (Square Tiles with Top Corner Check) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            onClick={tile.onClick}
            onMouseEnter={() => setHoveredTile(tile)}
            onMouseLeave={() => setHoveredTile(null)}
            onFocus={() => setHoveredTile(tile)}
            onBlur={() => setHoveredTile(null)}
            className={`aspect-square p-2 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all active:scale-95 cursor-pointer relative group ${
              tile.active
                ? 'border-2 border-[#085B7A] bg-[#085B7A]/10 text-[#085B7A] shadow-xs'
                : 'border-slate-200 bg-white hover:border-[#085B7A]/50 hover:bg-slate-50 text-[#085B7A]'
            }`}
            aria-pressed={tile.active}
            title={tile.title}
          >
            {/* Top-Right Checkmark when active */}
            {tile.active && (
              <div
                className={`absolute top-1.5 ${
                  isRtl ? 'right-1.5' : 'left-1.5'
                } text-xs font-black text-[#085B7A] leading-none`}
              >
                ✓
              </div>
            )}

            <div className="flex items-center justify-center h-7 text-[#085B7A]">
              {tile.icon}
            </div>
            <span className="font-bold text-[10.5px] sm:text-xs leading-tight text-[#2C2C2C] line-clamp-2">
              {tile.title}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};
