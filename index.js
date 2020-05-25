const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secret = 'c0ntr4señAsupersecreta*';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://')

app.use(bodyParser.json());

//inicia servidor
app.listen(port, () => {
    console.log('Servidor Iniciado');
});