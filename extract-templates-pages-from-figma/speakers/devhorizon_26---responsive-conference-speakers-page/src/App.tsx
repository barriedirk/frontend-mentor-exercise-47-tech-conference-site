/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Maximize2, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  ArrowUp,
  Calendar,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';

interface Speaker {
  id: number;
  name: string;
  role: string;
  talk: string;
  image: string;
  track: 'Frontend' | 'Performance' | 'Accessibility' | 'Tooling';
  time: string;
  room: string;
  bio: string;
  abstract: string;
}

const SPEAKERS: Speaker[] = [
  {
    id: 1,
    name: "elena vasquez",
    role: "PRINCIPAL FRONTEND ENGINEER @ BYTECRAFT",
    talk: "THE NEXT FRONTIER OF WEB DEVELOPMENT",
    image: "/speakers/speaker-1.jpg",
    track: "Frontend",
    time: "Day 1 · 09:30 AM",
    room: "Stage Alpha (Pier 70 Main)",
    bio: "Elena leads the UI architecture group at Bytecraft, focusing on next-generation web platforms, microfrontends, and standards-compliant component primitives.",
    abstract: "An exploration into the coming seismic shifts in web client runtimes, including baseline standards, native WebAssembly integration, and the evolution of DOM APIs."
  },
  {
    id: 2,
    name: "aisha patel",
    role: "WEB PERFORMANCE LEAD @EDGEVANE",
    talk: "ELIMINATING LAYOUT SHIFT ONCE AND FOR ALL",
    image: "/speakers/speaker-2.jpg",
    track: "Performance",
    time: "Day 1 · 11:00 AM",
    room: "Stage Beta",
    bio: "Aisha specializes in browser rendering metrics, Core Web Vitals optimization, and real-user monitoring at global edge scale.",
    abstract: "Deep architectural patterns to eradicate Cumulative Layout Shift (CLS) in high-churn single page apps and dynamic content streams."
  },
  {
    id: 3,
    name: "naomi tanaka",
    role: "ACCESSIBILITY ENGINEERING LEAD @AXION",
    talk: "SCREEN READERS DESERVE BETTER COMPONENTS",
    image: "/speakers/speaker-3.jpg",
    track: "Accessibility",
    time: "Day 1 · 01:30 PM",
    room: "Stage Gamma",
    bio: "Naomi is an internationally recognized digital accessibility champion, leading inclusive design and assistive technology initiatives at Axion.",
    abstract: "How modern custom elements break accessibility trees, and pragmatic design engineering to deliver first-class screen reader user experiences."
  },
  {
    id: 4,
    name: "james okonkwo",
    role: "ENGINEERING DIRECTOR @ CARTWELL",
    talk: "MONOREPOS AT SCALE: LESSONS FROM 500 PACKAGES",
    image: "/speakers/speaker-4.jpg",
    track: "Tooling",
    time: "Day 1 · 03:00 PM",
    room: "Stage Alpha (Pier 70 Main)",
    bio: "James manages developer productivity and monorepo tooling infrastructure across Cartwell's distributed engineering organization.",
    abstract: "Scaling caching, dependency graphs, remote build execution, and CI pipeline throughput across half a thousand synchronized internal packages."
  },
  {
    id: 5,
    name: "sarah lindström",
    role: "DESIGN SYSTEMS LEAD @TESSERA",
    talk: "TYPE-SAFE DESIGN TOKENS ACROSS PLATFORMS",
    image: "/speakers/speaker-5.jpg",
    track: "Frontend",
    time: "Day 1 · 04:30 PM",
    room: "Stage Beta",
    bio: "Sarah spearheads multi-brand design token pipelines at Tessera, connecting Figma variables to typed React and native components.",
    abstract: "Bridging the designer-developer gulf using compiler-enforced design tokens with zero runtime overhead."
  },
  {
    id: 6,
    name: "devon park",
    role: "FRONTEND ARCHITECT @ LUMINARY",
    talk: "STREAMING SERVER COMPONENTS FOR INSTANT PAGES",
    image: "/speakers/speaker-6.jpg",
    track: "Performance",
    time: "Day 2 · 09:30 AM",
    room: "Stage Alpha (Pier 70 Main)",
    bio: "Devon architectures high-concurrency client-server rendering layers for Luminary's real-time publication systems.",
    abstract: "Selective hydration, progressive chunk streaming, and avoiding waterfall latencies on complex content surfaces."
  },
  {
    id: 7,
    name: "bertram gilfoyle",
    role: "SYSTEMS ARCHITECT @ PIED PIPER",
    talk: "TEACHING MACHINES TO WRITE CODE: BUILDING SON OF ANTON",
    image: "/speakers/speaker-7.jpg",
    track: "Tooling",
    time: "Day 2 · 11:00 AM",
    room: "Stage Alpha (Pier 70 Main)",
    bio: "Bertram architected backend network topology, server clusters, and decentralized compression engines for Pied Piper.",
    abstract: "Autonomous agents, server security paranoia, middle-out compiler optimizations, and what happens when the build system begins negotiating."
  },
  {
    id: 8,
    name: "priya sharma",
    role: "SENIOR DEVELOPER ADVOCATE @ COBALT",
    talk: "ARIA PATTERNS YOU'RE PROBABLY USING WRONG",
    image: "/speakers/speaker-8.jpg",
    track: "Accessibility",
    time: "Day 2 · 01:30 PM",
    room: "Stage Gamma",
    bio: "Priya teaches accessible frontend architecture and audits web applications for enterprise WCAG 2.2 AA/AAA compliance.",
    abstract: "Dissecting the top 10 most misused ARIA attributes that actually hurt accessibility, and what semantic HTML alternatives to use instead."
  },
  {
    id: 9,
    name: "lucas moreau",
    role: "SENIOR FRONTEND ENGINEER @ WEBSMITH",
    talk: "BROWSER DEVTOOLS: HIDDEN GEMS FOR CSS DEBUGGING",
    image: "/speakers/speaker-9.jpg",
    track: "Tooling",
    time: "Day 2 · 03:00 PM",
    room: "Stage Beta",
    bio: "Lucas builds developer extensions and modern layout diagnostics at Websmith.",
    abstract: "Unlocking browser inspect panel capabilities: scroll-driven timeline scrubbers, container query inspectors, and subgrid debuggers."
  },
  {
    id: 10,
    name: "marcus chen",
    role: "STAFF UI ENGINEER @ NIMBUS",
    talk: "REACT SERVER COMPONENTS: A PRACTICAL DEEP DIVE",
    image: "/speakers/speaker-10.jpg",
    track: "Frontend",
    time: "Day 2 · 04:30 PM",
    room: "Stage Alpha (Pier 70 Main)",
    bio: "Marcus focuses on the intersection of React compilers, async primitives, and server boundary isolation.",
    abstract: "Practical patterns and mental models for structuring React Server Component trees in production enterprise applications."
  },
  {
    id: 11,
    name: "ryan o'sullivan",
    role: "DEVTOOLS ENGINEER @ COBALT",
    talk: "PROFILING REACT RENDERS AT 120FPS",
    image: "/speakers/speaker-11.jpg",
    track: "Performance",
    time: "Day 3 · 09:30 AM",
    room: "Stage Beta",
    bio: "Ryan develops telemetry profilers and low-overhead memory tracing tools for rich web applications.",
    abstract: "Eliminating micro-stutter, GC pauses, and expensive unmemoized reconciliation passes in high-frequency interactive canvas apps."
  },
  {
    id: 12,
    name: "fatima al-rashid",
    role: "SENIOR UI ENGINEER @ SPECTRA",
    talk: "DESIGNING ACCESSIBLE AUDIO EXPERIENCES",
    image: "/speakers/speaker-12.jpg",
    track: "Accessibility",
    time: "Day 3 · 11:00 AM",
    room: "Stage Gamma",
    bio: "Fatima pioneers spatial audio interfaces and accessible multimedia players at Spectra.",
    abstract: "Harmonizing visual, auditory, and haptic feedback loops to create universal media experiences for all ability spectrums."
  },
  {
    id: 13,
    name: "tom kowalski",
    role: "PLATFORM ENGINEER @ NIMBUS",
    talk: "DEPLOY PREVIEW ENVIRONMENTS THAT SCALE",
    image: "/speakers/speaker-13.jpg",
    track: "Tooling",
    time: "Day 3 · 01:30 PM",
    room: "Stage Alpha (Pier 70 Main)",
    bio: "Tom engineers ephemeral cloud infrastructure and staging orchestrators for Nimbus.",
    abstract: "Spinning up isolated full-stack branch previews in sub-30 seconds with database cloning and synthetic seed fixtures."
  },
  {
    id: 14,
    name: "mei-lin zhang",
    role: "STAFF ENGINEER @ ROAMLY",
    talk: "CSS CONTAINER QUERIES IN PRODUCTION",
    image: "/speakers/speaker-14.jpg",
    track: "Frontend",
    time: "Day 3 · 03:00 PM",
    room: "Stage Beta",
    bio: "Mei-Lin is an author and speaker specializing in fluid layout systems, CSS modern standards, and container context styling.",
    abstract: "Moving beyond viewport media queries to component-driven container query architectures that fit any slot."
  },
  {
    id: 15,
    name: "dinesh chugtai",
    role: "SENIOR FRONTEND ENGINEER @ PIED PIPER",
    talk: "VIDEO COMPRESSION FOR THE WEB: THE MIDDLE-OUT APPROACH",
    image: "/speakers/speaker-15.jpg",
    track: "Performance",
    time: "Day 3 · 04:30 PM",
    room: "Stage Alpha (Pier 70 Main)",
    bio: "Dinesh was the first frontend engineer hired at Pied Piper, maintaining video streaming clients across all client devices.",
    abstract: "Lossless video codec delivery over cellular connections using middle-out compression algorithms."
  },
  {
    id: 16,
    name: "carlos rivera",
    role: "CORE TEAM MEMBER @ BLAZE",
    talk: "INSIDE A MODERN BUNDLER: AN ARCHITECTURAL DEEP DIVE",
    image: "/speakers/speaker-16.jpg",
    track: "Tooling",
    time: "Day 3 · 05:30 PM",
    room: "Stage Alpha (Pier 70 Main)",
    bio: "Carlos is a core contributor to high-speed Rust-based bundlers and source map compilers.",
    abstract: "AST parsing, tree shaking, incremental HMR graphs, and multi-threaded linkers explained from first principles."
  },
  {
    id: 17,
    name: "hannah bergström",
    role: "UX ENGINEER @ PAYPATH",
    talk: "ACCESSIBLE PAYMENT FORMS THAT CONVERT",
    image: "/speakers/speaker-17.jpg",
    track: "Accessibility",
    time: "Day 3 · 06:15 PM",
    room: "Stage Gamma",
    bio: "Hannah designs frictionless checkout experiences and accessible banking UI primitives at Paypath.",
    abstract: "Balancing strict accessibility compliance with conversion rate optimization across credit card inputs and assistive inputs."
  },
  {
    id: 18,
    name: "kwame asante",
    role: "ENGINEERING MANAGER @ TRACKWISE",
    talk: "AI-POWERED DEVELOPER TOOLS: HYPE VS. REALITY",
    image: "/speakers/speaker-18.jpg",
    track: "Tooling",
    time: "Day 2 · 05:30 PM",
    room: "Stage Beta",
    bio: "Kwame oversees developer platform engineering and code synthesis telemetry at Trackwise.",
    abstract: "Measuring actual developer velocity gains, hallucinations, security audits, and code review burdens with AI tools in large codebases."
  },
  {
    id: 19,
    name: "julia petrov",
    role: "RUNTIME ENGINEER @ DAWN",
    talk: "SERVER-SIDE RENDERING WITHOUT THE FRAMEWORK",
    image: "/speakers/speaker-19.jpg",
    track: "Frontend",
    time: "Day 1 · 05:30 PM",
    room: "Stage Beta",
    bio: "Julia designs lightweight JavaScript runtimes, edge streaming engines, and minimal templating compilers.",
    abstract: "Constructing blazing-fast server-rendered web applications with zero runtime dependencies and pure web standards."
  },
  {
    id: 20,
    name: "oliver chang",
    role: "PRINCIPAL ARCHITECT @ CRESTLINE",
    talk: "WEB PERFORMANCE AT BILLION-USER SCALE",
    image: "/speakers/speaker-20.jpg",
    track: "Performance",
    time: "Day 2 · 06:15 PM",
    room: "Stage Alpha (Pier 70 Main)",
    bio: "Oliver architects distributed frontend caching layers, asset pipelines, and global CDN routing for Crestline.",
    abstract: "Lessons learned optimizing web experiences across emerging market devices, spotty connectivity, and extreme global distribution."
  }
];

type BreakpointMode = 'fluid' | 'desktop' | 'tablet' | 'mobile';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'schedule' | 'speakers'>('speakers');
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [breakpointMode, setBreakpointMode] = useState<BreakpointMode>('fluid');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeTab, setCodeTab] = useState<'html' | 'css'>('html');
  const [copied, setCopied] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => {
      setCurrentWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getContainerWidthStyle = () => {
    switch (breakpointMode) {
      case 'desktop':
        return 'max-w-[1440px] shadow-2xl ring-1 ring-[#183e4e]';
      case 'tablet':
        return 'max-w-[768px] shadow-2xl ring-1 ring-[#183e4e]';
      case 'mobile':
        return 'max-w-[390px] shadow-2xl ring-1 ring-[#183e4e]';
      case 'fluid':
      default:
        return 'w-full';
    }
  };

  const pureHtmlCode = `<!-- DEVHORIZON_26 Responsive Speakers Page (Pure HTML) -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DEVHORIZON_26 // Speakers</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Header -->
  <header class="site-header">
    <div class="container header-content">
      <a href="#" class="brand-logo">DEVHORIZON_26</a>
      <nav class="nav-links">
        <a href="#home" class="nav-btn">HOME</a>
        <a href="#schedule" class="nav-btn">SCHEDULE</a>
        <a href="#speakers" class="nav-btn active">SPEAKERS</a>
      </nav>
      <button class="mobile-menu-btn" aria-label="Toggle Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <!-- Speakers Section -->
  <main class="speakers-section">
    <div class="container">
      <h1 class="section-heading">// speakers</h1>
      
      <!-- Responsive Grid: 1 col (mobile) -> 2 cols (tablet) -> 4 cols (desktop) -->
      <div class="speakers-grid">
        <!-- 20 Speaker Cards -->
        <article class="speaker-card">
          <div class="card-image-wrap">
            <img src="./speakers/speaker-1.jpg" alt="Elena Vasquez" class="card-image">
          </div>
          <div class="card-body">
            <div class="card-top">
              <h2 class="speaker-name">elena vasquez</h2>
              <p class="speaker-role">PRINCIPAL FRONTEND ENGINEER @ BYTECRAFT</p>
            </div>
            <div class="card-talk">
              <p class="talk-title">THE NEXT FRONTIER OF WEB DEVELOPMENT</p>
            </div>
          </div>
        </article>
        <!-- (repeat for remaining 19 speakers) -->
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="#" class="footer-logo">DEVHORIZON_26</a>
          <p class="footer-desc">A three-day conference for engineers who build the interfaces humans use every day.</p>
        </div>
        <div class="footer-links-group">
          <div>
            <h3 class="footer-col-title">// NAVIGATE</h3>
            <ul class="footer-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#schedule">Schedule</a></li>
              <li><a href="#speakers">Speakers</a></li>
            </ul>
          </div>
          <div>
            <h3 class="footer-col-title">// TRACKS</h3>
            <ul class="footer-list">
              <li><a href="#frontend">Frontend</a></li>
              <li><a href="#performance">Performance</a></li>
              <li><a href="#accessibility">Accessibility</a></li>
              <li><a href="#tooling">Tooling</a></li>
            </ul>
          </div>
          <div>
            <h3 class="footer-col-title">// VENUE</h3>
            <ul class="footer-list">
              <li>Pier 70</li>
              <li>San Francisco, CA</li>
              <li>Nov 15-17, 2026</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="copyright">© 2026 DEVHORIZON. ALL RIGHTS RESERVED.</p>
        <a href="#" class="back-to-top">BACK TO TOP ↑</a>
      </div>
    </div>
  </footer>
</body>
</html>`;

  const pureCssCode = `/* Pure CSS Responsive Breakpoints */
:root {
  --bg: #00151d;
  --card-bg: #001a24;
  --border: #123948;
  --border-subtle: #0d2a36;
  --lime: #d2f936;
  --text: #ffffff;
  --muted: #8fa6af;
}

/* 1. Mobile First: 1 columna (< 768px) */
.speakers-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

/* 2. Breakpoint Tablet: 2 columnas (768px a 1199px) */
@media (min-width: 768px) {
  .speakers-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 3. Breakpoint Desktop: 4 columnas (>= 1200px) */
@media (min-width: 1200px) {
  .speakers-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Card Styling */
.speaker-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.speaker-card:hover {
  border-color: var(--lime);
  transform: translateY(-2px);
}

.card-image-wrap {
  width: 100%;
  aspect-ratio: 632 / 496;
  border-bottom: 1px solid var(--border);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  padding: 20px 22px 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.speaker-name {
  color: var(--text);
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 6px;
}

.speaker-role {
  color: var(--muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  font-family: monospace;
}

.card-talk {
  border-top: 1px solid var(--border-subtle);
  padding-top: 14px;
  margin-top: 20px;
}

.talk-title {
  color: var(--lime);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  font-family: monospace;
}`;

  const copyCode = () => {
    const code = codeTab === 'html' ? pureHtmlCode : pureCssCode;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#001017] text-white flex flex-col font-sans">
      {/* Top Testing & Control Bar */}
      <aside aria-label="Responsive testing controls" className="bg-[#001822] border-b border-[#133948] sticky top-0 z-50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-[#d2f936] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#d2f936] animate-pulse"></span>
            Breakpoints:
          </span>
          <div className="flex items-center bg-[#00121a] p-0.5 border border-[#133948]">
            <button 
              onClick={() => setBreakpointMode('fluid')}
              className={`px-2.5 py-1 flex items-center gap-1.5 transition-colors ${breakpointMode === 'fluid' ? 'bg-[#d2f936] text-black font-bold' : 'text-[#8ea5af] hover:text-white'}`}
              title="Fluid responsive to actual screen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fluid</span>
            </button>
            <button 
              onClick={() => setBreakpointMode('desktop')}
              className={`px-2.5 py-1 flex items-center gap-1.5 transition-colors ${breakpointMode === 'desktop' ? 'bg-[#d2f936] text-black font-bold' : 'text-[#8ea5af] hover:text-white'}`}
              title="Force Desktop Breakpoint (1440px · 4 columns)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop (4 cols)</span>
            </button>
            <button 
              onClick={() => setBreakpointMode('tablet')}
              className={`px-2.5 py-1 flex items-center gap-1.5 transition-colors ${breakpointMode === 'tablet' ? 'bg-[#d2f936] text-black font-bold' : 'text-[#8ea5af] hover:text-white'}`}
              title="Force Tablet Breakpoint (768px · 2 columns)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet (2 cols)</span>
            </button>
            <button 
              onClick={() => setBreakpointMode('mobile')}
              className={`px-2.5 py-1 flex items-center gap-1.5 transition-colors ${breakpointMode === 'mobile' ? 'bg-[#d2f936] text-black font-bold' : 'text-[#8ea5af] hover:text-white'}`}
              title="Force Mobile Breakpoint (390px · 1 column)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (1 col)</span>
            </button>
          </div>
          <span className="hidden lg:inline text-[#65818d]">
            Viewport: {breakpointMode === 'fluid' ? `${currentWidth}px` : breakpointMode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCodeModal(true)}
            className="px-3 py-1 bg-[#092b38] hover:bg-[#0f3d4f] text-[#d2f936] border border-[#184e63] flex items-center gap-1.5 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código HTML & CSS</span>
          </button>
          <a
            href="/export/index.html"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 bg-[#133948] hover:bg-[#1a4a5e] text-white flex items-center gap-1.5 transition-colors"
            title="Open standalone pure HTML file in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Standalone</span>
          </a>
        </div>
      </aside>

      {/* Main Responsive Canvas Wrapper (Supports Simulator Mode) */}
      <div className={`flex-1 mx-auto transition-all duration-300 ${getContainerWidthStyle()} bg-[#00151d]`}>
        
        {/* Navigation Bar */}
        <header className="border-b border-[#123948] py-5 px-5 md:px-10 lg:px-12 bg-[#00151d] sticky top-[41px] z-40 transition-colors">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <a 
              href="#speakers" 
              className="text-[#d2f936] font-mono font-bold text-lg md:text-xl tracking-wider select-none hover:opacity-90"
            >
              DEVHORIZON_26
            </a>

            {/* Desktop & Tablet Navigation */}
            <nav className={`${
              breakpointMode === 'mobile' 
                ? 'hidden' 
                : breakpointMode === 'tablet' || breakpointMode === 'desktop' 
                  ? 'flex' 
                  : 'hidden md:flex'
            } items-center gap-3 font-mono text-xs`}>
              <button 
                onClick={() => setActiveTab('home')}
                className={`px-5 py-2 border transition-all duration-150 uppercase tracking-wider font-semibold ${
                  activeTab === 'home' 
                    ? 'border-[#d2f936] text-[#d2f936]' 
                    : 'border-[#123948] text-white hover:border-[#8ea5af]'
                }`}
              >
                HOME
              </button>
              <button 
                onClick={() => setActiveTab('schedule')}
                className={`px-5 py-2 border transition-all duration-150 uppercase tracking-wider font-semibold ${
                  activeTab === 'schedule' 
                    ? 'border-[#d2f936] text-[#d2f936]' 
                    : 'border-[#123948] text-white hover:border-[#8ea5af]'
                }`}
              >
                SCHEDULE
              </button>
              <button 
                onClick={() => setActiveTab('speakers')}
                className={`px-5 py-2 border transition-all duration-150 uppercase tracking-wider font-semibold ${
                  activeTab === 'speakers' 
                    ? 'border-[#d2f936] text-[#d2f936]' 
                    : 'border-[#123948] text-white hover:border-[#8ea5af]'
                }`}
              >
                SPEAKERS
              </button>
            </nav>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${
                breakpointMode === 'mobile' 
                  ? 'block' 
                  : breakpointMode === 'tablet' || breakpointMode === 'desktop' 
                    ? 'hidden' 
                    : 'md:hidden'
              } border border-[#123948] p-2 text-[#d2f936] hover:bg-[#002230] transition-colors`}
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Collapsible Navigation Menu */}
          {mobileMenuOpen && (
            <div className={`${
              breakpointMode === 'tablet' || breakpointMode === 'desktop' ? 'hidden' : 'block'
            } pt-4 pb-2 border-t border-[#123948] mt-4 flex flex-col gap-2 font-mono text-xs`}>
              <button 
                onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                className={`text-left px-4 py-2.5 border uppercase tracking-wider ${
                  activeTab === 'home' ? 'border-[#d2f936] text-[#d2f936] bg-[#002230]' : 'border-[#123948] text-white'
                }`}
              >
                HOME
              </button>
              <button 
                onClick={() => { setActiveTab('schedule'); setMobileMenuOpen(false); }}
                className={`text-left px-4 py-2.5 border uppercase tracking-wider ${
                  activeTab === 'schedule' ? 'border-[#d2f936] text-[#d2f936] bg-[#002230]' : 'border-[#123948] text-white'
                }`}
              >
                SCHEDULE
              </button>
              <button 
                onClick={() => { setActiveTab('speakers'); setMobileMenuOpen(false); }}
                className={`text-left px-4 py-2.5 border uppercase tracking-wider ${
                  activeTab === 'speakers' ? 'border-[#d2f936] text-[#d2f936] bg-[#002230]' : 'border-[#123948] text-white'
                }`}
              >
                SPEAKERS
              </button>
            </div>
          )}
        </header>

        {/* Main Title Section */}
        <section className="px-5 md:px-10 lg:px-12 pt-8 pb-4 max-w-[1440px] mx-auto">
          <h1 className="text-[#d2f936] font-mono font-bold text-2xl md:text-3xl tracking-tight">
            // speakers
          </h1>
        </section>

        {/* Speakers Grid:
            Desktop: 4 columns
            Tablet: 2 columns
            Mobile: 1 column
        */}
        <main className="px-5 md:px-10 lg:px-12 pb-12 max-w-[1440px] mx-auto">
          <div 
            className={`grid gap-6 ${
              breakpointMode === 'mobile' 
                ? 'grid-cols-1' 
                : breakpointMode === 'tablet' 
                  ? 'grid-cols-2' 
                  : breakpointMode === 'desktop' 
                    ? 'grid-cols-4' 
                    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
            }`}
          >
            {SPEAKERS.map((speaker) => (
                <article 
                  key={speaker.id}
                  onClick={() => setSelectedSpeaker(speaker)}
                  className="group bg-[#001a24] border border-[#123948] flex flex-col overflow-hidden hover:border-[#d2f936] transition-all duration-200 cursor-pointer shadow-lg hover:-translate-y-1"
                >
                  {/* Photo area with pastel grid backdrop */}
                  <div className="w-full aspect-[632/496] border-b border-[#123948] bg-[#072431] overflow-hidden relative">
                    <img 
                      src={speaker.image} 
                      alt={speaker.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    {/* Track tag subtle badge on hover */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 border border-[#d2f936] px-2 py-0.5 text-[10px] font-mono text-[#d2f936] uppercase">
                      {speaker.track}
                    </div>
                  </div>

                  {/* Text Details Area */}
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-white font-bold text-lg md:text-xl lowercase tracking-tight mb-1.5 leading-snug group-hover:text-[#d2f936] transition-colors">
                        {speaker.name}
                      </h2>
                      <p className="text-[#8fa6af] font-mono text-[11px] uppercase tracking-wider leading-relaxed">
                        {speaker.role}
                      </p>
                    </div>

                    <div className="border-t border-[#0d2a36] pt-4 mt-6">
                      <p className="text-[#d2f936] font-mono text-[11px] font-semibold uppercase tracking-wide leading-relaxed">
                        {speaker.talk}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
        </main>

        {/* Footer Section matching the mockups */}
        <footer className="border-t border-[#123948] bg-[#00151d] mt-16 pt-12 pb-8 px-5 md:px-10 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            {/* Top row */}
            <div className={`flex flex-col ${
              breakpointMode === 'mobile' 
                ? 'flex-col' 
                : breakpointMode === 'tablet' || breakpointMode === 'desktop' 
                  ? 'md:flex-row justify-between items-start' 
                  : 'md:flex-row justify-between items-start'
            } gap-10 mb-12`}>
              {/* Brand info */}
              <div className="max-w-sm">
                <a 
                  href="#speakers" 
                  className="text-[#d2f936] font-mono font-bold text-xl tracking-wider inline-block mb-3"
                >
                  DEVHORIZON_26
                </a>
                <p className="font-mono text-[#8fa6af] text-xs leading-relaxed">
                  A three-day conference for engineers who build the interfaces humans use every day.
                </p>
              </div>

              {/* 3 Columns */}
              <div className={`grid gap-8 md:gap-12 w-full md:w-auto ${
                breakpointMode === 'mobile' 
                  ? 'grid-cols-1' 
                  : breakpointMode === 'tablet' || breakpointMode === 'desktop' 
                    ? 'grid-cols-3' 
                    : 'grid-cols-1 md:grid-cols-3'
              }`}>
                {/* Column 1: Navigate */}
                <div>
                  <h3 className="text-[#d2f936] font-mono font-bold text-xs tracking-wider mb-3.5">
                    // NAVIGATE
                  </h3>
                  <ul className="space-y-2 font-mono text-xs text-[#8fa6af]">
                    <li><button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">Home</button></li>
                    <li><button onClick={() => setActiveTab('schedule')} className="hover:text-white transition-colors">Schedule</button></li>
                    <li><button onClick={() => setActiveTab('speakers')} className="hover:text-white transition-colors text-white">Speakers</button></li>
                  </ul>
                </div>

                {/* Column 2: Tracks */}
                <div>
                  <h3 className="text-[#d2f936] font-mono font-bold text-xs tracking-wider mb-3.5">
                    // TRACKS
                  </h3>
                  <ul className="space-y-2 font-mono text-xs text-[#8fa6af]">
                    <li>Frontend</li>
                    <li>Performance</li>
                    <li>Accessibility</li>
                    <li>Tooling</li>
                  </ul>
                </div>

                {/* Column 3: Venue */}
                <div>
                  <h3 className="text-[#d2f936] font-mono font-bold text-xs tracking-wider mb-3.5">
                    // VENUE
                  </h3>
                  <ul className="space-y-2 font-mono text-xs text-[#8fa6af]">
                    <li>Pier 70</li>
                    <li>San Francisco, CA</li>
                    <li>Nov 15-17, 2026</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Copyright & Back to Top */}
            <div className="border-t border-[#0d2a36] pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-mono text-xs">
              <p className="text-[#5b737d] uppercase tracking-wider">
                © 2026 DEVHORIZON. ALL RIGHTS RESERVED.
              </p>
              <button 
                onClick={scrollToTop}
                className="text-[#8fa6af] hover:text-[#d2f936] transition-colors uppercase tracking-wider flex items-center gap-1 group"
              >
                <span>BACK TO TOP</span>
                <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Speaker Details Modal */}
      {selectedSpeaker && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedSpeaker(null)}
        >
          <div 
            className="bg-[#001a24] border border-[#d2f936] max-w-lg w-full p-6 shadow-2xl relative font-mono text-left animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedSpeaker(null)}
              className="absolute top-4 right-4 p-1 text-[#8fa6af] hover:text-[#d2f936] transition-colors border border-[#123948]"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-4">
              <img 
                src={selectedSpeaker.image} 
                alt={selectedSpeaker.name}
                className="w-20 h-20 object-cover border border-[#123948]" 
              />
              <div>
                <h3 className="text-white font-sans font-bold text-xl lowercase leading-tight">
                  {selectedSpeaker.name}
                </h3>
                <p className="text-[#8fa6af] text-[11px] uppercase mt-1">
                  {selectedSpeaker.role}
                </p>
                <div className="inline-block mt-2 px-2 py-0.5 bg-[#002635] text-[#d2f936] border border-[#13495d] text-[10px] uppercase font-bold">
                  {selectedSpeaker.track} Track
                </div>
              </div>
            </div>

            <div className="border-t border-[#0d2a36] pt-3 mb-4">
              <span className="text-[10px] uppercase text-[#627e8a] block mb-1">Ponencia</span>
              <h4 className="text-[#d2f936] font-bold text-sm uppercase leading-relaxed">
                {selectedSpeaker.talk}
              </h4>
            </div>

            <p className="text-[#b1c3cb] text-xs leading-relaxed mb-4">
              {selectedSpeaker.abstract}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#00131b] p-3 border border-[#0d2a36] text-[#8fa6af] mb-4">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d2f936]" />
                <span>{selectedSpeaker.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#d2f936]" />
                <span>{selectedSpeaker.room}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-[#627e8a]">DEVHORIZON 2026</span>
              <button 
                onClick={() => setSelectedSpeaker(null)}
                className="px-4 py-1.5 bg-[#d2f936] text-black font-bold text-xs uppercase hover:bg-white transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Code Export Modal */}
      {showCodeModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowCodeModal(false)}
        >
          <div 
            className="bg-[#001822] border border-[#133948] max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl relative font-mono text-left animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-[#133948] flex items-center justify-between bg-[#00131a]">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#d2f936]" />
                <h3 className="text-white font-bold text-sm">Código HTML y CSS Puro</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex bg-[#001f2b] p-0.5 border border-[#133948]">
                  <button 
                    onClick={() => setCodeTab('html')}
                    className={`px-3 py-1 text-xs transition-colors ${codeTab === 'html' ? 'bg-[#d2f936] text-black font-bold' : 'text-[#8ea5af] hover:text-white'}`}
                  >
                    index.html
                  </button>
                  <button 
                    onClick={() => setCodeTab('css')}
                    className={`px-3 py-1 text-xs transition-colors ${codeTab === 'css' ? 'bg-[#d2f936] text-black font-bold' : 'text-[#8ea5af] hover:text-white'}`}
                  >
                    styles.css
                  </button>
                </div>
                <button 
                  onClick={() => setShowCodeModal(false)}
                  className="p-1 text-[#8ea5af] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4 bg-[#000f16] text-[#c7dbe3] text-xs">
              <pre className="whitespace-pre font-mono leading-relaxed select-all">
                {codeTab === 'html' ? pureHtmlCode : pureCssCode}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="p-3 border-t border-[#133948] bg-[#00131a] flex items-center justify-between text-xs">
              <span className="text-[#65818d]">
                {codeTab === 'html' ? 'HTML5 semántico sin librerías' : 'CSS Grid responsivo nativo (@media)'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyCode}
                  className="px-3 py-1.5 bg-[#092b38] hover:bg-[#0f3d4f] text-[#d2f936] border border-[#184e63] flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                </button>
                <a
                  href={codeTab === 'html' ? '/export/index.html' : '/export/styles.css'}
                  download={codeTab === 'html' ? 'index.html' : 'styles.css'}
                  className="px-3 py-1.5 bg-[#d2f936] hover:bg-white text-black font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
