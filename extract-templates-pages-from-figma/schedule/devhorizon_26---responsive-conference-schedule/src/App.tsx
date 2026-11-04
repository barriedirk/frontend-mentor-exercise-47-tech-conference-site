/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { SCHEDULE_DATA } from './data/scheduleData.ts';
import { TrackType } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { ScheduleCard } from './components/ScheduleCard.tsx';
import { Footer } from './components/Footer.tsx';
import { BreakpointInspector, ViewportMode } from './components/BreakpointInspector.tsx';
import { PureCodeModal } from './components/PureCodeModal.tsx';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export default function App() {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedTrack, setSelectedTrack] = useState<TrackType | 'ALL'>('ALL');
  const [showOnlySaved, setShowOnlySaved] = useState<boolean>(false);
  const [isPureCodeModalOpen, setIsPureCodeModalOpen] = useState<boolean>(false);
  
  // Talk 1 is expanded by default (matching the user's desktop & mobile screenshot)
  const [expandedTalkIds, setExpandedTalkIds] = useState<Set<string>>(new Set(['talk-1']));
  
  // Bookmarked talks (saved in state & localStorage)
  const [savedTalkIds, setSavedTalkIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('devhorizon_saved_talks');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [currentNav, setCurrentNav] = useState<string>('schedule');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('responsive');
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Monitor window resize to show accurate live breakpoint tag
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeBreakpointLabel = useMemo(() => {
    if (viewportMode === 'desktop') return 'Desktop (≥ 1024px)';
    if (viewportMode === 'tablet') return 'Tablet (768px – 1023px)';
    if (viewportMode === 'mobile') return 'Mobile (< 768px)';

    if (windowWidth >= 1024) return `Desktop (${windowWidth}px ≥ 1024px)`;
    if (windowWidth >= 768) return `Tablet (${windowWidth}px: 768px – 1023px)`;
    return `Mobile (${windowWidth}px < 768px)`;
  }, [viewportMode, windowWidth]);

  // Persist bookmarks
  const toggleSaveTalk = (id: string) => {
    setSavedTalkIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('devhorizon_saved_talks', JSON.stringify(Array.from(next)));
      } catch {
        // ignore storage error
      }
      return next;
    });
  };

  const toggleExpandTalk = (id: string) => {
    setExpandedTalkIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClearFilters = () => {
    setSelectedTrack('ALL');
    setShowOnlySaved(false);
  };

  const hasActiveFilters = selectedTrack !== 'ALL' || showOnlySaved;

  // Filter talks by day, track and bookmark state
  const displayedTalks = useMemo(() => {
    return SCHEDULE_DATA.filter((talk) => {
      if (talk.day !== selectedDay) return false;
      if (showOnlySaved && !savedTalkIds.has(talk.id)) return false;
      if (selectedTrack !== 'ALL' && talk.track !== selectedTrack) return false;
      return true;
    });
  }, [selectedDay, selectedTrack, showOnlySaved, savedTalkIds]);

  const allExpanded = displayedTalks.length > 0 && displayedTalks.every((t) => expandedTalkIds.has(t.id));

  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpandedTalkIds(new Set());
    } else {
      setExpandedTalkIds(new Set(displayedTalks.map((t) => t.id)));
    }
  };

  return (
    <div className="min-h-screen bg-[#041318] text-slate-100 flex flex-col font-sans" id="top">
      {/* Interactive Breakpoint & Viewport Simulator Bar */}
      <BreakpointInspector
        currentMode={viewportMode}
        onModeChange={setViewportMode}
        activeBreakpointLabel={activeBreakpointLabel}
        onOpenPureCode={() => setIsPureCodeModalOpen(true)}
      />

      {/* Pure HTML & CSS Modal Viewer / Downloader */}
      <PureCodeModal
        isOpen={isPureCodeModalOpen}
        onClose={() => setIsPureCodeModalOpen(false)}
      />

      {/* Viewport Simulation Wrapper */}
      <div
        className={`mx-auto w-full transition-all duration-300 ${
          viewportMode === 'mobile'
            ? 'max-w-[390px] my-4 shadow-2xl border border-[#143d46] rounded-xl overflow-hidden bg-[#041318]'
            : viewportMode === 'tablet'
            ? 'max-w-[768px] my-4 shadow-2xl border border-[#143d46] rounded-xl overflow-hidden bg-[#041318]'
            : viewportMode === 'desktop'
            ? 'max-w-[1240px] my-4 shadow-2xl border border-[#143d46] rounded-none bg-[#041318]'
            : 'max-w-none'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          currentTab={currentNav}
          onTabChange={(tab) => {
            setCurrentNav(tab);
            if (tab === 'schedule') {
              setShowOnlySaved(false);
            }
          }}
          savedCount={savedTalkIds.size}
          onOpenMySchedule={() => {
            setCurrentNav('schedule');
            setShowOnlySaved(true);
          }}
        />

        {/* Home Tab Overlay if user clicks HOME */}
        {currentNav === 'home' && (
          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8 font-mono">
            <div className="border border-[#143d46] bg-[#06191f] p-8 space-y-4">
              <span className="text-xs text-[#c8f535] font-bold tracking-widest uppercase">
                // WELCOME TO DEVHORIZON 2026
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white lowercase">
                where interface architects meet the future of web runtime
              </h1>
              <p className="text-sm text-[#8ea7af] leading-relaxed max-w-2xl">
                Join 1,200 frontend engineers, platform architects, and UI systems designers at Pier 70 in San Francisco for 3 days of deep-dive keynotes, hands-on masterclasses, and production war stories.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => setCurrentNav('schedule')}
                  className="px-6 py-2.5 bg-[#c8f535] text-[#041318] font-bold text-xs tracking-wider uppercase hover:bg-[#b5e024] transition-colors"
                >
                  View Conference Schedule &rarr;
                </button>
              </div>
            </div>
          </main>
        )}

        {/* Speakers Tab Overlay if user clicks SPEAKERS */}
        {currentNav === 'speakers' && (
          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8 font-mono">
            <div className="flex items-center justify-between border-b border-[#143d46] pb-4">
              <h1 className="font-display text-3xl font-bold text-[#c8f535]">{'// featured speakers'}</h1>
              <button
                onClick={() => setCurrentNav('schedule')}
                className="text-xs text-[#8ea7af] hover:text-[#c8f535] border border-[#143d46] px-3 py-1.5"
              >
                &larr; Back to Schedule
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(new Set(SCHEDULE_DATA.map((t) => `${t.speaker}|${t.company}`))).map((speakerKey) => {
                const [name, company] = speakerKey.split('|');
                const talksBySpeaker = SCHEDULE_DATA.filter((t) => t.speaker === name);
                return (
                  <div key={speakerKey} className="border border-[#143d46] bg-[#06191f] p-5 space-y-3">
                    <div className="w-10 h-10 rounded-full bg-[#0d2a32] border border-[#1e4854] flex items-center justify-center text-[#c8f535] font-bold text-sm">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-bold text-white text-sm tracking-wide">{name}</h2>
                      <p className="text-xs text-[#8ea7af]">{company}</p>
                    </div>
                    <div className="pt-2 border-t border-[#143d46]/50">
                      <p className="text-[11px] text-[#c8f535]/80 lowercase line-clamp-1">
                        &quot;{talksBySpeaker[0]?.title}&quot;
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        )}

        {/* Main Schedule Content (Matches user mockups) */}
        {currentNav === 'schedule' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 flex-1">
            {/* Filter and Category Section */}
            <FilterBar
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              selectedTrack={selectedTrack}
              onSelectTrack={setSelectedTrack}
              showOnlySaved={showOnlySaved}
              onToggleSaved={() => setShowOnlySaved(!showOnlySaved)}
              savedCount={savedTalkIds.size}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Quick Actions (Count & Expand/Collapse All) */}
            <div className="flex items-center justify-between text-xs font-mono text-[#7e9ba3] pt-1">
              <div>
                <span>Showing {displayedTalks.length} {displayedTalks.length === 1 ? 'session' : 'sessions'}</span>
                {showOnlySaved && <span className="text-[#c8f535] ml-2">(My Schedule)</span>}
                {selectedTrack !== 'ALL' && <span className="text-[#c8f535] ml-2">[{selectedTrack}]</span>}
              </div>

              {displayedTalks.length > 0 && (
                <button
                  type="button"
                  onClick={toggleExpandAll}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  {allExpanded ? (
                    <>
                      <ChevronUp size={14} />
                      <span>COLLAPSE ALL</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} />
                      <span>EXPAND ALL</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Schedule Cards List */}
            {displayedTalks.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {displayedTalks.map((talk) => (
                  <ScheduleCard
                    key={talk.id}
                    talk={talk}
                    isExpanded={expandedTalkIds.has(talk.id)}
                    onToggleExpand={() => toggleExpandTalk(talk.id)}
                    isSaved={savedTalkIds.has(talk.id)}
                    onToggleSave={() => toggleSaveTalk(talk.id)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="border border-[#143d46] bg-[#06191f] p-10 text-center space-y-4 font-mono">
                <Calendar className="mx-auto text-[#c8f535]/60" size={36} />
                <h3 className="text-base text-white font-semibold">No sessions match your filter</h3>
                <p className="text-xs text-[#8ea7af] max-w-sm mx-auto">
                  {showOnlySaved
                    ? "You haven't bookmarked any sessions for this day yet. Click the star icon on any talk to save it here."
                    : 'Try clearing your category filter or selecting another conference day.'}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-[#c8f535] text-[#041318] font-bold text-xs uppercase tracking-wider hover:bg-[#b8e225] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </main>
        )}

        {/* Footer */}
        <Footer
          onSelectTrack={(track) => {
            setCurrentNav('schedule');
            setSelectedTrack(track as TrackType);
            setShowOnlySaved(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectNav={(nav) => {
            setCurrentNav(nav);
            if (nav === 'schedule') {
              setShowOnlySaved(false);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    </div>
  );
}
