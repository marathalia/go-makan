import { getLocationDetail, getPlacesApiKey } from "../server/places-service.js";

export default async function handler(request, response) {
  try {
    const result = await getLocationDetail(getPlacesApiKey(), request.query.placeId);
    response.status(result.status).json(result.body);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}
