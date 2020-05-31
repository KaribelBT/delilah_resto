class Products {
    create(sql, name, price, img_url) {
        let resp = sql.query(
            `INSERT INTO products (name, price, img_url, enable) 
             VALUES (:name, :price, :img_url, :enable)`,
            {
                replacements: {
                    name,
                    price,
                    img_url,
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
    update(sql, id, name, price, img_url) {
        let resp = sql.query(
            `UPDATE products
            SET name = :name, price = :price, img_url = :img_url
            WHERE id = :id`, {
            replacements: {
                id,
                name,
                price,
                img_url
            },
            type: sql.QueryTypes.UPDATE
        });
        return resp
    };
    delete(sql, id) {
        let resp = sql.query(
            `UPDATE products
            SET enable = :enable
            WHERE id = :id`, {
            replacements: {
                id,
                enable: false
            },
            type: sql.QueryTypes.UPDATE
        });
        return resp
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