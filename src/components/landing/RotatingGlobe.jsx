import React, { useEffect, useRef } from 'react';

const LAND_POLYS = [
  [[-60,46],[-65,44],[-70,43],[-75,42],[-80,42],[-82,42],[-84,42],[-87,42],[-90,42],[-93,42],[-97,46],[-100,48],[-104,48],[-110,48],[-114,49],[-118,49],[-122,49],[-124,48],[-124,46],[-124,44],[-124,41],[-122,38],[-118,34],[-117,33],[-116,32],[-117,31],[-118,28],[-110,24],[-105,20],[-98,16],[-90,14],[-85,12],[-83,9],[-77,8],[-77,10],[-75,10],[-73,12],[-66,10],[-62,10],[-60,12],[-60,16],[-62,18],[-65,18],[-72,18],[-80,24],[-80,25],[-81,25],[-81,28],[-80,30],[-80,32],[-76,35],[-75,38],[-74,40],[-72,41],[-70,42],[-68,44],[-67,45],[-65,44],[-60,46]],
  [[-20,84],[-30,83],[-40,82],[-55,82],[-58,76],[-55,70],[-48,68],[-44,60],[-48,60],[-52,68],[-55,74],[-52,80],[-40,82],[-30,83],[-20,84]],
  [[-35,-8],[-38,-12],[-40,-15],[-40,-20],[-42,-22],[-43,-22],[-44,-24],[-48,-26],[-50,-29],[-52,-32],[-58,-34],[-60,-38],[-64,-42],[-68,-46],[-68,-52],[-66,-56],[-68,-56],[-70,-52],[-72,-50],[-72,-44],[-68,-40],[-68,-34],[-68,-28],[-70,-22],[-70,-18],[-75,-10],[-78,-4],[-78,2],[-76,6],[-72,12],[-66,12],[-60,8],[-52,4],[-50,2],[-48,0],[-44,-4],[-40,-8],[-35,-8]],
  [[28,42],[25,40],[22,40],[20,38],[16,38],[14,40],[12,44],[12,46],[8,47],[6,46],[2,50],[-2,50],[-4,48],[-8,44],[-10,40],[-8,38],[-6,36],[-2,36],[2,36],[6,36],[10,36],[12,36],[14,38],[16,40],[18,40],[20,42],[24,42],[28,42]],
  [[28,70],[25,70],[22,68],[18,66],[16,64],[14,60],[12,58],[10,56],[12,55],[18,54],[24,54],[28,56],[28,60],[26,64],[28,68],[28,70]],
  [[-6,58],[-4,56],[-2,54],[0,52],[2,52],[2,53],[0,54],[-2,55],[-4,56],[-6,58]],
  [[36,20],[40,16],[42,12],[42,8],[40,4],[36,0],[34,-4],[32,-8],[30,-12],[28,-16],[26,-20],[24,-24],[22,-28],[20,-30],[18,-34],[18,-34],[20,-34],[24,-34],[28,-32],[32,-28],[36,-24],[40,-20],[44,-16],[48,-12],[52,-8],[54,-4],[54,0],[50,4],[48,8],[46,12],[44,16],[42,20],[40,24],[38,28],[36,30],[34,30],[32,28],[30,24],[28,20],[26,16],[22,14],[18,12],[14,10],[10,8],[6,6],[2,6],[-2,4],[-4,6],[-8,8],[-12,8],[-16,12],[-18,14],[-16,16],[-14,18],[-14,20],[-16,22],[-16,24],[-14,26],[-10,26],[-6,26],[-2,26],[2,24],[6,22],[10,22],[14,22],[18,22],[22,20],[26,20],[30,20],[34,20],[36,20]],
  [[180,68],[170,70],[160,72],[150,72],[140,70],[130,66],[120,60],[110,54],[100,50],[90,50],[80,50],[70,54],[60,56],[50,54],[44,50],[40,42],[36,40],[34,40],[36,38],[40,36],[44,36],[48,34],[52,32],[56,26],[60,22],[64,22],[68,24],[72,22],[76,20],[80,24],[84,28],[86,30],[88,30],[90,28],[92,24],[96,20],[100,18],[104,20],[108,20],[112,22],[116,24],[120,28],[122,30],[120,32],[116,34],[112,36],[108,40],[108,44],[110,48],[114,50],[118,52],[120,54],[124,54],[130,56],[134,58],[136,60],[138,62],[140,66],[144,70],[150,72],[160,72],[170,70],[180,68]],
  [[68,22],[70,24],[74,28],[78,32],[80,34],[78,36],[76,36],[74,34],[72,28],[70,24],[68,22]],
  [[68,22],[72,20],[76,14],[78,10],[80,8],[80,10],[82,14],[80,18],[78,20],[76,22],[72,22],[68,22]],
  [[100,20],[104,18],[108,16],[110,14],[108,12],[106,10],[104,6],[100,4],[98,4],[96,6],[96,10],[98,16],[100,20]],
  [[132,34],[134,36],[136,38],[138,40],[140,40],[142,38],[140,36],[138,34],[136,34],[134,34],[132,34]],
  [[100,40],[104,42],[108,44],[112,46],[116,48],[120,48],[120,44],[118,40],[116,36],[114,32],[112,28],[110,24],[108,22],[104,20],[100,20],[98,22],[96,24],[96,28],[98,32],[100,36],[100,40]],
  [[114,-22],[118,-20],[122,-18],[128,-16],[132,-14],[136,-14],[140,-16],[144,-18],[148,-20],[152,-24],[154,-28],[154,-32],[152,-36],[150,-38],[146,-40],[142,-38],[138,-36],[134,-34],[130,-32],[126,-30],[120,-28],[116,-26],[114,-24],[114,-22]],
  [[172,-36],[174,-38],[176,-40],[178,-40],[178,-38],[176,-36],[174,-36],[172,-36]],
];

// City pins: [lat, lng, label, color]
const CITIES = [
  [40.7,  -74.0, 'NEW YORK', '#818CF8'],
  [51.5,   -0.1, 'LONDON',   '#818CF8'],
  [25.2,   55.3, 'DUBAI',    '#FCD34D'],
  [24.9,   67.0, 'KARACHI',  '#FCD34D'],
  [35.7,  139.7, 'TOKYO',    '#818CF8'],
];

function ptInPoly(lat, lng) {
  for (const poly of LAND_POLYS) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1];
      const xj = poly[j][0], yj = poly[j][1];
      const intersect = ((yi > lat) !== (yj > lat)) &&
        (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    if (inside) return true;
  }
  return false;
}

const DOT_STEP = 5;
const landMap = new Set();
for (let lat = -85; lat <= 85; lat += DOT_STEP) {
  for (let lng = -180; lng <= 180; lng += DOT_STEP) {
    if (ptInPoly(lat, lng)) landMap.add(`${lat},${lng}`);
  }
}

export default function RotatingGlobe({ size = 680 }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ rotY: 0, isDragging: false, lastX: 0, animating: true, rafId: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const R = W * 0.44;
    const rotX = 20;
    const s = stateRef.current;

    function toRad(d) { return d * Math.PI / 180; }

    function project(lat, lng, rotYRad) {
      const phi   = toRad(90 - lat);
      const theta = toRad(lng) + rotYRad;
      const x3 = R * Math.sin(phi) * Math.cos(theta);
      const y3 = R * Math.cos(phi);
      const z3 = R * Math.sin(phi) * Math.sin(theta);
      const tilt = toRad(rotX);
      const y3t = y3 * Math.cos(tilt) - z3 * Math.sin(tilt);
      const z3t = y3 * Math.sin(tilt) + z3 * Math.cos(tilt);
      return { x: cx + x3, y: cy - y3t, z: z3t, visible: z3t > 0 };
    }

    function drawPin(ctx, p, label, color, pingPhase) {
      if (!p.visible) return;
      const depth = Math.max(0.3, p.z / R);

      // Pulsing ring
      const pingR = 8 + 12 * Math.abs(Math.sin(pingPhase));
      const pingAlpha = (1 - Math.abs(Math.sin(pingPhase))) * 0.7 * depth;
      ctx.beginPath();
      ctx.arc(p.x, p.y, pingR, 0, Math.PI * 2);
      ctx.strokeStyle = color + Math.round(pingAlpha * 255).toString(16).padStart(2, '0');
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 * depth, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12 * depth;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Pin stem
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x, p.y - 20 * depth);
      ctx.strokeStyle = color + 'bb';
      ctx.lineWidth = 1.5 * depth;
      ctx.stroke();

      // Pin head
      ctx.beginPath();
      ctx.arc(p.x, p.y - 20 * depth, 4 * depth, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.font = `bold ${Math.round(9 * depth)}px 'Courier New', monospace`;
      ctx.fillStyle = color + Math.round(Math.min(1, depth * 1.4) * 255).toString(16).padStart(2, '0');
      ctx.textAlign = 'center';
      ctx.fillText(label, p.x, p.y - 28 * depth);
    }

    function draw(rotYRad, t) {
      ctx.clearRect(0, 0, W, H);

      // Sphere base gradient
      const grad = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.05, cx, cy, R);
      grad.addColorStop(0, '#1a0a2e');
      grad.addColorStop(1, '#050510');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Rim
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(191,90,242,0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Ocean + land dots
      for (let lat = -85; lat <= 85; lat += DOT_STEP) {
        for (let lng = -180; lng < 180; lng += DOT_STEP) {
          const p = project(lat, lng, rotYRad);
          if (!p.visible) continue;
          const depth = Math.max(0.1, p.z / R);
          const isLand = landMap.has(`${lat},${lng}`);

          if (isLand) {
            const r = Math.max(0.4, (1.6 + depth * 0.8) * depth);
            ctx.beginPath();
            ctx.arc(p.x, p.y, r * 1.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,45,155,${0.08 * depth})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,45,155,${0.5 + 0.5 * depth})`;
            ctx.fill();
          } else {
            const r = Math.max(0.3, 1.2 * depth);
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fillStyle = depth > 0.6
              ? `rgba(191,90,242,0.30)`
              : `rgba(191,90,242,0.18)`;
            ctx.fill();
          }
        }
      }

      // Faint grid lines
      ctx.save();
      ctx.globalAlpha = 0.055;
      ctx.strokeStyle = '#9966ff';
      ctx.lineWidth = 0.5;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let first = true;
        for (let lng = -180; lng <= 180; lng += 3) {
          const p = project(lat, lng, rotYRad);
          if (!p.visible) { first = true; continue; }
          first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          first = false;
        }
        ctx.stroke();
      }
      for (let lng = -180; lng < 180; lng += 30) {
        ctx.beginPath();
        let first = true;
        for (let lat2 = -85; lat2 <= 85; lat2 += 3) {
          const p = project(lat2, lng, rotYRad);
          if (!p.visible) { first = true; continue; }
          first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          first = false;
        }
        ctx.stroke();
      }
      ctx.restore();

      // City pins
      const sec = t / 1000;
      CITIES.forEach(([lat, lng, label, color], idx) => {
        const p = project(lat, lng, rotYRad);
        drawPin(ctx, p, label, color, sec * 1.6 + idx * 1.1);
      });

      // Shine
      const shine = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, 0, cx - R * 0.35, cy - R * 0.35, R * 0.55);
      shine.addColorStop(0, 'rgba(255,255,255,0.045)');
      shine.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = shine;
      ctx.fill();
    }

    let lastTime = 0;
    function animate(ts) {
      const dt = ts - lastTime;
      lastTime = ts;
      if (s.animating && !s.isDragging) {
        s.rotY += dt * 0.00008;
      }
      draw(s.rotY, ts);
      s.rafId = requestAnimationFrame(animate);
    }
    s.rafId = requestAnimationFrame(animate);

    // Mouse drag
    const onDown = (e) => { s.isDragging = true; s.lastX = e.clientX; s.animating = false; };
    const onMove = (e) => {
      if (!s.isDragging) return;
      s.rotY += (e.clientX - s.lastX) * 0.006;
      s.lastX = e.clientX;
    };
    const onUp = () => { s.isDragging = false; s.animating = true; };

    // Touch
    const onTouchStart = (e) => { s.isDragging = true; s.lastX = e.touches[0].clientX; s.animating = false; };
    const onTouchMove = (e) => {
      if (!s.isDragging) return;
      s.rotY += (e.touches[0].clientX - s.lastX) * 0.006;
      s.lastX = e.touches[0].clientX;
      e.preventDefault();
    };
    const onTouchEnd = () => { s.isDragging = false; s.animating = true; };

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      cancelAnimationFrame(s.rafId);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ display: 'block', cursor: 'grab' }}
    />
  );
}
