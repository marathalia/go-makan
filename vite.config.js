import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {
  findPlaces,
  getLocationDetail,
  getPlacePhotoRedirect,
  suggestLocations,
} from "./server/places-service.js";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function installPlacesApi(server, apiKey) {
  server.middlewares.use("/api/location-suggest", async (req, res) => {
    try {
      const requestUrl = new URL(req.url, "http://localhost");
      const result = await suggestLocations(apiKey, requestUrl.searchParams.get("q"));
      sendJson(res, result.status, result.body);
    } catch (error) {
      sendJson(res, 500, { error: error.message, suggestions: [] });
    }
  });

  server.middlewares.use("/api/location-detail", async (req, res) => {
    try {
      const requestUrl = new URL(req.url, "http://localhost");
      const result = await getLocationDetail(apiKey, requestUrl.searchParams.get("placeId"));
      sendJson(res, result.status, result.body);
    } catch (error) {
      sendJson(res, 500, { error: error.message });
    }
  });

  server.middlewares.use("/api/places", async (req, res) => {
    try {
      const requestUrl = new URL(req.url, "http://localhost");
      const result = await findPlaces(apiKey, Object.fromEntries(requestUrl.searchParams));
      sendJson(res, result.status, result.body);
    } catch (error) {
      sendJson(res, 500, { error: error.message, places: [] });
    }
  });

  server.middlewares.use("/api/place-photo", (req, res) => {
    const requestUrl = new URL(req.url, "http://localhost");
    const result = getPlacePhotoRedirect(
      apiKey,
      requestUrl.searchParams.get("reference"),
      requestUrl.searchParams.get("maxWidth")
    );

    res.statusCode = result.status;
    if (result.location) {
      res.setHeader("Location", result.location);
      res.end();
      return;
    }

    res.end(result.body || "");
  });
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiKey = env.GOOGLE_MAPS_API_KEY || env.GOOGLE_PLACES_API_KEY;

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "go-makan-places-api",
        configureServer(server) {
          installPlacesApi(server, apiKey);
        },
      },
    ],
  };
});
