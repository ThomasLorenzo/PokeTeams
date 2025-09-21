# PokeTeams

API RESTful em NestJS para gerenciar treinadores, times e Pokémon integrando com a [PokéAPI](https://pokeapi.co/).

## 🚀 Como Executar

### Pré-requisitos

- Node.js 20.x
- npm (vem junto com o Node)
- Docker + Docker Compose

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/ThomasLorenzo/PokeTeams.git
   cd poke-teams
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   ```

4. **Suba o banco de dados PostgreSQL**
   ```bash
   docker compose up -d
   ```

5. **Execute a aplicação**
   ```bash
   npm run start:dev
   ```

6. **Acesse a documentação**
   - Swagger UI: http://localhost:3000/docs

## 📋 Funcionalidades

- **CRUD para Treinadores**: Criar, listar, buscar, atualizar e remover treinadores.
- **CRUD para Times**: Gerenciar times associados a treinadores.
- **Gerenciamento de Pokémon nos Times**: Adicionar, listar e remover Pokémon dos times.
- **Integração com PokéAPI**: Validação e enriquecimento de dados dos Pokémon.
- **Validação de DTOs**: Validação automática de entrada com class-validator.
- **Documentação Swagger**: API documentada automaticamente.
- **Arquitetura em Camadas**: Controllers, Services e Repositories bem organizados.

## 📚 Endpoints da API

### Treinadores (/trainers)

- `POST /trainers` - Criar treinador.
- `GET /trainers` - Listar todos os treinadores.
- `GET /trainers/:id` - Buscar treinador por id.
- `GET /trainers/:id/teams` - Listar times de um treinador.
- `PATCH /trainers/:id` - Atualizar treinador.
- `DELETE /trainers/:id` - Remover treinador.

### Times (/teams)

- `POST /teams` - Criar time.
- `GET /teams` - Listar todos os times.
- `GET /teams/:id` - Buscar time por id.
- `PATCH /teams/:id` - Atualizar time.
- `DELETE /teams/:id` - Remover time.

### Pokémon dos Times (/teams/:teamId/pokemon)

- `POST /teams/:teamId/pokemon` - Adicionar Pokémon ao time.
- `GET /teams/:teamId/pokemon` - Listar Pokémon do time.
- `DELETE /teams/:teamId/pokemon/:id` - Remover Pokémon do time.

## 🏗️ Arquitetura

### Entidades Principais

- **Trainer**: Treinadores com nome e cidade de origem.
- **Team**: Times pertencentes a treinadores.
- **TeamPokemon**: Relação entre times e Pokémon.

### Relacionamentos

- 1xN: Um Treinador pode ter vários Times.
- NxN: Um Time pode ter vários Pokémon (via PokéAPI).

## 🔧 Tecnologias Utilizadas

- **NestJS**: Framework Node.js para APIs.
- **TypeScript**: Linguagem de programação.
- **TypeORM**: ORM para TypeScript/JavaScript.
- **PostgreSQL**: Banco de dados relacional.
- **Docker**: Containerização do banco de dados.
- **Swagger/OpenAPI**: Documentação automática da API.
- **class-validator / class-transformer**: Validação e transformação de DTOs.
- **Axios**: Cliente HTTP para PokéAPI.

## 🎯 Decisões de Projeto

### Integração com PokéAPI
- Validação de existência do Pokémon antes de adicionar ao time.
- Enriquecimento de dados na listagem (nome, tipos, habilidades, imagem).

### Validações
- Limite de 6 Pokémon por time.
- Prevenção de Pokémon duplicados no mesmo time.
- Validação de existência de treinadores e times.

### Estrutura de Dados
- Entidades separadas para melhor organização.
- DTOs de entrada e saída para isolamento da API.
- Relacionamentos bem definidos entre entidades.