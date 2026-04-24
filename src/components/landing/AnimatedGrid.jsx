import React, { useEffect, useRef } from 'react';

export default function AnimatedGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = 700;
    }
    resize();
    window.addEventListener('resize', resize);

    const cols = 40;
    const rows = 20;
    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const cw = w / cols;
      const ch = h / rows;

      for (let i = 0; i <= cols; i++) {
        const x = i * cw;
        const wave = Math.sin(t * 0.5 + i * 0.15) * 0.3;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + wave * 10, h);
        ctx.strokeStyle = `rgba(0, 255, 148, ${0.03 + wave * 0.02})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      for (let j = 0; j <= rows; j++) {
        const y = j * ch;
        const wave = Math.sin(t * 0.3 + j * 0.2) * 0.3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y + wave * 8);
        ctx.strokeStyle = `rgba(0, 255, 148, ${0.03 + wave * 0.02})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Glowing intersection dots
      for (let i = 0; i < 6; i++) {
        const px = (Math.sin(t * 0.2 + i * 1.5) * 0.5 + 0.5) * w;
        const py = (Math.cos(t * 0.15 + i * 2) * 0.5 + 0.5) * h;
        const r = 2 + Math.sin(t + i) * 1;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 15);
        grad.addColorStop(0, 'rgba(0, 255, 148, 0.15)');
        grad.addColorStop(1, 'rgba(0, 255, 148, 0)');
        ctx.beginPath();
        ctx.arc(px, py, r * 15, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 148, 0.4)';
        ctx.fill();
      }

      t += 0.016;
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    />
  );
}
