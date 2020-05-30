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
app.post('/users', myUser.userExist(sequelize), async (req, res) => {
    const { username, fullname, email, phone, address, password } = req.body
    let create = await myUser.create(sequelize, username, fullname, email, phone, address, password) 
    if(create.length>0){
        let user = await myUser.get(sequelize,create[0])
        res.status(200).json(user)
    }else{
        res.status(400).json({error: 'Bad Request, invalid or missing input'})
    }
});

//lista todos los usuarios
app.get('/users', async (req, res) => {
    let usersList = await myUser.list(sequelize)
    res.status(200).json(usersList)
});

//obtiene usuario por id
app.get('/users/:id', async (req, res) => {
    let user = await myUser.get(sequelize,req.params.id)
    res.status(200).json(user)
});

//loguea al usuario
app.post('/users/login', async (req, res) => {
    const { username, password } = req.body
    let userLogged = await myUser.login(sequelize, username, password)
    if(userLogged.length>0){
        res.status(200).json(userLogged[0].username)
    }else{
        res.status(400).json({error: 'Bad Request, invalid or missing input'})
    }
});

//inicia servidor
app.listen(port, () => {
    console.log('Servidor Iniciado');
});