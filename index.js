const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secret = 'c0ntr4señAsupersecreta*';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root@127.0.0.1:3306/delilah_resto')
const users = require('./models/users.js');
let myUser = new users.Users();

app.use(bodyParser.json());

//crea usuario
app.post('/v1/users', async (req, res) => {
    const { username, fullname, email, phone, address, password } = req.body
    let create = await myUser.create(sequelize, username, fullname, email, phone, address, password) 
    if(create.length>0){
        let user = await myUser.get(sequelize,create[0])
        res.status(200).json(user)
    }
});

//lista todos los usuarios
app.get('/v1/users', async (req, res) => {
    let usersList = await myUser.list(sequelize)
    res.status(200).json(usersList)
});

//obtiene usuario por id
app.get('/v1/users/:id', async (req, res) => {
    let user = await myUser.get(sequelize,req.params.id)
    res.status(200).json(user)
});
//inicia servidor
app.listen(port, () => {
    console.log('Servidor Iniciado');
});