const cache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 15;

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }
  return item.value;
}

function setCached(key, value) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

async function fetchGoogleJson(url) {
  const cached = getCached(url);
  if (cached) return cached;

  const response = await fetch(url);
  const payload = await response.json();

  if (!response.ok || (payload.status && !["OK", "ZERO_RESULTS"].includes(payload.status))) {
    throw new Error(payload.error_message || payload.status || "Google Maps request failed");
  }

  setCached(url, payload);
  return payload;
}

function moneyFromPriceLevel(priceLevel) {
  if (priceLevel === 0 || priceLevel === 1) return "$";
  if (priceLevel === 2) return "$$";
  if (priceLevel >= 3) return "$$$";
  return "$$";
}

function cuisineFromTypes(types = [], name = "") {
  const typeText = `${types.join(" ")} ${name}`.toLowerCase();
  const matches = [];

  if (/japanese|sushi|ramen|bento/.test(typeText)) matches.push("Japanese");
  if (/korean|kimchi/.test(typeText)) matches.push("Korean");
  if (/chinese|dimsum|din tai fung|boon tong kee/.test(typeText)) matches.push("Chinese");
  if (/kopitiam|killiney|hawker|chicken rice|nasi|laksa/.test(typeText)) matches.push("Local");
  if (/cafe|coffee|bakery/.test(typeText)) matches.push("Cafe");
  if (/western|pasta|pizza|burger|steak|prime rib|grill|hard rock/.test(typeText)) matches.push("Western");
  if (/soup|noodle|ramen|pho/.test(typeText)) matches.push("Noodles");
  if (/rice|onigiri|donburi|bowl/.test(typeText)) matches.push("Rice");

  return matches.length ? [...new Set(matches)].slice(0, 3) : ["Restaurant"];
}

function foodProfileFromPlace(place, searchHints = []) {
  const actualText = `${place.types?.join(" ") || ""} ${place.name}`.toLowerCase();
  const intentText = `${actualText} ${searchHints.join(" ")}`.toLowerCase();
  const moodTags = new Set();
  let heroEmoji = "🍽️";
  let signature = "Nearby restaurant";

  if (/salad|health|healthy|vegetarian|vegan|subway|poke|grain|bowl|acai|smoothie|juice|protein/.test(intentText)) {
    moodTags.add("healthy");
    moodTags.add("light");
    heroEmoji = "🥗";
    signature = "Lighter lunch option";
  }
  if (/soup|ramen|pho/.test(intentText)) {
    moodTags.add("soupy");
    moodTags.add("comfort");
    heroEmoji = "🍜";
    signature = "Warm comfort lunch";
  }
  if (/kopitiam|killiney|hawker|chicken rice|din tai fung|boon tong kee/.test(intentText)) {
    moodTags.add("comfort");
    moodTags.add("filling");
    heroEmoji = "🍚";
    signature = "Reliable comfort lunch";
  }
  if (/pizza|burger|steak|prime rib|pasta|hard rock/.test(intentText)) {
    moodTags.add("treat");
    moodTags.add("filling");
    heroEmoji = "🍝";
    signature = "Heavier treat lunch";
  }
  if (/cafe|coffee|bakery/.test(intentText)) {
    moodTags.add("light");
    heroEmoji = "☕";
    signature = "Cafe lunch spot";
  }
  if (/sushi|japanese|bento/.test(intentText)) {
    moodTags.add("light");
    heroEmoji = "🍣";
    signature = "Japanese lunch spot";
  }
  if (/spicy|mala|curry|laksa|kimchi/.test(actualText)) {
    moodTags.add("spicy");
  }
  if (/fast_food|meal_takeaway|food court|hawker|kopitiam|subway|stuff'd|stuffd/.test(actualText)) {
    moodTags.add("fast");
  }

  return {
    moodTags: [...moodTags],
    heroEmoji,
    signature,
    halal: /halal|muslim/.test(actualText) ? true : null,
    spicy: /spicy|mala|curry|laksa|kimchi/.test(actualText) ? true : null,
    vegetarian: /vegetarian|vegan/.test(actualText) || place.types?.includes("vegetarian_restaurant") ? true : null,
  };
}

function mapGooglePlace(place, origin, searchHints = []) {
  const location = place.geometry?.location || {};
  const photoReference = place.photos?.[0]?.photo_reference;
  const profile = foodProfileFromPlace(place, searchHints);
  const avgWaitMin = 8 + Math.floor(Math.random() * 7);
  const moodTags = avgWaitMin <= 9 ? [...new Set([...profile.moodTags, "fast"])] : profile.moodTags;

  return {
    id: place.place_id,
    name: place.name,
    area: place.vicinity || place.formatted_address || "Nearby",
    cuisine: cuisineFromTypes(place.types, place.name),
    moodTags,
    priceLevel: moneyFromPriceLevel(place.price_level),
    rating: place.rating || 4,
    reviewCount: place.user_ratings_total || 0,
    lat: location.lat,
    lng: location.lng,
    address: place.vicinity || place.formatted_address || "Address unavailable",
    openNow: place.opening_hours?.open_now ?? true,
    halal: profile.halal,
    vegetarian: profile.vegetarian,
    spicy: profile.spicy,
    avgWaitMin,
    imageTone: "from-sky-100 via-white to-emerald-50",
    heroEmoji: profile.heroEmoji,
    signature: profile.signature,
    photoUrl: photoReference ? `/api/place-photo?reference=${encodeURIComponent(photoReference)}&maxWidth=900` : "",
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`,
    source: origin,
  };
}

function keywordsForIntent({ mood, cuisines, dietary, budget, spice }) {
  const keywords = new Set();

  if (mood === "healthy") {
    ["healthy food", "salad", "grain bowl", "poke bowl", "vegetarian food", "acai"].forEach((item) => keywords.add(item));
  }
  if (budget === "$") {
    ["hawker food", "food court", "kopitiam", "cheap lunch"].forEach((item) => keywords.add(item));
  }
  if (mood === "soupy" || cuisines.includes("Noodles")) {
    ["soup", "ramen", "pho", "noodles"].forEach((item) => keywords.add(item));
  }
  if (mood === "treat") {
    ["pasta", "steak", "dessert cafe"].forEach((item) => keywords.add(item));
  }
  if (mood === "fast") {
    ["quick lunch", "meal takeaway", "food court"].forEach((item) => keywords.add(item));
  }
  if (spice === "Spicy") {
    ["spicy food", "mala", "curry", "kimchi"].forEach((item) => keywords.add(item));
  }
  if (spice === "Non-spicy") {
    ["non spicy food", "soup", "sandwich", "cafe"].forEach((item) => keywords.add(item));
  }
  if (dietary === "Halal") keywords.add("halal food");
  if (dietary === "Vegetarian") keywords.add("vegetarian food");

  cuisines.forEach((cuisine) => {
    keywords.add(`${cuisine} food`);
  });

  return [...keywords].slice(0, 8);
}

export function getPlacesApiKey(env = process.env) {
  return env.GOOGLE_MAPS_API_KEY || env.GOOGLE_PLACES_API_KEY || "";
}

export async function suggestLocations(apiKey, input) {
  if (!apiKey) {
    return { status: 200, body: { source: "fallback", suggestions: [] } };
  }

  if (!input || input.trim().length < 2) {
    return { status: 200, body: { source: "google", suggestions: [] } };
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", input.trim());
  url.searchParams.set("components", "country:sg");
  url.searchParams.set("key", apiKey);

  const payload = await fetchGoogleJson(url.toString());
  const suggestions = (payload.predictions || []).slice(0, 5).map((prediction) => ({
    id: prediction.place_id,
    label: prediction.structured_formatting?.main_text || prediction.description,
    description: prediction.structured_formatting?.secondary_text || prediction.description,
  }));

  return { status: 200, body: { source: "google", suggestions } };
}

export async function getLocationDetail(apiKey, placeId) {
  if (!apiKey) {
    return { status: 503, body: { error: "Missing GOOGLE_MAPS_API_KEY" } };
  }

  if (!placeId) {
    return { status: 400, body: { error: "placeId is required" } };
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "place_id,name,formatted_address,geometry");
  url.searchParams.set("key", apiKey);

  const payload = await fetchGoogleJson(url.toString());
  const result = payload.result;

  return {
    status: 200,
    body: {
      id: result.place_id,
      name: result.name,
      address: result.formatted_address,
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      source: "search",
    },
  };
}

export async function findPlaces(apiKey, params) {
  if (!apiKey) {
    return { status: 200, body: { source: "fallback", places: [] } };
  }

  const lat = Number(params.lat);
  const lng = Number(params.lng);
  const radius = Math.min(Number(params.radius || 1500), 5000);
  const mood = params.mood || "Any";
  const cuisines = String(params.cuisines || "").split(",").filter(Boolean);
  const dietary = params.dietary || "No restriction";
  const budget = params.budget || "Any";
  const spice = params.spice || "Either";

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { status: 400, body: { error: "lat and lng are required" } };
  }

  const keywords = keywordsForIntent({ mood, cuisines, dietary, budget, spice });
  const requestUrls = [""].concat(keywords).map((keyword) => {
    const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
    url.searchParams.set("location", `${lat},${lng}`);
    url.searchParams.set("radius", String(radius));
    url.searchParams.set("type", "restaurant");
    if (keyword) url.searchParams.set("keyword", keyword);
    url.searchParams.set("key", apiKey);
    return { url: url.toString(), keyword };
  });

  const payloads = await Promise.all(
    requestUrls.map((item) => fetchGoogleJson(item.url).then((payload) => ({ ...item, payload })))
  );
  const byPlaceId = new Map();

  payloads.forEach(({ payload, keyword }) => {
    (payload.results || []).forEach((place) => {
      if (!place.place_id) return;
      const existing = byPlaceId.get(place.place_id);
      byPlaceId.set(place.place_id, {
        ...place,
        searchHints: [...new Set([...(existing?.searchHints || []), keyword].filter(Boolean))],
      });
    });
  });

  const places = [...byPlaceId.values()]
    .filter(
      (place) =>
        place.geometry?.location &&
        place.business_status !== "CLOSED_PERMANENTLY" &&
        !place.types?.includes("lodging")
    )
    .map((place) => mapGooglePlace(place, "google", place.searchHints))
    .sort((a, b) => {
      const aIntent = a.moodTags.includes(mood) || cuisines.some((cuisine) => a.cuisine.includes(cuisine)) ? 1 : 0;
      const bIntent = b.moodTags.includes(mood) || cuisines.some((cuisine) => b.cuisine.includes(cuisine)) ? 1 : 0;
      return bIntent - aIntent || b.rating - a.rating;
    })
    .slice(0, 40);

  return { status: 200, body: { source: "google", places, keywords } };
}

export async function fetchPlacePhoto(apiKey, reference, maxWidth = "900") {
  if (!apiKey) {
    return { status: 404 };
  }

  if (!reference) {
    return { status: 400, body: "reference is required" };
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/photo");
  url.searchParams.set("photoreference", reference);
  url.searchParams.set("maxwidth", maxWidth);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  const body = new Uint8Array(await response.arrayBuffer());

  return {
    status: response.status,
    body,
    contentType: response.headers.get("content-type") || "image/jpeg",
    cacheControl: response.headers.get("cache-control") || "public, max-age=3600",
  };
}
