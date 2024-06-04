const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const userControllers = require("../controllers/users-controller");

router.get("/", userControllers.getUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("surname").not().isEmpty(),
    check("email").not().isEmpty(),
    check("password").not().isEmpty(),
    check("email").normalizeEmail(),
    check("email").isEmail(),
  ],
  userControllers.signUp
);
router.post(
  "/login",
  [check("email").isEmail(), check("password").isStrongPassword()],
  userControllers.LogIn
);

module.exports = router;
