import React from 'react';

interface BarcodeProps {
  className?: string;
}

export const Barcode: React.FC<BarcodeProps> = ({ className = '' }) => {
  // A deterministic set of bar widths and gaps matching conference ticket barcodes
  const bars = [
    { width: 3, gap: 2 },
    { width: 1.5, gap: 1.5 },
    { width: 4, gap: 2 },
    { width: 2, gap: 1.5 },
    { width: 1.5, gap: 2.5 },
    { width: 3.5, gap: 1.5 },
    { width: 2, gap: 2 },
    { width: 4.5, gap: 1.5 },
    { width: 1.5, gap: 2 },
    { width: 3, gap: 1.5 },
    { width: 2, gap: 2 },
    { width: 4, gap: 1.5 },
    { width: 2, gap: 2 },
    { width: 3, gap: 0 },
  ];

  let currentX = 0;
  const renderedBars = bars.map((bar, index) => {
    const x = currentX;
    currentX += bar.width + bar.gap;
    return (
      <rect
        key={index}
        x={x}
        y="0"
        width={bar.width}
        height="32"
        fill="currentColor"
      />
    );
  });

  return (
    <svg
      viewBox={`0 0 ${currentX} 32`}
      className={`h-7 sm:h-8 w-auto text-[#06151a] ${className}`}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {renderedBars}
    </svg>
  );
};
