class Users {
    create(sql, username, fullname, email, phone, address, password) {
        let resp = sql.query(
            `INSERT INTO users (username, fullname, email, phone, address, password, admin, enable) 
             VALUES (:username, :fullname, :email, :phone, :address, :password, :admin, :enable)`,
            { replacements: {
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

    userExist(req, res, next) {
        const { fullname, username, email } = req.body
        let exist = sequilize.query(
            `SELECT fullname, email FROM users WHERE fullname = ${fullname} AND email = ${username} AND email = ${email}`, {
            type: sql.QueryTypes.SELECT,
            raw: true
        })
        if (exist.length > 0) {
            return res
                .status(409)
                .json({ error: `Ya existe el usuario ${fullname} asociado a este nombre ${username} y email ${email}` });
        } else { next() };
    }
    list(sql) {
        let resp = sql.query(
            'SELECT * FROM users', {
            type: sql.QueryTypes.SELECT,
            raw: true
        })
        return resp
    }
    get(sql, id) {
        let resp = sql.query(
            `SELECT * FROM users WHERE id = ${id}`, {
            type: sql.QueryTypes.SELECT,
            raw: true
        })
        return resp
    }
}
module.exports = { Users }
