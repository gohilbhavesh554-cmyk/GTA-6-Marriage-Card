import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { VICE_THEMES, type ViceThemeId } from '../types/theme';

interface ScratchCardProps {
  children: React.ReactNode;
  theme?: ViceThemeId;
  promptTitle?: string;
  promptSubtitle?: string;
  revealed: boolean;
  onReveal: () => void;
  resetCounter?: number;
  heightClass?: string;
  brushRadius?: number;
  compact?: boolean;
}

export function ScratchCard({
  children,
  theme = 'vice',
  promptTitle = 'Scratch to Reveal',
  promptSubtitle = 'Rub with finger or cursor',
  revealed,
  onReveal,
  resetCounter = 0,
  heightClass = 'min-h-[170px]',
  brushRadius = 26,
  compact = false,
}: ScratchCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokesSinceCheckRef = useRef(0);
  const revealedRef = useRef(revealed);

  const [percent, setPercent] = useState(0);
  const [justRevealed, setJustRevealed] = useState(false);

  revealedRef.current = revealed;

  const paintFoil = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const w = Math.max(120, Math.floor(rect.width));
    const h = Math.max(80, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    const themeDef = VICE_THEMES[theme];
    const [c0, c1, c2, c3] = themeDef.foilStops;

    // Theme-reactive brushed metallic foil gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, c0);
    grad.addColorStop(0.35, c1);
    grad.addColorStop(0.7, c2);
    grad.addColorStop(1, c3);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Fine brushed diagonal metallic sheen lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1;
    for (let x = -h; x < w + h; x += 13) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h * 0.58, h);
      ctx.stroke();
    }

    // Embossed double inner trim
    ctx.strokeStyle = 'rgba(11, 9, 20, 0.24)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(7, 7, w - 14, h - 14);

    // Foil embossed copy
    ctx.fillStyle = themeDef.foilText;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = compact
      ? '700 19px "Bebas Neue", sans-serif'
      : '700 30px "Bebas Neue", sans-serif';
    ctx.fillText(promptTitle.toUpperCase(), w / 2, h / 2 - (compact ? 7 : 10));

    ctx.fillStyle = 'rgba(11, 9, 20, 0.78)';
    ctx.font = compact
      ? '600 10px "JetBrains Mono", monospace'
      : '600 12px "JetBrains Mono", monospace';
    ctx.fillText(promptSubtitle.toUpperCase(), w / 2, h / 2 + (compact ? 11 : 16));

    setPercent(0);
  }, [compact, promptSubtitle, promptTitle, theme]);

  useEffect(() => {
    if (!revealed) {
      paintFoil();
    }
  }, [revealed, resetCounter, paintFoil]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      if (!revealedRef.current) {
        paintFoil();
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [paintFoil]);

  const computeScratchedRatio = () => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    const { width, height } = canvas;
    if (!width || !height) return 0;

    const data = ctx.getImageData(0, 0, width, height).data;
    let cleared = 0;
    let sampled = 0;
    const stride = 24;
    for (let i = 3; i < data.length; i += 4 * stride) {
      sampled += 1;
      if (data[i] < 128) cleared += 1;
    }
    return sampled > 0 ? Math.round((cleared / sampled) * 100) : 0;
  };

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealedRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushRadius * 2;

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    lastPointRef.current = { x, y };

    strokesSinceCheckRef.current += 1;
    if (strokesSinceCheckRef.current >= 5) {
      strokesSinceCheckRef.current = 0;
      const ratio = computeScratchedRatio();
      setPercent(ratio);
      if (ratio >= 38) {
        setJustRevealed(true);
        onReveal();
        window.setTimeout(() => setJustRevealed(false), 1000);
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (revealedRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPointRef.current = null;
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || revealedRef.current) return;
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    const ratio = computeScratchedRatio();
    setPercent(ratio);
    if (ratio >= 38 && !revealedRef.current) {
      setJustRevealed(true);
      onReveal();
      window.setTimeout(() => setJustRevealed(false), 1000);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${heightClass}`}
    >
      {/* Revealed Underlying Content */}
      <div className="relative z-0 w-full h-full flex flex-col justify-center">
        {children}
      </div>

      {/* Subtle Luminous Flash When Unlocked */}
      {justRevealed && (
        <motion.div
          initial={{ opacity: 0.85, scale: 0.96 }}
          animate={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute inset-0 z-20 border-2 border-[var(--accent-3)] bg-[var(--accent-3)]/15"
        />
      )}

      {/* Interactive Scratch-Off Metallic Foil Layer */}
      {!revealed && (
        <>
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            aria-label={`${promptTitle}. ${promptSubtitle}`}
            className="absolute inset-0 z-10 w-full h-full touch-none cursor-crosshair"
          />
          {percent > 4 && (
            <div className="pointer-events-none absolute top-2 right-2 z-20 bg-[#0B0914]/82 px-2 py-0.5 text-[10px] font-mono text-[var(--accent-3)] tabular-nums">
              {percent}%
            </div>
          )}
        </>
      )}
    </div>
  );
}
