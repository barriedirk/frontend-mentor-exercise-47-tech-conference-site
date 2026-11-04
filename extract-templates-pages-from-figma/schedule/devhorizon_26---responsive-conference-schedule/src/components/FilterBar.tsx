import React from 'react';
import { TrackType } from '../types.ts';

interface FilterBarProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
  selectedTrack: TrackType | 'ALL';
  onSelectTrack: (track: TrackType | 'ALL') => void;
  showOnlySaved: boolean;
  onToggleSaved: () => void;
  savedCount: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedDay,
  onSelectDay,
  selectedTrack,
  onSelectTrack,
  showOnlySaved,
  onToggleSaved,
  savedCount,
  onClearFilters,
  hasActiveFilters,
}) => {
  const tracks: { id: TrackType; label: string }[] = [
    { id: 'FRONTEND', label: 'FRONTEND' },
    { id: 'PERFORMANCE', label: 'PERFORMANCE' },
    { id: 'ACCESSIBILITY', label: 'A11Y' },
    { id: 'TOOLING', label: 'TOOLING' },
  ];

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#c8f535]">
          {'// schedule'}
        </h1>
      </div>

      {/* Responsive Filter Container */}
      {/* Adapts seamlessly across Mobile (stacked rows), Tablet (2 rows), Desktop (single row) */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Day Selectors Group */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {[1, 2, 3].map((dayNum) => {
            const isDayActive = selectedDay === dayNum;
            return (
              <button
                key={dayNum}
                onClick={() => onSelectDay(dayNum)}
                className={`px-3 sm:px-4 py-1.5 text-xs font-mono tracking-wider font-semibold transition-colors duration-150 border ${
                  isDayActive
                    ? 'bg-[#c8f535] text-[#041318] border-[#c8f535] shadow-[0_0_10px_rgba(200,245,53,0.3)]'
                    : 'bg-[#071d24]/60 text-[#93b0b8] border-[#143d46] hover:border-[#276575] hover:text-white'
                }`}
              >
                DAY 0{dayNum}
              </button>
            );
          })}
        </div>

        {/* Vertical Divider on Desktop & Tablet */}
        <div className="hidden sm:block h-6 w-px bg-[#143d46] mx-1" aria-hidden="true" />

        {/* Track Category Buttons (Pills) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {tracks.map((track) => {
            const isTrackActive = selectedTrack === track.id && !showOnlySaved;
            return (
              <button
                key={track.id}
                onClick={() => {
                  if (isTrackActive) {
                    onSelectTrack('ALL');
                  } else {
                    onSelectTrack(track.id);
                  }
                }}
                className={`px-3 sm:px-4 py-1.5 text-xs font-mono tracking-wider rounded-full transition-all duration-150 border ${
                  isTrackActive
                    ? 'border-[#c8f535] text-[#c8f535] bg-[#c8f535]/15 font-semibold'
                    : 'border-[#143d46] text-[#8ea7af] hover:border-[#276575] hover:text-white bg-[#071d24]/40'
                }`}
              >
                {track.label}
              </button>
            );
          })}

          {/* MY SCHEDULE Button (Dashed pill) */}
          <button
            onClick={onToggleSaved}
            className={`px-3 sm:px-4 py-1.5 text-xs font-mono tracking-wider rounded-full border border-dashed transition-all duration-150 ${
              showOnlySaved
                ? 'border-[#c8f535] bg-[#c8f535] text-[#041318] font-bold shadow-[0_0_12px_rgba(200,245,53,0.3)]'
                : 'border-[#c8f535] text-[#c8f535] hover:bg-[#c8f535]/10 bg-transparent'
            }`}
          >
            MY SCHEDULE {savedCount > 0 ? `(${savedCount})` : ''}
          </button>

          {/* CLEAR Button (Red/Coral outline) */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-3 sm:px-4 py-1.5 text-xs font-mono tracking-wider rounded-full border border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b]/15 transition-all duration-150"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
