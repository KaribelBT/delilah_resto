class Users {
    create(sql, username, fullname, email, phone, address, password) {
        let resp = sql.query(
            `INSERT INTO users (username, fullname, email, phone, address, password, admin, enable)
            VALUES  ("${username}", "${fullname}", "${email}", ${phone}, "${address}", "${password}", false, true)
            `, {
            raw: true
        })
        return resp
    }
    list(sql) {
        let resp = sql.query(
            'SELECT * FROM users', {
            type: sql.QueryTypes.SELECT,
            raw: true
        })
        return resp
    }
    get(sql,id) {
        let resp = sql.query(
            `SELECT * FROM users WHERE id = ${id}`, {
            type: sql.QueryTypes.SELECT,
            raw: true
        })
        return resp
    }
}
module.exports = { Users }
