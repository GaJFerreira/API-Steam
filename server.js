const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config(); // Carrega variáveis do arquivo .env

const app = express();
const port = process.env.API_PORT || 8000;
const host = process.env.API_HOST || '127.0.0.1';

const STEAM_API_KEY = process.env.STEAM_API_KEY;
if (!STEAM_API_KEY) {
    console.error("Chave da API da Steam não encontrada. Verifique o arquivo .env ou as variáveis de ambiente.");
    process.exit(1); // Encerra o processo se a chave não for encontrada
}

const STEAM_API_BASE_URL = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/";
const STEAM_API_GET_OWNED_GAMES_URL = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/";
const STEAM_API_GET_PLAYER_ACHIEVEMENTS_URL = "https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/";

app.get("/user/:steamids", async (req, res) => {
    const { steamids } = req.params;
    const params = {
        key: STEAM_API_KEY,
        steamids: steamids
    };

    try {
        const response = await axios.get(STEAM_API_BASE_URL, { params });
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao chamar a API da Steam (GetPlayerSummaries):", error.message);
        if (error.response) {
            res.status(error.response.status).json({ detail: `Erro ao chamar a API da Steam: ${error.response.data}` });
        } else if (error.request) {
            res.status(500).json({ detail: "Erro de requisição ao chamar a API da Steam: Nenhuma resposta recebida." });
        } else {
            res.status(500).json({ detail: `Erro ao configurar a requisição para a API da Steam: ${error.message}` });
        }
    }
});

app.get("/games/:steamid", async (req, res) => {
    const { steamid } = req.params;
    const params = {
        key: STEAM_API_KEY,
        steamid: steamid,
        format: "json",
        include_appinfo: true,
        include_played_free_games: true
    };

    try {
        const response = await axios.get(STEAM_API_GET_OWNED_GAMES_URL, { params });
        console.log("Resposta da API Steam (GetOwnedGames):", JSON.stringify(response.data, null, 2)); // Adicionado para depuração
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao chamar a API da Steam (GetOwnedGames):", error.message);
        if (error.response) {
            res.status(error.response.status).json({ detail: `Erro ao chamar a API da Steam para obter jogos: ${error.response.data}` });
        } else if (error.request) {
            res.status(500).json({ detail: "Erro de requisição ao chamar a API da Steam para obter jogos: Nenhuma resposta recebida." });
        } else {
            res.status(500).json({ detail: `Erro ao configurar a requisição para a API da Steam para obter jogos: ${error.message}` });
        }
    }
});

app.get("/achievements/:steamid/:appid", async (req, res) => {
    const { steamid, appid } = req.params;
    const params = {
        key: STEAM_API_KEY,
        steamid: steamid,
        appid: appid,
        l: "portuguese"
    };

    try {
        const response = await axios.get(STEAM_API_GET_PLAYER_ACHIEVEMENTS_URL, { params });
        res.json(response.data);
    } catch (error) {
        console.error("Erro ao chamar a API da Steam (GetPlayerAchievements):", error.message);
        if (error.response) {
            // A API da Steam pode retornar 400 se o jogo não tiver conquistas ou o perfil for privado
            if (error.response.status === 400 && error.response.data && error.response.data.playerstats && error.response.data.playerstats.error) {
                res.status(400).json({ detail: `Erro ao obter conquistas: ${error.response.data.playerstats.error}` });
            } else {
                res.status(error.response.status).json({ detail: `Erro ao chamar a API da Steam para obter conquistas: ${JSON.stringify(error.response.data)}` });
            }
        } else if (error.request) {
            res.status(500).json({ detail: "Erro de requisição ao chamar a API da Steam para obter conquistas: Nenhuma resposta recebida." });
        } else {
            res.status(500).json({ detail: `Erro ao configurar a requisição para a API da Steam para obter conquistas: ${error.message}` });
        }
    }
});

app.listen(port, host, () => {
    console.log(`Servidor Node.js rodando em http://${host}:${port}`);
});
