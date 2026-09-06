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
    <div className="acc:grid acc:grid-cols-2 acc:gap-2.5 acc:sm:gap-3 acc:select-none">
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
            className={`acc:min-h-[96px] acc:sm:min-h-[105px] acc:p-3 acc:sm:p-4 acc:rounded-2xl acc:border acc:flex acc:flex-col acc:items-center acc:justify-center acc:text-center acc:gap-1.5 acc:transition-all acc:duration-150 acc:active:scale-95 acc:cursor-pointer acc:relative acc:overflow-hidden ${
              isHovered
                ? 'acc:bg-[#5B6770] acc:border-[#5B6770] acc:text-white acc:shadow-md'
                : tile.active
                ? 'acc:border-2 acc:border-[#085B7A] acc:bg-white acc:text-[#085B7A] acc:shadow-xs'
                : 'acc:border-slate-200 acc:bg-white acc:hover:border-[#085B7A]/40 acc:text-[#085B7A] acc:shadow-xs'
            }`}
            aria-pressed={tile.active}
            title={tile.title}
          >
            {/* Top Corner Checkmark when active */}
            {tile.active && (
              <div
                className={`acc:absolute acc:top-2 ${
                  isRtl ? 'acc:right-2.5' : 'acc:left-2.5'
                } acc:text-sm acc:font-black acc:leading-none ${
                  isHovered ? 'acc:text-white' : 'acc:text-[#085B7A]'
                }`}
              >
                ✓
              </div>
            )}

            {/* Hover State: Display the descriptive explanation inside the tile */}
            {isHovered ? (
              <div className="acc:flex acc:items-center acc:justify-center acc:w-full acc:h-full acc:px-1">
                <span className="acc:text-xs acc:sm:text-[12.5px] acc:font-bold acc:text-white acc:leading-snug acc:text-center animate-a11y-fadeIn">
                  {tile.desc}
                </span>
              </div>
            ) : (
              /* Normal State: Display the Icon and Title */
              <>
                <div className="acc:flex acc:items-center acc:justify-center acc:h-8 acc:sm:h-9 acc:text-[#085B7A] acc:[&>svg]:w-7 acc:[&>svg]:h-7 acc:sm:[&>svg]:w-8 acc:sm:[&>svg]:h-8">
                  {tile.icon}
                </div>
                <span className="acc:font-black acc:text-xs acc:sm:text-[13px] acc:leading-tight acc:text-[#085B7A] acc:line-clamp-2 acc:px-1">
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
