const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const Place = require("../model/place");
const User = require("../model/user");
const mongoose = require("mongoose");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Could not find place by id.", 500);
    return next(error);
  }
  if (!place) {
    const error = new HttpError("Could no find a place fpr provided id.", 404);
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError("Could not find a places for cetain user.");
    return next(error);
  }
  if (!places) {
    const error = new HttpError("User did not logged any place", 404);
    return next(error);
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs.", 422));
  }

  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://lp-cms-production.imgix.net/2021-05/shutterstockRF_1563449509.jpg?auto=format&w=1440&h=810&fit=crop&q=75",
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    console.error("Error finding user:", err);
    return next(new HttpError("Failed creating place", 500));
  }

  if (!user) {
    return next(new HttpError("This user doesn't exist", 404));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await createdPlace.save({ session });
    user.places.push(createdPlace);
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.error("Error creating place:", err);
    return next(new HttpError("Creating place failed.", 500));
  }

  res
    .status(201)
    .json({ message: "Place successfully created.", place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input", 422);
  }
  let place;
  const placeId = req.params.pid;
  const { title, description } = req.body;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Could not find place with this id.", 500);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Problem with saving place to database.", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });

  res.status(200).json({ message: "Succesfully updated place", place: place });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
    console.log(placeId);
    if (!place) {
      const error = new HttpError("Could not find place for this id.", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError("Error with finding place.", 500);
    return next(error);
  }

  if (!place) {
    const error = HttpError("Could not find place for this id", 404);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await place.deleteOne({ session: session });
    place.creator.places.pull(place);
    await place.creator.save({ session: session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Error with removing place from database.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Successfully deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
