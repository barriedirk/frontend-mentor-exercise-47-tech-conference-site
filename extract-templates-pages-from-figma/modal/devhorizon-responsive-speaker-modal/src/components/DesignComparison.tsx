import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, Eye, Sliders, CheckCircle } from 'lucide-react';

export const DesignComparison: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay'>('side-by-side');
  const [opacity, setOpacity] = useState<number>(50);

  const referenceImages = {
    desktop: '/public/assets/aistudio/Desktop_-_Speakers_-_Modal_b949a2e7.png',
    tablet: '/public/assets/aistudio/Tablet_-_Speakers_-_Modal_c4cab24a.png',
    mobile: '/public/assets/aistudio/Mobile_-_Speakers_-_Modal_68f8940e.png',
  };

  const deviceLabels = {
    desktop: 'Desktop (≥ 1024px)',
    tablet: 'Tablet (768px - 1023px)',
    mobile: 'Mobile (< 768px)',
  };

  return (
    <div className="bg-[#05141d] border border-[#143542] p-4 sm:p-6 text-white space-y-6">
      {/* Barra de Controles de Comparación */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#143542]">
        <div>
          <h2 className="font-mono text-sm font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#b6f338]" /> Comparador de Fidelidad con Imágenes de Referencia
          </h2>
          <p className="text-xs text-[#8faec0] mt-0.5">
            Verifica la correspondencia estructural entre el diseño original y el código CSS/HTML generado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Dispositivo */}
          <div className="flex items-center gap-1 bg-[#030b10] p-1 border border-[#143542]">
            <button
              onClick={() => setSelectedDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs transition-colors ${
                selectedDevice === 'desktop' ? 'bg-[#153949] text-white font-bold' : 'text-[#8faec0] hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              onClick={() => setSelectedDevice('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs transition-colors ${
                selectedDevice === 'tablet' ? 'bg-[#153949] text-white font-bold' : 'text-[#8faec0] hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" /> Tablet
            </button>
            <button
              onClick={() => setSelectedDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs transition-colors ${
                selectedDevice === 'mobile' ? 'bg-[#153949] text-white font-bold' : 'text-[#8faec0] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>

          {/* Selector Modo Vista */}
          <div className="flex items-center gap-1 bg-[#030b10] p-1 border border-[#143542]">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1 font-mono text-xs transition-colors ${
                viewMode === 'side-by-side' ? 'bg-[#153949] text-white font-bold' : 'text-[#8faec0] hover:text-white'
              }`}
            >
              Lado a Lado
            </button>
            <button
              onClick={() => setViewMode('overlay')}
              className={`px-3 py-1 font-mono text-xs transition-colors ${
                viewMode === 'overlay' ? 'bg-[#153949] text-white font-bold' : 'text-[#8faec0] hover:text-white'
              }`}
            >
              Superposición
            </button>
          </div>
        </div>
      </div>

      {/* Lista de características clave verificadas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#030e16] p-3 border border-[#143542] text-xs">
        <div className="flex items-start gap-2 text-[#8faec0]">
          <CheckCircle className="w-4 h-4 text-[#b6f338] shrink-0 mt-0.5" />
          <span><strong>Flexbox Centrado:</strong> Modal centrado en X e Y con scroll vertical seguro.</span>
        </div>
        <div className="flex items-start gap-2 text-[#8faec0]">
          <CheckCircle className="w-4 h-4 text-[#b6f338] shrink-0 mt-0.5" />
          <span><strong>Estructura Ticket:</strong> Badge rotado en tablet/desktop, horizontal en mobile.</span>
        </div>
        <div className="flex items-start gap-2 text-[#8faec0]">
          <CheckCircle className="w-4 h-4 text-[#b6f338] shrink-0 mt-0.5" />
          <span><strong>Fidelidad Tipográfica:</strong> Display sans bold + JetBrains Mono para metadatos.</span>
        </div>
      </div>

      {/* Visualización Lado a Lado */}
      {viewMode === 'side-by-side' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Captura original de referencia */}
          <div className="bg-[#030b10] border border-[#143542] p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#143542]">
              <span className="font-mono text-xs font-bold text-[#8faec0]">
                Diseño Original ({deviceLabels[selectedDevice]})
              </span>
              <span className="text-[11px] font-mono text-[#b6f338]">Referencia PNG</span>
            </div>
            <div className="flex items-center justify-center bg-[#02070a] p-2 overflow-hidden max-h-[620px]">
              <img
                src={referenceImages[selectedDevice]}
                alt={`Diseño de referencia ${selectedDevice}`}
                className="max-h-[580px] w-auto object-contain shadow-lg"
              />
            </div>
          </div>

          {/* Renderizado de código interactivo en Iframe aislado */}
          <div className="bg-[#030b10] border border-[#143542] p-3 flex flex-col">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#143542]">
              <span className="font-mono text-xs font-bold text-[#8faec0]">
                Renderizado Código CSS/HTML Puro (Iframe)
              </span>
              <span className="text-[11px] font-mono text-[#38bdf8]">En vivo</span>
            </div>
            <div className="flex items-center justify-center bg-[#02070a] p-2 overflow-hidden h-[600px]">
              <iframe
                src="/standalone-modal/index.html"
                title="Renderizado Puro"
                className={`h-full border border-[#143542] bg-[#051219] transition-all ${
                  selectedDevice === 'mobile'
                    ? 'w-[375px]'
                    : selectedDevice === 'tablet'
                    ? 'w-[768px]'
                    : 'w-full'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Visualización en Modo Superposición */}
      {viewMode === 'overlay' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-[#030e16] p-3 border border-[#143542]">
            <Sliders className="w-4 h-4 text-[#b6f338]" />
            <span className="font-mono text-xs text-[#8faec0]">Opacidad de la referencia:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-48 accent-[#b6f338]"
            />
            <span className="font-mono text-xs font-bold text-white">{opacity}%</span>
          </div>

          <div className="relative w-full h-[640px] bg-[#02070a] border border-[#143542] overflow-hidden flex items-center justify-center">
            {/* Iframe interactivo al fondo */}
            <iframe
              src="/standalone-modal/index.html"
              title="Renderizado Puro Superpuesto"
              className={`h-full border-none transition-all ${
                selectedDevice === 'mobile'
                  ? 'w-[375px]'
                  : selectedDevice === 'tablet'
                  ? 'w-[768px]'
                  : 'w-full'
              }`}
            />

            {/* Imagen de referencia semitransparente encima */}
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center"
              style={{ opacity: opacity / 100 }}
            >
              <img
                src={referenceImages[selectedDevice]}
                alt="Referencia superpuesta"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
