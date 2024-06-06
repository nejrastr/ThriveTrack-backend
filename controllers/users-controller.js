const e = require("express");
const User = require("../model/user");
const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
let DUMMY_USERS = [
  {
    id: "u1",
    name: "Nejra",
    surname: "Strsevic",
    email: "strsevicnejra@gmail.com",
    password: "123",
  },
  {
    id: "u2",
    name: "Arman",
    surname: "Hadzigrahic",
    email: "ahadzigrahic@gmail.com",
    password: "456",
  },
];

const getUsers = (req, res, next) => {
  if (DUMMY_USERS.length === 0) {
    return new HttpError("No users.", 400);
  }
  res.status(200).json({ users: DUMMY_USERS });
};

const signUp = async (req, res, next) => {
  let existingUser;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input.", 422));
  }
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("error", 500);
  }

  if (existingUser) {
    const error = new HttpError("User already exist.", 422);
  }

  const { name, surname, email, password, places } = req.body;

  const createdUser = new User({
    name,
    email,
    image:
      "https://lp-cms-production.imgix.net/2021-05/shutterstockRF_1563449509.jpg?auto=format&w=1440&h=810&fit=crop&q=75",
    password,
    places,
  });
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("cREATING user FAILED.", 500);
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const LogIn = async (req, res, next) => {
  const { email, password } = req.body;

  let isSigned;

  try {
    isSigned = User.findOne({ email: email, password: password });
  } catch (err) {
    const error = new HttpError("Doesnt exist", 422);
  }

  res.status(200).json({ message: "Logged in." });
};
exports.getUsers = getUsers;
exports.signUp = signUp;
exports.LogIn = LogIn;
