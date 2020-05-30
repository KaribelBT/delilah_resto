class Users {
    create(sql, username, fullname, email, phone, address, password) {
        let resp = sql.query(
            `INSERT INTO users (username, fullname, email, phone, address, password, admin, enable) 
             VALUES (:username, :fullname, :email, :phone, :address, :password, :admin, :enable)`,
            {
                replacements: {
                    username,
                    fullname,
                    email,
                    phone,
                    address,
                    password,
                    admin: false,
                    enable: true
                }
            });
        return resp
    };
    list(sql) {
        let resp = sql.query(
            'SELECT * FROM users', {
            type: sql.QueryTypes.SELECT,
        })
        return resp;
    };
    get(sql, id) {
        let resp = sql.query(
            `SELECT * FROM users 
            WHERE id = :id`, {
            replacements: {
                id
            },
            type: sql.QueryTypes.SELECT,
        });
        return resp;
    };
    setAdmin(sql, id, admin) {
        let resp = sql.query(
            `UPDATE users
            SET admin = :admin
            WHERE id = :id`, {
            replacements: {
                id,
                admin
            },
            type: sql.QueryTypes.UPDATE
        });
        return resp
    };
    update(sql, id, username, fullname, email, phone, address, password) {
        let resp = sql.query(
            `UPDATE users
            SET username = :username, fullname = :fullname, email = :email, phone = :phone, address = :address, password = :password
            WHERE id = :id`, {
            replacements: {
                id,
                username,
                fullname,
                email,
                phone,
                address,
                password
            },
            type: sql.QueryTypes.UPDATE
        });
        return resp
    };
    login(sql, username, password) {
        let resp = sql.query(
            `SELECT * FROM users 
            WHERE username = :username OR email = :username AND password = :password`, {
            replacements: {
                username,
                password
            },
            type: sql.QueryTypes.SELECT
        });
        return resp;
    };
    userExist(sql) {
        return function (req, res, next) {
            const { username, email } = req.body
            sql.query(
                `SELECT username, email FROM users 
                WHERE username = :username AND email = :email`, {
                replacements: {
                    username,
                    email
                },
                type: sql.QueryTypes.SELECT
            }).then(resp => {
                if (resp.length > 0) {
                    return res
                        .status(409)
                        .json({ error: `Conflict, username and email already exist` });
                } else { next() };
            });
        };
    };
    userNotFound(sql) {
        let self = this
        return function (req, res, next) {
            self.get(sql, req.params.id)
                .then(resp => {
                    if (resp.length === 0) return res.status(404).json({ error: 'Not Found' });
                    else { next() };
                })
        };
    };
    validToken(jwt) {
        return function (req, res, next) {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                res
                    .status(401)
                    .json({ error: 'Unauthorized, you are not logged in' });
                return;
            }
            const token = authorizationHeader.split(" ").pop();
            const secret = require('../config/config.js');
            const decoded = jwt.verify(token, secret.secret);
            if (decoded) {
                req.user = decoded;
                next();
            } else {
                res
                    .status(401)
                    .json({ error: 'Unauthorized, you are not logged in' });
            };
        };
    };
    isAdmin(jwt) {
        return function (req, res, next) {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                res
                    .status(401)
                    .json({ error: 'Unauthorized, you are not logged in' });
                return;
            }
            const token = authorizationHeader.split(" ").pop();
            const secret = require('../config/config.js');
            const decoded = jwt.verify(token, secret.secret);
            if (decoded.admin == true) {
                req.user = decoded;
                next();
            } else {
                res
                    .status(403)
                    .json({ error: 'Forbidden, you are not an admin user' });
            };
        }
    }
};
module.exports = { Users }