import React from 'react';
import { Star } from 'lucide-react';
import { Talk } from '../types.ts';
import { Barcode } from './Barcode.tsx';

interface ScheduleCardProps {
  talk: Talk;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  talk,
  isExpanded,
  onToggleExpand,
  isSaved,
  onToggleSave,
}) => {
  return (
    <article
      className="group relative flex flex-col md:flex-row items-stretch border border-[#0d2a32] overflow-hidden transition-all duration-200 hover:border-[#1e4854] shadow-md"
      aria-label={`${talk.title} by ${talk.speaker}`}
    >
      {/* MOBILE-ONLY: Top Track Banner */}
      <div className="block md:hidden w-full bg-[#06191f] py-2 px-4 text-center border-b border-[#0d2a32]">
        <span className="text-[11px] font-mono tracking-widest text-[#829fa7] font-semibold uppercase">
          {talk.trackLabel}
        </span>
      </div>

      {/* DESKTOP & TABLET: Left Track Vertical Sidebar Strip */}
      <div className="hidden md:flex w-11 lg:w-14 shrink-0 bg-[#06191f] border-r border-[#0d2a32] items-center justify-center select-none py-6">
        <span className="[writing-mode:vertical-rl] rotate-180 uppercase tracking-widest text-[11px] font-mono text-[#829fa7] font-semibold whitespace-nowrap">
          {talk.trackLabel}
        </span>
      </div>

      {/* MAIN BODY (Colored by track) */}
      <div
        className="flex-1 p-5 sm:p-6 md:p-7 lg:p-8 flex flex-col justify-between"
        style={{ backgroundColor: talk.trackColor.bg }}
      >
        <div>
          {/* Talk Title */}
          <h2 className="font-display text-xl sm:text-2xl md:text-[1.75rem] lg:text-[1.85rem] font-bold tracking-tight text-[#06151a] leading-tight lowercase">
            {talk.title}
          </h2>

          {/* Speaker & Company */}
          <div className="mt-2 text-xs sm:text-sm font-mono tracking-wider font-semibold text-[#06151a]/90 uppercase">
            <span>{talk.speaker}</span>
            <span className="mx-2 text-[#06151a]/60">{'//'}</span>
            <span>{talk.company}</span>
          </div>

          {/* Collapsible Content */}
          {isExpanded && (
            <div className="mt-4 pt-1 animate-in fade-in duration-200">
              <p className="text-xs sm:text-sm font-mono text-[#06151a]/85 leading-relaxed max-w-3xl">
                {talk.description}
              </p>

              <div className="mt-3 text-xs font-mono font-bold tracking-wide text-[#06151a]">
                LOCATION: {talk.location}
              </div>
            </div>
          )}
        </div>

        {/* Toggle Details Action */}
        <div className="mt-4 pt-1">
          <button
            type="button"
            onClick={onToggleExpand}
            className="inline-flex items-center text-xs font-mono font-bold tracking-wider text-[#06151a] hover:opacity-70 transition-opacity focus:outline-none cursor-pointer"
            aria-expanded={isExpanded}
          >
            {isExpanded ? '— HIDE DETAILS' : '+ SHOW DETAILS'}
          </button>
        </div>
      </div>

      {/* DESKTOP & TABLET: Right Ticket Stub (Vertical) */}
      <div
        className="hidden md:flex w-32 sm:w-36 lg:w-44 shrink-0 border-l border-dashed border-[#06151a]/30 p-4 sm:p-5 lg:p-6 flex-col justify-between items-center text-center select-none"
        style={{ backgroundColor: talk.trackColor.bg }}
      >
        {/* Times */}
        <div className="flex flex-col items-center">
          <span className="text-lg sm:text-xl lg:text-2xl font-bold font-mono text-[#06151a] tracking-tight">
            {talk.timeStart}
          </span>
          <span className="text-xs font-mono text-[#06151a]/70 font-medium">
            {talk.timeEnd}
          </span>
        </div>

        {/* Barcode graphic */}
        <div className="my-3 flex items-center justify-center">
          <Barcode className="h-8 lg:h-9" />
        </div>

        {/* Bookmark Star Button */}
        <button
          type="button"
          onClick={onToggleSave}
          title={isSaved ? 'Remove from My Schedule' : 'Add to My Schedule'}
          aria-label={isSaved ? 'Remove from My Schedule' : 'Add to My Schedule'}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
            isSaved
              ? 'bg-[#06151a] text-white border-[#06151a] shadow-sm'
              : 'border-[#06151a]/40 text-[#06151a] hover:bg-[#06151a]/15 hover:border-[#06151a]'
          }`}
        >
          <Star
            size={16}
            className={isSaved ? 'fill-current text-white' : 'text-[#06151a]'}
          />
        </button>
      </div>

      {/* MOBILE-ONLY: Bottom Ticket Stub (Horizontal) */}
      <div
        className="flex md:hidden border-t border-dashed border-[#06151a]/30 px-5 py-3.5 items-center justify-between select-none"
        style={{ backgroundColor: talk.trackColor.bg }}
      >
        {/* Times */}
        <div className="flex flex-col">
          <span className="text-base sm:text-lg font-bold font-mono text-[#06151a] tracking-tight">
            {talk.timeStart}
          </span>
          <span className="text-[11px] font-mono text-[#06151a]/70 font-medium">
            {talk.timeEnd}
          </span>
        </div>

        {/* Barcode graphic */}
        <div className="flex items-center justify-center px-2">
          <Barcode className="h-7" />
        </div>

        {/* Bookmark Star Button */}
        <button
          type="button"
          onClick={onToggleSave}
          title={isSaved ? 'Remove from My Schedule' : 'Add to My Schedule'}
          aria-label={isSaved ? 'Remove from My Schedule' : 'Add to My Schedule'}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
            isSaved
              ? 'bg-[#06151a] text-white border-[#06151a]'
              : 'border-[#06151a]/40 text-[#06151a] hover:bg-[#06151a]/15'
          }`}
        >
          <Star
            size={16}
            className={isSaved ? 'fill-current text-white' : 'text-[#06151a]'}
          />
        </button>
      </div>
    </article>
  );
};
