const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Sarajevo",
    description: "Capital of BiH",
    location: {
      lat: 40.83933,
      lng: -73.9292,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlaceById = (req, res) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    throw new HttpError("Could no find a place fpr provided id.", 404);
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, error) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });
  if (!places) {
    return new HttpError("Could not find a place for provided id", 404);
  }
  res.json({ places });
};

const createPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs.", 422);
  }
  const { id, title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuidv4(),
    title: title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);
  res
    .status(200)
    .json({ message: "User is successfully created.", place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input", 422);
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;
  const place = {
    ...DUMMY_PLACES.find((p) => {
      return p.id === placeId;
    }),
  }; //make a copy of an object
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  place.title = title;
  place.description = description;

  DUMMY_PLACES[placeIndex] = place;

  res.status(200).json({ place: place });

  res.status(200).json({ message: "Succesfully updated place", place: place });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;

  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "Successfully deleted place." });
};
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
