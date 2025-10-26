const express = require("express");
const router = express.Router();
const { handleVoiceAssistant } = require("../controllers/aivoiceController");

router.post("/voice", handleVoiceAssistant);

module.exports = router;
