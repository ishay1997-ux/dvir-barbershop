'use client';

import React, { useState } from 'react';
import { TileItem } from '../types';
import { A11Y_I18N } from '../i18n';

interface FeatureTilesGridProps {
  tiles: TileItem[];
  hoveredTile?: TileItem | null;
  setHoveredTile?: (tile: TileItem | null) => void;
  t: typeof A11Y_I18N.he;
  isRtl: boolean;
}

export const FeatureTilesGrid: React.FC<FeatureTilesGridProps> = ({
  tiles,
  isRtl,
}) => {
  const [hoveredTileId, setHoveredTileId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-2.5 select-none">
      {tiles.map((tile) => {
        const isHovered = hoveredTileId === tile.id;

        return (
          <button
            key={tile.id}
            onClick={tile.onClick}
            onMouseEnter={() => setHoveredTileId(tile.id)}
            onMouseLeave={() => setHoveredTileId(null)}
            onFocus={() => setHoveredTileId(tile.id)}
            onBlur={() => setHoveredTileId(null)}
            className={`aspect-square p-2 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all duration-150 active:scale-95 cursor-pointer relative overflow-hidden ${
              isHovered
                ? 'bg-[#5B6770] border-[#5B6770] text-white shadow-md'
                : tile.active
                ? 'border-2 border-[#085B7A] bg-white text-[#085B7A] shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300 text-[#085B7A]'
            }`}
            aria-pressed={tile.active}
            title={tile.title}
          >
            {/* Top Corner Checkmark when active (white when hovered, blue when not) */}
            {tile.active && (
              <div
                className={`absolute top-1.5 ${
                  isRtl ? 'right-2' : 'left-2'
                } text-xs font-black leading-none ${
                  isHovered ? 'text-white' : 'text-[#085B7A]'
                }`}
              >
                ✓
              </div>
            )}

            {/* Hover State: Display the descriptive explanation inside the tile */}
            {isHovered ? (
              <div className="flex items-center justify-center w-full h-full px-1">
                <span className="text-[11px] sm:text-[11.5px] font-bold text-white leading-tight text-center animate-fadeIn">
                  {tile.desc}
                </span>
              </div>
            ) : (
              /* Normal State: Display the Icon and Title */
              <>
                <div className="flex items-center justify-center h-7 text-[#085B7A]">
                  {tile.icon}
                </div>
                <span className="font-bold text-[11px] sm:text-xs leading-tight text-[#085B7A] line-clamp-2 px-0.5">
                  {tile.title}
                </span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
};
