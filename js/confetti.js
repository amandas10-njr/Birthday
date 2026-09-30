/**
 * Canvas Confetti Engine
 * Renders celebratory fluttering confetti, golden stars, and metallic flakes
 * for Screen 3 and the candle blowout celebration.
 */

class ConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.pieces = [];
    this.isRunning = false;
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.colors = [
      "#ffd700", // Gold
      "#f472b6", // Rose pink
      "#c084fc", // Purple
      "#38bdf8", // Sky blue
      "#fbbf24", // Amber
      "#ffffff", // White
      "#f43f5e"  // Coral red
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  burst(originX = this.width * 0.5, originY = this.height * 0.5, count = 120) {
    this.isRunning = true;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const isStar = Math.random() < 0.25;

      this.pieces.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * speed - Math.random() * 8, // upward pop
        gravity: 0.16 + Math.random() * 0.08,
        drag: 0.94,
        w: Math.random() * 8 + 6,
        h: Math.random() * 14 + 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        oscillationSpeed: Math.random() * 0.1 + 0.05,
        oscillationPhase: Math.random() * Math.PI * 2,
        color: color,
        alpha: 1,
        decay: Math.random() * 0.005 + 0.004,
        isStar: isStar
      });
    }

    this.animate();
  }

  animate() {
    if (!this.isRunning && this.pieces.length === 0) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.pieces.length - 1; i >= 0; i--) {
      const p = this.pieces[i];

      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;

      p.x += p.vx + Math.sin(p.oscillationPhase) * 1.5;
      p.y += p.vy;
      p.oscillationPhase += p.oscillationSpeed;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.y > this.height + 20 || p.alpha <= 0) {
        this.pieces.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;

      if (p.isStar) {
        // Draw star
        this.drawStar(0, 0, 5, p.w * 0.7, p.w * 0.35);
      } else {
        // Draw fluttering ribbon
        const scaleY = Math.cos(p.oscillationPhase);
        this.ctx.scale(1, scaleY);
        this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }

      this.ctx.restore();
    }

    if (this.pieces.length > 0) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.isRunning = false;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }
}

window.ConfettiEngine = ConfettiEngine;
