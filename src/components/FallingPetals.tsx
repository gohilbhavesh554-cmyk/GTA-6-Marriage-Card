import { useEffect, useRef } from 'react';
import { VICE_THEMES, type ViceThemeId } from '../types/theme';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  rotation: number;
  rotSpeed: number;
  colorIndex: number;
  opacity: number;
  shape: 'petal' | 'blossom';
}

interface FallingPetalsProps {
  theme: ViceThemeId;
}

export function FallingPetals({ theme }: FallingPetalsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const paletteRef = useRef<string[]>(VICE_THEMES[theme].petalColors);
  const centerDotRef = useRef<string>(VICE_THEMES[theme].accentSecondary);

  useEffect(() => {
    paletteRef.current = VICE_THEMES[theme].petalColors;
    centerDotRef.current = VICE_THEMES[theme].accentSecondary;
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Restrained, poetic particle density for clean editorial presentation
    const count = width < 768 ? 13 : 20;

    const createPetal = (startAtTop = false): Petal => ({
      x: Math.random() * width,
      y: startAtTop ? -20 - Math.random() * 140 : Math.random() * height,
      size: 5 + Math.random() * 6.5,
      speedY: 0.34 + Math.random() * 0.56,
      speedX: -0.18 + Math.random() * 0.36,
      swayAmp: 0.3 + Math.random() * 0.75,
      swayFreq: 0.005 + Math.random() * 0.009,
      phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: -0.012 + Math.random() * 0.024,
      colorIndex: Math.floor(Math.random() * 5),
      opacity: 0.24 + Math.random() * 0.26,
      shape: Math.random() > 0.74 ? 'blossom' : 'petal',
    });

    const petals: Petal[] = Array.from({ length: count }, (_, i) =>
      createPetal(i < Math.floor(count * 0.45))
    );

    let tick = 0;
    let paused = false;

    const handleVisibility = () => {
      paused = document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const drawPetalShape = (p: Petal) => {
      const palette = paletteRef.current;
      const fill = palette[p.colorIndex % palette.length];

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = fill;

      if (p.shape === 'blossom') {
        const r = p.size * 0.54;
        for (let k = 0; k < 5; k++) {
          ctx.save();
          ctx.rotate((k * Math.PI * 2) / 5);
          ctx.beginPath();
          ctx.ellipse(0, -r * 0.65, r * 0.4, r * 0.68, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = centerDotRef.current;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(
          p.size * 0.82,
          -p.size * 0.42,
          p.size * 0.66,
          p.size * 0.68,
          0,
          p.size * 0.82
        );
        ctx.bezierCurveTo(
          -p.size * 0.66,
          p.size * 0.68,
          -p.size * 0.82,
          -p.size * 0.42,
          0,
          -p.size
        );
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (paused) return;

      tick += 1;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(tick * p.swayFreq + p.phase) * p.swayAmp;
        p.rotation += p.rotSpeed;

        drawPetalShape(p);

        if (p.y > height + 30 || p.x < -40 || p.x > width + 40) {
          petals[i] = createPetal(true);
        }
      }
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-30 pointer-events-none"
    />
  );
}
