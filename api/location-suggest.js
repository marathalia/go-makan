import { getPlacesApiKey, suggestLocations } from "../server/places-service.js";

export default async function handler(request, response) {
  try {
    const result = await suggestLocations(getPlacesApiKey(), request.query.q);
    response.status(result.status).json(result.body);
  } catch (error) {
    response.status(500).json({ error: error.message, suggestions: [] });
  }
}
