import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  savedCount: number;
  onOpenMySchedule: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  savedCount,
  onOpenMySchedule,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'HOME' },
    { id: 'schedule', label: 'SCHEDULE' },
    { id: 'speakers', label: 'SPEAKERS' },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-[#0d272f] bg-[#05161c]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#top"
          className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-[#c8f535] hover:opacity-90 transition-opacity whitespace-nowrap select-none"
        >
          DEVHORIZON_26
        </a>

        {/* Desktop & Tablet Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-1.5 text-xs font-mono tracking-widest transition-all duration-150 uppercase border ${
                  isActive
                    ? 'border-[#c8f535] text-[#c8f535] bg-[#c8f535]/5 shadow-[0_0_12px_rgba(200,245,53,0.15)] font-semibold'
                    : 'border-[#143d46] text-[#8ea7af] hover:text-white hover:border-[#276575] bg-[#071d24]/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {savedCount > 0 && (
            <button
              onClick={onOpenMySchedule}
              className="ml-2 px-3 py-1.5 text-xs font-mono tracking-wider text-[#c8f535] border border-dashed border-[#c8f535]/80 hover:bg-[#c8f535]/10 transition-colors flex items-center gap-1.5"
              title="View your saved schedule"
            >
              <span>★</span>
              <span>SAVED ({savedCount})</span>
            </button>
          )}
        </nav>

        {/* Mobile Hamburger Toggle Button (Matches Mobile Mockup) */}
        <div className="flex md:hidden items-center gap-2">
          {savedCount > 0 && (
            <button
              onClick={onOpenMySchedule}
              className="px-2 py-1 text-xs font-mono text-[#c8f535] border border-dashed border-[#c8f535] flex items-center gap-1"
            >
              <span>★</span>
              <span>{savedCount}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 border border-[#143d46] bg-[#071d24]/60 text-[#b3d4dc] hover:text-[#c8f535] hover:border-[#c8f535] flex items-center justify-center transition-colors focus:outline-none focus:ring-1 focus:ring-[#c8f535]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#0d272f] bg-[#05161c] px-4 py-4 space-y-2 animate-in fade-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 text-xs font-mono tracking-widest uppercase border transition-colors ${
                  isActive
                    ? 'border-[#c8f535] text-[#c8f535] bg-[#c8f535]/10 font-bold'
                    : 'border-[#143d46] text-[#8ea7af] hover:text-white hover:border-[#276575]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
