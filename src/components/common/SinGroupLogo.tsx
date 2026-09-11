import React from 'react';

interface SinGroupLogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const SinGroupLogo: React.FC<SinGroupLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showSubtitle = true,
}) => {
  // Icon sizes
  const iconDimensions = {
    sm: { w: 28, h: 28, scale: 0.75 },
    md: { w: 38, h: 38, scale: 1 },
    lg: { w: 52, h: 52, scale: 1.35 },
    xl: { w: 72, h: 72, scale: 1.85 },
  }[size];

  // Pure SVG reproduction of the exact uploaded Pixel Star + Cursor emblem
  const PixelCursorEmblem = ({ width = 42, height = 42 }: { width?: number; height?: number }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 46 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-md select-none"
    >
      {/* Red Pixel Sparkle / Star (Pixel grid reproduction) */}
      <g>
        {/* Top spark tip */}
        <rect x="22" y="2" width="3" height="5" fill="#DC2626" />
        <rect x="20" y="6" width="7" height="4" fill="#EF4444" />
        <rect x="18" y="10" width="11" height="4" fill="#F43F5E" />
        
        {/* Left spark tip */}
        <rect x="2" y="22" width="5" height="3" fill="#DC2626" />
        <rect x="6" y="20" width="4" height="7" fill="#EF4444" />
        <rect x="10" y="18" width="4" height="11" fill="#F43F5E" />
        
        {/* Center glowing core */}
        <rect x="14" y="14" width="18" height="18" fill="#EF4444" />
        <rect x="17" y="17" width="12" height="12" fill="#FB7185" />
        
        {/* Right spark tip */}
        <rect x="32" y="18" width="4" height="11" fill="#F43F5E" />
        <rect x="36" y="20" width="4" height="7" fill="#EF4444" />
        <rect x="39" y="22" width="5" height="3" fill="#DC2626" />
        
        {/* Bottom spark tip */}
        <rect x="18" y="32" width="11" height="4" fill="#F43F5E" />
        <rect x="20" y="36" width="7" height="4" fill="#EF4444" />
        <rect x="22" y="39" width="3" height="5" fill="#DC2626" />
      </g>

      {/* Retro Pixel Mouse Cursor Arrow (Black border outline + White body) */}
      <g transform="translate(14, 12)">
        {/* Pixel outline */}
        <polygon
          points="0,0 0,26 6,20 12,31 17,29 11,18 20,18"
          fill="#0F172A"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinejoin="miter"
        />
        {/* Pixel white interior */}
        <polygon
          points="1,2 1,23 5.5,18.5 11,29 14.5,27.5 9.5,17 17.5,17"
          fill="#FFFDF8"
        />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <PixelCursorEmblem width={iconDimensions.w} height={iconDimensions.h} />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-start select-none ${className}`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <PixelCursorEmblem width={iconDimensions.w + 6} height={iconDimensions.h + 6} />
            <div className="absolute -inset-1 bg-rose-500/20 blur-md -z-10 rounded-full" />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-white text-xl tracking-tight font-sans">Sin</span>
              <span className="font-extrabold text-slate-200 text-xl tracking-tight font-sans">group</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-rose-400 font-semibold text-sm tracking-wider uppercase">Medya</span>
              {showSubtitle && (
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  ERP
                </span>
              )}
            </div>
          </div>
        </div>
        {showSubtitle && (
          <p className="text-[11px] text-slate-400 mt-1.5 font-medium pl-0.5">
            Tech, Digital Media &amp; Academy
          </p>
        )}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-rose-500/30 shadow-sm ${className}`}>
        <PixelCursorEmblem width={24} height={24} />
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-white font-bold">Sin group</span>
          <span className="text-rose-400">Medya</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 font-normal">Business Suite</span>
        </div>
      </div>
    );
  }

  // Default: horizontal variant
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center p-1 rounded-lg bg-slate-900/60 border border-slate-800 shadow-inner">
        <PixelCursorEmblem width={iconDimensions.w} height={iconDimensions.h} />
      </div>
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-white text-base tracking-tight">Sin group</span>
          <span className="font-bold text-rose-500 text-sm tracking-wide uppercase">Medya</span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <span>ERP &amp; Academy</span>
            <span className="inline-block w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};
