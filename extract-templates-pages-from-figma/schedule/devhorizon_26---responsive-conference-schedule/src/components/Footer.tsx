import React from 'react';

interface FooterProps {
  onSelectTrack: (track: string) => void;
  onSelectNav: (nav: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTrack, onSelectNav }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 sm:mt-24 border-t border-[#0d2a32] bg-[#030e12] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <h2 className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[#c8f535]">
              DEVHORIZON_26
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#7e9ba3] leading-relaxed max-w-xs">
              A three-day conference for engineers who build the interfaces humans use every day.
            </p>
          </div>

          {/* Column 2: Navigate */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs sm:text-sm font-semibold text-[#c8f535] tracking-wider uppercase">
              {'// NAVIGATE'}
            </h3>
            <ul className="space-y-2 font-mono text-xs sm:text-sm text-[#8ea7af]">
              <li>
                <button
                  onClick={() => onSelectNav('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNav('schedule')}
                  className="hover:text-white transition-colors cursor-pointer text-[#c8f535]"
                >
                  Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNav('speakers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Speakers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Tracks */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs sm:text-sm font-semibold text-[#c8f535] tracking-wider uppercase">
              {'// TRACKS'}
            </h3>
            <ul className="space-y-2 font-mono text-xs sm:text-sm text-[#8ea7af]">
              <li>
                <button
                  onClick={() => onSelectTrack('FRONTEND')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Frontend
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTrack('PERFORMANCE')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Performance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTrack('ACCESSIBILITY')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Accessibility
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTrack('TOOLING')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tooling
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Venue */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs sm:text-sm font-semibold text-[#c8f535] tracking-wider uppercase">
              {'// VENUE'}
            </h3>
            <div className="space-y-1 font-mono text-xs sm:text-sm text-[#8ea7af] leading-relaxed">
              <p>Pier 70</p>
              <p>San Francisco, CA</p>
              <p className="text-[#a4c0c8]">Nov 15–17, 2026</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#0d2a32] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] sm:text-xs text-[#5f7a83]">
          <div>
            &copy; 2026 DEVHORIZON. ALL RIGHTS RESERVED.
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="hover:text-[#c8f535] transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            BACK TO TOP &uarr;
          </button>
        </div>
      </div>
    </footer>
  );
};
