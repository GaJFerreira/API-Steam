# API-Steam

## Configuração Inicial

**Importante:**

- Substitua `SUA_CHAVE_API_STEAM_AQUI` pela sua chave de API da Steam. Você pode obter uma [aqui](https://steamcommunity.com/dev/apikey).
- `API_PORT` (opcional): Define a porta em que a API vai rodar. O padrão é `8000`.
- `API_HOST` (opcional): Define o host em que a API vai rodar. O padrão é `127.0.0.1`.

## Como Rodar o Projeto

1.  **Instale as dependências:**
    Se você ainda não o fez, abra o terminal na pasta do projeto e rode:

    ```bash
    npm install
    ```

2.  **Inicie o servidor:**
    Ainda no terminal, rode:
    ```bash
    npm start
    ```
    Você deverá ver uma mensagem como: `Servidor Node.js rodando em http://127.0.0.1:8000` (ou a porta que você configurou).

## Endpoints da API

Aqui estão os endpoints disponíveis e como usá-los:

### 1. Informações do Usuário

Recupera informações básicas de um ou mais perfis da Steam.

- **URL:** `/user/:steamids`
- **Método:** `GET`
- **Parâmetros da URL:**
  - `steamids`: O ID Steam de 64 bits do(s) usuário(s). Para múltiplos IDs, separe-os por vírgula (ex: `76561198167120451,76561197960287931`).
- **Exemplo de Uso:**
  `http://127.0.0.1:8000/user/SEU_STEAM_ID_AQUI`
- **Resposta Esperada (Sucesso):** Um JSON com os dados dos perfis.
- **Possíveis Erros:**
  - Se a chave da API da Steam for inválida ou não fornecida, o servidor pode não iniciar ou retornar erros.
  - Erros de conexão com a API da Steam.

### 2. Jogos do Usuário

Recupera a lista de jogos que um usuário possui.

- **URL:** `/games/:steamid`
- **Método:** `GET`
- **Parâmetros da URL:**
  - `steamid`: O ID Steam de 64 bits do usuário.
- **Exemplo de Uso:**
  `http://127.0.0.1:8000/games/SEU_STEAM_ID_AQUI`
- **Resposta Esperada (Sucesso):** Um JSON com a lista de jogos, incluindo informações como nome, tempo jogado, etc.
- **Possíveis Erros:**
  - `{"response": {}}`: Pode significar que o perfil do usuário é privado, não possui jogos, ou o `steamid` é inválido.
  - Erros de conexão ou da API da Steam.

### 3. Conquistas do Usuário em um Jogo

Recupera as conquistas de um usuário para um jogo específico.

- **URL:** `/achievements/:steamid/:appid`
- **Método:** `GET`
- **Parâmetros da URL:**
  - `steamid`: O ID Steam de 64 bits do usuário.
  - `appid`: O ID do aplicativo (jogo) na Steam.
- **Exemplo de Uso:**
  `http://127.0.0.1:8000/achievements/SEU_STEAM_ID_AQUI/ID_DO_JOGO_AQUI`
  (Exemplo: `http://127.0.0.1:8000/achievements/76561198167120451/440` para Team Fortress 2)
- **Resposta Esperada (Sucesso):** Um JSON com a lista de conquistas do jogador para aquele jogo.
- **Possíveis Erros:**
  - Erro 400 (Bad Request): Pode ocorrer se o jogo não tiver conquistas, o perfil for privado, ou o `appid` for inválido. A mensagem de erro da API da Steam geralmente indica o motivo (ex: "Requested app has no stats").
  - Erro 403 (Forbidden): Pode indicar um problema com sua chave da API da Steam ou permissões para acessar os dados daquele usuário/jogo.
  - Erro 500 (Internal Server Error): Erro interno na API da Steam.
  - Erros de conexão.

## Observações

- Certifique-se de que o perfil da Steam que você está consultando é público, especialmente para dados de jogos e conquistas. Perfis privados podem retornar respostas vazias ou erros.
- A `STEAM_API_KEY` é sensível e não deve ser compartilhada publicamente. Mantenha seu arquivo `.env` seguro.
