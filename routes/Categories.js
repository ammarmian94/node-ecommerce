const express = require("express");
const {
  createCategory,
  fetchAllCategories,
} = require("../controllers/Category");
const router = express.Router();

router.post("/", createCategory).get("/", fetchAllCategories);

exports.router = router;
