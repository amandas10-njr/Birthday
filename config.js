/**
 * ====================================================================
 * BIRTHDAY SURPRISE WEBSITE CONFIGURATION
 * ====================================================================
 * Easily customize text, names, dates, memories, and photos here!
 * Everything updates automatically across all 3 screens.
 */

window.BIRTHDAY_CONFIG = {
  // --- RECIPIENT & SENDER INFO ---
  recipientName: "Nasrin",
  senderName: "Das",
  birthdayDate: "October 1",

  // --- SCREEN 1: TAP FOR SURPRISE ---
  screen1: {
    title: "tap for suprise",
    subtitle: "",
    hintText: "",
    // Duration in milliseconds of the slow majestic fireworks display before transitioning
    fireworksShowDuration: 15000,
    // Whether to auto-transition to Screen 2 after fireworks
    autoTransitionToScreen2: true,
  },

  // --- SCREEN 2: HEARTFELT LETTER & MEMORIES ---
  screen2: {
    envelopeBadge: "A Special Letter",
    envelopeTitle: "Open Me",
    envelopeSubtext: "Tap the wax seal to unfold your note",

    letterHeader: "Happy Birthday, Beautiful Soul 💌",
    letterDate: "Today & Always",
    
    // Customize your personal letter paragraphs here (add as many as you like):
    paragraphs: [
    "A very happy birthday",
    "Innh anaku 20 vayas avulee anne njn adhyayitt kanumbol anaku 16 vayas ",
    "Ante 17am vayasil njn ante oppam ndeyini pakshe 18um 19um njn ante opppam illarnu",
    "Appo ijj choikum nthe 2 kolam mindanje kore misunderstanding karanm ego karanm(anaku alla tto eniku) vivaram illayima kondh pattipoi",
    "enne kondh kuttiya kudula ennh eniku manasilayi, kore kalathinh shesham anne kandhappo ntha cheyande entha parayande onm arayathe ninh poi, blank ayi poi",
    "Birthday ku ingane oke parayune pande cliche aanu ennalum ennenkilum parayande ini ulla birthday ku enniku ninte kude agoshikan agrahm undu ",
    "ee potta collage karanm leave um kittula exam um vekkum october 1 inh, Njn padakum nerit pottikan aa plan akiye college moonjichu",
    "Thalakalm ith vech adjust cheyu",
    "eniku ninod kore parayan nd pakshe alamb akunilaa"
    ],

    letterSignOff: "With love",
    letterSignature: "Dass",

    // Memory cards / polaroid photos (add your photos or replace with your own in /assets):
    /* showMemories: true,
    memoriesTitle: "Moments I Cherish With You 📸",
    memories: [
      {
        url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
        caption: "Golden hour smiles & pure joy ✨",
        date: "Summer Memories"
      },
      {
        url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop",
        caption: "Celebrating another milestone together 🎈",
        date: "Unforgettable Times"
      },
      {
        url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=800&auto=format&fit=crop",
        caption: "To many more sweet moments ahead 🎂",
        date: "Sweetest Days"
      }
    ],*/

    continueButtonText: "One more surprise ✨"
  },

  // --- SCREEN 3: HAPPY BIRTHDAY GRAND FINALE ---
  screen3: {
    badge: "The Grand Finale 🎉",
    heading: "Happy Birthday,",
    cakeInstructions: "Make a wish & tap the candles to blow them out! 🎂",
    cakeBlownTitle: "Your Wish Has Been Sent to the Stars! 🌟",
    cakeBlownMessage: "May every dream you hold in your heart come true this year.",

    // Birthday wish cards
    wishes: [
      {
        icon: "🌟",
        title: "Endless Joy",
        text: "May your days be packed with infectious laughter, warm sunshine, and pure happiness."
      },
      {
        icon: "🚀",
        title: "Big Dreams",
        text: "May you fearlessly conquer every goal and reach heights you never thought possible."
      },
      {
        icon: "💖",
        title: "Peace & Love",
        text: "Surrounded always by genuine hearts who cherish and adore you just as you are."
      },
      {
        icon: "✨",
        title: "Magical Year",
        text: "May this be your healthiest, most vibrant, and most unforgettable chapter yet."
      }
    ],

    replayButtonText: "Replay Experience ↺",
    shareMessage: "Share this special moment"
  },

  // --- AUDIO SETTINGS ---
  audio: {
    // Enable built-in synthesized celebratory sounds and ambient melody (no external files needed!)
    enabled: true,
    // Optional: supply a direct link to an MP3 file (e.g., "assets/birthday-song.mp3")
    // If empty or left undefined, our built-in high-quality Web Audio synth soundtrack is used!
    customAudioUrl: "",
    defaultVolume: 0.7
  },

  // --- VISUAL THEME PRESETS ---
  theme: {
    // Primary aesthetic accents
    colors: {
      gold: "#ffd700",
      goldGlow: "rgba(255, 215, 0, 0.4)",
      rosePink: "#f472b6",
      deepPurple: "#1e1136",
      midnightNavy: "#0b1021",
      backgroundDark: "#06070d"
    }
  }
};
