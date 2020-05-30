class Middlewares {
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
    isAdmin(jwt){
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
            if (decoded.admin) {
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

module.exports = { Middlewares }