import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

export default function ParticleTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;

      // Spawn a couple of particles on mouse move matching Emerald/Amber palette
      const numParticles = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < numParticles; i++) {
        const isEmerald = Math.random() > 0.4;
        const color = isEmerald 
          ? `rgba(16, 185, 129, ${0.4 + Math.random() * 0.4})` // Emerald Green
          : `rgba(251, 191, 36, ${0.4 + Math.random() * 0.4})`;  // Amber/Gold

        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5, // slightly drifting upwards
          alpha: 1,
          size: 1.5 + Math.random() * 2.5,
          color
        });
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Drifting idle spawn occasionally if mouse is active but stationary
      if (mouseRef.current.active && Math.random() < 0.15) {
        const isEmerald = Math.random() > 0.5;
        const color = isEmerald ? 'rgba(16, 185, 129, 0.6)' : 'rgba(251, 191, 36, 0.6)';
        particles.push({
          x: mouseRef.current.x + (Math.random() - 0.5) * 4,
          y: mouseRef.current.y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 - 0.4,
          alpha: 1,
          size: 1 + Math.random() * 2,
          color
        });
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.012; // slow fadeout

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        // Subtle glow simulation via shadow
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="particle-trail-canvas"
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-40"
      style={{ opacity: 0.85 }}
    />
  );
}
