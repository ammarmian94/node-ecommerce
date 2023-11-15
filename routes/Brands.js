const express = require("express");
const { createBrand, fetchAllBrands } = require("../controllers/Brand");
const router = express.Router();

router.post("/", createBrand).get("/", fetchAllBrands);

exports.router = router;
