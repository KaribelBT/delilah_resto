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
            })
        return resp
    }
    list(sql) {
        let resp = sql.query(
            'SELECT * FROM users', {
            type: sql.QueryTypes.SELECT,
        })
        return resp
    }
    get(sql, id) {
        let resp = sql.query(
            `SELECT * FROM users 
            WHERE id = :id`, {
            replacements: {
                id
            },
            type: sql.QueryTypes.SELECT,
        })
        return resp
    }
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
                        .json({ error: `Ya existe un usuario asociado a ese email` });
                } else { next() };
            })
        }
    }
    login(sql, username, password){
        let resp = sql.query(
            `SELECT * FROM users 
            WHERE username = :username OR email = :username AND password = :password`, {
            replacements: {
                username,
                password
            },
            type: sql.QueryTypes.SELECT,
        })
        return resp   
    }
}
module.exports = { Users }