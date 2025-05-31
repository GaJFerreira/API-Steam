const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Permitir todas as origens
const app = express();
app.use(cors());

const port = process.env.API_PORT || 8000;
const host = process.env.API_HOST || "127.0.0.1";

if (!process.env.STEAM_API_KEY) {
  console.error(
    "Chave da API da Steam não encontrada. Verifique o arquivo .env"
  );
  process.exit(1);
}

const steamRoutes = require("./routes/steamRoutes");
app.use("/", steamRoutes);

app.listen(port, host, () => {
  console.log(`Servidor Node.js rodando em http://${host}:${port}`);
});
