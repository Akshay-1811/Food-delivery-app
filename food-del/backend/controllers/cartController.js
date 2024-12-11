import db from "../config/db.js";

const addToCart = (req, res) => {
    const { itemId } = req.body;
    const userId = req.body.userId;

    const getCartSql = "SELECT cartData FROM users WHERE id = ?";
    db.query(getCartSql, [userId], (err, result) => {
        if (err || result.length === 0) {
            console.error(err || "User not found");
            return res.json({ success: false, message: "Error fetching user cart" });
        }

        let cartData = JSON.parse(result[0].cartData || '{}');

        cartData[itemId] = (cartData[itemId] || 0) + 1;

        const updateCartSql = "UPDATE users SET cartData = ? WHERE id = ?";
        db.query(updateCartSql, [JSON.stringify(cartData), userId], (updateErr) => {
            if (updateErr) {
                console.error(updateErr);
                return res.json({ success: false, message: "Error updating cart" });
            }
            res.json({ success: true, message: "Added to Cart" });
        });
    });
};

const removeFromCart = (req, res) => {
    const { itemId } = req.body;
    const userId = req.body.userId;

    const getCartSql = "SELECT cartData FROM users WHERE id = ?";
    db.query(getCartSql, [userId], (err, result) => {
        if (err || result.length === 0) {
            console.error(err || "User not found");
            return res.json({ success: false, message: "Error fetching user cart" });
        }

        let cartData = JSON.parse(result[0].cartData || '{}');

        if (cartData[itemId]) {
            cartData[itemId] = cartData[itemId] - 1;
            if (cartData[itemId] <= 0) delete cartData[itemId];

            const updateCartSql = "UPDATE users SET cartData = ? WHERE id = ?";
            db.query(updateCartSql, [JSON.stringify(cartData), userId], (updateErr) => {
                if (updateErr) {
                    console.error(updateErr);
                    return res.json({ success: false, message: "Error updating cart" });
                }
                res.json({ success: true, message: "Removed from Cart" });
            });
        } else {
            res.json({ success: false, message: "Item not in cart" });
        }
    });
};

const getCart = (req, res) => {
    const userId = req.body.userId;

    const getCartSql = "SELECT cartData FROM users WHERE id = ?";
    db.query(getCartSql, [userId], (err, result) => {
        if (err || result.length === 0) {
            console.error(err || "User not found");
            return res.json({ success: false, message: "Error fetching cart data" });
        }

        const cartData = JSON.parse(result[0].cartData || '{}');
        res.json({ success: true, cartData });
    });
};

export { addToCart, removeFromCart, getCart };
