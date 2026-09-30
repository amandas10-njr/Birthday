/**
 * ====================================================================
 * BIRTHDAY SURPRISE — APPLICATION ORCHESTRATOR
 * Handles 3-screen cinematic flow, one-tap fireworks, letter unfolding,
 * interactive candle blowout, sound effects, and confetti.
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = window.BIRTHDAY_CONFIG || {};

  // Engine instances
  const stars = new Starfield("starsCanvas");
  const fireworks = new FireworksEngine("fireworksCanvas");
  const confetti = new ConfettiEngine("confettiCanvas");
  const sound = window.soundEngine;

  // DOM Elements
  const screen1 = document.getElementById("screen1");
  const screen2 = document.getElementById("screen2");
  const screen3 = document.getElementById("screen3");
  const deviceContainer = document.getElementById("deviceContainer");

  const screen1Content = document.getElementById("screen1Trigger");
  const fireworksIndicator = document.getElementById("fireworksIndicator");
  const waxSeal = document.getElementById("waxSeal");
  const envelopeElement = document.getElementById("envelopeElement");
  const toScreen3Btn = document.getElementById("toScreen3Btn");
  const cakeScene = document.getElementById("cakeScene");
  const blowCandleBtn = document.getElementById("blowCandleBtn");
  const replayBtn = document.getElementById("replayBtn");
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  const viewToggleBtn = document.getElementById("viewToggleBtn");

  // State
  let currentScreen = 1;
  let hasStarted = false;
  let candlesBlown = false;

  // ==================================================================
  // 1. POPULATE CONFIGURATION DATA
  // ==================================================================
  function populateConfig() {
    // Screen 1
    if (config.screen1) {
      const titleEl = document.getElementById("screen1Title");
      if (titleEl) titleEl.textContent = config.screen1.title || "tap for suprise";
    }

    // Screen 2
    if (config.screen2) {
      document.getElementById("envelopeBadge").textContent = config.screen2.envelopeBadge || "A Special Letter";
      document.getElementById("envelopeTitle").textContent = config.screen2.envelopeTitle || "Open Me";
      document.getElementById("envelopeSubtext").textContent = config.screen2.envelopeSubtext || "Tap the wax seal to unfold your note";
      document.getElementById("letterHeader").textContent = config.screen2.letterHeader || "Happy Birthday, Beautiful Soul 💌";
      document.getElementById("letterDate").textContent = config.screen2.letterDate || "Today & Always";
      document.getElementById("letterSignOff").textContent = config.screen2.letterSignOff || "With all my love & warmest wishes,";
      document.getElementById("letterSignature").textContent = config.senderName || config.screen2.letterSignature || "Alex";
      document.getElementById("screen2BtnText").textContent = config.screen2.continueButtonText || "One more surprise ✨";

      // Populate Letter Paragraphs
      const letterBody = document.getElementById("letterBody");
      letterBody.innerHTML = "";
      if (Array.isArray(config.screen2.paragraphs)) {
        config.screen2.paragraphs.forEach(pText => {
          const p = document.createElement("p");
          p.textContent = pText;
          letterBody.appendChild(p);
        });
      }

      // Populate Memories Carousel
      const memoriesSection = document.getElementById("memoriesSection");
      const polaroidCarousel = document.getElementById("polaroidCarousel");
      if (config.screen2.showMemories && Array.isArray(config.screen2.memories) && config.screen2.memories.length > 0) {
        document.getElementById("memoriesTitle").textContent = config.screen2.memoriesTitle || "Moments I Cherish With You 📸";
        polaroidCarousel.innerHTML = "";

        config.screen2.memories.forEach(mem => {
          const card = document.createElement("div");
          card.className = "polaroid-card";
          card.innerHTML = `
            <div class="polaroid-img-box">
              <img src="${mem.url}" alt="${mem.caption}" class="polaroid-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop'">
            </div>
            <p class="polaroid-caption">${mem.caption}</p>
            ${mem.date ? `<p class="polaroid-date">${mem.date}</p>` : ""}
          `;
          polaroidCarousel.appendChild(card);
        });
      } else {
        memoriesSection.classList.add("hidden");
      }
    }

    // Screen 3
    if (config.screen3) {
      document.getElementById("screen3Badge").textContent = config.screen3.badge || "The Grand Finale 🎉";
      document.getElementById("screen3Heading").textContent = config.screen3.heading || "Happy Birthday,";
      document.getElementById("recipientNameDisplay").textContent = config.recipientName || "Sophia";
      document.getElementById("cakePromptText").textContent = config.screen3.cakeInstructions || "Make a wish & tap the candles to blow them out! 🎂";
      document.getElementById("wishGrantedTitle").textContent = config.screen3.cakeBlownTitle || "Your Wish Has Been Sent to the Stars! 🌟";
      document.getElementById("wishGrantedMessage").textContent = config.screen3.cakeBlownMessage || "May every dream you hold in your heart come true this year.";
      document.getElementById("replayBtnText").textContent = config.screen3.replayButtonText || "Replay Experience ↺";

      // Wishes Grid
      const wishesGrid = document.getElementById("wishesGrid");
      wishesGrid.innerHTML = "";
      if (Array.isArray(config.screen3.wishes)) {
        config.screen3.wishes.forEach(wish => {
          const wCard = document.createElement("div");
          wCard.className = "wish-card";
          wCard.innerHTML = `
            <span class="wish-icon">${wish.icon || "✨"}</span>
            <h4>${wish.title}</h4>
            <p>${wish.text}</p>
          `;
          wishesGrid.appendChild(wCard);
        });
      }
    }
  }

  // ==================================================================
  // 2. SCREEN TRANSITIONS
  // ==================================================================
  function goToScreen(targetScreenNum) {
    if (targetScreenNum === currentScreen) return;

    const screens = [null, screen1, screen2, screen3];
    const currentEl = screens[currentScreen];
    const nextEl = screens[targetScreenNum];

    // Smooth exit animation
    if (currentEl) {
      currentEl.classList.add("screen-exiting");
      currentEl.classList.remove("screen-active");
    }

    setTimeout(() => {
      if (currentEl) {
        currentEl.classList.remove("screen-exiting");
        currentEl.classList.add("screen-hidden");
      }

      // Enter next screen
      if (nextEl) {
        nextEl.classList.remove("screen-hidden");
        nextEl.classList.add("screen-active");

        // Scroll back to top
        const scrollable = nextEl.querySelector(".screen-scrollable-content");
        if (scrollable) scrollable.scrollTop = 0;
      }

      currentScreen = targetScreenNum;

      // Ensure Screen 1 has no container background, while Screens 2 & 3 show their luxurious frame
      if (targetScreenNum === 1) {
        deviceContainer.classList.add("screen-1-active");
      } else {
        deviceContainer.classList.remove("screen-1-active");
      }

      // Special screen entrance actions
      if (targetScreenNum === 3) {
        // Continuous soft celebratory sparkles on Screen 3
        celebrateScreen3();
      }
    }, 450);
  }

  // ==================================================================
  // 3. SCREEN 1: ONE-TAP FIREWORK SYSTEM
  // ==================================================================
  screen1.addEventListener("pointerdown", (e) => {
    // Only process the one-tap sequence if not started yet
    if (!hasStarted) {
      hasStarted = true;

      // 1. Unlock Web Audio API context immediately on first user touch
      if (sound) {
        sound.unlock();
        sound.startAmbientMusic();
      }

      // 2. Immediately hide / fade out Screen 1 text
      screen1Content.classList.add("fading-out");
      if (fireworksIndicator) fireworksIndicator.classList.remove("hidden");

      // 3. Launch choreographed realistic fireworks show on Canvas
      const showDuration = config.screen1?.fireworksShowDuration || 15000;
      fireworks.launchSalvo(showDuration, () => {
        // 4. Transition smoothly to Screen 2 after firework salvo
        if (config.screen1?.autoTransitionToScreen2 !== false) {
          goToScreen(2);
        }
      });
    } else if (currentScreen === 1) {
      // User tapped again while fireworks are firing: launch extra firework at tap location!
      const rect = screen1.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      fireworks.launch(x, y);
    }
  });

  // ==================================================================
  // 4. SCREEN 2: ENVELOPE & LETTER ACTIONS
  // ==================================================================
  function openEnvelope() {
    envelopeElement.classList.add("opened");
    if (sound) sound.playMagicalChimes();

    // Haptic feedback if supported on mobile
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }

    // Smoothly scroll down to reveal the letter content
    setTimeout(() => {
      const letterCard = document.getElementById("letterCard");
      if (letterCard) {
        letterCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 350);
  }

  waxSeal.addEventListener("click", (e) => {
    e.stopPropagation();
    openEnvelope();
  });

  envelopeElement.addEventListener("click", () => {
    openEnvelope();
  });

  toScreen3Btn.addEventListener("click", () => {
    if (sound) sound.playMagicalChimes();
    if (navigator.vibrate) navigator.vibrate(30);
    goToScreen(3);
  });

  // ==================================================================
  // 5. SCREEN 3: CAKE CANDLE BLOWOUT INTERACTION
  // ==================================================================
  function blowOutCandles() {
    if (candlesBlown) return;
    candlesBlown = true;

    // Haptic burst
    if (navigator.vibrate) {
      navigator.vibrate([60, 40, 80]);
    }

    // Play sound: Air puff whoosh + magical celebration chimes!
    if (sound) {
      sound.playCandleBlow();
    }

    // Extinguish candle flames and show rising smoke wisps
    const candles = document.querySelectorAll(".candle");
    candles.forEach((c, index) => {
      setTimeout(() => {
        c.classList.add("extinguished");
        const smoke = c.querySelector(".smoke-wisp");
        if (smoke) smoke.classList.remove("hidden");
      }, index * 80);
    });

    // Launch celebratory confetti burst from center of screen!
    const rect = cakeScene.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    confetti.burst(centerX, centerY, 130);

    // Launch celebratory fireworks in the background
    fireworks.start();
    fireworks.launch(window.innerWidth * 0.3, window.innerHeight * 0.25);
    setTimeout(() => {
      fireworks.launch(window.innerWidth * 0.7, window.innerHeight * 0.22);
    }, 350);

    // Update prompt box to reveal the Wish Granted Banner
    const cakePromptBox = document.getElementById("cakePromptBox");
    const wishBanner = document.getElementById("wishGrantedBanner");
    
    cakePromptBox.classList.add("hidden");
    wishBanner.classList.remove("hidden");
  }

  cakeScene.addEventListener("click", blowOutCandles);
  blowCandleBtn.addEventListener("click", blowOutCandles);

  function celebrateScreen3() {
    // Gentle background fireworks while on Screen 3
    fireworks.start();
    fireworks.launch(window.innerWidth * 0.5, window.innerHeight * 0.2);
  }

  // ==================================================================
  // 6. REPLAY EXPERIENCE FLOW
  // ==================================================================
  replayBtn.addEventListener("click", () => {
    if (navigator.vibrate) navigator.vibrate(30);

    // Reset candles and smoke
    candlesBlown = false;
    document.querySelectorAll(".candle").forEach(c => {
      c.classList.remove("extinguished");
      const smoke = c.querySelector(".smoke-wisp");
      if (smoke) smoke.classList.add("hidden");
    });

    const cakePromptBox = document.getElementById("cakePromptBox");
    const wishBanner = document.getElementById("wishGrantedBanner");
    cakePromptBox.classList.remove("hidden");
    wishBanner.classList.add("hidden");

    // Reset envelope flap
    envelopeElement.classList.remove("opened");

    // Reset Screen 1 state
    hasStarted = false;
    screen1Content.classList.remove("fading-out");
    if (fireworksIndicator) fireworksIndicator.classList.add("hidden");

    // Go back to Screen 1
    goToScreen(1);
  });

  // ==================================================================
  // 7. FLOATING CONTROLS (SOUND & DESKTOP VIEWPORT FRAME)
  // ==================================================================
  soundToggleBtn.addEventListener("click", () => {
    if (!sound.isUnlocked) {
      sound.unlock();
      sound.startAmbientMusic();
    }
    const isMuted = sound.toggleMute();
    document.getElementById("soundOnIcon").classList.toggle("hidden", isMuted);
    document.getElementById("soundMutedIcon").classList.toggle("hidden", !isMuted);
  });

  if (viewToggleBtn) {
    viewToggleBtn.addEventListener("click", () => {
      const isFrame = deviceContainer.classList.contains("mode-frame");
      deviceContainer.classList.toggle("mode-frame", !isFrame);
      deviceContainer.classList.toggle("mode-fullscreen", isFrame);
      viewToggleBtn.title = isFrame ? "Switch to Phone Frame" : "Switch to Fullscreen";
    });
  }

  // Initial population
  populateConfig();
});
