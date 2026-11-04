import React from 'react';
import { Monitor, Tablet, Smartphone, Maximize2 } from 'lucide-react';

export type ViewportMode = 'responsive' | 'desktop' | 'tablet' | 'mobile';

interface BreakpointInspectorProps {
  currentMode: ViewportMode;
  onModeChange: (mode: ViewportMode) => void;
  activeBreakpointLabel: string;
  onOpenPureCode: () => void;
}

export const BreakpointInspector: React.FC<BreakpointInspectorProps> = ({
  currentMode,
  onModeChange,
  activeBreakpointLabel,
  onOpenPureCode,
}) => {
  return (
    <aside
      aria-label="Viewport Preview Controls"
      className="bg-[#030d10] border-b border-[#0d272f] py-2 px-4 text-xs font-mono select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#8ea7af]">Breakpoint activo:</span>
            <span className="px-2 py-0.5 bg-[#09222a] border border-[#143d46] text-[#c8f535] font-bold rounded">
              {activeBreakpointLabel}
            </span>
          </div>

          <button
            onClick={onOpenPureCode}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#c8f535]/15 border border-[#c8f535] text-[#c8f535] hover:bg-[#c8f535] hover:text-[#041318] rounded font-bold transition-colors cursor-pointer"
            title="Ver y descargar los archivos HTML y CSS puros"
          >
            <span>&lt;/&gt;</span>
            <span>Ver HTML y CSS Puro</span>
          </button>
        </div>

        {/* Quick Viewport Simulator Controls */}
        <div className="flex items-center gap-1.5 bg-[#06191f] p-1 border border-[#11323a] rounded">
          <span className="text-[11px] text-[#718b93] px-2 hidden sm:inline">Preview Mode:</span>
          
          <button
            onClick={() => onModeChange('responsive')}
            className={`px-2.5 py-1 flex items-center gap-1.5 rounded text-[11px] transition-colors ${
              currentMode === 'responsive'
                ? 'bg-[#c8f535] text-[#041318] font-bold'
                : 'text-[#8ea7af] hover:text-white'
            }`}
            title="Fluid 100% Responsive"
          >
            <Maximize2 size={12} />
            <span className="hidden sm:inline">Fluid</span>
          </button>

          <button
            onClick={() => onModeChange('desktop')}
            className={`px-2.5 py-1 flex items-center gap-1.5 rounded text-[11px] transition-colors ${
              currentMode === 'desktop'
                ? 'bg-[#c8f535] text-[#041318] font-bold'
                : 'text-[#8ea7af] hover:text-white'
            }`}
            title="Desktop Simulation (1200px)"
          >
            <Monitor size={12} />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => onModeChange('tablet')}
            className={`px-2.5 py-1 flex items-center gap-1.5 rounded text-[11px] transition-colors ${
              currentMode === 'tablet'
                ? 'bg-[#c8f535] text-[#041318] font-bold'
                : 'text-[#8ea7af] hover:text-white'
            }`}
            title="Tablet Simulation (768px)"
          >
            <Tablet size={12} />
            <span>Tablet</span>
          </button>

          <button
            onClick={() => onModeChange('mobile')}
            className={`px-2.5 py-1 flex items-center gap-1.5 rounded text-[11px] transition-colors ${
              currentMode === 'mobile'
                ? 'bg-[#c8f535] text-[#041318] font-bold'
                : 'text-[#8ea7af] hover:text-white'
            }`}
            title="Mobile Simulation (390px)"
          >
            <Smartphone size={12} />
            <span>Mobile</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
