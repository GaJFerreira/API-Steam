const axios = require("axios");
const STEAM_API_KEY = process.env.STEAM_API_KEY;

const BASE_URLS = {
  playerSummaries:
    "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/",
  ownedGames: "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/",
  achievements:
    "https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/",
  gameDetails: "https://store.steampowered.com/api/appdetails",
};

async function getUserSummary(steamids) {
  const response = await axios.get(BASE_URLS.playerSummaries, {
    params: {
      key: STEAM_API_KEY,
      steamids,
    },
  });
  return response.data;
}

async function getOwnedGames(steamid) {
  const response = await axios.get(BASE_URLS.ownedGames, {
    params: {
      key: STEAM_API_KEY,
      steamid,
      format: "json",
      include_appinfo: true,
      include_played_free_games: true,
    },
  });
  return response.data;
}

async function getGameDetails(appid) {
  const response = await axios.get(BASE_URLS.gameDetails, {
    params: {
      appids: appid,
      key: STEAM_API_KEY,
    },
  });
  const gameData = response.data[appid];
  if (gameData && gameData.success) {
    return gameData.data;
  } else {
    throw new Error("Jogo não encontrado");
  }
}
module.exports = { getGameDetails };

async function getPlayerAchievements(steamid, appid) {
  const response = await axios.get(BASE_URLS.achievements, {
    params: {
      key: STEAM_API_KEY,
      steamid,
      appid,
      l: "portuguese",
    },
  });
  return response.data;
}

module.exports = {
  getUserSummary,
  getOwnedGames,
  getPlayerAchievements,
  getGameDetails,
};
