const rp = require("request-promise");

const getWeather = async ({ longitude, latitude, language }) => {
  const weatherToken = "e89a6604091e90d4b354515b084e558e";
  const weatherUrl = `https://api.darksky.net/forecast/${weatherToken}/${longitude},${latitude}`;

  const { currently } = await rp({
    url: weatherUrl,
    json: true,
    qs: {
      units: "si",
      lang: language
    }
  });
  if (!currently || !currently.summary) {
    throw new Error(
      `Unable to find location with longitude=${longitude} and latitude=${latitude}`
    );
  }
  return currently;
};

module.exports = getWeather;
