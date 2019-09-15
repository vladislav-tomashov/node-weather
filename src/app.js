const path = require("path");
const express = require("express");
const hbs = require("hbs");

const { geocode, geoplace } = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", { title: "Weather App", name: "Vlad Tomashov" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About", name: "Vlad Tomashov" });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Vlad Tomashov",
    text: "help text"
  });
});

app.get("/weatherbylocation", async (req, res) => {
  const { longitude, latitude } = req.query;
  if (!longitude || !latitude) {
    return res.send({
      error: "You must provide longitude and latitude"
    });
  }

  try {
    const { place_name } = await geoplace({
      latitude,
      longitude
    });
    const forecastResult = await forecast({
      latitude,
      longitude
    });
    const { summary, temperature } = forecastResult;
    const weather = `${summary}. It is currently ${temperature} degrees out.`;
    res.send({
      location: place_name,
      weather
    });
  } catch (e) {
    return res.send({
      error: e.message
    });
  }
});

app.get("/weather", async (req, res) => {
  const { address } = req.query;
  if (!address) {
    return res.send({
      error: "You must provide an address"
    });
  }

  try {
    const { place_name, latitude, longitude } = await geocode(address);
    const { summary, temperature } = await forecast({
      latitude,
      longitude
    });
    const weather = `${summary}. It is currently ${temperature} degrees out.`;
    res.send({
      location: place_name,
      weather
    });
  } catch (e) {
    return res.send({
      error: e.message
    });
  }
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term"
    });
  }
  console.log(req.query);
  res.send({
    products: []
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404 help",
    name: "Vlad Tomashov",
    errorMessage: "page not found"
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Vlad Tomashov",
    errorMessage: "Help article page not found"
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
