import React, { useState, useEffect } from 'react';
import { Copy, Check, Download, X, Code, FileText } from 'lucide-react';

interface PureCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PureCodeModal: React.FC<PureCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [copied, setCopied] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [cssContent, setCssContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([
        fetch('/schedule.html').then((r) => r.text()),
        fetch('/schedule.css').then((r) => r.text()),
      ])
        .then(([html, css]) => {
          setHtmlContent(html);
          setCssContent(css);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCode = activeTab === 'html' ? htmlContent : cssContent;
  const currentFilename = activeTab === 'html' ? 'schedule.html' : 'schedule.css';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], {
      type: activeTab === 'html' ? 'text/html' : 'text/css',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#05191f] border border-[#143d46] rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#0d2a32] bg-[#030e12]">
          <div className="flex items-center gap-3">
            <Code size={18} className="text-[#c8f535]" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              Código HTML y CSS Puro (Vanilla Standalone)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#8ea7af] hover:text-white p-1 rounded hover:bg-[#143d46] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab & Action Bar */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-[#0d2a32] bg-[#061e25] gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('html')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors cursor-pointer ${
                activeTab === 'html'
                  ? 'bg-[#c8f535] text-[#041318] font-bold shadow-sm'
                  : 'text-[#8ea7af] hover:text-white bg-[#0d2a32]/60'
              }`}
            >
              <FileText size={14} />
              <span>schedule.html</span>
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors cursor-pointer ${
                activeTab === 'css'
                  ? 'bg-[#c8f535] text-[#041318] font-bold shadow-sm'
                  : 'text-[#8ea7af] hover:text-white bg-[#0d2a32]/60'
              }`}
            >
              <FileText size={14} />
              <span>schedule.css</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0e333d] hover:bg-[#154653] text-[#c8f535] border border-[#1e5462] rounded transition-colors cursor-pointer"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0e333d] hover:bg-[#154653] text-white border border-[#1e5462] rounded transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>Descargar {currentFilename}</span>
            </button>
          </div>
        </div>

        {/* File paths note */}
        <div className="px-5 py-2 bg-[#020b0e] border-b border-[#0d2a32] text-[11px] text-[#718f97] flex items-center justify-between">
          <span>
            Archivos creados en tu repositorio: <strong className="text-[#c8f535]">/schedule.html</strong> y <strong className="text-[#c8f535]">/schedule.css</strong>
          </span>
          <span className="hidden sm:inline">100% Vanilla HTML5 + CSS3 (sin dependencias)</span>
        </div>

        {/* Code Content View */}
        <div className="flex-1 overflow-auto p-4 bg-[#030d10] font-mono text-xs text-[#a0c5cf] leading-relaxed">
          {loading ? (
            <div className="p-8 text-center text-[#718f97]">Cargando código...</div>
          ) : (
            <pre className="whitespace-pre overflow-x-auto select-all">
              <code>{currentCode}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
