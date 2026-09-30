/**
 * Realistic Slow-Motion Canvas Fireworks Engine
 * Features:
 * - Special long-ascent first cracker with golden propulsion trail and massive 260-particle willow
 * - Abundant choreographed salvo with multi-stage barrages, fan shells, and grand finale
 * - Slow-motion aerodynamic drag, gentle floating gravity, and organic shimmering strobe embers
 * - Interactive tap-to-launch anywhere on screen
 */

class FireworksEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.rockets = [];
    this.particles = [];
    this.smokeEmbers = [];
    this.width = 0;
    this.height = 0;
    this.isRunning = false;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.ambientFlashAlpha = 0;
    this.ambientFlashColor = "255, 215, 0";

    // Realistic Pyrotechnic Color Palettes
    this.palettes = {
      goldWillow: [
        { r: 255, g: 220, b: 110, hex: "#ffdc6e" },
        { r: 255, g: 200, b: 60,  hex: "#ffc83c" },
        { r: 255, g: 240, b: 180, hex: "#fff0b4" },
        { r: 218, g: 165, b: 32,  hex: "#daa520" },
        { r: 255, g: 255, b: 255, hex: "#ffffff" }
      ],
      roseDiamond: [
        { r: 244, g: 114, b: 182, hex: "#f472b6" },
        { r: 251, g: 182, b: 206, hex: "#fbb6ce" },
        { r: 255, g: 255, b: 255, hex: "#ffffff" },
        { r: 249, g: 168, b: 212, hex: "#f9a8d4" },
        { r: 253, g: 164, b: 175, hex: "#fda4af" }
      ],
      royalPurple: [
        { r: 192, g: 132, b: 252, hex: "#c084fc" },
        { r: 168, g: 85,  b: 247, hex: "#a855f7" },
        { r: 255, g: 215, b: 0,   hex: "#ffd700" },
        { r: 233, g: 213, b: 255, hex: "#e9d5ff" },
        { r: 255, g: 255, b: 255, hex: "#ffffff" }
      ],
      celestialCyan: [
        { r: 56,  g: 189, b: 248, hex: "#38bdf8" },
        { r: 125, g: 211, b: 252, hex: "#7dd3fc" },
        { r: 255, g: 255, b: 255, hex: "#ffffff" },
        { r: 254, g: 240, b: 138, hex: "#fef08a" },
        { r: 14,  g: 165, b: 233, hex: "#0ea5e9" }
      ]
    };

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

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Launch the Special Long First Cracker
   * Takes ~2.5 seconds of suspenseful, slow ascent high into the sky,
   * trailing golden propulsion sparks before bursting into a massive 260-particle weeping willow!
   */
  launchFirstCracker() {
    const startX = this.width * 0.5;
    const destX = this.width * 0.5;
    const destY = this.height * 0.15; // Climbs high near the top of the sky

    const dist = this.height - destY;
    // Slower, steady ascent speed calibrated for ~2.5s climb time
    const speed = 5.2;

    const rocket = {
      x: startX,
      y: this.height,
      vx: 0,
      vy: -speed,
      targetY: destY,
      palette: this.palettes.goldWillow,
      type: "firstCrackerWillow",
      isFirstCracker: true,
      trail: [],
      maxTrail: 20,
      gravityDecel: 0.022
    };

    this.rockets.push(rocket);

    if (window.soundEngine) {
      if (typeof window.soundEngine.playLongLaunch === "function") {
        window.soundEngine.playLongLaunch();
      } else {
        window.soundEngine.playLaunch();
      }
    }
  }

  /**
   * Standard rocket launch
   */
  launch(targetX, targetY, options = {}) {
    const startX = options.startX ?? (this.width * 0.2 + Math.random() * this.width * 0.6);
    const destX = targetX ?? (this.width * 0.2 + Math.random() * this.width * 0.6);
    const destY = targetY ?? (this.height * 0.16 + Math.random() * this.height * 0.28);

    const paletteKey = options.palette || "goldWillow";
    const palette = this.palettes[paletteKey] || this.palettes.goldWillow;
    const type = options.type || "slowWillow";

    const dx = destX - startX;
    const dy = destY - this.height;
    const dist = Math.hypot(dx, dy);

    // Natural slow-motion ascent speed (~1.5s climb)
    const speed = Math.min(8.2, Math.max(5.8, dist * 0.0092));
    const angle = Math.atan2(dy, dx);

    const rocket = {
      x: startX,
      y: this.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      targetY: destY,
      palette: palette,
      type: type,
      isFirstCracker: false,
      trail: [],
      maxTrail: 14,
      gravityDecel: 0.038
    };

    this.rockets.push(rocket);

    if (window.soundEngine) {
      window.soundEngine.playLaunch();
    }
  }

  /**
   * Explode rocket into multi-stage slow-motion particles
   */
  explode(rocket) {
    const palette = rocket.palette;
    const primaryColor = palette[0];

    // Screen light flash
    this.ambientFlashAlpha = rocket.isFirstCracker ? 0.24 : 0.16;
    this.ambientFlashColor = `${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}`;

    if (window.soundEngine) {
      window.soundEngine.playExplosion(rocket.isFirstCracker ? 1.4 : 1.0);
    }

    // Special First Cracker Explosion: 260 weeping golden willow particles!
    if (rocket.isFirstCracker) {
      const count = 260;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.2 + 0.5;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        const color = (Math.random() < 0.2)
          ? palette[palette.length - 1] // diamond starlight white accent
          : palette[Math.floor(Math.random() * (palette.length - 1))];

        this.particles.push(this.createParticle(
          rocket.x, rocket.y,
          vx, vy,
          color,
          {
            friction: 0.988,   // Ultra-high air resistance: slow-motion blossom
            gravity: 0.013,    // Floating gentle weeping willow gravity
            decay: 0.0028,     // Lingers for over 5 seconds!
            size: Math.random() * 2.4 + 1.2,
            tailLength: 22,    // Long weeping golden trails
            shimmer: true,
            seed: Math.random() * 100
          }
        ));
      }

      // Center gold sparks core
      for (let i = 0; i < 35; i++) {
        this.smokeEmbers.push({
          x: rocket.x,
          y: rocket.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          alpha: 1.0,
          decay: 0.012,
          size: Math.random() * 2.5 + 1.2,
          color: "255, 235, 140"
        });
      }
      return;
    }

    // Ring / Heart shell
    if (rocket.type === "ring") {
      const count = 70;
      const speed = 3.2;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const color = palette[i % palette.length];
        this.particles.push(this.createParticle(
          rocket.x, rocket.y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          color,
          {
            friction: 0.985,
            gravity: 0.016,
            decay: 0.0045, // Lingers ~3.5s
            size: 2.2,
            tailLength: 12,
            shimmer: true
          }
        ));
      }
      return;
    }

    // Standard Rich Fireworks: 140 - 180 particles
    const isWillow = rocket.type === "slowWillow";
    const isGlitter = rocket.type === "glitter";
    const particleCount = isWillow ? 160 : 130;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = isWillow 
        ? Math.random() * 3.8 + 0.8
        : Math.random() * 4.6 + 0.6;

      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      const color = (Math.random() < 0.25)
        ? palette[palette.length - 1]
        : palette[Math.floor(Math.random() * (palette.length - 1))];

      this.particles.push(this.createParticle(
        rocket.x, rocket.y,
        vx, vy,
        color,
        {
          friction: isWillow ? 0.986 : 0.983,
          gravity: isWillow ? 0.018 : 0.022,
          decay: isWillow ? 0.0042 : 0.0055,
          size: Math.random() * 2.2 + 1.2,
          tailLength: isWillow ? 18 : 12,
          shimmer: isGlitter || true,
          seed: Math.random() * 100
        }
      ));
    }

    // Secondary core embers
    for (let i = 0; i < 24; i++) {
      this.smokeEmbers.push({
        x: rocket.x,
        y: rocket.y,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        alpha: 0.95,
        decay: 0.015,
        size: Math.random() * 2 + 1,
        color: "255, 245, 200"
      });
    }
  }

  createParticle(x, y, vx, vy, color, opts = {}) {
    return {
      x, y,
      vx, vy,
      color,
      alpha: 1,
      size: opts.size || 2,
      gravity: opts.gravity ?? 0.02,
      friction: opts.friction ?? 0.984,
      decay: opts.decay ?? 0.005,
      shimmer: opts.shimmer ?? true,
      seed: opts.seed ?? Math.random() * 50,
      tail: [],
      tailLength: opts.tailLength || 12
    };
  }

  /**
   * Choreographed Rich Fireworks Show
   * Features:
   * 1. Special long first cracker ascending slowly and bursting into a huge golden weeping willow
   * 2. Multitude of cascading fireworks across the sky: twin peonies, fan barrages, rings, and grand finale!
   */
  launchSalvo(duration = 15000, onComplete = null) {
    this.start();

    // STAGE 1: The Long First Cracker
    // Ascends gracefully for ~2.5s, then bursts at 2.6s into a 260-particle golden weeping willow
    this.launchFirstCracker();

    // STAGE 2: Twin Peonies (Rose Diamond + Celestial Cyan)
    // Launched at 4.2s while the golden willow embers are weeping downwards
    setTimeout(() => {
      if (!this.isRunning) return;
      this.launch(this.width * 0.26, this.height * 0.28, {
        palette: "roseDiamond",
        type: "slowWillow"
      });
      this.launch(this.width * 0.74, this.height * 0.28, {
        palette: "celestialCyan",
        type: "slowWillow"
      });
    }, 4200);

    // STAGE 3: Double Ring / Heart Shells at 5.8s
    setTimeout(() => {
      if (!this.isRunning) return;
      this.launch(this.width * 0.40, this.height * 0.22, {
        palette: "royalPurple",
        type: "ring"
      });
      this.launch(this.width * 0.60, this.height * 0.22, {
        palette: "goldWillow",
        type: "ring"
      });
    }, 5800);

    // STAGE 4: Triple Fan Barrage at 7.2s (Left, Center, Right simultaneously!)
    setTimeout(() => {
      if (!this.isRunning) return;
      this.launch(this.width * 0.20, this.height * 0.26, {
        palette: "roseDiamond",
        type: "slowWillow"
      });
      this.launch(this.width * 0.50, this.height * 0.16, {
        palette: "goldWillow",
        type: "chrysanthemum"
      });
      this.launch(this.width * 0.80, this.height * 0.26, {
        palette: "celestialCyan",
        type: "slowWillow"
      });
    }, 7200);

    // STAGE 5: High Diamond Strobe Glitter Shell at 8.8s
    setTimeout(() => {
      if (!this.isRunning) return;
      this.launch(this.width * 0.50, this.height * 0.18, {
        palette: "roseDiamond",
        type: "glitter"
      });
    }, 8800);

    // STAGE 6: Rapid Alternating Salvo at 10.0s
    setTimeout(() => {
      if (!this.isRunning) return;
      this.launch(this.width * 0.34, this.height * 0.24, {
        palette: "royalPurple",
        type: "slowWillow"
      });
      this.launch(this.width * 0.66, this.height * 0.24, {
        palette: "goldWillow",
        type: "chrysanthemum"
      });
    }, 10000);

    // STAGE 7: The Grand Finale Barrage at 11.4s (4 Simultaneous Sky-Filling Rockets!)
    setTimeout(() => {
      if (!this.isRunning) return;
      this.launch(this.width * 0.16, this.height * 0.26, {
        palette: "celestialCyan",
        type: "slowWillow"
      });
      this.launch(this.width * 0.38, this.height * 0.18, {
        palette: "goldWillow",
        type: "chrysanthemum"
      });
      this.launch(this.width * 0.62, this.height * 0.18, {
        palette: "roseDiamond",
        type: "chrysanthemum"
      });
      this.launch(this.width * 0.84, this.height * 0.26, {
        palette: "royalPurple",
        type: "slowWillow"
      });
    }, 11400);

    // STAGE 8: Final Golden Crown Salvo at 13.0s
    setTimeout(() => {
      if (!this.isRunning) return;
      this.launch(this.width * 0.46, this.height * 0.15, {
        palette: "goldWillow",
        type: "slowWillow"
      });
      this.launch(this.width * 0.54, this.height * 0.15, {
        palette: "goldWillow",
        type: "slowWillow"
      });
    }, 13000);

    // Complete salvo and transition smoothly
    if (onComplete) {
      setTimeout(() => {
        onComplete();
      }, duration);
    }
  }

  loop() {
    if (!this.isRunning) return;

    // Use gentle fade for persistent glowing trails
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.11)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Additive lighting blending
    this.ctx.globalCompositeOperation = "lighter";

    const time = Date.now() * 0.005;

    // 1. Update and Render Ascending Rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];

      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > r.maxTrail) r.trail.shift();

      // Rocket decelerates smoothly as it climbs
      r.vy += (r.gravityDecel || 0.035);
      r.x += r.vx;
      r.y += r.vy;

      // Draw glowing propulsion trail
      if (r.trail.length > 1) {
        this.ctx.beginPath();
        for (let j = 0; j < r.trail.length; j++) {
          const pt = r.trail[j];
          this.ctx.lineTo(pt.x, pt.y);
        }
        this.ctx.strokeStyle = r.isFirstCracker 
          ? `rgba(255, 230, 130, 0.95)` 
          : `rgba(255, 215, 100, 0.75)`;
        this.ctx.lineWidth = r.isFirstCracker ? 3.2 : 2.2;
        this.ctx.stroke();
      }

      // Trailing sparks falling off the ascending rocket
      const sparkChance = r.isFirstCracker ? 0.85 : 0.55;
      if (Math.random() < sparkChance) {
        this.smokeEmbers.push({
          x: r.x + (Math.random() - 0.5) * 4,
          y: r.y + 5,
          vx: (Math.random() - 0.5) * 1.0,
          vy: Math.random() * 1.4 + 0.6,
          alpha: 0.9,
          decay: 0.03,
          size: r.isFirstCracker ? 1.6 : 1.2,
          color: "255, 215, 90"
        });
      }

      // Rocket head golden star
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.isFirstCracker ? 3.5 : 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fill();

      // Explode at apex or when upward momentum ceases
      if (r.y <= r.targetY || r.vy >= -0.4) {
        this.explode(r);
        this.rockets.splice(i, 1);
      }
    }

    // 2. Update and Render Slow-Motion Exploding Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.tail.push({ x: p.x, y: p.y });
      if (p.tail.length > p.tailLength) p.tail.shift();

      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;

      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      // Shimmer / strobe effect
      let drawAlpha = p.alpha;
      if (p.shimmer && p.alpha < 0.7) {
        const twinkle = Math.sin(time * 8 + p.seed);
        drawAlpha = Math.max(0.1, p.alpha * (0.45 + 0.55 * twinkle));
      }

      // Render smooth tapering light trail
      if (p.tail.length > 2) {
        this.ctx.beginPath();
        for (let j = 0; j < p.tail.length; j++) {
          const pt = p.tail[j];
          this.ctx.lineTo(pt.x, pt.y);
        }
        this.ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${drawAlpha * 0.5})`;
        this.ctx.lineWidth = p.size * 0.75;
        this.ctx.stroke();
      }

      // Glowing ember head
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${drawAlpha})`;
      this.ctx.fill();

      // Soft aura glow
      if (p.size > 1.8 && drawAlpha > 0.35) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${drawAlpha * 0.2})`;
        this.ctx.fill();
      }
    }

    // 3. Render Smoke & Core Embers
    for (let i = this.smokeEmbers.length - 1; i >= 0; i--) {
      const s = this.smokeEmbers[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= s.decay;

      if (s.alpha <= 0) {
        this.smokeEmbers.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${s.color}, ${s.alpha})`;
      this.ctx.fill();
    }

    // 4. Soft Ambient Sky Flash
    if (this.ambientFlashAlpha > 0.01) {
      this.ctx.fillStyle = `rgba(${this.ambientFlashColor}, ${this.ambientFlashAlpha})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ambientFlashAlpha *= 0.91;
    }

    requestAnimationFrame(() => this.loop());
  }
}

window.FireworksEngine = FireworksEngine;
