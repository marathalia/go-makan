import { fetchPlacePhoto, getPlacesApiKey } from "../server/places-service.js";

export default async function handler(request, response) {
  try {
    const result = await fetchPlacePhoto(
      getPlacesApiKey(),
      request.query.reference,
      request.query.maxWidth
    );

    response.status(result.status);
    if (result.contentType) response.setHeader("Content-Type", result.contentType);
    if (result.cacheControl) response.setHeader("Cache-Control", result.cacheControl);
    if (result.body) {
      response.send(Buffer.from(result.body));
      return;
    }
    response.end();
  } catch (error) {
    response.status(500).send(error.message);
  }
}
