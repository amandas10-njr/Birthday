# ✨ Premium Interactive Birthday Surprise Website

A cinematic, interactive, mobile-first birthday surprise web experience built with modern HTML5, CSS3, Canvas API, and Web Audio API. 

Designed specifically for mobile smartphones (360×800, 390×844, 412×915, 430×932) with a phone-frame presentation mode on desktop.

---

## 🌟 The Core Experience Flow

The entire experience is organized into **exactly 3 cinematic screens**:

```
Screen 1 (tap for suprise)
   ↓ [One Tap anywhere]
Slow-Motion Fireworks Show & Sound Salvo (Realistic Willow & Chrysanthemum physics)
   ↓ [Smooth Cinematic Transition]
Screen 2 (The Heartfelt Letter & Polaroid Memories)
   ↓ [Tap "One more surprise ✨"]
Screen 3 (Happy Birthday Grand Finale + Interactive Cake & Candle Blowout)
   ↓ [Blow candles 🎂💨]
Confetti Burst + Cosmic Celebration + Replay
```

1. **Screen 1 — "tap for suprise"**:
   - Immersive night sky with twinkling stars and soft drifting cosmic dust.
   - Minimalist, centered glowing title: *"tap for suprise"* with pulsating ripple indicator.
   - **Hyper-Realistic Slow-Motion Fireworks System**:
     - Tap or click **ONCE** anywhere.
     - Immediately fades out the intro text.
     - Unlocks Web Audio and begins a serene celestial ambient soundtrack.
     - Launches a choreographed slow-motion realistic fireworks display on Canvas API (decelerating rocket trails, prolonged golden willow weeping cascades, organic shimmering strobe embers, and ring bursts).
     - Seamlessly transitions to Screen 2.

2. **Screen 2 — "The Letter & Memories"**:
   - Interactive luxury envelope with golden wax seal (`💌`).
   - Tapping the seal opens the envelope flap in 3D CSS and glides into the letter.
   - Glassmorphic parchment with gold accents, customizable heartfelt paragraphs, and script signature.
   - Polaroid photo gallery with sweet handwritten captions.
   - Prominent touch-friendly button: *"One more surprise ✨"*.

3. **Screen 3 — "Happy Birthday Grand Finale"**:
   - Grand celebration headline: *"Happy Birthday, [Name]! 🎉✨"*.
   - **Interactive Birthday Cake**:
     - Multi-tiered cake with golden pedestal and 3 flickering candle flames.
     - Tap either the cake or *"Blow out candles 💨"* button.
     - Air puff whoosh sound + celebratory chime chord.
     - Candle flames extinguish smoothly and realistic smoke wisps rise up.
     - Massive confetti explosion (`confettiCanvas`) + celebratory background fireworks!
     - Reveals the *"Your Wish Has Been Sent to the Stars! 🌟"* banner.
   - Inspiring birthday wish cards.
   - *"Replay Experience ↺"* button to smoothly reset and experience the surprise again!

---

## 🚀 Instant Quick Start

### Option 1: Open Directly in Any Browser (Zero Install Required!)
Simply double-click `index.html` or open it in Chrome, Safari, Edge, or Firefox. No build tools or servers are required!

### Option 2: Local Python Server
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

### Option 3: Vite / Node.js (Optional)
```bash
npm install
npm run dev
```

---

## 🎨 Easy Customization Guide (`config.js`)

All texts, names, dates, photos, and settings can be customized in **`config.js`** without touching any HTML or CSS:

```javascript
window.BIRTHDAY_CONFIG = {
  // Recipient and Sender
  recipientName: "Sophia",
  senderName: "Alex",
  birthdayDate: "October 24",

  // Screen 1: Intro
  screen1: {
    title: "tap for suprise",
    fireworksShowDuration: 8500,
  },

  // Screen 2: Letter & Memories
  screen2: {
    letterHeader: "Happy Birthday, Beautiful Soul 💌",
    paragraphs: [
      "Your first heartfelt paragraph...",
      "Your second paragraph...",
      "Your third paragraph..."
    ],
    letterSignOff: "With all my love & warmest wishes,",
    letterSignature: "Alex",

    // Photos: add your own images to /assets or use image URLs!
    memories: [
      {
        url: "assets/photo1.jpg",
        caption: "Summer smiles & pure joy ✨",
        date: "July 2025"
      }
    ],
    continueButtonText: "One more surprise ✨"
  },

  // Screen 3: Finale
  screen3: {
    cakeInstructions: "Make a wish & tap the candles to blow them out! 🎂",
    cakeBlownTitle: "Your Wish Has Been Sent to the Stars! 🌟",
    cakeBlownMessage: "May every dream you hold in your heart come true this year.",
    wishes: [ ... ]
  },

  // Audio: Zero-dependency Web Audio synth by default, or your own MP3
  audio: {
    enabled: true,
    customAudioUrl: "" // e.g., "assets/favorite-song.mp3"
  }
};
```

---

## 🎨 Figma Design Reference & Design System

If you are modifying this project in Figma or creating design mockups:

### Target Frame Sizes (Mobile-First)
* **iPhone 16 / 15 Pro**: 393 × 852 pt
* **iPhone 16 / 15 Pro Max**: 430 × 932 pt
* **Android Modern Standard**: 360 × 800 pt, 412 × 915 pt
* **Desktop Preview**: 1440 × 900 pt (with 414px phone frame centered)

### Color Palette Tokens
| Token | Hex | Usage |
|---|---|---|
| Deep Space Black | `#05060d` | Base background |
| Midnight Navy | `#090d1f` | Dark card gradient |
| Cosmic Purple | `#160c29` | Ambient glow nebula |
| Celebration Gold | `#ffd700` | Primary buttons, stars, wax seal, title highlights |
| Gold Light | `#fef08a` | Candle body, glowing dividers, subtle accents |
| Rose Pink | `#f472b6` | Birthday badge, top cake tier, romantic accents |
| Pure Starlight | `#ffffff` | Headings, frosting drops, sparks |

### Typography Tokens
* **Headings / Serif**: `'Playfair Display', Georgia, serif` (weights: 600, 700, 800)
* **Body / Sans**: `'Plus Jakarta Sans', system-ui, sans-serif` (weights: 400, 500, 600)
* **Signature & Polaroid / Script**: `'Dancing Script', cursive` (weights: 600, 700)

---

## 🚢 Deploying to Vercel (100% Free & 1-Minute Setup)

### Method A: Drag & Drop (Fastest, No Git Required)
1. Go to [vercel.com](https://vercel.com) and log in.
2. Go to your Dashboard and click **"Add New..."** → **"Project"**.
3. Drag and drop the `birthday-surprise` folder into Vercel.
4. Click **Deploy**. Vercel will instantly publish your site live with an SSL link (e.g. `https://birthday-surprise.vercel.app`)!

### Method B: GitHub + Vercel
1. Initialize a git repo and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of birthday surprise"
   git remote add origin https://github.com/your-username/birthday-surprise.git
   git push -u origin main
   ```
2. Import the repository in [vercel.com](https://vercel.com).
3. The project includes preconfigured `vercel.json` with clean URLs and asset caching. Leave build settings default and click **Deploy**!

---

## 🚢 Deploying to Render (Static Site)

1. Push your repository to GitHub or GitLab.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** → **Static Site**.
3. Connect your repository.
4. Settings:
   - **Name**: `birthday-surprise`
   - **Build Command**: *(leave empty)*
   - **Publish Directory**: `./` (or `.`)
5. Click **Create Static Site**. Render deploys it automatically with a free `onrender.com` URL!

---

## 📱 Mobile-First Features Included

- **`100dvh` Viewport Units**: Eliminates jarring jumps when mobile browser address bars expand/collapse.
- **Safe Area Insets**: Native support for device notches and home indicator bars (`env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`).
- **Zero-Dependency Audio Engine**: Synthesizes realistic firework whooshes, explosion rumbles, candle puffs, and a gentle celestial ambient melody directly through Web Audio API—guaranteeing sound never fails due to missing files or broken external links.
- **Touch Targets & Haptics**: Standard 48px+ tap targets and subtle mobile vibration feedback on supported devices.
- **Desktop Adaptation**: Centered mobile viewport frame with toggleable fullscreen button for testing or widescreen browsing.
