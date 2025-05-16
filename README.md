# Projeto LuizaLabs

API REST desenvolvida como parte de um teste técnico para a LuizaLabs. O objetivo principal é importar dados de pedidos a partir de um arquivo `.txt`, armazená-los no MongoDB e permitir consultas filtradas por `orderId` e intervalos de datas.

O projeto aplica boas práticas com TypeScript e adota uma arquitetura em camadas.

## 🚀 Tecnologias Utilizadas

* TypeScript
* Node.js
* Express
* MongoDB
* Docker & Docker Compose
* Jest

## 📁 Estrutura do Projeto

O sistema está dividido nas seguintes camadas:

* **Controllers**: tratam as requisições HTTP e repassam para os serviços;
* **Services**: contêm a lógica de negócio;
* **Repositories**: lidam com a comunicação com o banco MongoDB;
* **Resources**: estruturam a resposta da API;
* **Interfaces**: definem os tipos e contratos da aplicação.

## 📆 Instalação

### Requisitos

* Docker
* Docker Compose

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/ViniciusRCampos/ProjetoLuizaLabs.git
   cd ProjetoLuizaLabs
   ```

2. Copie o exemplo do arquivo `.env`:

   ```bash
   cp .env.example .env
   ```

3. Altere o valor da chave `MONGO_URI` para refletir seu ambiente local ou utilize o padrão Docker:

   ```env
   MONGO_URI=mongodb://mongo:27017/luizalabs
   PORT=8000
   ```
## 💻 Executando Localmente (sem Docker)
1. Instale as dependencias:

   ```bash
   npm install
   ```
2. Inicie o servidor: 
   ```bash
   npm run dev
   ```
## 🐳 Executando com Docker
1. Suba os containers:

   ```bash
   docker-compose up --build
   ```

2. Acesse a aplicação:
   [http://localhost:8000](http://localhost:8000)

## 📚 Documentação da API

### 📥 Importação de Pedidos

* **POST** `/api/orders/file`

  * Upload de arquivo `.txt` contendo pedidos no formato definido.
  * Formato: `multipart/form-data`
  * Campo: `file`

### 🔎 Consulta de Pedidos

* **GET** `/api/orders`

  * Consulta de pedidos com filtros opcionais:

    * `orderId` (string ou número)
    * `startDate` (formato YYYY-MM-DD)
    * `endDate` (formato YYYY-MM-DD)
  * Os filtros `startDate` e `endDate` funcionam individualmente ou em conjunto.

Exemplo:

```bash
GET /api/orders?orderId=123&startDate=2023-01-01&endDate=2023-12-31
```

## 🧪 Testes

Para rodar os testes automatizados::

```bash
npm run test
```

## 📬 Postman

### 🗂️ Arquivos disponíveis

* [`ProjetoLuizaLabs.postman_collection.json`](ProjetoLuizaLabs.postman_collection.json): Collection com as seguintes requisições:

  * `GET /healthcheck`
  * `POST /api/orders/file` (upload de arquivo .txt)
  * `GET /api/orders` com filtros por `orderId`, `startDate`, `endDate`

* [`LuizaLabs.postman_environment.json`](LuizaLabs.postman_environment.json): Ambiente com variável `{{base_url}} = http://localhost:8000`

### 📥 Como importar no Postman

1. Abra o Postman
2. Vá em **File > Import**
3. Importe os dois arquivos JSON:

   * Collection: `ProjetoLuizaLabs.postman_collection.json`
   * Environment: `LuizaLabs.postman_environment.json`
4. No topo direito, selecione o ambiente **LuizaLabs Local**
5. Execute as requisições normalmente (a URL `{{base_url}}` será usada automaticamente)

## 🤝 Contribuição

Contribuições são bem-vindas! Fique à vontade para abrir issues ou pull requests.

## 📝 Licença

Este projeto está sob a licença MIT.
