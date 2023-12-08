const express = require("express");
const router = express.Router();
const passport = require("passport");
const { createUser, loginUser, checkUser } = require("../controllers/Auth");

router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check", passport.authenticate("jwt"), checkUser);

exports.router = router;
