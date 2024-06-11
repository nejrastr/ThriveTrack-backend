const e = require("express");
const User = require("../model/user");
const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const user = require("../model/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Fetchin gusers failed", 500);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) }); // to get rid of id
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

  const { name, surname, email, password } = req.body;

  const createdUser = new User({
    name,
    email,
    image:
      "https://lp-cms-production.imgix.net/2021-05/shutterstockRF_1563449509.jpg?auto=format&w=1440&h=810&fit=crop&q=75",
    password,
    places: [],
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
    isSigned = User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("User with this email doenst exist", 422);
    return next(error);
  }

  if (isSigned.password !== password) {
    const error = new HttpError("Invalid credentials.", 401);
    return next(error);
  }

  res.status(200).json({ message: "Logged in." });
};
exports.getUsers = getUsers;
exports.signUp = signUp;
exports.LogIn = LogIn;
