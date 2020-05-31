class Products {
    create(sql, name, price, img_url, stock) {
        let resp = sql.query(
            `INSERT INTO products (name, price, img_url, stock, enable) 
             VALUES (:name, :price, :img_url, :stock, :enable)`,
            {
                replacements: {
                    name,
                    price,
                    img_url,
                    stock,
                    enable: true
                }
            });
        return resp
    };
    list(sql) {
        let resp = sql.query(
            'SELECT * FROM products', {
            type: sql.QueryTypes.SELECT,
        })
        return resp;
    };
    get(sql, id) {
        let resp = sql.query(
            `SELECT * FROM products 
            WHERE id = :id`, {
            replacements: {
                id
            },
            type: sql.QueryTypes.SELECT,
        });
        return resp;
    };
    //middlewares
    productExist(sql) {
        return function (req, res, next) {
            const { name } = req.body
            sql.query(
                `SELECT name FROM products 
                WHERE name = :name`, {
                replacements: {
                    name,
                },
                type: sql.QueryTypes.SELECT
            }).then(resp => {
                if (resp.length > 0) {
                    return res
                        .status(409)
                        .json({ error: `Conflict, product already exists` });
                } else { next() };
            });
        };
    };
    productNotFound(sql) {
        let self = this
        return function (req, res, next) {
            self.get(sql, req.params.id)
                .then(resp => {
                    if (resp.length === 0) return res.status(404).json({ error: 'Not Found' });
                    else { next() };
                })
        };
    };
}

module.exports = { Products }