import React, { useState } from 'react';
import { Copy, Check, Code, FileText, Layers, Smartphone, Tablet, Monitor } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'guide'>('html');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const pureHtmlCode = `<!-- ============================================================
     DEVHORIZON_26 - ESTRUCTURA HTML PURA DEL MODAL DE SPEAKER
     Diseño Flexible y Centrado (Mobile, Tablet, Desktop)
     ============================================================ -->
<div 
  id="speakerModal" 
  class="modal-backdrop" 
  role="dialog" 
  aria-modal="true" 
  aria-labelledby="speakerName"
>
  <!-- Contenedor Centrado del Modal -->
  <div class="modal-dialog">

    <!-- Botón de Cierre (X) -->
    <button 
      type="button" 
      class="modal-close-btn" 
      onclick="closeSpeakerModal()" 
      aria-label="Cerrar modal"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="2" y1="2" x2="12" y2="12"></line>
        <line x1="12" y1="2" x2="2" y2="12"></line>
      </svg>
    </button>

    <!-- Sección de Perfil (Avatar + Nombre + Cargo) -->
    <!-- En Mobile: columna apilada | En Tablet y Desktop: fila horizontal -->
    <div class="speaker-profile">
      <div class="speaker-avatar-frame">
        <img 
          src="assets/elena_vasquez.jpg" 
          alt="Elena Vasquez" 
          class="speaker-avatar"
        />
      </div>
      <div class="speaker-meta">
        <h2 id="speakerName" class="speaker-name">elena vasquez</h2>
        <p class="speaker-role">PRINCIPAL FRONTEND ENGINEER @ BYTECRAFT</p>
      </div>
    </div>

    <!-- Divisor Horizontal -->
    <hr class="modal-divider" />

    <!-- Biografía en Fuente Mono -->
    <p class="speaker-bio">
      Elena has spent the last decade pushing the boundaries of in-browser development environments. She led the browser-native IDE initiative at Bytecraft and is a frequent contributor to the TC39 process. Her work focuses on making the web platform a first-class development target.
    </p>

    <!-- Divisor Horizontal -->
    <hr class="modal-divider" />

    <!-- Título de la Sección de Charla -->
    <h3 class="talk-section-title">// TALK</h3>

    <!-- Tarjeta Ticket Responsiva -->
    <!-- En Mobile: Apilada (Badge arriba, cuerpo al medio, colilla abajo) -->
    <!-- En Tablet y Desktop: 3 columnas (Badge vertical izquierda, cuerpo centro, colilla derecha) -->
    <div class="talk-ticket">
      
      <!-- Insignia KEYNOTE -->
      <div class="ticket-badge">
        KEYNOTE
      </div>

      <!-- Cuerpo Central de la Charla (Fondo Celeste) -->
      <div class="ticket-body">
        <h4 class="ticket-title">the next frontier of web development</h4>
        <p class="ticket-author">
          ELENA VASQUEZ <span class="ticket-slash">//</span> BYTECRAFT
        </p>
      </div>

      <!-- Colilla / Stub con Horario, Código de Barras y Favorito -->
      <div class="ticket-stub">
        <div class="ticket-schedule">
          <span class="ticket-time-main">9:00</span>
          <span class="ticket-time-sub">10:00</span>
        </div>

        <!-- Código de barras puro en CSS -->
        <div class="ticket-barcode" aria-hidden="true">
          <span class="bar-thick"></span>
          <span class="bar-thin"></span>
          <span class="bar-medium"></span>
          <span class="bar-thin"></span>
          <span class="bar-thick"></span>
          <span class="bar-thin"></span>
          <span class="bar-medium"></span>
          <span class="bar-thick"></span>
          <span class="bar-thin"></span>
          <span class="bar-medium"></span>
          <span class="bar-thick"></span>
        </div>

        <!-- Botón interactivo de Favorito -->
        <button 
          type="button" 
          class="ticket-fav-btn" 
          onclick="this.classList.toggle('is-saved')" 
          aria-label="Guardar en agenda"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </button>
      </div>

    </div>

  </div>
</div>`;

  const pureCssCode = `/* ==========================================================================
   DEVHORIZON_26 - HOJA DE ESTILOS CSS PURA
   Estructura Responsiva, Flexible y Centrada para Modal de Speaker
   ========================================================================== */

/* 1. TOKENS Y VARIABLES DE COLOR */
:root {
  --color-backdrop: rgba(3, 11, 16, 0.88);
  --color-modal-bg: #061620;
  --color-modal-border: #153949;
  --color-divider: #153949;
  --color-text-main: #ffffff;
  --color-text-role: #8faec0;
  --color-text-muted: #8ea8b8;
  --color-accent-lime: #b6f338;
  
  --color-ticket-bg: #bcf1f6;
  --color-ticket-text: #05141d;
  --color-ticket-badge-bg: #071922;

  --font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

/* 2. BACKDROP Y CENTRADO FLEXIBLE
   Utiliza Flexbox para garantizar el centrado exacto horizontal y vertical
   con soporte para scroll cuando la ventana es pequeña. */
.modal-backdrop {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-backdrop);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  /* Centrado con Flexbox */
  display: flex;
  align-items: center;      /* Centrado vertical */
  justify-content: center;   /* Centrado horizontal */
  
  padding: 16px;
  overflow-y: auto;          /* Scroll seguro */
  z-index: 1000;
  box-sizing: border-box;
}

/* 3. DIALOG CONTENEDOR */
.modal-dialog {
  position: relative;
  width: 100%;
  max-width: 680px;
  background-color: var(--color-modal-bg);
  border: 1px solid var(--color-modal-border);
  box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.85);
  padding: 24px 20px;
  margin: auto;             /* Clave para centrado flexible con scroll */
  box-sizing: border-box;
}

/* 4. BOTÓN DE CIERRE (X) */
.modal-close-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.85);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.15s ease;
}
.modal-close-btn:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

/* 5. PERFIL DEL SPEAKER (MOBILE FIRST: Columna apilada) */
.speaker-profile {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.speaker-avatar-frame {
  width: 105px;
  height: 105px;
  background-color: #8ed3e8;
  border: 1px solid var(--color-modal-border);
  flex-shrink: 0;
  overflow: hidden;
}

.speaker-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

.speaker-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.speaker-name {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-main);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0;
}

.speaker-role {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-role);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0;
}

/* 6. DIVISORES Y BIOGRAFÍA */
.modal-divider {
  border: none;
  height: 1px;
  background-color: var(--color-divider);
  margin: 18px 0;
}

.speaker-bio {
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.65;
  color: var(--color-text-muted);
  margin: 0;
}

/* 7. TALK & TICKET (MOBILE FIRST) */
.talk-section-title {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent-lime);
  letter-spacing: 0.08em;
  margin: 0 0 12px 0;
}

.talk-ticket {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-modal-border);
  background-color: var(--color-ticket-bg);
  color: var(--color-ticket-text);
  overflow: hidden;
}

/* Badge KEYNOTE superior en mobile */
.ticket-badge {
  background-color: var(--color-ticket-badge-bg);
  color: #ffffff;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-align: center;
  padding: 8px 12px;
  border-bottom: 1px solid var(--color-modal-border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ticket-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ticket-title {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 800;
  line-height: 1.15;
  color: var(--color-ticket-text);
  margin: 0;
}

.ticket-author {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: #173847;
  text-transform: uppercase;
  margin: 0;
}

.ticket-slash {
  color: #4a7587;
  margin: 0 4px;
}

/* Colilla inferior en mobile */
.ticket-stub {
  border-top: 1.5px dashed var(--color-ticket-text);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background-color: var(--color-ticket-bg);
}

.ticket-schedule {
  display: flex;
  flex-direction: column;
  font-family: var(--font-mono);
  line-height: 1;
}

.ticket-time-main {
  font-size: 18px;
  font-weight: 800;
}

.ticket-time-sub {
  font-size: 11px;
  opacity: 0.8;
  margin-top: 2px;
}

/* Código de barras */
.ticket-barcode {
  display: flex;
  align-items: center;
  height: 38px;
  gap: 2px;
}
.ticket-barcode span {
  display: inline-block;
  height: 100%;
  background-color: var(--color-ticket-text);
}
.bar-thin   { width: 1.5px; }
.bar-medium { width: 3.5px; }
.bar-thick  { width: 5.5px; }

/* Botón Favorito */
.ticket-fav-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: transparent;
  color: var(--color-ticket-text);
  border: 1.5px solid var(--color-ticket-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.ticket-fav-btn.is-saved {
  background-color: var(--color-ticket-text);
  color: var(--color-ticket-bg);
}

/* ==========================================================================
   BREAKPOINTS RESPONSIVOS
   ========================================================================== */

/* TABLET (min-width: 768px) */
@media (min-width: 768px) {
  .modal-dialog {
    max-width: 660px;
    padding: 28px 28px 24px 28px;
  }

  /* Perfil se convierte en fila horizontal */
  .speaker-profile {
    flex-direction: row;
    align-items: center;
    gap: 22px;
    padding-right: 50px;
  }

  .speaker-avatar-frame {
    width: 120px;
    height: 120px;
  }

  .speaker-name {
    font-size: 27px;
  }

  /* Ticket se convierte en fila de 3 secciones */
  .talk-ticket {
    flex-direction: row;
    align-items: stretch;
  }

  .ticket-badge {
    border-bottom: none;
    border-right: 1px solid var(--color-modal-border);
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    width: 38px;
    padding: 16px 10px;
    letter-spacing: 0.18em;
  }

  .ticket-body {
    flex: 1;
    padding: 20px 22px;
    justify-content: center;
  }

  .ticket-title {
    font-size: 22px;
  }

  .ticket-stub {
    border-top: none;
    border-left: 1.5px dashed var(--color-ticket-text);
    flex-direction: column;
    justify-content: space-between;
    width: 125px;
    padding: 16px 12px;
    gap: 10px;
  }

  .ticket-schedule {
    text-align: center;
    align-items: center;
  }

  .ticket-barcode {
    height: 32px;
    justify-content: center;
  }
}

/* DESKTOP (min-width: 1024px) */
@media (min-width: 1024px) {
  .modal-dialog {
    max-width: 720px;
    padding: 32px 32px 28px 32px;
  }

  .speaker-avatar-frame {
    width: 130px;
    height: 130px;
  }

  .speaker-name {
    font-size: 29px;
  }

  .ticket-badge {
    width: 42px;
  }

  .ticket-body {
    padding: 24px 26px;
  }

  .ticket-title {
    font-size: 24px;
  }

  .ticket-stub {
    width: 135px;
    padding: 18px 14px;
  }

  .ticket-time-main {
    font-size: 20px;
  }
}`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2200);
  };

  return (
    <div className="bg-[#040e14] border border-[#143542] rounded-none overflow-hidden text-slate-200">
      {/* Header del Visor de Código */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#061620] border-b border-[#143542]">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-[#b6f338]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
            Código Puro HTML & CSS
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 bg-[#0e2733] text-[#8faec0] border border-[#1b4355]">
            Sin dependencias
          </span>
        </div>

        {/* Selector de Pestaña */}
        <div className="flex items-center gap-1 bg-[#040d13] p-1 border border-[#143542]">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1 font-mono text-xs font-medium transition-colors ${
              activeTab === 'html'
                ? 'bg-[#153949] text-white shadow-sm'
                : 'text-[#8faec0] hover:text-white'
            }`}
          >
            index.html
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-3 py-1 font-mono text-xs font-medium transition-colors ${
              activeTab === 'css'
                ? 'bg-[#153949] text-white shadow-sm'
                : 'text-[#8faec0] hover:text-white'
            }`}
          >
            style.css
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1 font-mono text-xs font-medium transition-colors ${
              activeTab === 'guide'
                ? 'bg-[#153949] text-white shadow-sm'
                : 'text-[#8faec0] hover:text-white'
            }`}
          >
            Arquitectura & Breakpoints
          </button>
        </div>

        {/* Botón Copiar */}
        <button
          onClick={() => {
            if (activeTab === 'html') copyToClipboard(pureHtmlCode, 'html');
            else if (activeTab === 'css') copyToClipboard(pureCssCode, 'css');
            else copyToClipboard(pureHtmlCode + '\n\n' + pureCssCode, 'all');
          }}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#b6f338] text-[#05141d] font-mono text-xs font-bold hover:bg-[#cbfd55] transition-colors"
        >
          {copiedType ? (
            <>
              <Check className="w-3.5 h-3.5" /> ¡Copiado!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copiar {activeTab.toUpperCase()}
            </>
          )}
        </button>
      </div>

      {/* Contenido de Código */}
      <div className="p-4 sm:p-6 overflow-x-auto max-h-[640px]">
        {activeTab === 'html' && (
          <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-[#cbe2ee] whitespace-pre selection:bg-[#1a4e66]">
            <code>{pureHtmlCode}</code>
          </pre>
        )}

        {activeTab === 'css' && (
          <pre className="font-mono text-xs sm:text-[13px] leading-relaxed text-[#cbe2ee] whitespace-pre selection:bg-[#1a4e66]">
            <code>{pureCssCode}</code>
          </pre>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-6 font-sans text-sm text-[#a4c1d2] max-w-3xl">
            <div>
              <h3 className="font-mono text-base font-bold text-white mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#b6f338]" /> 1. El Centrado Flexible con Flexbox
              </h3>
              <p className="leading-relaxed mb-3">
                Para lograr que el modal quede perfectamente centrado en cualquier pantalla sin riesgo de recortarse o salirse en dispositivos con poca altura, se combina:
              </p>
              <div className="bg-[#061620] border border-[#153949] p-3 font-mono text-xs text-[#b6f338] space-y-1">
                <div>.modal-backdrop &#123;</div>
                <div className="pl-4 text-white">display: flex;</div>
                <div className="pl-4 text-white">align-items: center; /* Centrado vertical */</div>
                <div className="pl-4 text-white">justify-content: center; /* Centrado horizontal */</div>
                <div className="pl-4 text-white">overflow-y: auto; /* Permite scroll seguro en móviles */</div>
                <div className="pl-4 text-white">padding: 16px;</div>
                <div>&#125;</div>
                <div>.modal-dialog &#123;</div>
                <div className="pl-4 text-white">margin: auto; /* Mantiene el flujo natural centrado */</div>
                <div className="pl-4 text-white">max-width: 680px;</div>
                <div>&#125;</div>
              </div>
            </div>

            <div className="border-t border-[#143542] pt-5">
              <h3 className="font-mono text-base font-bold text-white mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#b6f338]" /> 2. Comportamiento en los 3 Breakpoints
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div className="bg-[#061620] border border-[#153949] p-3.5">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#b6f338] mb-1.5">
                    <Smartphone className="w-3.5 h-3.5" /> Mobile (&lt; 768px)
                  </div>
                  <ul className="text-xs space-y-1.5 list-disc list-inside text-[#8faec0]">
                    <li>Avatar arriba a la izquierda, botón [X] a la derecha.</li>
                    <li>Nombre y cargo apilados debajo del avatar.</li>
                    <li>Insignia KEYNOTE como barra horizontal superior del ticket.</li>
                    <li>Colilla del ticket horizontal en la base con horario, código y estrella.</li>
                  </ul>
                </div>

                <div className="bg-[#061620] border border-[#153949] p-3.5">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#b6f338] mb-1.5">
                    <Tablet className="w-3.5 h-3.5" /> Tablet (768px - 1023px)
                  </div>
                  <ul className="text-xs space-y-1.5 list-disc list-inside text-[#8faec0]">
                    <li>Perfil en fila: Avatar a la izquierda, nombre y cargo al costado.</li>
                    <li>Max-width: 660px centrado.</li>
                    <li>Ticket pasa a ser fila de 3 columnas horizontales.</li>
                    <li>KEYNOTE vertical rotado 90° con writing-mode a la izquierda.</li>
                    <li>Colilla vertical a la derecha con línea discontinua.</li>
                  </ul>
                </div>

                <div className="bg-[#061620] border border-[#153949] p-3.5">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#b6f338] mb-1.5">
                    <Monitor className="w-3.5 h-3.5" /> Desktop (&ge; 1024px)
                  </div>
                  <ul className="text-xs space-y-1.5 list-disc list-inside text-[#8faec0]">
                    <li>Max-width óptimo de 720px con padding generoso (32px).</li>
                    <li>Avatar ampliado a 130px con nombre en 29px.</li>
                    <li>Mantiene la distribución en 3 columnas del ticket.</li>
                    <li>Código de barras y estrella alineados verticalmente.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-[#143542] pt-5">
              <h3 className="font-mono text-base font-bold text-white mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#b6f338]" /> 3. Detalle de la Insignia Vertical (Writing-Mode)
              </h3>
              <p className="leading-relaxed mb-2 text-xs">
                Para el texto vertical girado en Tablet y Desktop, se utiliza CSS moderno nativo sin trucos raros:
              </p>
              <div className="bg-[#061620] border border-[#153949] p-3 font-mono text-xs text-[#b6f338]">
                writing-mode: vertical-rl;
                <br />
                transform: rotate(180deg);
                <br />
                white-space: nowrap;
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
