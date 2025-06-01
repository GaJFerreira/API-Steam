const express = require("express");
const router = express.Router();
const steamController = require("../controllers/steamController");

router.get("/user/:steamids", steamController.getUser);
router.get("/library/:steamid", steamController.getLibrary);
router.get("/game/:appid", steamController.getGameDetails);
router.get("/achievements/:steamid/:appid", steamController.getAchievements);

module.exports = router;
