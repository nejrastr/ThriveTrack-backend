const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes); // added as middelware in app.js

app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown erroe ocurred!" });
});
mongoose
  .connect(
    "mongodb+srv://nejrastr:LKXjn6BGaZHxD7R6@thrivetrackdb.cefzhox.mongodb.net/?retryWrites=true&w=majority&appName=ThriveTrackDB"
  )
  .then(() => {
    console.log("Connected to database.s");
    app.listen(5000);
  })
  .catch(console.log("Error while trying to connect to database."));
