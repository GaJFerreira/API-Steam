const express = require("express");
const router = express.Router();
const steamController = require("../controllers/steamController");

router.get("/user/:steamids", steamController.getUser);
router.get("/games/:steamid", steamController.getGames);
router.get("/achievements/:steamid/:appid", steamController.getAchievements);

module.exports = router;
