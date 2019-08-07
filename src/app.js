const path = require("path");
const express = require("express");
const hbs = require("hbs");

const getGeoData = require("./utils/geo");
const getWeather = require("./utils/weather");

const app = express();

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

app.get("/weather", async (req, res) => {
  const { address } = req.query;
  if (!address) {
    return res.send({
      error: "You must provide an adress"
    });
  }

  try {
    const { place_name, latitude, longitude } = await getGeoData(address);
    const forecast = await getWeather({
      latitude,
      longitude
    });
    res.send({
      location: place_name,
      forecast,
      address
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

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
