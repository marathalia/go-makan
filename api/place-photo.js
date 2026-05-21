import { getPlacePhotoRedirect, getPlacesApiKey } from "../server/places-service.js";

export default function handler(request, response) {
  const result = getPlacePhotoRedirect(
    getPlacesApiKey(),
    request.query.reference,
    request.query.maxWidth
  );

  if (result.location) {
    response.redirect(result.status, result.location);
    return;
  }

  response.status(result.status);
  if (result.body) {
    response.send(result.body);
    return;
  }
  response.end();
}
