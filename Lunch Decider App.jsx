import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Apple,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ChefHat,
  ChevronRight,
  Clock,
  Flame,
  Heart,
  History,
  LocateFixed,
  MapPin,
  Navigation,
  Plus,
  RefreshCw,
  Search,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Star,
  Utensils,
  Wand2,
  X,
} from "lucide-react";

const STORAGE_KEYS = {
  favourites: "lunch-decider:favourites",
  history: "lunch-decider:history",
  quickLocations: "lunch-decider:quick-locations",
};

const locationPresets = [
  {
    id: "somerset",
    name: "Somerset / Orchard",
    hint: "Intern lunch area",
    lat: 1.3008,
    lng: 103.8389,
  },
  {
    id: "ntu",
    name: "NTU North Spine",
    hint: "Campus lunch",
    lat: 1.3483,
    lng: 103.6831,
  },
  {
    id: "cbd",
    name: "Raffles Place",
    hint: "Office lunch",
    lat: 1.2847,
    lng: 103.8515,
  },
  {
    id: "buona",
    name: "Buona Vista",
    hint: "Work + school area",
    lat: 1.3067,
    lng: 103.7906,
  },
];

const demoPlaces = [
  {
    id: "p1",
    name: "Kimchi Table",
    area: "Somerset",
    cuisine: ["Korean", "Rice"],
    moodTags: ["comfort", "spicy", "filling", "fast"],
    priceLevel: "$",
    rating: 4.5,
    reviewCount: 812,
    lat: 1.3012,
    lng: 103.8397,
    address: "313 Orchard Road, Singapore",
    openNow: true,
    halal: false,
    vegetarian: true,
    spicy: true,
    avgWaitMin: 8,
    imageTone: "from-red-100 via-orange-50 to-amber-100",
    heroEmoji: "🍲",
    signature: "Kimchi jjigae lunch set",
  },
  {
    id: "p2",
    name: "Green Bowl Studio",
    area: "Somerset",
    cuisine: ["Cafe"],
    moodTags: ["healthy", "light", "fast"],
    priceLevel: "$$",
    rating: 4.3,
    reviewCount: 390,
    lat: 1.2998,
    lng: 103.8382,
    address: "Orchard Gateway, Singapore",
    openNow: true,
    halal: false,
    vegetarian: true,
    spicy: false,
    avgWaitMin: 6,
    imageTone: "from-emerald-100 via-lime-50 to-white",
    heroEmoji: "🥗",
    signature: "Protein grain bowl",
  },
  {
    id: "p3",
    name: "Noodle Theory",
    area: "Somerset",
    cuisine: ["Chinese", "Noodles"],
    moodTags: ["soupy", "comfort", "filling"],
    priceLevel: "$",
    rating: 4.2,
    reviewCount: 551,
    lat: 1.3021,
    lng: 103.8374,
    address: "Killiney Road, Singapore",
    openNow: true,
    halal: false,
    vegetarian: false,
    spicy: true,
    avgWaitMin: 10,
    imageTone: "from-yellow-100 via-orange-50 to-white",
    heroEmoji: "🍜",
    signature: "Hand-pulled beef noodles",
  },
  {
    id: "p4",
    name: "The Bento Edit",
    area: "Somerset",
    cuisine: ["Japanese", "Rice"],
    moodTags: ["comfort", "fast", "filling"],
    priceLevel: "$$",
    rating: 4.6,
    reviewCount: 1180,
    lat: 1.3003,
    lng: 103.8405,
    address: "Somerset Road, Singapore",
    openNow: true,
    halal: false,
    vegetarian: true,
    spicy: false,
    avgWaitMin: 9,
    imageTone: "from-sky-100 via-white to-stone-100",
    heroEmoji: "🍱",
    signature: "Salmon teriyaki bento",
  },
  {
    id: "p5",
    name: "Hawker Hero",
    area: "Somerset",
    cuisine: ["Local", "Rice", "Noodles"],
    moodTags: ["fast", "filling", "comfort"],
    priceLevel: "$",
    rating: 4.1,
    reviewCount: 2301,
    lat: 1.2989,
    lng: 103.8391,
    address: "Cuppage Plaza, Singapore",
    openNow: true,
    halal: true,
    vegetarian: false,
    spicy: true,
    avgWaitMin: 5,
    imageTone: "from-amber-100 via-white to-red-50",
    heroEmoji: "🍛",
    signature: "Chicken rice and curry rice",
  },
  {
    id: "p6",
    name: "Toast & Kopi Lab",
    area: "Somerset",
    cuisine: ["Cafe", "Local"],
    moodTags: ["light", "fast"],
    priceLevel: "$",
    rating: 4.0,
    reviewCount: 705,
    lat: 1.303,
    lng: 103.8378,
    address: "Orchard Central, Singapore",
    openNow: true,
    halal: false,
    vegetarian: true,
    spicy: false,
    avgWaitMin: 4,
    imageTone: "from-orange-100 via-yellow-50 to-white",
    heroEmoji: "☕",
    signature: "Kaya toast set",
  },
  {
    id: "p7",
    name: "North Spine Wok",
    area: "NTU",
    cuisine: ["Chinese", "Rice", "Noodles"],
    moodTags: ["filling", "fast", "spicy"],
    priceLevel: "$",
    rating: 4.1,
    reviewCount: 420,
    lat: 1.3488,
    lng: 103.6835,
    address: "North Spine Food Court, NTU",
    openNow: true,
    halal: false,
    vegetarian: true,
    spicy: true,
    avgWaitMin: 7,
    imageTone: "from-red-100 via-yellow-50 to-white",
    heroEmoji: "🥢",
    signature: "Mala stir fry bowl",
  },
  {
    id: "p8",
    name: "Canteen Green",
    area: "NTU",
    cuisine: ["Rice", "Local"],
    moodTags: ["healthy", "light"],
    priceLevel: "$",
    rating: 4.0,
    reviewCount: 188,
    lat: 1.3474,
    lng: 103.6825,
    address: "North Spine, NTU",
    openNow: true,
    halal: true,
    vegetarian: true,
    spicy: false,
    avgWaitMin: 6,
    imageTone: "from-lime-100 via-white to-emerald-50",
    heroEmoji: "🥬",
    signature: "Vegetarian mixed rice",
  },
  {
    id: "p9",
    name: "CBD Rice Bar",
    area: "Raffles Place",
    cuisine: ["Japanese", "Rice"],
    moodTags: ["healthy", "fast", "filling"],
    priceLevel: "$$",
    rating: 4.4,
    reviewCount: 960,
    lat: 1.2842,
    lng: 103.8519,
    address: "Raffles Place, Singapore",
    openNow: true,
    halal: false,
    vegetarian: true,
    spicy: false,
    avgWaitMin: 9,
    imageTone: "from-blue-100 via-white to-slate-100",
    heroEmoji: "🍚",
    signature: "Chirashi lunch bowl",
  },
  {
    id: "p10",
    name: "Soup Society",
    area: "Buona Vista",
    cuisine: ["Western"],
    moodTags: ["soupy", "light", "comfort", "healthy"],
    priceLevel: "$$",
    rating: 4.2,
    reviewCount: 340,
    lat: 1.3062,
    lng: 103.7902,
    address: "The Star Vista, Singapore",
    openNow: true,
    halal: false,
    vegetarian: true,
    spicy: false,
    avgWaitMin: 7,
    imageTone: "from-stone-100 via-white to-amber-50",
    heroEmoji: "🥣",
    signature: "Tomato basil soup set",
  },
  {
    id: "p11",
    name: "Halal Bowl Club",
    area: "Somerset",
    cuisine: ["Rice", "Local"],
    moodTags: ["filling", "comfort", "fast"],
    priceLevel: "$",
    rating: 4.4,
    reviewCount: 621,
    lat: 1.3001,
    lng: 103.8371,
    address: "Near Somerset MRT, Singapore",
    openNow: true,
    halal: true,
    vegetarian: true,
    spicy: true,
    avgWaitMin: 8,
    imageTone: "from-green-100 via-white to-yellow-50",
    heroEmoji: "🍗",
    signature: "Ayam penyet rice bowl",
  },
  {
    id: "p12",
    name: "Treat Day Pasta",
    area: "Somerset",
    cuisine: ["Western", "Cafe"],
    moodTags: ["treat", "comfort", "filling"],
    priceLevel: "$$$",
    rating: 4.7,
    reviewCount: 1088,
    lat: 1.2999,
    lng: 103.8411,
    address: "Orchard Road, Singapore",
    openNow: true,
    halal: false,
    vegetarian: true,
    spicy: false,
    avgWaitMin: 14,
    imageTone: "from-pink-100 via-white to-orange-50",
    heroEmoji: "🍝",
    signature: "Truffle mushroom pasta",
  },
];

const defaultPreferences = {
  budget: "Any",
  distanceM: 1200,
  cuisines: [],
  dietary: "No restriction",
  spice: "Either",
  mood: "Any",
};

const cuisineOptions = ["Japanese", "Korean", "Chinese", "Local", "Western", "Cafe", "Noodles", "Rice"];
const moodOptions = [
  { id: "comfort", label: "Comfort", emoji: "🍲" },
  { id: "healthy", label: "Light & healthy", emoji: "🥗" },
  { id: "soupy", label: "Soupy", emoji: "🥣" },
  { id: "fast", label: "Quick", emoji: "⚡" },
  { id: "treat", label: "Treat myself", emoji: "✨" },
];

function haversineMeters(a, b) {
  const R = 6371e3;
  const toRad = (value) => (value * Math.PI) / 180;
  const phi1 = toRad(a.lat);
  const phi2 = toRad(b.lat);
  const deltaPhi = toRad(b.lat - a.lat);
  const deltaLambda = toRad(b.lng - a.lng);
  const x =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function priceToNumber(price) {
  if (price === "$") return 1;
  if (price === "$$") return 2;
  if (price === "$$$") return 3;
  return 2;
}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function loadLocalArray(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }

  return payload;
}

function normalizeApiPlaces(places) {
  return places.map((place) => ({
    ...place,
    moodTags: place.moodTags?.length ? place.moodTags : ["fast", "filling"],
    cuisine: place.cuisine?.length ? place.cuisine : ["Restaurant"],
    priceLevel: place.priceLevel || "$$",
    rating: place.rating || 4,
    reviewCount: place.reviewCount || 0,
    openNow: place.openNow ?? true,
    halal: place.halal ?? null,
    vegetarian: place.vegetarian ?? null,
    spicy: place.spicy ?? null,
    avgWaitMin: place.avgWaitMin || 10,
    imageTone: place.imageTone || "from-sky-100 via-white to-emerald-50",
    heroEmoji: place.heroEmoji || "🍽️",
    signature: place.signature || "Nearby restaurant",
    source: place.source || "google",
  }));
}

function walkingMinutes(meters) {
  return Math.max(2, Math.round(meters / 80));
}

function labelForMood(moodId) {
  return moodOptions.find((mood) => mood.id === moodId)?.label.toLowerCase() || moodId;
}

function matchCuisine(place, selectedCuisines) {
  return selectedCuisines.filter((cuisine) => place.cuisine.includes(cuisine));
}

function buildRecommendationReason({ place, preferences, distance, walkMin, cuisineMatches, overBudgetBy, isFallback }) {
  const parts = [];

  if (preferences.mood !== "Any" && place.moodTags.includes(preferences.mood)) {
    parts.push(`matches your ${labelForMood(preferences.mood)} mood`);
  }

  if (cuisineMatches.length) {
    parts.push(`matches ${cuisineMatches.slice(0, 2).join(" and ")}`);
  }

  if (preferences.budget !== "Any" && overBudgetBy <= 0) {
    parts.push(`is within your ${preferences.budget} budget`);
  }

  if (preferences.dietary === "Halal" && place.halal === true) {
    parts.push("is marked halal");
  }
  if (preferences.dietary === "Vegetarian" && place.vegetarian === true) {
    parts.push("is vegetarian-friendly");
  }
  if (preferences.spice === "Spicy" && place.spicy === true) {
    parts.push("has spicy options");
  }
  if (preferences.spice === "Non-spicy" && place.spicy === false) {
    parts.push("has non-spicy options");
  }

  if (distance <= Math.min(800, preferences.distanceM * 0.65)) {
    parts.push(`is nearby, about ${walkMin} minutes away`);
  } else {
    parts.push(`is still within your distance limit at ${formatDistance(distance)}`);
  }

  if (place.rating >= 4.4) {
    parts.push(`has a strong ${place.rating.toFixed(1)} rating`);
  }

  const sentence = parts.slice(0, 3).join(" and ");
  if (sentence) {
    return `${isFallback ? "Best fallback: " : ""}This ${sentence}.`;
  }

  return "This is a balanced lunch option based on your current filters.";
}

function getRecentPenalty(placeId, history) {
  const now = Date.now();
  const recent = history.filter((item) => item.placeId === placeId);
  if (!recent.length) return 0;

  const daysSinceLast = Math.min(
    ...recent.map((item) => (now - new Date(item.selectedAt).getTime()) / (1000 * 60 * 60 * 24))
  );
  const eatenThisWeek = recent.filter(
    (item) => (now - new Date(item.selectedAt).getTime()) / (1000 * 60 * 60 * 24) <= 7
  ).length;

  if (daysSinceLast < 1) return 35;
  if (daysSinceLast < 3) return 22;
  if (eatenThisWeek >= 2) return 15;
  return 5;
}

function scorePlace(place, location, preferences, history, favouriteIds) {
  const distance = haversineMeters(location, { lat: place.lat, lng: place.lng });
  const distanceLimit = preferences.distanceM;
  const overDistanceBy = distance - distanceLimit;
  const selectedBudget = preferences.budget !== "Any" ? priceToNumber(preferences.budget) : null;
  const actualBudget = priceToNumber(place.priceLevel);
  const overBudgetBy = selectedBudget ? actualBudget - selectedBudget : 0;
  const cuisineMatches = matchCuisine(place, preferences.cuisines);
  const wantsCuisine = preferences.cuisines.length > 0;
  const wantsMood = preferences.mood !== "Any";
  const moodMatches = wantsMood ? place.moodTags.includes(preferences.mood) : true;
  const strictDietFail =
    (preferences.dietary === "Halal" && place.halal !== true) ||
    (preferences.dietary === "Vegetarian" && place.vegetarian !== true);

  if (!place.openNow || strictDietFail || distance > distanceLimit) {
    return null;
  }

  const majorCuisineMiss = wantsCuisine && !cuisineMatches.length;
  const majorMoodMiss = wantsMood && !moodMatches;
  const majorBudgetMiss = selectedBudget && overBudgetBy > 1;
  const isFallback = majorCuisineMiss || majorMoodMiss || majorBudgetMiss || overDistanceBy > 0;

  const distanceScore = clamp(105 - (distance / distanceLimit) * 85);
  const ratingScore = clamp(((place.rating || 3.8) - 3.5) * 55, 35, 100);

  const budgetScore =
    preferences.budget === "Any"
      ? actualBudget === 1
        ? 88
        : 76
      : overBudgetBy <= 0
        ? actualBudget < selectedBudget
          ? 96
          : 100
        : overBudgetBy === 1
          ? 52
          : 10;

  const cuisineScore = wantsCuisine ? (cuisineMatches.length ? 90 + cuisineMatches.length * 10 : 8) : 76;
  const dietaryScore = preferences.dietary === "No restriction" ? 80 : 100;
  const moodScore = wantsMood ? (moodMatches ? 100 : 12) : 76;

  let spiceScore = 72;
  if (preferences.spice === "Spicy") spiceScore = place.spicy === true ? 100 : place.spicy === null ? 62 : 35;
  if (preferences.spice === "Non-spicy") spiceScore = place.spicy === false ? 100 : place.spicy === null ? 70 : 35;

  const waitScore = clamp(100 - place.avgWaitMin * 3);
  const favouriteBoost = favouriteIds.includes(place.id) ? 5 : 0;
  const recentPenalty = getRecentPenalty(place.id, history);
  const fallbackPenalty =
    (majorCuisineMiss ? 32 : 0) +
    (majorMoodMiss ? 26 : 0) +
    (majorBudgetMiss ? 34 : overBudgetBy === 1 ? 12 : 0);

  const score =
    distanceScore * 0.24 +
    budgetScore * 0.21 +
    cuisineScore * 0.22 +
    moodScore * 0.16 +
    dietaryScore * 0.08 +
    ratingScore * 0.06 +
    spiceScore * 0.02 +
    waitScore * 0.01 +
    favouriteBoost -
    recentPenalty -
    fallbackPenalty;

  const walkMin = walkingMinutes(distance);
  const reason = buildRecommendationReason({
    place,
    preferences,
    distance,
    walkMin,
    cuisineMatches,
    overBudgetBy,
    isFallback,
  });

  return {
    ...place,
    distance,
    walkMin,
    score: Math.round(clamp(score)),
    reason,
    isFallback,
  };
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Shell({ children, activeTab, setActiveTab }) {
  const nav = [
    { id: "home", label: "Decide", icon: Sparkles },
    { id: "saved", label: "Saved", icon: Heart },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white blur-3xl" />
        <div className="absolute right-[-120px] top-24 h-72 w-72 rounded-full bg-orange-100 blur-3xl" />
        <div className="absolute bottom-10 left-[-120px] h-80 w-80 rounded-full bg-sky-100 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-28 pt-5 sm:max-w-lg">
        {children}
      </main>

      <nav className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-[2rem] border border-white/70 bg-white/70 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.14)] backdrop-blur-2xl sm:max-w-lg">
        <div className="grid grid-cols-3 gap-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={classNames(
                  "flex items-center justify-center gap-2 rounded-3xl px-3 py-3 text-sm font-semibold transition",
                  active ? "bg-zinc-950 text-white shadow-lg" : "text-zinc-500 hover:bg-white hover:text-zinc-950"
                )}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function TopBar({ title, subtitle, onBack, right }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            onClick={onBack}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white/70 shadow-sm backdrop-blur-xl transition hover:scale-105"
          >
            <ArrowLeft size={18} />
          </button>
        ) : (
          <div className="grid h-11 w-11 place-items-center rounded-full bg-zinc-950 text-white shadow-lg">
            <Apple size={18} />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-zinc-500">{subtitle}</p>
        </div>
      </div>
      {right}
    </div>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div className={classNames("rounded-[2rem] border border-white/70 bg-white/70 shadow-[0_20px_70px_rgba(0,0,0,0.08)] backdrop-blur-2xl", className)}>
      {children}
    </div>
  );
}

function Pill({ active, children, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition",
        active
          ? "border-zinc-950 bg-zinc-950 text-white shadow-lg shadow-zinc-900/10"
          : "border-zinc-200 bg-white/70 text-zinc-600 hover:border-zinc-300 hover:bg-white hover:text-zinc-950"
      )}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}

function LocationControl({
  location,
  locationLabel,
  onUseGps,
  gpsStatus,
  onPresetLocation,
  quickLocations,
  canAddQuickLocation,
  onAddQuickLocation,
  query,
  onQueryChange,
  suggestions,
  onSelect,
  loading,
  error,
  source,
  placesStatus,
}) {
  return (
    <div className="relative rounded-[1.75rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-white/75">
            <MapPin size={16} />
            Eating near
          </p>
          <p className="truncate text-lg font-bold">{locationLabel}</p>
          <p className="text-xs text-white/50">
            {location.source === "gps" ? "Using your current location" : "Search or pick a nearby area"}
          </p>
          {gpsStatus && <p className="mt-2 text-xs text-white/60">{gpsStatus}</p>}
        </div>
        <button
          onClick={onUseGps}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-zinc-950 transition hover:scale-105"
          title="Use GPS"
        >
          <LocateFixed size={18} />
        </button>
      </div>

      <div className="relative z-30">
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search a place or MRT station"
          className="w-full rounded-full border border-white/10 bg-white px-4 py-3 pl-11 pr-11 text-sm font-semibold text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-white"
        />
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-950"
            title="Clear location search"
          >
            <X size={15} />
          </button>
        )}

        {(loading || error || suggestions.length > 0 || source === "fallback") && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-3xl border border-zinc-100 bg-white text-zinc-950 shadow-[0_22px_70px_rgba(0,0,0,0.25)]">
            {loading && <p className="px-4 py-3 text-sm font-semibold text-zinc-500">Searching locations...</p>}
            {error && <p className="px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
            {!loading && source === "fallback" && query.length >= 2 && (
              <p className="px-4 py-3 text-sm font-semibold text-zinc-500">
                Add a Google Maps API key to enable live suggestions.
              </p>
            )}
            {!loading &&
              suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => onSelect(suggestion)}
                  className="block w-full border-t border-zinc-100 px-4 py-3 text-left transition first:border-t-0 hover:bg-zinc-50"
                >
                  <p className="text-sm font-bold">{suggestion.label}</p>
                  <p className="text-xs text-zinc-500">{suggestion.description}</p>
                </button>
              ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {quickLocations.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetLocation(preset)}
            className={classNames(
              "rounded-full border px-3 py-2 text-xs font-bold transition",
              location.id === preset.id
                ? "border-white bg-white text-zinc-950"
                : "border-white/10 bg-white/10 text-white/75 hover:bg-white/15"
            )}
          >
            {preset.name}
          </button>
        ))}

        {canAddQuickLocation && (
          <button
            onClick={onAddQuickLocation}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold text-white/80 transition hover:bg-white/15"
          >
            <Plus size={13} />
            Save place
          </button>
        )}
      </div>

      <div className="mt-3 min-h-10">
        {placesStatus && <p className="line-clamp-2 text-xs leading-5 text-white/45">{placesStatus}</p>}
      </div>
    </div>
  );
}

function HomeScreen({
  location,
  locationLabel,
  onUseGps,
  gpsStatus,
  onPresetLocation,
  quickLocations,
  canAddQuickLocation,
  onAddQuickLocation,
  locationQuery,
  onLocationQueryChange,
  locationSuggestions,
  onSelectLocationSuggestion,
  locationSearchLoading,
  locationSearchError,
  locationSearchSource,
  onStart,
  onHungryNow,
  onSurprise,
  placesStatus,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
      <TopBar title="Lunch Decider" subtitle="Pick lunch without overthinking" />

      <section className="mb-5 rounded-[2.5rem] bg-zinc-950 p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.26)]">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">
              <Sparkles size={14} />
              Lunch helper
            </div>
            <h2 className="max-w-xs text-4xl font-black leading-[0.95] tracking-tight">What kind of lunch works today?</h2>
            <p className="mt-3 max-w-xs text-sm font-medium leading-6 text-white/55">
              Start from where you are, then choose how much help you want.
            </p>
          </div>
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[1.5rem] bg-white text-3xl shadow-xl">
            🍱
          </div>
        </div>

        <LocationControl
          location={location}
          locationLabel={locationLabel}
          onUseGps={onUseGps}
          gpsStatus={gpsStatus}
          onPresetLocation={onPresetLocation}
          quickLocations={quickLocations}
          canAddQuickLocation={canAddQuickLocation}
          onAddQuickLocation={onAddQuickLocation}
          query={locationQuery}
          onQueryChange={onLocationQueryChange}
          suggestions={locationSuggestions}
          onSelect={onSelectLocationSuggestion}
          loading={locationSearchLoading}
          error={locationSearchError}
          source={locationSearchSource}
          placesStatus={placesStatus}
        />

        <button
          onClick={onStart}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-base font-bold text-zinc-950 transition hover:scale-[1.01]"
        >
          Choose preferences
          <ChevronRight size={18} />
        </button>
      </section>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <button
          onClick={onHungryNow}
          className="rounded-[2rem] border border-white/70 bg-white/80 p-4 text-left shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-2xl">⚡</div>
          <p className="font-bold">Quick pick</p>
          <p className="mt-1 text-xs text-zinc-500">Nearby, open, low fuss.</p>
        </button>
        <button
          onClick={onSurprise}
          className="rounded-[2rem] border border-white/70 bg-white/80 p-4 text-left shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 text-2xl">🎲</div>
          <p className="font-bold">Surprise me</p>
          <p className="mt-1 text-xs text-zinc-500">One confident pick.</p>
        </button>
      </div>
    </motion.div>
  );
}

function PreferenceScreen({ preferences, setPreferences, onFind, onBack }) {
  const toggleCuisine = (cuisine) => {
    setPreferences((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter((item) => item !== cuisine)
        : [...prev.cuisines, cuisine],
    }));
  };

  return (
    <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}>
      <TopBar title="Lunch mood" subtitle="Quick filters only" onBack={onBack} />

      <GlassCard className="mb-4 p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-zinc-950 text-white">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <p className="font-bold">Budget</p>
            <p className="text-xs text-zinc-500">How much are we spending?</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Any", "$", "$$", "$$$"].map((budget) => (
            <Pill
              key={budget}
              active={preferences.budget === budget}
              onClick={() => setPreferences((prev) => ({ ...prev, budget }))}
            >
              {budget === "Any" ? "Any budget" : budget}
            </Pill>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="mb-4 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-bold">Distance</p>
            <p className="text-xs text-zinc-500">Maximum walking distance</p>
          </div>
          <p className="rounded-full bg-zinc-950 px-3 py-1 text-sm font-bold text-white">
            {preferences.distanceM >= 1000 ? `${preferences.distanceM / 1000} km` : `${preferences.distanceM} m`}
          </p>
        </div>
        <input
          type="range"
          min="500"
          max="2500"
          step="250"
          value={preferences.distanceM}
          onChange={(event) => setPreferences((prev) => ({ ...prev, distanceM: Number(event.target.value) }))}
          className="w-full accent-zinc-950"
        />
        <div className="mt-2 flex justify-between text-xs text-zinc-400">
          <span>5 min</span>
          <span>15 min</span>
          <span>30 min</span>
        </div>
      </GlassCard>

      <GlassCard className="mb-4 p-5">
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-100 text-orange-700">
            <ChefHat size={18} />
          </div>
          <div>
            <p className="font-bold">Cuisine</p>
            <p className="text-xs text-zinc-500">Pick cravings, or skip it</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {cuisineOptions.map((cuisine) => (
            <Pill key={cuisine} active={preferences.cuisines.includes(cuisine)} onClick={() => toggleCuisine(cuisine)}>
              {cuisine}
            </Pill>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="mb-4 p-5">
        <p className="mb-1 font-bold">Mood</p>
        <p className="mb-4 text-xs text-zinc-500">More useful than cuisine when you do not know what you want.</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPreferences((prev) => ({ ...prev, mood: "Any" }))}
            className={classNames(
              "rounded-2xl border p-3 text-left transition",
              preferences.mood === "Any" ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-100 bg-white/70"
            )}
          >
            <p className="text-xl">🤷</p>
            <p className="text-sm font-bold">Anything</p>
          </button>
          {moodOptions.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setPreferences((prev) => ({ ...prev, mood: mood.id }))}
              className={classNames(
                "rounded-2xl border p-3 text-left transition hover:bg-white",
                preferences.mood === mood.id ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-100 bg-white/70"
              )}
            >
              <p className="text-xl">{mood.emoji}</p>
              <p className="text-sm font-bold">{mood.label}</p>
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="mb-5 p-5">
        <p className="mb-4 font-bold">Diet & spice</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {["No restriction", "Halal", "Vegetarian"].map((dietary) => (
            <Pill
              key={dietary}
              active={preferences.dietary === dietary}
              onClick={() => setPreferences((prev) => ({ ...prev, dietary }))}
            >
              {dietary}
            </Pill>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {["Either", "Spicy", "Non-spicy"].map((spice) => (
            <Pill
              key={spice}
              active={preferences.spice === spice}
              onClick={() => setPreferences((prev) => ({ ...prev, spice }))}
              icon={spice === "Spicy" ? Flame : undefined}
            >
              {spice}
            </Pill>
          ))}
        </div>
      </GlassCard>

      <div className="sticky bottom-24 z-20 rounded-full border border-white/80 bg-white/80 p-2 shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-2xl">
        <button
          onClick={onFind}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-4 text-base font-bold text-white transition hover:scale-[1.01]"
        >
          Show me lunch
          <Sparkles size={18} />
        </button>
      </div>
    </motion.div>
  );
}

function PlaceCard({ place, isFavourite, onToggleFavourite, onOpen, compact = false }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl"
    >
      <div className={classNames("relative overflow-hidden bg-gradient-to-br p-5", place.imageTone)}>
        {place.photoUrl && (
          <>
            <img
              src={place.photoUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-white/10 to-white/85" />
          </>
        )}
        <div className="relative flex items-start justify-between gap-3">
          <div className="grid h-16 w-16 place-items-center rounded-[1.5rem] bg-white/70 text-4xl shadow-sm backdrop-blur">
            {place.heroEmoji}
          </div>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavourite(place.id);
            }}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/75 text-zinc-950 shadow-sm backdrop-blur transition hover:scale-105"
          >
            {isFavourite ? <BookmarkCheck size={19} fill="currentColor" /> : <Bookmark size={19} />}
          </button>
        </div>
        <div className="relative mt-5">
          <div className="mb-2 flex flex-wrap gap-2">
            {place.source === "google" && (
              <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-zinc-700 backdrop-blur">
                Live
              </span>
            )}
            {place.isFallback && (
              <span className="rounded-full bg-amber-100/90 px-2.5 py-1 text-xs font-bold text-amber-900 backdrop-blur">
                Fallback
              </span>
            )}
            {place.cuisine.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold text-zinc-700 backdrop-blur">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-2xl font-black tracking-tight">{place.name}</h3>
          <p className="mt-1 text-sm font-medium text-zinc-600">{place.signature}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 grid grid-cols-4 gap-2">
          <Metric icon={MapPin} label={formatDistance(place.distance)} sub={`${place.walkMin} min`} />
          <Metric icon={Star} label={place.rating.toFixed(1)} sub="rating" />
          <Metric icon={Utensils} label={place.priceLevel} sub="price" />
          <Metric icon={Clock} label={`${place.avgWaitMin}m`} sub="wait" />
        </div>

        {!compact && (
          <div className="mb-4 rounded-2xl bg-zinc-50 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-zinc-800">
              <Wand2 size={15} />
              Why this works
            </p>
            <p className="text-sm leading-6 text-zinc-600">{place.reason}</p>
          </div>
        )}

        <button
          onClick={() => onOpen(place)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 py-3.5 text-sm font-bold text-white transition hover:scale-[1.01]"
        >
          View lunch details
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.article>
  );
}

function Metric({ icon: Icon, label, sub }) {
  return (
    <div className="rounded-2xl bg-zinc-50 p-3 text-center">
      <Icon size={15} className="mx-auto mb-1 text-zinc-400" />
      <p className="text-sm font-black">{label}</p>
      <p className="text-[11px] text-zinc-400">{sub}</p>
    </div>
  );
}

function ResultsScreen({
  recommendations,
  onBack,
  onOpen,
  favourites,
  onToggleFavourite,
  onSpinPick,
  selectedSpinPlace,
  onResetFilters,
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}>
      <TopBar
        title="Best lunch matches"
        subtitle={`${recommendations.length} places, ranked for you`}
        onBack={onBack}
        right={
          <button
            onClick={onResetFilters}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white/70 shadow-sm backdrop-blur-xl"
          >
            <RefreshCw size={18} />
          </button>
        }
      />

      {recommendations.length ? (
        <>
          <GlassCard className="mb-5 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-zinc-950 text-white">
                <Shuffle size={19} />
              </div>
              <div className="flex-1">
                <p className="font-bold">Still cannot decide?</p>
                <p className="text-xs text-zinc-500">Spin only between good matches.</p>
              </div>
              <button
                onClick={onSpinPick}
                className="rounded-full bg-zinc-950 px-4 py-2.5 text-sm font-bold text-white transition hover:scale-105"
              >
                Spin
              </button>
            </div>
            <AnimatePresence>
              {selectedSpinPlace && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 rounded-2xl bg-orange-50 p-4"
                >
                  <p className="text-sm font-bold text-orange-900">The wheel picked:</p>
                  <p className="text-lg font-black text-orange-950">{selectedSpinPlace.name} {selectedSpinPlace.heroEmoji}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          <div className="space-y-4">
            {recommendations.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isFavourite={favourites.includes(place.id)}
                onToggleFavourite={onToggleFavourite}
                onOpen={onOpen}
              />
            ))}
          </div>
        </>
      ) : (
        <GlassCard className="p-6 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-[1.5rem] bg-zinc-100 text-3xl">🥲</div>
          <h2 className="text-xl font-black">No strong matches</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Try increasing distance, choosing any budget, or removing a dietary/cuisine filter.
          </p>
          <button
            onClick={onResetFilters}
            className="mt-5 rounded-full bg-zinc-950 px-5 py-3 text-sm font-bold text-white"
          >
            Reset filters
          </button>
        </GlassCard>
      )}
    </motion.div>
  );
}

function DetailScreen({ place, onBack, isFavourite, onToggleFavourite, onAteHere }) {
  if (!place) return null;

  const mapUrl = place.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address}`)}`;

  return (
    <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}>
      <TopBar
        title="Lunch details"
        subtitle="Enough info to go"
        onBack={onBack}
        right={
          <button
            onClick={() => onToggleFavourite(place.id)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white/70 shadow-sm backdrop-blur-xl"
          >
            {isFavourite ? <BookmarkCheck size={18} fill="currentColor" /> : <Bookmark size={18} />}
          </button>
        }
      />

      <div className={classNames("relative mb-4 overflow-hidden rounded-[2.5rem] bg-gradient-to-br p-6 shadow-[0_25px_80px_rgba(0,0,0,0.12)]", place.imageTone)}>
        {place.photoUrl && (
          <>
            <img src={place.photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-white/10 to-white/90" />
          </>
        )}
        <div className="relative mb-8 flex items-start justify-between">
          <div className="grid h-20 w-20 place-items-center rounded-[1.75rem] bg-white/75 text-5xl shadow-sm backdrop-blur">
            {place.heroEmoji}
          </div>
          <span className="rounded-full bg-white/70 px-3 py-1.5 text-sm font-black backdrop-blur">{place.score}/100 match</span>
        </div>
        <h2 className="relative text-4xl font-black leading-none tracking-tight">{place.name}</h2>
        <p className="relative mt-3 max-w-sm text-sm font-medium leading-6 text-zinc-600">{place.signature}</p>
      </div>

      <GlassCard className="mb-4 p-5">
        <p className="mb-4 flex items-center gap-2 font-bold">
          <Sparkles size={18} />
          Why recommended
        </p>
        <p className="text-sm leading-6 text-zinc-600">{place.reason}</p>
      </GlassCard>

      <GlassCard className="mb-4 p-5">
        <div className="grid grid-cols-2 gap-3">
          <DetailMetric label="Distance" value={formatDistance(place.distance)} icon={MapPin} />
          <DetailMetric label="Walk" value={`${place.walkMin} min`} icon={Navigation} />
          <DetailMetric label="Rating" value={`${place.rating.toFixed(1)} ⭐`} icon={Star} />
          <DetailMetric label="Price" value={place.priceLevel} icon={Utensils} />
        </div>
      </GlassCard>

      <GlassCard className="mb-5 p-5">
        <p className="mb-2 text-sm font-bold text-zinc-500">Address</p>
        <p className="font-semibold leading-6">{place.address}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {place.halal && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Halal</span>}
          {place.vegetarian && <span className="rounded-full bg-lime-50 px-3 py-1 text-xs font-bold text-lime-700">Vegetarian-friendly</span>}
          {place.spicy && <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">Spicy options</span>}
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700">{place.reviewCount} reviews</span>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-4 py-4 text-sm font-bold text-white transition hover:scale-[1.01]"
        >
          Open Maps
          <Navigation size={16} />
        </a>
        <button
          onClick={() => onAteHere(place)}
          className="flex items-center justify-center gap-2 rounded-full bg-white px-4 py-4 text-sm font-bold text-zinc-950 shadow-sm transition hover:scale-[1.01]"
        >
          Ate here
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

function DetailMetric({ label, value, icon: Icon }) {
  return (
    <div className="rounded-3xl bg-zinc-50 p-4">
      <Icon size={18} className="mb-3 text-zinc-400" />
      <p className="text-xs font-bold text-zinc-400">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function SavedScreen({ savedPlaces, favourites, onToggleFavourite, onOpen, emptyAction }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <TopBar title="Saved places" subtitle="Your reliable lunch backups" />
      {savedPlaces.length ? (
        <div className="space-y-4">
          {savedPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              isFavourite={favourites.includes(place.id)}
              onToggleFavourite={onToggleFavourite}
              onOpen={onOpen}
              compact
            />
          ))}
        </div>
      ) : (
        <EmptyState
          emoji="🤍"
          title="No favourites yet"
          body="Save places you like so lunch gets easier over time."
          actionLabel="Find places"
          onAction={emptyAction}
        />
      )}
    </motion.div>
  );
}

function HistoryScreen({ historyRows, onClear, emptyAction }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <TopBar
        title="Lunch history"
        subtitle="So you do not repeat too often"
        right={
          historyRows.length ? (
            <button onClick={onClear} className="rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm">
              Clear
            </button>
          ) : null
        }
      />
      {historyRows.length ? (
        <GlassCard className="overflow-hidden">
          {historyRows.map((row, index) => (
            <div key={row.id} className={classNames("flex items-center gap-4 p-4", index !== historyRows.length - 1 && "border-b border-zinc-100")}>
              <div className={classNames("grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-2xl", row.place.imageTone)}>
                {row.place.heroEmoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{row.place.name}</p>
                <p className="text-xs text-zinc-500">{new Date(row.selectedAt).toLocaleString()}</p>
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">{row.place.priceLevel}</span>
            </div>
          ))}
        </GlassCard>
      ) : (
        <EmptyState
          emoji="🕰️"
          title="No lunch history yet"
          body="Tap ‘Ate here’ after choosing lunch. The app will avoid repeating it too soon."
          actionLabel="Find lunch"
          onAction={emptyAction}
        />
      )}
    </motion.div>
  );
}

function EmptyState({ emoji, title, body, actionLabel, onAction }) {
  return (
    <GlassCard className="p-8 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-[1.5rem] bg-zinc-100 text-3xl">{emoji}</div>
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-zinc-500">{body}</p>
      <button onClick={onAction} className="mt-6 rounded-full bg-zinc-950 px-5 py-3 text-sm font-bold text-white">
        {actionLabel}
      </button>
    </GlassCard>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 2200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-full border border-white/70 bg-white/85 px-4 py-3 text-center text-sm font-bold shadow-[0_20px_60px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LunchDeciderApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [screen, setScreen] = useState("home");
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [location, setLocation] = useState({ ...locationPresets[0], source: "preset" });
  const [gpsStatus, setGpsStatus] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedSpinPlace, setSelectedSpinPlace] = useState(null);
  const [toast, setToast] = useState("");
  const [favourites, setFavourites] = useState(() => loadLocalArray(STORAGE_KEYS.favourites));
  const [history, setHistory] = useState(() => loadLocalArray(STORAGE_KEYS.history));
  const [customQuickLocations, setCustomQuickLocations] = useState(() => loadLocalArray(STORAGE_KEYS.quickLocations));
  const [remotePlaces, setRemotePlaces] = useState([]);
  const [placesStatus, setPlacesStatus] = useState("Using demo places until a Google Maps API key is configured.");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationSearchLoading, setLocationSearchLoading] = useState(false);
  const [locationSearchError, setLocationSearchError] = useState("");
  const [locationSearchSource, setLocationSearchSource] = useState("");

  useEffect(() => saveLocalArray(STORAGE_KEYS.favourites, favourites), [favourites]);
  useEffect(() => saveLocalArray(STORAGE_KEYS.history, history), [history]);
  useEffect(() => saveLocalArray(STORAGE_KEYS.quickLocations, customQuickLocations), [customQuickLocations]);

  const quickLocations = useMemo(
    () => [...locationPresets, ...customQuickLocations].slice(0, 8),
    [customQuickLocations]
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadPlaces() {
      setPlacesStatus("Finding real restaurants near this area...");
      try {
        const params = new URLSearchParams({
          lat: String(location.lat),
          lng: String(location.lng),
          radius: String(Math.max(preferences.distanceM, 1500)),
          mood: preferences.mood,
          cuisines: preferences.cuisines.join(","),
          dietary: preferences.dietary,
          budget: preferences.budget,
          spice: preferences.spice,
        });
        const payload = await fetchJson(
          `/api/places?${params.toString()}`,
          { signal: controller.signal }
        );
        const places = normalizeApiPlaces(payload.places || []);
        setRemotePlaces(places);
        setPlacesStatus(
          payload.source === "google" && places.length
            ? `Using ${places.length} live Google Places results near ${location.name}.`
            : "Using demo places until a Google Maps API key is configured."
        );
      } catch (error) {
        if (error.name === "AbortError") return;
        setRemotePlaces([]);
        setPlacesStatus(`Using demo places because live places failed: ${error.message}`);
      }
    }

    loadPlaces();
    return () => controller.abort();
  }, [location, preferences]);

  useEffect(() => {
    const query = locationQuery.trim();
    const controller = new AbortController();

    if (query.length < 2) {
      setLocationSuggestions([]);
      setLocationSearchError("");
      setLocationSearchSource("");
      setLocationSearchLoading(false);
      return () => controller.abort();
    }

    const timer = setTimeout(async () => {
      setLocationSearchLoading(true);
      setLocationSearchError("");

      try {
        const payload = await fetchJson(`/api/location-suggest?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const apiSuggestions = payload.suggestions || [];
        const fallbackSuggestions = quickLocations
          .filter((preset) => `${preset.name} ${preset.hint}`.toLowerCase().includes(query.toLowerCase()))
          .map((preset) => ({
            id: preset.id,
            label: preset.name,
            description: preset.hint,
            fallbackPreset: preset,
          }));

        setLocationSuggestions(apiSuggestions.length ? apiSuggestions : fallbackSuggestions);
        setLocationSearchSource(payload.source);
      } catch (error) {
        if (error.name === "AbortError") return;
        setLocationSuggestions([]);
        setLocationSearchError(error.message);
      } finally {
        setLocationSearchLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [locationQuery, quickLocations]);

  const availablePlaces = remotePlaces.length ? remotePlaces : demoPlaces;

  const recommendations = useMemo(() => {
    const scored = availablePlaces
      .map((place) => scorePlace(place, location, preferences, history, favourites))
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    return scored;
  }, [availablePlaces, location, preferences, history, favourites]);

  const enrichedPlaces = useMemo(() => {
    return availablePlaces
      .map((place) => {
        const scored = scorePlace(place, location, { ...defaultPreferences, distanceM: 100000 }, [], favourites);
        const distance = haversineMeters(location, { lat: place.lat, lng: place.lng });
        return scored || {
          ...place,
          distance,
          walkMin: walkingMinutes(distance),
          score: 0,
          reason: "This place is saved, but it does not match the current filters.",
          isFallback: true,
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }, [availablePlaces, location, favourites]);

  const savedPlaces = enrichedPlaces.filter((place) => favourites.includes(place.id));

  const historyRows = history
    .map((row) => ({ ...row, place: enrichedPlaces.find((place) => place.id === row.placeId) }))
    .filter((row) => row.place)
    .sort((a, b) => new Date(b.selectedAt).getTime() - new Date(a.selectedAt).getTime());

  const locationLabel = location.name || "Current location";
  const canAddQuickLocation =
    location.source === "search" &&
    !quickLocations.some((preset) => preset.id === location.id) &&
    Number.isFinite(location.lat) &&
    Number.isFinite(location.lng);

  const goHome = () => {
    setScreen("home");
    setActiveTab("home");
    setSelectedPlace(null);
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setGpsStatus("GPS is not available in this browser. Use a demo location instead.");
      return;
    }
    setGpsStatus("Finding your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          id: "gps",
          name: "Current location",
          hint: "GPS",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          source: "gps",
        });
        setGpsStatus("GPS location updated. If demo places look far away, switch to a Singapore preset.");
      },
      () => {
        setGpsStatus("Could not access GPS. You can still use a demo lunch area.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handlePresetLocation = (preset) => {
    setLocation({ ...preset, source: preset.source || "preset" });
    setLocationQuery("");
    setLocationSuggestions([]);
    setGpsStatus("");
    setToast(`Lunch area changed to ${preset.name}`);
  };

  const handleAddQuickLocation = () => {
    if (!canAddQuickLocation) return;

    const quickLocation = {
      id: location.id,
      name: location.name,
      hint: location.hint || "Saved place",
      lat: location.lat,
      lng: location.lng,
      source: "quick",
    };

    setCustomQuickLocations((prev) => [quickLocation, ...prev.filter((item) => item.id !== quickLocation.id)].slice(0, 5));
    setToast(`${location.name} saved as a quick place`);
  };

  const handleSelectLocationSuggestion = async (suggestion) => {
    if (suggestion.fallbackPreset) {
      handlePresetLocation(suggestion.fallbackPreset);
      return;
    }

    setLocationSearchLoading(true);
    setLocationSearchError("");
    try {
      const detail = await fetchJson(`/api/location-detail?placeId=${encodeURIComponent(suggestion.id)}`);
      setLocation({
        id: detail.id,
        name: detail.name,
        hint: detail.address,
        lat: detail.lat,
        lng: detail.lng,
        source: "search",
      });
      setLocationQuery("");
      setLocationSuggestions([]);
      setGpsStatus("");
      setToast(`Lunch area changed to ${detail.name}`);
    } catch (error) {
      setLocationSearchError(error.message);
    } finally {
      setLocationSearchLoading(false);
    }
  };

  const handleHungryNow = () => {
    setPreferences({
      budget: "$",
      distanceM: 900,
      cuisines: [],
      dietary: "No restriction",
      spice: "Either",
      mood: "fast",
    });
    setSelectedSpinPlace(null);
    setScreen("results");
    setActiveTab("home");
  };

  const handleSurprise = () => {
    const pool = recommendations.length ? recommendations : enrichedPlaces.slice(0, 5);
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setSelectedPlace(pick);
    setScreen("detail");
    setActiveTab("home");
    setToast(`Surprise pick: ${pick.name}`);
  };

  const toggleFavourite = (placeId) => {
    setFavourites((prev) => {
      const exists = prev.includes(placeId);
      setToast(exists ? "Removed from favourites" : "Saved to favourites");
      return exists ? prev.filter((id) => id !== placeId) : [...prev, placeId];
    });
  };

  const handleOpenPlace = (place) => {
    setSelectedPlace(place);
    setScreen("detail");
    setActiveTab("home");
  };

  const handleAteHere = (place) => {
    setHistory((prev) => [
      {
        id: crypto?.randomUUID ? crypto.randomUUID() : `${place.id}-${Date.now()}`,
        placeId: place.id,
        selectedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setToast("Added to lunch history. I’ll avoid repeating it too soon.");
  };

  const handleSpinPick = () => {
    if (!recommendations.length) return;
    setSelectedSpinPlace(null);
    setTimeout(() => {
      const pick = recommendations[Math.floor(Math.random() * recommendations.length)];
      setSelectedSpinPlace(pick);
      setSelectedPlace(pick);
      setToast(`The wheel picked ${pick.name}`);
    }, 200);
  };

  const resetFilters = () => {
    setPreferences(defaultPreferences);
    setSelectedSpinPlace(null);
    setToast("Filters reset");
  };

  const renderHomeContent = () => {
    if (screen === "preferences") {
      return (
        <PreferenceScreen
          preferences={preferences}
          setPreferences={setPreferences}
          onFind={() => {
            setSelectedSpinPlace(null);
            setScreen("results");
          }}
          onBack={goHome}
        />
      );
    }

    if (screen === "results") {
      return (
        <ResultsScreen
          recommendations={recommendations}
          onBack={() => setScreen("preferences")}
          onOpen={handleOpenPlace}
          favourites={favourites}
          onToggleFavourite={toggleFavourite}
          onSpinPick={handleSpinPick}
          selectedSpinPlace={selectedSpinPlace}
          onResetFilters={resetFilters}
        />
      );
    }

    if (screen === "detail") {
      return (
        <DetailScreen
          place={selectedPlace}
          onBack={() => setScreen("results")}
          isFavourite={selectedPlace ? favourites.includes(selectedPlace.id) : false}
          onToggleFavourite={toggleFavourite}
          onAteHere={handleAteHere}
        />
      );
    }

    return (
      <HomeScreen
        location={location}
        locationLabel={locationLabel}
        onUseGps={handleUseGps}
        gpsStatus={gpsStatus}
        onPresetLocation={handlePresetLocation}
        quickLocations={quickLocations}
        canAddQuickLocation={canAddQuickLocation}
        onAddQuickLocation={handleAddQuickLocation}
        locationQuery={locationQuery}
        onLocationQueryChange={setLocationQuery}
        locationSuggestions={locationSuggestions}
        onSelectLocationSuggestion={handleSelectLocationSuggestion}
        locationSearchLoading={locationSearchLoading}
        locationSearchError={locationSearchError}
        locationSearchSource={locationSearchSource}
        onStart={() => setScreen("preferences")}
        onHungryNow={handleHungryNow}
        onSurprise={handleSurprise}
        placesStatus={placesStatus}
      />
    );
  };

  let content = renderHomeContent();

  if (activeTab === "saved") {
    content = (
      <SavedScreen
        savedPlaces={savedPlaces}
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
        onOpen={handleOpenPlace}
        emptyAction={goHome}
      />
    );
  }

  if (activeTab === "history") {
    content = (
      <HistoryScreen
        historyRows={historyRows}
        onClear={() => {
          setHistory([]);
          setToast("Lunch history cleared");
        }}
        emptyAction={goHome}
      />
    );
  }

  return (
    <>
      <Shell activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        if (tab === "home") setScreen("home");
      }}>
        {content}
      </Shell>
      <Toast message={toast} onClose={() => setToast("")} />
    </>
  );
}
