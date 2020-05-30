const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secret = require('./config/config.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://root@127.0.0.1:3306/delilah_resto')
const users = require('./models/users.js');
let myUser = new users.Users();
const middlewares = require('./middlewares/middlewares.js');
let myMid = new middlewares.Middlewares();

app.use(bodyParser.json());

//crea usuario
app.post('/users', myMid.userExist(sequelize), async (req, res) => {
    const { username, fullname, email, phone, address, password } = req.body;
    let create = await myUser.create(sequelize, username, fullname, email, phone, address, password);
    if (create.length > 0) {
        let user = await myUser.get(sequelize, create[0]);
        res.status(200).json({
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            address: user.address
        });
    } else {
        res.status(400).json({ error: 'Bad Request, invalid or missing input' });
    }
});

//lista todos los usuarios
app.get('/users', myMid.validToken(jwt), async (req, res) => {
    let usersList = await myUser.list(sequelize);
    res.status(200).json(usersList);
});

//obtiene usuario por id
app.get('/users/:id', myMid.validToken(jwt), async (req, res) => {
    let user = await myUser.get(sequelize, req.params.id);
    res.status(200).json(user);
});

//loguea al usuario
app.post('/users/login', async (req, res) => {
    const { username, password } = req.body;
    let userLogged = await myUser.login(sequelize, username, password);
    if (userLogged.length > 0) {
        if (userLogged[0].enable == true) {
            const payload = {
                id: userLogged[0].id,
                username: userLogged[0].username,
                fullname: userLogged[0].fullname,
                email: userLogged[0].email,
                phone: userLogged[0].phone,
                address: userLogged[0].address
            }
            const token = jwt.sign(payload, secret.secret,{
                expiresIn: 1440
            });
            res.status(200).json({ token });
            return;
        } else {
            res.statrus(409).json({ error: `Conflict, user disabled` })
        }
    } else {
        res.status(400).json({ error: 'Bad Request, invalid or missing input' })
    }
});

//inicia servidor
app.listen(port, () => {
    console.log('Servidor Iniciado');
});