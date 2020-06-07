class Orders {
    create(sql,body,priceTotal,quantity,id_user){
        let resp = sql.query(
            `INSERT INTO orders (id_status,  quantity, id_fop, price, id_user) 
             VALUES (:id_status,  :quantity, :id_fop, :price, :id_user)`,
            {
                replacements: {
                    id_status:1,
                    quantity,
                    id_fop:body.id_fop,
                    price:priceTotal,
                    id_user
                }
            });
        return resp

    }
    insertProductOrder(sql,id_order,id_product){
        let resp = sql.query(
            `INSERT INTO orders_products(id_order, id_product) 
             VALUES (:id_order,  :id_product)`,
            {
                replacements: {
                    id_order,
                    id_product
                }
            });
        return resp 
    }
    list(sql, user) {
        if (user.admin == 1) {
            let resp = sql.query(
                `SELECT DISTINCT o.id, o.create_time, o.price order_price, o.quantity, s.name status_name,
                    p.name product_name, p.price product_price, p.img_url, f.name payment, 
                    u.address, u.fullname, u.username, u.email, u.phone 
                FROM orders o 
                JOIN orders_products op ON op.id_order = o.id 
                JOIN status s ON s.id = o.id_status 
                JOIN products p ON p.id = op.id_product 
                JOIN fop f ON f.id = o.id_fop 
                JOIN users u ON u.id = o.id_user`,
                { type: sql.QueryTypes.SELECT }
            )
            return resp;
        } else {
            let id = user.id
            let resp = sql.query(
                `SELECT DISTINCT o.id, o.create_time, o.price order_price, o.quantity, s.name status_name,
                    p.name product_name, p.price product_price, p.img_url, f.name payment, 
                    u.address, u.fullname, u.username, u.email, u.phone 
                FROM orders o 
                JOIN orders_products op ON op.id_order = o.id 
                JOIN status s ON s.id = o.id_status 
                JOIN products p ON p.id = op.id_product 
                JOIN fop f ON f.id = o.id_fop 
                JOIN users u ON u.id = o.id_user
                WHERE o.id_user = :id`, {
                    replacements: {
                        id
                    },
                    type: sql.QueryTypes.SELECT
                })
            return resp;
        }

    };
    get(sql, user, id){
        if (user.admin == 1) {
            let resp = sql.query(
                `SELECT DISTINCT o.id, o.create_time, o.price order_price, o.quantity, s.name status_name,
                    p.name product_name, p.price product_price, p.img_url, f.name payment, 
                    u.address, u.fullname, u.username, u.email, u.phone 
                FROM orders o 
                JOIN orders_products op ON op.id_order = o.id 
                JOIN status s ON s.id = o.id_status 
                JOIN products p ON p.id = op.id_product 
                JOIN fop f ON f.id = o.id_fop 
                JOIN users u ON u.id = o.id_user
                WHERE o.id = :id`,{
                    replacements: {
                        id
                    },
                    type: sql.QueryTypes.SELECT
                }
            )
            return resp;
        } else {
            let userId = user.id
            let resp = sql.query(
                `SELECT DISTINCT o.id, o.create_time, o.price order_price, o.quantity, s.name status_name,
                    p.name product_name, p.price product_price, p.img_url, f.name payment, 
                    u.address, u.fullname, u.username, u.email, u.phone 
                FROM orders o 
                JOIN orders_products op ON op.id_order = o.id 
                JOIN status s ON s.id = o.id_status 
                JOIN products p ON p.id = op.id_product 
                JOIN fop f ON f.id = o.id_fop 
                JOIN users u ON u.id = o.id_user
                WHERE o.id_user = :userId
                AND o.id = :id`, {
                    replacements: {
                        userId,
                        id
                    },
                    type: sql.QueryTypes.SELECT
                })
            return resp;
        }
    }
    setStatus(sql, id, id_status) {
        let resp = sql.query(
            `UPDATE orders
            SET id_status = :id_status
            WHERE id = :id`, {
            replacements: {
                id,
                id_status
            },
            type: sql.QueryTypes.UPDATE
        });
        return resp
    };
    delete(sql, id) {
        let resp = sql.query(
            `UPDATE orders
            SET id_status = :id_status
            WHERE id = :id`, {
            replacements: {
                id,
                id_status:6
            },
            type: sql.QueryTypes.UPDATE
        });
        return resp
    };
    //middleware
    orderNotFound(sql) {
        let self = this
        return function (req, res, next) {
            self.get(sql, req.user, req.params.id)
                .then(resp => {
                    if (resp.length === 0) return res.status(404).json({ error: 'Not Found' });
                    else { next() };
                })
        };
    };
}
module.exports = { Orders }