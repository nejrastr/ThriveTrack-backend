const e = require("express");
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

const signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid input.", 422);
  }
  const { name, surname, email, password } = req.body;
  const hasuSER = DUMMY_USERS.find((u) => u.email === email);
  if (hasuSER) {
    throw new HttpError("User with this email already exist.", 422);
  }
  const createdUser = {
    id: uuidv4(),
    name,
    surname,
    email,
    password,
  };
  DUMMY_USERS.push(createdUser);

  res.status(201).json({ message: "Succesfully signed up." });
};

const LogIn = (req, res, next) => {
  const { email, password } = req.body;

  const user = DUMMY_USERS.find((u) => u.email === email);
  if (!user || user.password != password) {
    throw new HttpError("No user with that email.", 401);
  }
  res.status(200).json({ message: "Logged in." });
};
exports.getUsers = getUsers;
exports.signUp = signUp;
exports.LogIn = LogIn;
