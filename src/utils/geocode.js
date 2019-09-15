const rp = require("request-promise");

const geocode = async (address, { language } = {}) => {
  const encodedAddress = encodeURIComponent(address);
  const mapboxToken =
    "pk.eyJ1IjoidmxhZGlzbGF2LXRvbWFzaG92IiwiYSI6ImNqeXh5MHJuYjE0ODYzaG1sNjhsa3h1dmQifQ.jz6_fcarY_AAuZ4LGQFLJA";
  const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json`;
  const { features } = await rp({
    url: mapboxUrl,
    json: true,
    qs: {
      access_token: mapboxToken,
      limit: 1,
      language
    }
  });
  if (!features || !features[0]) {
    throw new Error(`Unable to find address "${address}". Try another search.`);
  }
  const { center, place_name } = features[0];
  if (!center) {
    throw new Error(`Unable to find address "${address}". Try another search.`);
  }
  const [latitude, longitude] = center;
  return { latitude, longitude, place_name };
};

const geoplace = async ({ language, latitude, longitude } = {}) => {
  const mapboxToken =
    "pk.eyJ1IjoidmxhZGlzbGF2LXRvbWFzaG92IiwiYSI6ImNqeXh5MHJuYjE0ODYzaG1sNjhsa3h1dmQifQ.jz6_fcarY_AAuZ4LGQFLJA";
  const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    longitude
  )},${encodeURIComponent(latitude)}.json`;
  const { features } = await rp({
    url: mapboxUrl,
    json: true,
    qs: {
      access_token: mapboxToken,
      limit: 1,
      language
    }
  });
  if (!features || !features[0]) {
    throw new Error(
      `Unable to find address by location (latitude=${latitude}, longitude=${longitude})". Try another search.`
    );
  }
  const { place_name } = features[0];
  if (!place_name) {
    `Unable to find address by location (latitude=${latitude}, longitude=${longitude})". Try another search.`;
  }
  return { place_name };
};

module.exports = { geocode, geoplace };
