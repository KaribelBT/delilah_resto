const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//inicia servidor
app.listen(port, () => {
    console.log('Servidor Iniciado');
});