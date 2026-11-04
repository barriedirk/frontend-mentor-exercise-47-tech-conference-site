import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, Info, CheckCircle2, RefreshCw } from 'lucide-react';
import { SpeakerModal, SpeakerData } from './SpeakerModal.tsx';

interface ThreeBreakpointsViewProps {
  speaker: SpeakerData;
}

export const ThreeBreakpointsView: React.FC<ThreeBreakpointsViewProps> = ({ speaker }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'mobile' | 'tablet' | 'desktop'>('all');
  const [mobileModalOpen, setMobileModalOpen] = useState(true);
  const [tabletModalOpen, setTabletModalOpen] = useState(true);
  const [desktopModalOpen, setDesktopModalOpen] = useState(true);

  const resetAllModals = () => {
    setMobileModalOpen(true);
    setTabletModalOpen(true);
    setDesktopModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Barra de Introducción y Selectores de Vista */}
      <div className="bg-[#05141d] border border-[#143542] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-mono text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b6f338]"></span>
            Vista de los 3 Breakpoints Responsivos (Mobile, Tablet y Desktop)
          </h2>
          <p className="text-xs text-[#8faec0] mt-1 max-w-2xl">
            Aquí puedes ver exactamente cómo se adapta el modal en cada tamaño de pantalla según las reglas del CSS puro. Puedes ver los 3 a la vez o elegir uno para examinarlo en detalle.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Botones de Selección */}
          <div className="flex items-center gap-1 bg-[#02090e] p-1 border border-[#143542]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 font-mono text-xs transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#153949] text-white font-bold'
                  : 'text-[#8faec0] hover:text-white'
              }`}
            >
              Los 3 a la Vez
            </button>
            <button
              onClick={() => setActiveTab('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs transition-colors ${
                activeTab === 'mobile'
                  ? 'bg-[#153949] text-white font-bold'
                  : 'text-[#8faec0] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#b6f338]" /> Mobile
            </button>
            <button
              onClick={() => setActiveTab('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs transition-colors ${
                activeTab === 'tablet'
                  ? 'bg-[#153949] text-white font-bold'
                  : 'text-[#8faec0] hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5 text-[#38bdf8]" /> Tablet
            </button>
            <button
              onClick={() => setActiveTab('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs transition-colors ${
                activeTab === 'desktop'
                  ? 'bg-[#153949] text-white font-bold'
                  : 'text-[#8faec0] hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-[#a78bfa]" /> Desktop
            </button>
          </div>

          <button
            onClick={resetAllModals}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#061822] border border-[#143542] text-xs font-mono text-[#8faec0] hover:text-white hover:border-[#38a169] transition-colors"
            title="Reabrir todos los modales"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reabrir
          </button>
        </div>
      </div>

      {/* =====================================================================
          1. DISPOSITIVO MÓVIL (< 768px)
          ===================================================================== */}
      {(activeTab === 'all' || activeTab === 'mobile') && (
        <div className="bg-[#040e14] border border-[#143542] p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#143542]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#0e2733] border border-[#1b4355] text-[#b6f338]">
                <Smartphone className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-mono text-sm font-bold text-white">
                  1. Breakpoint Móvil (<span className="text-[#b6f338]">&lt; 768px</span> — Ancho Simulado: 375px)
                </h3>
                <p className="text-[11px] text-[#8faec0]">
                  Estructura apilada verticalmente: Avatar arriba a la izquierda con botón [X] a la derecha, nombre/cargo debajo, y ticket apilado con KEYNOTE en la cabecera horizontal y colilla con horario abajo.
                </p>
              </div>
            </div>
            {!mobileModalOpen && (
              <button
                onClick={() => setMobileModalOpen(true)}
                className="px-2.5 py-1 bg-[#153949] text-white font-mono text-xs hover:bg-[#1f4f66]"
              >
                Abrir Modal Móvil
              </button>
            )}
          </div>

          {/* Marco de Teléfono Móvil Realista */}
          <div className="flex justify-center py-4 bg-[#02070a] border border-[#0d222b] overflow-hidden">
            <div className="relative w-[375px] h-[780px] bg-[#05131b] border-[8px] border-[#132832] rounded-[36px] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
              
              {/* Notch y Barra de Estado Móvil */}
              <div className="h-6 bg-[#030a0e] flex items-center justify-between px-6 shrink-0 text-[10px] font-mono text-[#64748b] select-none">
                <span>9:41</span>
                <div className="w-16 h-3.5 bg-[#132832] rounded-full mx-auto"></div>
                <span>5G 100%</span>
              </div>

              {/* Contenido de la pantalla móvil (Fondo de Conferencia) */}
              <div className="flex-1 relative overflow-y-auto bg-[#040e14]">
                
                {/* Header Móvil con Menú Hamburguesa */}
                <div className="p-3.5 border-b border-[#0f2b38] flex items-center justify-between bg-[#05131b]">
                  <span className="font-mono text-xs font-bold text-[#38a169]">DEVHORIZON_26</span>
                  <div className="w-7 h-7 border border-[#143542] flex items-center justify-center text-[#8faec0] text-xs">
                    ☰
                  </div>
                </div>

                <div className="p-3">
                  <div className="font-mono text-xs text-[#2c7a52] font-bold mb-3">// speakers</div>
                  <div className="space-y-3">
                    <div className="bg-[#061720] border border-[#143542] p-3">
                      <div className="font-bold text-xs text-white">aisha patel</div>
                      <div className="text-[10px] text-[#8faec0] font-mono">WEB PERFORMANCE LEAD</div>
                    </div>
                  </div>
                </div>

                {/* MODAL MÓVIL EN VIVO (Confinado en el teléfono) */}
                <SpeakerModal
                  speaker={speaker}
                  isOpen={mobileModalOpen}
                  onClose={() => setMobileModalOpen(false)}
                  forceBreakpoint="mobile"
                  embedded={true}
                />
              </div>

              {/* Barra de Inicio Móvil */}
              <div className="h-4 bg-[#030a0e] flex items-center justify-center shrink-0">
                <div className="w-28 h-1 bg-[#234351] rounded-full"></div>
              </div>

            </div>
          </div>

          {/* Explicación de las reglas CSS de Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#030e16] p-3.5 border border-[#143542]">
            <div className="space-y-1">
              <strong className="text-white block font-mono text-[11px] text-[#b6f338]">1. Perfil Apilado</strong>
              <p className="text-[#8faec0]">
                <code>.speaker-profile &#123; flex-direction: column; &#125;</code>. La foto va arriba y el nombre con cargo debajo.
              </p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block font-mono text-[11px] text-[#b6f338]">2. Ticket Horizontal Superior</strong>
              <p className="text-[#8faec0]">
                <code>.ticket-badge</code> es una barra horizontal superior que ocupa el 100% del ancho del ticket.
              </p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block font-mono text-[11px] text-[#b6f338]">3. Colilla Inferior</strong>
              <p className="text-[#8faec0]">
                <code>.ticket-stub</code> se ubica en la base separada por <code>border-top: 1.5px dashed</code> con hora, código y estrella.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. DISPOSITIVO TABLET (768px - 1023px)
          ===================================================================== */}
      {(activeTab === 'all' || activeTab === 'tablet') && (
        <div className="bg-[#040e14] border border-[#143542] p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#143542]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#0e2733] border border-[#1b4355] text-[#38bdf8]">
                <Tablet className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-mono text-sm font-bold text-white">
                  2. Breakpoint Tablet (<span className="text-[#38bdf8]">768px a 1023px</span> — Ancho Simulado: 768px)
                </h3>
                <p className="text-[11px] text-[#8faec0]">
                  Estructura en Fila: Avatar a la izquierda y Nombre/Cargo al lado en fila horizontal. Ticket en 3 columnas: KEYNOTE vertical rotado 90° a la izquierda, cuerpo celeste al centro, y colilla vertical con hora/código a la derecha.
                </p>
              </div>
            </div>
            {!tabletModalOpen && (
              <button
                onClick={() => setTabletModalOpen(true)}
                className="px-2.5 py-1 bg-[#153949] text-white font-mono text-xs hover:bg-[#1f4f66]"
              >
                Abrir Modal Tablet
              </button>
            )}
          </div>

          {/* Marco de Tablet Realista */}
          <div className="flex justify-center py-4 bg-[#02070a] border border-[#0d222b] overflow-x-auto">
            <div className="relative w-[768px] h-[640px] bg-[#05131b] border-[10px] border-[#132832] rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col shrink-0">
              
              {/* Contenido de la pantalla tablet (Fondo de Conferencia) */}
              <div className="flex-1 relative overflow-y-auto bg-[#040e14]">
                
                {/* Header Tablet con Menú Horizontal */}
                <div className="p-4 border-b border-[#0f2b38] flex items-center justify-between bg-[#05131b]">
                  <span className="font-mono text-base font-bold text-[#38a169]">DEVHORIZON_26</span>
                  <div className="flex gap-2 font-mono text-xs text-[#8faec0]">
                    <span className="px-2 py-1 border border-[#143542]">HOME</span>
                    <span className="px-2 py-1 border border-[#143542]">SCHEDULE</span>
                    <span className="px-2 py-1 border border-[#38a169] text-white">SPEAKERS</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="font-mono text-base text-[#2c7a52] font-bold mb-4">// speakers</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#061720] border border-[#143542] p-4">
                      <div className="font-bold text-sm text-white">naomi tanaka</div>
                      <div className="text-xs text-[#8faec0] font-mono">ACCESSIBILITY LEAD @ AXION</div>
                    </div>
                    <div className="bg-[#061720] border border-[#143542] p-4">
                      <div className="font-bold text-sm text-white">james okonkwo</div>
                      <div className="text-xs text-[#8faec0] font-mono">ENGINEERING DIRECTOR @ CARTWELL</div>
                    </div>
                  </div>
                </div>

                {/* MODAL TABLET EN VIVO */}
                <SpeakerModal
                  speaker={speaker}
                  isOpen={tabletModalOpen}
                  onClose={() => setTabletModalOpen(false)}
                  forceBreakpoint="tablet"
                  embedded={true}
                />
              </div>

            </div>
          </div>

          {/* Explicación de las reglas CSS de Tablet */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#030e16] p-3.5 border border-[#143542]">
            <div className="space-y-1">
              <strong className="text-white block font-mono text-[11px] text-[#38bdf8]">1. Perfil en Fila</strong>
              <p className="text-[#8faec0]">
                <code>@media (min-width: 768px) &#123; .speaker-profile &#123; flex-direction: row; &#125; &#125;</code> con padding derecho de 50px para respetar la [X].
              </p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block font-mono text-[11px] text-[#38bdf8]">2. Writing-Mode Vertical</strong>
              <p className="text-[#8faec0]">
                <code>writing-mode: vertical-rl; transform: rotate(180deg);</code> permite girar el texto KEYNOTE verticalmente a la izquierda.
              </p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block font-mono text-[11px] text-[#38bdf8]">3. Colilla Vertical Derecha</strong>
              <p className="text-[#8faec0]">
                <code>.ticket-stub</code> pasa a ser una columna vertical derecha separada por <code>border-left: 1.5px dashed</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. DISPOSITIVO DESKTOP (≥ 1024px)
          ===================================================================== */}
      {(activeTab === 'all' || activeTab === 'desktop') && (
        <div className="bg-[#040e14] border border-[#143542] p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#143542]">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#0e2733] border border-[#1b4355] text-[#a78bfa]">
                <Monitor className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-mono text-sm font-bold text-white">
                  3. Breakpoint Desktop (<span className="text-[#a78bfa]">&ge; 1024px</span> — Ancho Simulado: 1040px)
                </h3>
                <p className="text-[11px] text-[#8faec0]">
                  Modal perfectamente centrado con max-width de 720px y padding amplio (32px), mostrando la cuadrícula completa de 4 columnas de la conferencia en el fondo oscurecido.
                </p>
              </div>
            </div>
            {!desktopModalOpen && (
              <button
                onClick={() => setDesktopModalOpen(true)}
                className="px-2.5 py-1 bg-[#153949] text-white font-mono text-xs hover:bg-[#1f4f66]"
              >
                Abrir Modal Desktop
              </button>
            )}
          </div>

          {/* Marco de Pantalla de Escritorio */}
          <div className="flex justify-center py-4 bg-[#02070a] border border-[#0d222b] overflow-x-auto">
            <div className="relative w-[1040px] h-[640px] bg-[#05131b] border-[10px] border-[#132832] rounded-[16px] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col shrink-0">
              
              {/* Barra de Navegador de Escritorio */}
              <div className="h-7 bg-[#030a0e] border-b border-[#143542] flex items-center px-4 gap-2 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
                <div className="ml-4 w-72 h-4 bg-[#0c1f28] rounded text-[10px] font-mono text-[#476a7a] flex items-center px-2">
                  https://devhorizon.io/speakers#elena-vasquez
                </div>
              </div>

              {/* Pantalla Desktop con Fondo de la Conferencia y Modal Centrado */}
              <div className="flex-1 relative overflow-y-auto bg-[#040e14]">
                
                {/* Header DEVHORIZON_26 */}
                <div className="px-8 py-4 border-b border-[#0f2b38] flex items-center justify-between bg-[#05131b]">
                  <span className="font-mono text-lg font-bold text-[#38a169]">DEVHORIZON_26</span>
                  <div className="flex gap-3 font-mono text-xs text-[#8faec0]">
                    <span className="px-3 py-1.5 border border-[#143542]">HOME</span>
                    <span className="px-3 py-1.5 border border-[#143542]">SCHEDULE</span>
                    <span className="px-3 py-1.5 border border-[#38a169] text-white bg-[#0c2430]">SPEAKERS</span>
                  </div>
                </div>

                {/* Grid de 4 columnas de la conferencia */}
                <div className="p-8">
                  <div className="font-mono text-xl text-[#2c7a52] font-bold mb-6">// speakers</div>
                  <div className="grid grid-cols-4 gap-4 opacity-40">
                    <div className="bg-[#061720] border border-[#143542] p-3 h-40"></div>
                    <div className="bg-[#061720] border border-[#143542] p-3 h-40"></div>
                    <div className="bg-[#061720] border border-[#143542] p-3 h-40"></div>
                    <div className="bg-[#061720] border border-[#143542] p-3 h-40"></div>
                  </div>
                </div>

                {/* MODAL DESKTOP EN VIVO */}
                <SpeakerModal
                  speaker={speaker}
                  isOpen={desktopModalOpen}
                  onClose={() => setDesktopModalOpen(false)}
                  forceBreakpoint="desktop"
                  embedded={true}
                />
              </div>

            </div>
          </div>

          {/* Explicación de las reglas CSS de Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#030e16] p-3.5 border border-[#143542]">
            <div className="space-y-1">
              <strong className="text-white block font-mono text-[11px] text-[#a78bfa]">1. Ancho Máximo y Centrado</strong>
              <p className="text-[#8faec0]">
                <code>max-width: 720px; margin: auto;</code> mantiene el modal centrado en horizontal y vertical sin estirarse en pantallas 4K.
              </p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block font-mono text-[11px] text-[#a78bfa]">2. Proporciones y Tipografía</strong>
              <p className="text-[#8faec0]">
                Avatar de 130px, título de la charla en 24px y horario principal en 20px font-extrabold.
              </p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block font-mono text-[11px] text-[#a78bfa]">3. Flexbox sin Overflows</strong>
              <p className="text-[#8faec0]">
                Estructura flexible que soporta contenido dinámico sin romper los bordes ni cortar textos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
