const steamService = require("../services/steamService");

async function getUser(req, res) {
  try {
    const data = await steamService.getUserSummary(req.params.steamids);
    res.json(data);
  } catch (error) {
    handleError(res, error, "GetPlayerSummaries");
  }
}

async function getGames(req, res) {
  try {
    const data = await steamService.getOwnedGames(req.params.steamid);
    res.json(data);
  } catch (error) {
    handleError(res, error, "GetOwnedGames");
  }
}

async function getAchievements(req, res) {
  try {
    const { steamid, appid } = req.params;
    const data = await steamService.getPlayerAchievements(steamid, appid);
    res.json(data);
  } catch (error) {
    if (
      error.response &&
      error.response.status === 400 &&
      error.response.data?.playerstats?.error
    ) {
      res
        .status(400)
        .json({
          detail: `Erro ao obter conquistas: ${error.response.data.playerstats.error}`,
        });
    } else {
      handleError(res, error, "GetPlayerAchievements");
    }
  }
}

function handleError(res, error, context) {
  console.error(`Erro ao chamar a API da Steam (${context}):`, error.message);
  if (error.response) {
    res.status(error.response.status).json({
      detail: `Erro ao chamar a API da Steam (${context}): ${JSON.stringify(
        error.response.data
      )}`,
    });
  } else if (error.request) {
    res
      .status(500)
      .json({
        detail: `Nenhuma resposta recebida da API da Steam (${context})`,
      });
  } else {
    res
      .status(500)
      .json({
        detail: `Erro na configuração da requisição (${context}): ${error.message}`,
      });
  }
}

module.exports = {
  getUser,
  getGames,
  getAchievements,
};
