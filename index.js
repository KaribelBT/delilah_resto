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
const products = require('./models/products.js');
let myProduct = new products.Products();
app.use(bodyParser.json());

//inicia servidor
app.listen(port, () => {
    console.log('Servidor Iniciado');
});
/***USERS***/
//crea usuario
app.post('/users', myUser.userExist(sequelize), async (req, res) => {
    const { username, fullname, email, phone, address, password } = req.body;
    let create = await myUser.create(sequelize, username, fullname, email, phone, address, password);
    if (create.length > 0) {
        let user = await myUser.get(sequelize, create[0]);
        res.status(201).json({
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
app.get('/users', myUser.isAdmin(jwt), async (req, res) => {
    let usersList = await myUser.list(sequelize);
    res.status(200).json(usersList);
});
//obtiene usuario por id
app.get('/users/:id', myUser.validToken(jwt), myUser.userNotFound(sequelize), async (req, res) => {
    if (req.user.id == req.params.id || req.user.admin == true) {
        let user = await myUser.get(sequelize, req.params.id);
        user = user[0];
        res.status(200).json({
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            address: user.address,
            admin: user.admin,
            enable: user.enable
        });
    } else {
        res.status(401).json({ error: 'Unauthorized, you are not allowed here' })
    };
});
//cambiar propiedad Admin por id de usuario
app.patch('/users/:id', myUser.isAdmin(jwt), myUser.userNotFound(sequelize), async (req, res) => {
    await myUser.setAdmin(sequelize, req.params.id, req.body.admin);
    let userUpdated = await myUser.get(sequelize, req.params.id);
    res.status(200).json({ userUpdated });
});
//cambia datos de usuario por id
app.put('/users/:id', myUser.validToken(jwt), myUser.userNotFound(sequelize), async (req, res) => {
    const { username, fullname, email, phone, address, password } = req.body;
    if (req.user.id == req.params.id || req.user.admin == true) {
        try {
            await myUser.update(sequelize, req.params.id, username, fullname, email, phone, address, password);
            let userUpdated = await myUser.get(sequelize, req.params.id);
            userUpdated = userUpdated[0];
            res.status(200).json({
                id: userUpdated.id,
                username: userUpdated.username,
                fullname: userUpdated.fullname,
                email: userUpdated.email,
                phone: userUpdated.phone,
                address: userUpdated.address,
                admin: userUpdated.admin,
                enable: userUpdated.enable
            });
        } catch {
            res.status(400).json({ error: 'Bad Request, invalid or missing input' })
        };
    } else {
        res.status(401).json({ error: 'Unauthorized, you are not allowed here' })
    };
});
//borrado logico de usuario por id
app.delete('/users/:id', myUser.validToken(jwt), myUser.userNotFound(sequelize), async (req, res) => {
    if (req.user.id == req.params.id || req.user.admin == true) {
        await myUser.delete(sequelize, req.params.id);
        res.status(200).json({ message: 'Success, user disabled' });
    } else {
        res.status(401).json({ error: 'Unauthorized, you are not allowed here' })
    };
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
                address: userLogged[0].address,
                admin: userLogged[0].admin,
                enable: userLogged[0].enable
            }
            const token = jwt.sign(payload, secret.secret, {
                expiresIn: 1440
            });
            res.status(200).json({ token });
            return;
        } else {
            res.status(409).json({ error: `Conflict, user disabled` })
        }
    } else {
        res.status(400).json({ error: 'Bad Request, invalid or missing input' })
    };
});
/***PRODUCTS***/
//crea producto
app.post('/products', myUser.isAdmin(jwt), myProduct.productExist(sequelize), async (req, res) => {
    const { name, price, img_url, stock } = req.body;
    let create = await myProduct.create(sequelize, name, price, img_url, stock);
    if (create.length > 0) {
        let user = await myProduct.get(sequelize, create[0]);
        res.status(201).json({ user });
    } else {
        res.status(400).json({ error: 'Bad Request, invalid or missing input' });
    }
});
//lista todos los productos
app.get('/products', myUser.validToken(jwt), async (req, res) => {
    let productsList = await myProduct.list(sequelize);
    if (req.user.admin == true) {
        res.status(200).json(productsList);
    } else {
        let productsFiltered = productsList.map(resp => {
            return {
                id: resp.id,
                name: resp.name,
                price: resp.price,
                img_url: resp.img_url
            }
        })
        res.status(200).json(productsFiltered);
    }
});
//obtiene product por id
app.get('/products/:id', myUser.validToken(jwt), myProduct.productNotFound(sequelize), async (req, res) => {
    let product = await myProduct.get(sequelize, req.params.id);
    if (product.length > 0) {
        product = product[0];
        if (req.user.admin == true) {
            res.status(200).json({ product });
        } else {
            res.status(200).json({
                id: product.id,
                name: product.name,
                price: product.price,
                img_url: product.img_url
            });
        }
    }
});