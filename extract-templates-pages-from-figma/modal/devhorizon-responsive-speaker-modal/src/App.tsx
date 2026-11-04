import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Code2,
  Eye,
  Sparkles,
  Download,
  ExternalLink,
  Menu,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { SpeakerModal, SpeakerData } from './components/SpeakerModal.tsx';
import { CodeViewer } from './components/CodeViewer.tsx';
import { DesignComparison } from './components/DesignComparison.tsx';
import { ThreeBreakpointsView } from './components/ThreeBreakpointsView.tsx';

// Lista de speakers inspirada exactamente en DEVHORIZON_26
const SPEAKERS_LIST: SpeakerData[] = [
  {
    id: 'elena-vasquez',
    name: 'elena vasquez',
    role: 'PRINCIPAL FRONTEND ENGINEER',
    company: 'BYTECRAFT',
    bio: 'Elena has spent the last decade pushing the boundaries of in-browser development environments. She led the browser-native IDE initiative at Bytecraft and is a frequent contributor to the TC39 process. Her work focuses on making the web platform a first-class development target.',
    talkCategory: 'KEYNOTE',
    talkTitle: 'the next frontier of web development',
    talkStartTime: '9:00',
    talkEndTime: '10:00',
    avatarUrl: '/src/assets/images/elena_vasquez_avatar_1793509593678.jpg',
  },
  {
    id: 'aisha-patel',
    name: 'aisha patel',
    role: 'WEB PERFORMANCE LEAD',
    company: 'EDGEVANE',
    bio: 'Aisha specializes in rendering pipeline optimization and Core Web Vitals. At Edgevane, she built zero-runtime performance budgets that slashed first input delay across high-traffic enterprise applications.',
    talkCategory: 'TECHNICAL TALK',
    talkTitle: 'eliminating layout shift once and for all',
    talkStartTime: '10:15',
    talkEndTime: '11:00',
    avatarUrl: '/src/assets/images/elena_vasquez_avatar_1793509593678.jpg',
  },
  {
    id: 'naomi-tanaka',
    name: 'naomi tanaka',
    role: 'ACCESSIBILITY ENGINEERING LEAD',
    company: 'AXION',
    bio: 'Naomi advocates for inclusive design systems. Her research focuses on screen reader interoperability, keyboard navigation heuristics, and WCAG 2.2 strict compliance for complex data grids.',
    talkCategory: 'WORKSHOP',
    talkTitle: 'screen readers deserve better components',
    talkStartTime: '11:15',
    talkEndTime: '12:00',
    avatarUrl: '/src/assets/images/elena_vasquez_avatar_1793509593678.jpg',
  },
  {
    id: 'james-okonkwo',
    name: 'james okonkwo',
    role: 'ENGINEERING DIRECTOR',
    company: 'CARTWELL',
    bio: 'James oversees build tooling and platform architecture for distributed systems. He previously led compiler optimization projects and authored several open-source package bundlers.',
    talkCategory: 'ARCHITECTURE',
    talkTitle: 'monorepos at scale: lessons from 500 packages',
    talkStartTime: '13:00',
    talkEndTime: '13:45',
    avatarUrl: '/src/assets/images/elena_vasquez_avatar_1793509593678.jpg',
  },
  {
    id: 'sarah-lindstrom',
    name: 'sarah lindström',
    role: 'DESIGN SYSTEMS LEAD',
    company: 'TESSERA',
    bio: 'Sarah bridges product design and frontend engineering. Her work standardizes cross-platform design tokens using modern CSS custom properties and Figma tokens sync pipelines.',
    talkCategory: 'DESIGN TECH',
    talkTitle: 'type-safe design tokens across platforms',
    talkStartTime: '14:00',
    talkEndTime: '14:45',
    avatarUrl: '/src/assets/images/elena_vasquez_avatar_1793509593678.jpg',
  },
  {
    id: 'devon-park',
    name: 'devon park',
    role: 'FRONTEND ARCHITECT',
    company: 'LUMINARY',
    bio: 'Devon works on streaming server architectures and progressive hydrations. He has presented internationally on micro-frontends and edge-rendered component boundaries.',
    talkCategory: 'DEEP DIVE',
    talkTitle: 'streaming server components for instant pages',
    talkStartTime: '15:00',
    talkEndTime: '15:45',
    avatarUrl: '/src/assets/images/elena_vasquez_avatar_1793509593678.jpg',
  },
  {
    id: 'bertram-gilfoyle',
    name: 'bertram gilfoyle',
    role: 'SYSTEMS ARCHITECT',
    company: 'PIED PIPER',
    bio: 'Systems architect, security auditor, and Bitcoin node runner. Expert in high-throughput network resilience and fault-tolerant server clustering.',
    talkCategory: 'SECURITY & AI',
    talkTitle: 'teaching machines to write code: building son of anton',
    talkStartTime: '16:00',
    talkEndTime: '16:45',
    avatarUrl: '/src/assets/images/elena_vasquez_avatar_1793509593678.jpg',
  },
  {
    id: 'priya-sharma',
    name: 'priya sharma',
    role: 'SENIOR DEVELOPER ADVOCATE',
    company: 'COBALT',
    bio: 'Priya focuses on browser developer tooling, accessibility auditing, and web standards education for modern frontend developers worldwide.',
    talkCategory: 'BEST PRACTICES',
    talkTitle: "aria patterns you're probably using wrong",
    talkStartTime: '17:00',
    talkEndTime: '17:45',
    avatarUrl: '/src/assets/images/elena_vasquez_avatar_1793509593678.jpg',
  },
];

export default function App() {
  // Modal de speaker activo
  const [activeSpeaker, setActiveSpeaker] = useState<SpeakerData | null>(SPEAKERS_LIST[0]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  // Control de vista principal: 'breakpoints' por defecto para mostrar inmediatamente móvil, tablet y desktop
  const [currentView, setCurrentView] = useState<'breakpoints' | 'preview' | 'code' | 'compare'>('breakpoints');

  // Control de Breakpoint en modo preview individual
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<'mobile' | 'tablet' | 'desktop' | 'auto'>('mobile');

  // Ancho y estilos del contenedor según breakpoint forzado en modo simulador
  const containerWidthStyle =
    selectedBreakpoint === 'mobile'
      ? 'w-full max-w-[390px] mx-auto border-4 border-[#183949] rounded-2xl shadow-2xl overflow-hidden'
      : selectedBreakpoint === 'tablet'
      ? 'w-full max-w-[768px] mx-auto border-4 border-[#183949] rounded-xl shadow-2xl overflow-hidden'
      : selectedBreakpoint === 'desktop'
      ? 'w-full max-w-[1240px] mx-auto'
      : 'w-full';

  return (
    <div className="min-h-screen bg-[#030c11] text-slate-100 flex flex-col font-sans selection:bg-[#1a4e66]">
      
      {/* =========================================================================
          BARRA DE CONTROL SUPERIOR (SWITCHER DE VISTAS Y BREAKPOINTS)
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#05151e]/95 backdrop-blur-md border-b border-[#143542] px-3 sm:px-6 py-2.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo y Título de la Solución */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm sm:text-base font-extrabold text-[#38a169] tracking-wider">
              DEVHORIZON_26
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 bg-[#0e2733] text-[#8faec0] border border-[#1b4355]">
              Modal Responsivo (CSS Puro)
            </span>
          </div>

          {/* Selector de Vistas Principales */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setCurrentView('breakpoints')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border transition-colors ${
                currentView === 'breakpoints'
                  ? 'bg-[#b6f338] text-[#05141d] border-[#b6f338] font-bold shadow-sm'
                  : 'bg-[#030d13] text-[#8faec0] border-[#143542] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <Tablet className="w-3.5 h-3.5 -ml-1" />
              <Monitor className="w-3.5 h-3.5 -ml-1" />
              <span>Ver los 3 Breakpoints (Simultáneo)</span>
            </button>

            <button
              onClick={() => setCurrentView('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border transition-colors ${
                currentView === 'preview'
                  ? 'bg-[#143746] text-white border-[#38a169] font-bold'
                  : 'bg-[#030d13] text-[#8faec0] border-[#143542] hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Simulador de Dispositivo</span>
            </button>

            <button
              onClick={() => setCurrentView('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border transition-colors ${
                currentView === 'code'
                  ? 'bg-[#143746] text-white border-[#38a169] font-bold'
                  : 'bg-[#030d13] text-[#8faec0] border-[#143542] hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Código HTML & CSS</span>
            </button>

            <button
              onClick={() => setCurrentView('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border transition-colors ${
                currentView === 'compare'
                  ? 'bg-[#143746] text-white border-[#38a169] font-bold'
                  : 'bg-[#030d13] text-[#8faec0] border-[#143542] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#b6f338]" />
              <span className="hidden sm:inline">Comparar Referencias PNG</span>
              <span className="sm:hidden">Refs</span>
            </button>

            <a
              href="/standalone-modal/index.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono bg-[#030d13] text-[#8faec0] border border-[#143542] hover:text-white hover:border-[#2a6983]"
              title="Abrir archivo HTML puro independiente en nueva pestaña"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">HTML Standalone</span>
            </a>
          </div>

        </div>
      </header>

      {/* =========================================================================
          CONTENIDO PRINCIPAL SEGÚN LA PESTAÑA ACTIVA
          ========================================================================= */}
      <main className="flex-1 flex flex-col">
        
        {/* VISTA 1: LOS 3 BREAKPOINTS SIMULTÁNEOS (MOBILE, TABLET Y DESKTOP) */}
        {currentView === 'breakpoints' && (
          <div className="flex-1 max-w-[1360px] w-full mx-auto p-3 sm:p-6">
            <ThreeBreakpointsView speaker={activeSpeaker || SPEAKERS_LIST[0]} />
          </div>
        )}

        {/* VISTA 2: SIMULADOR DE DISPOSITIVO INDIVIDUAL */}
        {currentView === 'preview' && (
          <div className="flex-1 w-full bg-[#030c11] py-4 sm:py-6 px-2 sm:px-4">
            
            {/* Barra de Controles del Simulador */}
            <div className="max-w-[1240px] mx-auto mb-4 flex flex-wrap items-center justify-between gap-3 bg-[#061822] border border-[#143542] px-4 py-2.5 text-xs text-[#8faec0]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b6f338]"></span>
                <span className="text-white font-mono font-bold">Simulador Interactivo:</span>
                <span>Selecciona el dispositivo para ver el comportamiento del modal:</span>
              </div>

              {/* Selector de Dispositivo en el propio simulador */}
              <div className="flex items-center gap-1 bg-[#02090e] p-1 border border-[#143542]">
                <button
                  onClick={() => setSelectedBreakpoint('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs transition-colors ${
                    selectedBreakpoint === 'mobile'
                      ? 'bg-[#153949] text-white font-bold'
                      : 'text-[#8faec0] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#b6f338]" /> Mobile (390px)
                </button>
                <button
                  onClick={() => setSelectedBreakpoint('tablet')}
                  className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs transition-colors ${
                    selectedBreakpoint === 'tablet'
                      ? 'bg-[#153949] text-white font-bold'
                      : 'text-[#8faec0] hover:text-white'
                  }`}
                >
                  <Tablet className="w-3.5 h-3.5 text-[#38bdf8]" /> Tablet (768px)
                </button>
                <button
                  onClick={() => setSelectedBreakpoint('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs transition-colors ${
                    selectedBreakpoint === 'desktop'
                      ? 'bg-[#153949] text-white font-bold'
                      : 'text-[#8faec0] hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 text-[#a78bfa]" /> Desktop
                </button>
                <button
                  onClick={() => setSelectedBreakpoint('auto')}
                  className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs transition-colors ${
                    selectedBreakpoint === 'auto'
                      ? 'bg-[#153949] text-white font-bold'
                      : 'text-[#8faec0] hover:text-white'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" /> Pantalla Completa
                </button>
              </div>

              <button
                onClick={() => {
                  setActiveSpeaker(SPEAKERS_LIST[0]);
                  setIsModalOpen(true);
                }}
                className="font-mono text-xs px-2.5 py-1 bg-[#153949] text-white hover:bg-[#1f4f66] transition-colors"
              >
                Reabrir Modal
              </button>
            </div>

            {/* Contenedor del dispositivo simulado */}
            <div className={`transition-all duration-300 relative min-h-[720px] bg-[#040e14] ${containerWidthStyle}`}>
              
              {/* Header de la Conferencia DEVHORIZON_26 */}
              <div className="bg-[#05131b] border-b border-[#0f2b38] px-4 sm:px-8 py-4 flex items-center justify-between">
                <div className="font-mono text-lg sm:text-xl font-bold text-[#38a169] tracking-wider">
                  DEVHORIZON_26
                </div>

                {/* Navegación Responsive: Links en Desktop/Tablet, Hamburguesa en Mobile */}
                {selectedBreakpoint === 'mobile' ? (
                  <button className="w-8 h-8 border border-[#143542] flex items-center justify-center text-[#8faec0]">
                    <Menu className="w-4 h-4" />
                  </button>
                ) : (
                  <nav className="flex items-center gap-2 sm:gap-3">
                    <span className="font-mono text-xs text-[#64748b] px-3 py-1.5 border border-[#143542]">
                      HOME
                    </span>
                    <span className="font-mono text-xs text-[#64748b] px-3 py-1.5 border border-[#143542]">
                      SCHEDULE
                    </span>
                    <span className="font-mono text-xs text-white px-3 py-1.5 border border-[#2a6983] bg-[#0c2430]">
                      SPEAKERS
                    </span>
                  </nav>
                )}
              </div>

              {/* Título de Sección // speakers */}
              <div className="p-4 sm:p-8">
                <h1 className="font-mono text-xl sm:text-2xl font-bold text-[#38a169] mb-6 tracking-wide">
                  // speakers
                </h1>

                {/* Grid de Speakers */}
                <div className={`grid gap-4 sm:gap-6 ${
                  selectedBreakpoint === 'mobile'
                    ? 'grid-cols-1'
                    : selectedBreakpoint === 'tablet'
                    ? 'grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}>
                  {SPEAKERS_LIST.map((spk) => (
                    <article
                      key={spk.id}
                      onClick={() => {
                        setActiveSpeaker(spk);
                        setIsModalOpen(true);
                      }}
                      className="group cursor-pointer bg-[#061720] border border-[#143542] hover:border-[#38a169] transition-all hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Foto con fondo cyan suave */}
                      <div className="w-full aspect-[4/3] bg-[#8ed3e8] overflow-hidden relative">
                        <img
                          src={spk.avatarUrl}
                          alt={spk.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Info de la tarjeta */}
                      <div className="p-4 flex flex-col justify-between min-h-[140px]">
                        <div>
                          <h3 className="font-bold text-white text-base lowercase group-hover:text-[#b6f338] transition-colors">
                            {spk.name}
                          </h3>
                          <p className="font-mono text-[10px] text-[#8faec0] tracking-wider uppercase mt-1">
                            {spk.role} @ {spk.company}
                          </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-[#102d3a]">
                          <p className="font-mono text-[10.5px] text-[#2c7a52] uppercase font-semibold leading-tight line-clamp-2">
                            {spk.talkTitle}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Modal de Speaker renderizado DIRECTAMENTE dentro del contenedor simulado */}
              {activeSpeaker && (
                <SpeakerModal
                  speaker={activeSpeaker}
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  forceBreakpoint={selectedBreakpoint}
                  embedded={selectedBreakpoint !== 'auto'}
                />
              )}

            </div>

          </div>
        )}

        {/* VISTA 2: VISUALIZADOR DE CÓDIGO HTML & CSS PURO */}
        {currentView === 'code' && (
          <div className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-6 space-y-6">
            <div className="bg-[#061822] border border-[#143542] p-4 text-xs text-[#8faec0] flex flex-wrap items-center justify-between gap-3">
              <div>
                <strong className="text-white text-sm block mb-1">
                  Código Listo para Producción (HTML & CSS Puro)
                </strong>
                Este código utiliza exclusivamente etiquetas estándar de HTML5 y propiedades de CSS3 (Flexbox, Media Queries y Custom Properties). No requiere frameworks, librerías JS ni Tailwind.
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/standalone-modal/index.html"
                  download="speaker-modal.html"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#153949] text-white font-mono text-xs hover:bg-[#1e4e64] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar index.html
                </a>
                <a
                  href="/standalone-modal/style.css"
                  download="speaker-modal.css"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#153949] text-white font-mono text-xs hover:bg-[#1e4e64] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar style.css
                </a>
              </div>
            </div>

            <CodeViewer />
          </div>
        )}

        {/* VISTA 3: COMPARADOR CON LAS IMÁGENES DE DISEÑO ORIGINALES */}
        {currentView === 'compare' && (
          <div className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-6">
            <DesignComparison />
          </div>
        )}

      </main>

      {/* =========================================================================
          FOOTER MINIMALISTA
          ========================================================================= */}
      <footer className="bg-[#040e14] border-t border-[#143542] px-4 py-3 text-center text-xs font-mono text-[#64748b]">
        DEVHORIZON_26 Speaker Modal — Pure Responsive HTML & CSS Engine
      </footer>

    </div>
  );
}
