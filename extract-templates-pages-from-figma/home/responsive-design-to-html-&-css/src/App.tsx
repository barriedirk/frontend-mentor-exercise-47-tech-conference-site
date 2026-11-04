import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Code2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Layers,
  Sparkles,
  Columns,
  Eye,
  FileCode,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [activeBreakpoint, setActiveBreakpoint] = useState<'desktop' | 'tablet' | 'mobile' | 'fluid'>('desktop');
  const [activeTab, setActiveTab] = useState<'preview' | 'compare' | 'html' | 'css'>('preview');
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [cssCode, setCssCode] = useState<string>('');
  const [copiedType, setCopiedType] = useState<'html' | 'css' | null>(null);

  // Load pure code from public files
  useEffect(() => {
    fetch('/pure-code/index.html')
      .then((res) => res.text())
      .then((text) => setHtmlCode(text))
      .catch((err) => console.error(err));

    fetch('/pure-code/style.css')
      .then((res) => res.text())
      .then((text) => setCssCode(text))
      .catch((err) => console.error(err));
  }, []);

  const handleCopy = (type: 'html' | 'css') => {
    const text = type === 'html' ? htmlCode : cssCode;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownload = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    handleDownload('index.html', htmlCode, 'text/html');
    setTimeout(() => {
      handleDownload('style.css', cssCode, 'text/css');
    }, 300);
  };

  const breakpointWidths = {
    desktop: '1440px',
    tablet: '768px',
    mobile: '375px',
    fluid: '100%',
  };

  const mockupImages = {
    desktop: '/assets/aistudio/Desktop_-_Home_fe3129f9.png',
    tablet: '/assets/aistudio/Tablet_-_Home_427e5d83.png',
    mobile: '/assets/aistudio/Mobile_-_Home_be7278cf.png',
    fluid: '/assets/aistudio/Desktop_-_Home_fe3129f9.png',
  };

  return (
    <div className="min-h-screen bg-[#030d12] text-slate-100 flex flex-col font-sans selection:bg-[#cbff00]/30 selection:text-[#cbff00]">
      {/* Top Navbar */}
      <header className="border-b border-[#142e39] bg-[#05161f]/90 backdrop-blur-md sticky top-0 z-50 px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#cbff00] text-[#041219] flex items-center justify-center font-mono font-black text-sm shadow-md shadow-[#cbff00]/20">
            D26
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-white tracking-wider">DEVHORIZON_26</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#cbff00]/10 text-[#cbff00] border border-[#cbff00]/30">
                Pure HTML5 + CSS3
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Fidelidad pixel-perfect en Desktop, Tablet y Móvil
            </p>
          </div>
        </div>

        {/* Center: Viewport Breakpoint Switcher */}
        <div className="flex items-center bg-[#071f2a] p-1 rounded-xl border border-[#163644]">
          <button
            onClick={() => setActiveBreakpoint('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeBreakpoint === 'desktop'
                ? 'bg-[#cbff00] text-[#041219] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Desktop Breakpoint (≥ 1024px, Base: 1440px)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
            <span className="text-[10px] opacity-80">(1440px)</span>
          </button>

          <button
            onClick={() => setActiveBreakpoint('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeBreakpoint === 'tablet'
                ? 'bg-[#cbff00] text-[#041219] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Tablet Breakpoint (768px - 1023px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
            <span className="text-[10px] opacity-80">(768px)</span>
          </button>

          <button
            onClick={() => setActiveBreakpoint('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeBreakpoint === 'mobile'
                ? 'bg-[#cbff00] text-[#041219] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Mobile Breakpoint (< 768px, Base: 375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Móvil</span>
            <span className="text-[10px] opacity-80">(375px)</span>
          </button>

          <button
            onClick={() => setActiveBreakpoint('fluid')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeBreakpoint === 'fluid'
                ? 'bg-[#cbff00] text-[#041219] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Full Width / Fluid"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Fluido</span>
          </button>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {/* Quick open in new tab */}
          <a
            href="/pure-code/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg text-slate-300 hover:text-white bg-[#071f2a] border border-[#163644] hover:border-[#cbff00]/50 transition-colors"
            title="Abrir el HTML puro directamente en el navegador"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#cbff00]" />
            <span className="hidden sm:inline">Abrir HTML Puro</span>
          </a>

          {/* Download Bundle */}
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-[#cbff00] text-[#041219] hover:bg-[#b8e600] transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Descargar .HTML + .CSS</span>
            <span className="sm:hidden">Descargar</span>
          </button>
        </div>
      </header>

      {/* Mode Sub-Navigation Tabs */}
      <div className="border-b border-[#142e39] bg-[#04131c] px-4 md:px-6 flex items-center justify-between text-xs font-mono overflow-x-auto">
        <div className="flex items-center gap-1 py-1">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
              activeTab === 'preview'
                ? 'border-[#cbff00] text-[#cbff00] font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista Previa Interactiva</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
              activeTab === 'compare'
                ? 'border-[#cbff00] text-[#cbff00] font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Comparar con PNG Mockup</span>
          </button>

          <button
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
              activeTab === 'html'
                ? 'border-[#cbff00] text-[#cbff00] font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Código HTML Puro (index.html)</span>
          </button>

          <button
            onClick={() => setActiveTab('css')}
            className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-all ${
              activeTab === 'css'
                ? 'border-[#cbff00] text-[#cbff00] font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código CSS Puro (style.css)</span>
          </button>
        </div>

        {/* Tab-specific actions */}
        {(activeTab === 'html' || activeTab === 'css') && (
          <div className="flex items-center gap-2 py-1">
            <button
              onClick={() => handleCopy(activeTab)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0b2430] hover:bg-[#103344] text-slate-200 text-xs font-mono border border-[#1b3e4e] transition-colors"
            >
              {copiedType === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#cbff00]" />
                  <span className="text-[#cbff00]">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar {activeTab.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-[#020b0f] relative overflow-hidden">
        {/* Tab 1: Live Interactive Preview */}
        {activeTab === 'preview' && (
          <div className="flex-1 flex flex-col items-center p-3 md:p-6 overflow-y-auto">
            {/* Viewport Frame */}
            <div
              className="transition-all duration-300 ease-out bg-[#041219] border border-[#163644] rounded-xl shadow-2xl overflow-hidden flex flex-col"
              style={{
                width: breakpointWidths[activeBreakpoint],
                maxWidth: '100%',
                height: 'calc(100vh - 140px)',
              }}
            >
              {/* Browser Chromeless Header */}
              <div className="px-4 py-2 bg-[#061922] border-b border-[#142e39] flex items-center justify-between shrink-0 font-mono text-xs text-slate-400 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-medium text-slate-300">
                    {activeBreakpoint === 'desktop' && 'Desktop Resolution (1440px wide)'}
                    {activeBreakpoint === 'tablet' && 'Tablet Resolution (768px wide)'}
                    {activeBreakpoint === 'mobile' && 'Mobile Viewport (375px wide)'}
                    {activeBreakpoint === 'fluid' && 'Fluid Viewport (100% responsive)'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#cbff00]">
                  <span>● Live Render: /pure-code/index.html</span>
                </div>
              </div>

              {/* Iframe displaying the pure HTML/CSS */}
              <iframe
                src="/pure-code/index.html"
                title="DEVHORIZON_26 Live Preview"
                className="w-full flex-1 border-0 bg-[#041219]"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Compare Side-by-Side with Mockup */}
        {activeTab === 'compare' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="bg-[#071f2a] border border-[#163644] p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">
                  Comparativa en vivo del breakpoint activo:{' '}
                  <strong className="text-[#cbff00] uppercase">{activeBreakpoint}</strong>
                </span>
                <span className="text-slate-400">
                  Izquierda: Código HTML/CSS renderizado | Derecha: Tu captura PNG original
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left: Rendered Code View */}
                <div className="border border-[#163644] rounded-xl overflow-hidden bg-[#041219] shadow-xl">
                  <div className="px-4 py-2 bg-[#061922] border-b border-[#142e39] font-mono text-xs text-[#cbff00] flex items-center justify-between">
                    <span>1. CÓDIGO HTML5 + CSS3 (INTERACTIVO)</span>
                    <span className="text-slate-400 text-[11px]">En vivo</span>
                  </div>
                  <div className="h-[800px] overflow-hidden">
                    <iframe
                      src="/pure-code/index.html"
                      title="Comparison Render"
                      className="w-full h-full border-0 bg-[#041219]"
                    />
                  </div>
                </div>

                {/* Right: Mockup Image */}
                <div className="border border-[#163644] rounded-xl overflow-hidden bg-[#041219] shadow-xl">
                  <div className="px-4 py-2 bg-[#061922] border-b border-[#142e39] font-mono text-xs text-slate-300 flex items-center justify-between">
                    <span>2. CAPTURA PNG ORIGINAL</span>
                    <span className="text-slate-400 text-[11px]">Diseño de referencia</span>
                  </div>
                  <div className="h-[800px] overflow-y-auto p-2 bg-[#020b0f] flex justify-center">
                    <img
                      src={mockupImages[activeBreakpoint]}
                      alt={`Mockup ${activeBreakpoint}`}
                      className="max-w-full h-auto object-top shadow-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: HTML Code Viewer */}
        {activeTab === 'html' && (
          <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
            <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col border border-[#163644] rounded-xl bg-[#041219] overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 bg-[#061922] border-b border-[#142e39] flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#cbff00] font-bold">index.html</span>
                  <span className="text-slate-400">· HTML5 semántico puro (sin Tailwind, sin React, 100% estándar)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload('index.html', htmlCode, 'text/html')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0b2430] hover:bg-[#123647] text-slate-200 text-xs border border-[#183d4e]"
                  >
                    <Download className="w-3 h-3" />
                    <span>Descargar</span>
                  </button>
                  <button
                    onClick={() => handleCopy('html')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#cbff00] text-[#041219] font-bold text-xs hover:bg-[#b8e600]"
                  >
                    {copiedType === 'html' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === 'html' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-[#030e13]">
                <pre className="font-mono text-xs leading-relaxed text-slate-300">
                  <code>{htmlCode}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: CSS Code Viewer */}
        {activeTab === 'css' && (
          <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
            <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col border border-[#163644] rounded-xl bg-[#041219] overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 bg-[#061922] border-b border-[#142e39] flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#cbff00] font-bold">style.css</span>
                  <span className="text-slate-400">· CSS3 puro con Media Queries (Desktop, Tablet y Móvil)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload('style.css', cssCode, 'text/css')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0b2430] hover:bg-[#123647] text-slate-200 text-xs border border-[#183d4e]"
                  >
                    <Download className="w-3 h-3" />
                    <span>Descargar</span>
                  </button>
                  <button
                    onClick={() => handleCopy('css')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#cbff00] text-[#041219] font-bold text-xs hover:bg-[#b8e600]"
                  >
                    {copiedType === 'css' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === 'css' ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-[#030e13]">
                <pre className="font-mono text-xs leading-relaxed text-slate-300">
                  <code>{cssCode}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
