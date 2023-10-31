// Incluir as bibliotecas
// Gerencia as requisições, rotas e URLs, entre outra funcionalidades
const express = require("express");
// Importar a biblioteca para permitir conexão externa
const cors = require('cors');
// Chamar a função express
const app = express();
const port = process.env.PORT || 8080;

// Criar o middleware para receber os dados no corpo da requisição
app.use(express.json());

// Criar o middleware para permitir requisição externa
app.use((req, res, next) => {
    // Qualquer endereço pode fazer requisição
    res.header("Access-Control-Allow-Origin", "*");
    // Tipos de método que a API aceita
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    // Permitir o envio de dados para API
    res.header("Access-Control-Allow-Headers", "Content-Type");
    // Executar o cors
    app.use(cors());
    // Quando não houver erro deve continuar o processamento
    next();
});

// Testar conexão com banco de dados
// const db = require("./db/models");

// Incluir as CONTROLLERS
const products = require("./controllers/products");

// Criar as rotas
app.use('/', products);

// Iniciar o servidor na porta 8080, criar a função utilizando modelo Arrow function para retornar a mensagem de sucesso
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}: http://localhost:${port}`);
});