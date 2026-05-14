import type { VideoItem } from "@/lib/types";

export const SEED_VIDEOS: VideoItem[] = [
  // ── Trending Now ──────────────────────────────────────────────
  {
    id: "bb-bunny",
    title: "The Last Meadow",
    category: "Trending Now",
    thumbnail: "/thumbnails/space-rabbit.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description:
      "When a gentle giant discovers his paradise under threat, he rises to defend everything he loves in this heartwarming animated epic.",
  },
  {
    id: "elephant-dream",
    title: "Neon Architects",
    category: "Trending Now",
    thumbnail: "/thumbnails/neon-city.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description:
      "Two strangers navigate a surreal machine-world where reality bends and nothing is as it seems. A mind-bending visual odyssey.",
  },
  {
    id: "midnight-chase",
    title: "Midnight Chase",
    category: "Trending Now",
    thumbnail: "/thumbnails/midnight-chase.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description:
      "A relentless pursuit through rain-soaked city streets pushes one detective past every limit. The clock is ticking.",
  },

  // ── Action Picks ──────────────────────────────────────────────
  {
    id: "sintel",
    title: "Dragon's Ember",
    category: "Action Picks",
    thumbnail: "/thumbnails/crimson-night.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description:
      "A lone warrior crosses frozen wastelands and burning skies on a quest to rescue the creature that saved her life.",
  },
  {
    id: "for-bigger-joyrides",
    title: "Velocity Protocol",
    category: "Action Picks",
    thumbnail: "/thumbnails/velocity-lane.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    description:
      "High-octane stunts meet cutting-edge tech as an underground racing syndicate goes head-to-head with international enforcers.",
  },
  {
    id: "ember-rise",
    title: "Ember Rising",
    category: "Action Picks",
    thumbnail: "/thumbnails/ember-rise.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description:
      "From the ashes of a fallen empire, a band of rebels ignites a revolution that will change everything — or burn it all down.",
  },

  // ── Comedy and Family ─────────────────────────────────────────
  {
    id: "for-bigger-fun",
    title: "Sunny Side Up",
    category: "Comedy and Family",
    thumbnail: "/thumbnails/sunset-laugh.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description:
      "A feel-good romp about a misfit family road trip that goes hilariously off the rails. Buckle up and bring tissues — from laughing.",
  },
  {
    id: "pixel-quest",
    title: "Pixel Quest",
    category: "Comedy and Family",
    thumbnail: "/thumbnails/pixel-quest.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description:
      "A retro video-game character escapes the screen and wreaks adorable havoc in the real world. Fun for every age.",
  },

  // ── Sci-Fi Spotlight ──────────────────────────────────────────
  {
    id: "tears-of-steel",
    title: "Tears of Steel",
    category: "Sci-Fi Spotlight",
    thumbnail: "/thumbnails/steel-horizon.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description:
      "In a crumbling near-future Amsterdam, a man races against rogue AI to undo the moment that shattered his world.",
  },
  {
    id: "cosmic-drift",
    title: "Cosmic Drift",
    category: "Sci-Fi Spotlight",
    thumbnail: "/thumbnails/cosmic-drift.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description:
      "Stranded aboard a derelict starship at the edge of known space, a skeleton crew must decode alien signals before oxygen runs out.",
  },
  {
    id: "cyber-pulse",
    title: "Cyber Pulse",
    category: "Sci-Fi Spotlight",
    thumbnail: "/thumbnails/cyber-pulse.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    description:
      "A black-market hacker jacks into the neural grid and uncovers a conspiracy that could rewrite human consciousness forever.",
  },

  // ── Drama & Thriller ──────────────────────────────────────────
  {
    id: "velvet-noir",
    title: "Velvet Noir",
    category: "Drama & Thriller",
    thumbnail: "/thumbnails/velvet-noir.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    description:
      "A jazz singer with a dangerous secret draws a weary private eye into a web of lies, loyalty, and lethal ambition.",
  },
  {
    id: "shadow-ops",
    title: "Shadow Operations",
    category: "Drama & Thriller",
    thumbnail: "/thumbnails/shadow-ops.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description:
      "Deep-cover agents on both sides of a cold war must decide who to trust when every ally could be the enemy.",
  },

  // ── Documentaries ─────────────────────────────────────────────
  {
    id: "ocean-depths",
    title: "Into the Abyss: Ocean Depths",
    category: "Documentaries",
    thumbnail: "/thumbnails/ocean-depths.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    description:
      "Breathtaking footage from the deepest trenches on Earth reveals creatures and ecosystems science never knew existed.",
  },
  {
    id: "wild-safari",
    title: "Wild Safari: Untamed",
    category: "Documentaries",
    thumbnail: "/thumbnails/wild-safari.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    description:
      "Follow apex predators across the Serengeti in a raw, unfiltered look at survival on the African plains.",
  },
  {
    id: "coral-reef",
    title: "Coral Kingdom",
    category: "Documentaries",
    thumbnail: "/thumbnails/coral-reef.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    description:
      "A stunning visual journey through the world's most vibrant coral reefs — and the race to save them before it's too late.",
  },

  // ── Top 10 This Week ──────────────────────────────────────────
  {
    id: "thunder-bolt",
    title: "Thunderbolt",
    category: "Top 10 This Week",
    thumbnail: "/thumbnails/thunder-bolt.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description:
      "A disgraced fighter pilot gets one last shot at redemption in a white-knuckle aerial showdown above the Pacific.",
  },
  {
    id: "frost-peak",
    title: "Frost Peak",
    category: "Top 10 This Week",
    thumbnail: "/thumbnails/frost-peak.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    description:
      "An elite climbing team battles avalanches, betrayal, and altitude sickness on the world's most unforgiving summit.",
  },

  // ── New Releases ──────────────────────────────────────────────
  {
    id: "golden-hour",
    title: "Golden Hour",
    category: "New Releases",
    thumbnail: "/thumbnails/golden-hour.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    description:
      "Two estranged siblings reunite for one unforgettable sunset road trip that forces them to confront the past — and each other.",
  },
  {
    id: "retro-wave",
    title: "Retro Wave",
    category: "New Releases",
    thumbnail: "/thumbnails/retro-wave.svg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    description:
      "Set in a neon-drenched 1980s Miami, a vinyl DJ stumbles onto a smuggling ring and must spin his way out of danger.",
  },
];
