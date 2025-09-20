# PokeTeams

API RESTful em NestJS para gerenciar treinadores, times e Pokémon integrando com a [PokéAPI](https://pokeapi.co/).

## Requisitos

- Node.js 20.x
- npm (vem junto com o Node)
- Docker + Docker Compose

## Como rodar localmente

1. Clone este repositório
2. Instale as dependências:
    ```bash
    npm install
    ```
3. Configure as variáveis de ambiente (copie `.env.example` para `.env`)
4. Suba o banco de dados com Docker:
    ```
    docker compose up -d
    ```
5. Inicie a aplicação:
    ```bash
    npm run start:dev
    ```
6. Acesse em: http://localhost:3000