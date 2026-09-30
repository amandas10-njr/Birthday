/**
 * Stars & Cosmic Background Engine
 * Renders twinkling stars, floating stardust, and soft nebula glow on HTML5 Canvas.
 */

class Starfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.stars = [];
    this.dustParticles = [];
    this.animationFrameId = null;
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.init();
  }

  init() {
    this.resize();
    this.createStars();
    this.createDust();
    window.addEventListener("resize", () => {
      this.resize();
      this.createStars();
    });
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  createStars() {
    this.stars = [];
    // Number of stars scaled by screen area
    const count = Math.floor((this.width * this.height) / 3800);
    const starColors = [
      "rgba(255, 255, 255, ",
      "rgba(254, 240, 138, ", // soft gold
      "rgba(244, 114, 182, ", // soft pink
      "rgba(192, 132, 252, ", // soft purple
      "rgba(186, 230, 253, "  // icy cyan
    ];

    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        baseAlpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        colorPrefix: starColors[Math.floor(Math.random() * starColors.length)],
        isSpecial: Math.random() < 0.08 // Larger glowing star
      });
    }
  }

  createDust() {
    this.dustParticles = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      this.dustParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.3 - 0.1, // gently rising
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Draw Twinkling Stars
    const time = Date.now() * 0.002;
    for (const star of this.stars) {
      const alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed * 50 + star.twinklePhase) * 0.35;
      const finalAlpha = Math.max(0.1, Math.min(1, alpha));

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = star.colorPrefix + finalAlpha + ")";
      this.ctx.fill();

      // Special star glow
      if (star.isSpecial && finalAlpha > 0.6) {
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius * 2.8, 0, Math.PI * 2);
        this.ctx.fillStyle = star.colorPrefix + (finalAlpha * 0.25) + ")";
        this.ctx.fill();
      }
    }

    // 2. Draw Floating Cosmic Dust
    for (const p of this.dustParticles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 230, 180, ${p.alpha})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = "rgba(255, 215, 0, 0.4)";
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

window.Starfield = Starfield;
