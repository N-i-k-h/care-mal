const express = require("express");
const { analyzeImage } = require("../controllers/aiController");

const router = express.Router();

router.post("/analyze", analyzeImage);

module.exports = router;
