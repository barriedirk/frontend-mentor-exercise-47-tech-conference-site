import React, { useState } from 'react';
import { X, Star, Check } from 'lucide-react';

export interface SpeakerData {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  talkCategory: string;
  talkTitle: string;
  talkStartTime: string;
  talkEndTime: string;
  avatarUrl: string;
}

interface SpeakerModalProps {
  speaker: SpeakerData;
  isOpen: boolean;
  onClose: () => void;
  // Permite forzar un breakpoint en modo simulador o usar el ancho natural
  forceBreakpoint?: 'desktop' | 'tablet' | 'mobile' | 'auto';
  // Si es true, se renderiza con absolute inset-0 dentro del marco del dispositivo en lugar de fixed pantalla completa
  embedded?: boolean;
}

export const SpeakerModal: React.FC<SpeakerModalProps> = ({
  speaker,
  isOpen,
  onClose,
  forceBreakpoint = 'auto',
  embedded = false,
}) => {
  const [isStarred, setIsStarred] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  if (!isOpen) return null;

  // Clases condicionales si se fuerza un breakpoint en la simulación
  const isForcedMobile = forceBreakpoint === 'mobile';
  const isForcedTablet = forceBreakpoint === 'tablet';
  const isForcedDesktop = forceBreakpoint === 'desktop';

  // Contenedor principal modal-dialog
  const dialogWidthClass = isForcedMobile
    ? 'w-[92%] max-w-[360px] p-4'
    : isForcedTablet
    ? 'w-[90%] max-w-[640px] p-7'
    : isForcedDesktop
    ? 'w-[90%] max-w-[720px] p-8'
    : 'w-[92%] max-w-[720px] p-5 sm:p-7 lg:p-8';

  // Perfil (fila o columna)
  const profileFlexClass = isForcedMobile
    ? 'flex flex-col gap-4'
    : isForcedTablet || isForcedDesktop
    ? 'flex flex-row items-center gap-5 sm:gap-6 pr-12'
    : 'flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 sm:pr-12';

  // Tamaño de avatar
  const avatarSizeClass = isForcedMobile
    ? 'w-[100px] h-[100px]'
    : isForcedTablet
    ? 'w-[120px] h-[120px]'
    : isForcedDesktop
    ? 'w-[130px] h-[130px]'
    : 'w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[130px] lg:h-[130px]';

  // Ticket flex
  const ticketFlexClass = isForcedMobile
    ? 'flex flex-col'
    : isForcedTablet || isForcedDesktop
    ? 'flex flex-row items-stretch'
    : 'flex flex-col sm:flex-row sm:items-stretch';

  // Ticket badge
  const ticketBadgeClass = isForcedMobile
    ? 'w-full py-2 px-3 text-center border-b border-[#143542] text-[11px]'
    : isForcedTablet || isForcedDesktop
    ? 'w-[38px] md:w-[42px] py-4 px-2 border-r border-[#143542] [writing-mode:vertical-rl] rotate-180 flex items-center justify-center whitespace-nowrap text-[11px]'
    : 'w-full sm:w-[38px] md:w-[42px] py-2 sm:py-4 px-3 sm:px-2 border-b sm:border-b-0 sm:border-r border-[#143542] sm:[writing-mode:vertical-rl] sm:rotate-180 flex items-center justify-center whitespace-nowrap text-[11px]';

  // Ticket stub (derecha o abajo)
  const ticketStubClass = isForcedMobile
    ? 'border-t-[1.5px] border-dashed border-[#05141d] px-4 py-3 flex flex-row items-center justify-between gap-3 bg-[#bcf1f6]'
    : isForcedTablet || isForcedDesktop
    ? 'border-l-[1.5px] border-dashed border-[#05141d] px-3.5 py-4 flex flex-col items-center justify-between gap-2.5 w-[125px] lg:w-[135px] shrink-0 bg-[#bcf1f6]'
    : 'border-t-[1.5px] sm:border-t-0 sm:border-l-[1.5px] border-dashed border-[#05141d] px-4 sm:px-3.5 py-3 sm:py-4 flex flex-row sm:flex-col items-center justify-between gap-3 sm:gap-2.5 sm:w-[125px] lg:w-[135px] shrink-0 bg-[#bcf1f6]';

  const backdropPositionClass = embedded
    ? 'absolute inset-0 z-30'
    : 'fixed inset-0 z-50';

  return (
    <div
      className={`${backdropPositionClass} flex items-center justify-center p-3 sm:p-5 bg-[#030b10]/90 backdrop-blur-md overflow-y-auto`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="speakerModalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Contenedor Modal */}
      <div
        className={`relative bg-[#061620] border border-[#153949] text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] my-auto transition-all ${dialogWidthClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de Cierre (X) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 bg-transparent border border-white/80 hover:border-white text-white flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[#b6f338]"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4 stroke-[2.2]" />
        </button>

        {/* Sección de Perfil: Foto + Nombre + Cargo */}
        <div className={profileFlexClass}>
          {/* Marco de Avatar con fondo cyan suave */}
          <div className={`${avatarSizeClass} shrink-0 bg-[#8ed3e8] border border-[#153949] overflow-hidden relative shadow-sm`}>
            <img
              src={speaker.avatarUrl}
              alt={speaker.name}
              className="w-full h-full object-cover object-top"
              loading="eager"
            />
          </div>

          {/* Información del Speaker */}
          <div className="flex flex-col">
            <h2
              id="speakerModalTitle"
              className="font-bold text-white text-[22px] sm:text-[26px] lg:text-[29px] leading-[1.15] tracking-tight font-sans lowercase"
            >
              {speaker.name}
            </h2>
            <p className="font-mono text-[10.5px] sm:text-[11.5px] font-medium text-[#8faec0] tracking-[0.12em] uppercase mt-1">
              {speaker.role} @ {speaker.company}
            </p>
          </div>
        </div>

        {/* Divisor */}
        <hr className="border-none h-[1px] bg-[#153949] my-4 sm:my-5" />

        {/* Biografía en fuente mono */}
        <p className="font-mono text-[12.5px] sm:text-[13.5px] leading-[1.65] text-[#8ea8b8]">
          {speaker.bio}
        </p>

        {/* Divisor */}
        <hr className="border-none h-[1px] bg-[#153949] my-4 sm:my-5" />

        {/* Encabezado // TALK */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-mono text-[13px] sm:text-[14px] font-bold text-[#b6f338] tracking-[0.08em]">
            // TALK
          </h3>
          {copiedNotification && (
            <span className="text-[11px] font-mono text-[#b6f338] flex items-center gap-1">
              <Check className="w-3 h-3" /> Añadido a tu agenda
            </span>
          )}
        </div>

        {/* Tarjeta Ticket Responsiva */}
        <div className={`border border-[#153949] bg-[#bcf1f6] text-[#05141d] overflow-hidden ${ticketFlexClass}`}>
          
          {/* Badge KEYNOTE */}
          <div className={`bg-[#071922] text-white font-mono font-semibold tracking-[0.15em] shrink-0 ${ticketBadgeClass}`}>
            {speaker.talkCategory}
          </div>

          {/* Cuerpo Central del Ticket */}
          <div className="p-3.5 sm:p-5 lg:p-6 flex-1 flex flex-col justify-center gap-1.5 sm:gap-2">
            <h4 className="font-sans font-extrabold text-[18px] sm:text-[21px] lg:text-[24px] leading-[1.15] text-[#05141d] tracking-tight lowercase">
              {speaker.talkTitle}
            </h4>
            <p className="font-mono text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.1em] text-[#173847] uppercase">
              {speaker.name} <span className="text-[#4a7587] font-bold mx-1">//</span> {speaker.company}
            </p>
          </div>

          {/* Colilla / Stub del Ticket */}
          <div className={ticketStubClass}>
            {/* Horario */}
            <div className="font-mono flex flex-col leading-none text-left sm:text-center">
              <span className="text-[17px] sm:text-[19px] font-black tracking-tight text-[#05141d]">
                {speaker.talkStartTime}
              </span>
              <span className="text-[11px] font-medium text-[#05141d]/75 mt-0.5">
                {speaker.talkEndTime}
              </span>
            </div>

            {/* Código de barras realista con CSS puro */}
            <div
              className="flex items-center h-8 sm:h-9 gap-[2px] justify-center px-1"
              aria-hidden="true"
            >
              <span className="w-[5px] h-full bg-[#05141d] inline-block"></span>
              <span className="w-[1.5px] h-full bg-[#05141d] inline-block"></span>
              <span className="w-[3px] h-full bg-[#05141d] inline-block"></span>
              <span className="w-[1.5px] h-full bg-[#05141d] inline-block"></span>
              <span className="w-[4.5px] h-full bg-[#05141d] inline-block"></span>
              <span className="w-[1.5px] h-full bg-[#05141d] inline-block"></span>
              <span className="w-[3.5px] h-full bg-[#05141d] inline-block"></span>
              <span className="w-[5px] h-full bg-[#05141d] inline-block"></span>
              <span className="w-[1.5px] h-full bg-[#05141d] inline-block"></span>
              <span className="w-[3px] h-full bg-[#05141d] inline-block"></span>
              <span className="w-[4.5px] h-full bg-[#05141d] inline-block"></span>
            </div>

            {/* Botón Favorito / Guardar charla */}
            <button
              type="button"
              onClick={() => {
                setIsStarred(!isStarred);
                setCopiedNotification(true);
                setTimeout(() => setCopiedNotification(false), 2000);
              }}
              className={`w-8 h-8 rounded-full border-[1.5px] border-[#05141d] flex items-center justify-center transition-all ${
                isStarred
                  ? 'bg-[#05141d] text-[#bcf1f6] scale-105'
                  : 'bg-transparent text-[#05141d] hover:bg-[#05141d]/15 hover:scale-105'
              }`}
              title={isStarred ? 'Guardado en tu horario' : 'Guardar en mi horario'}
              aria-label="Guardar charla en horario"
            >
              <Star
                className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`}
                strokeWidth={2}
              />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
