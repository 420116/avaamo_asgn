const express = require("express");
const router = express.Router();
const wordsController = require("../controllers/words-controller");

router.get("/", wordsController.getWords);
module.exports = router;
