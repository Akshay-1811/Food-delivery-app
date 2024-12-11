import db from "../config/db.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = 'http://localhost:5173';

const placeOrder = async (req, res) => {
    try {
        const orderSql = `INSERT INTO orders (userId, items, amount, address) VALUES (?, ?, ?, ?)`;
        const orderValues = [
            req.body.userId,
            JSON.stringify(req.body.items),
            req.body.amount,
            req.body.address,
        ];
        
        const [newOrderResult] = await db.query(orderSql, orderValues);
        const newOrderId = newOrderResult.insertId;

        await db.query(`UPDATE users SET cartData = '{}' WHERE id = ?`, [req.body.userId]);

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge",
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrderId}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrderId}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error placing order" });
    }
};

const placeOrderCod = async (req, res) => {
    try {
        const orderSql = `INSERT INTO orders (userId, items, amount, address, payment) VALUES (?, ?, ?, ?, ?)`;
        const orderValues = [
            req.body.userId,
            JSON.stringify(req.body.items),
            req.body.amount,
            req.body.address,
            true,
        ];

        await db.query(orderSql, orderValues);
        await db.query(`UPDATE users SET cartData = '{}' WHERE id = ?`, [req.body.userId]);

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error placing order" });
    }
};

const listOrders = async (req, res) => {
    try {
        const sql = "SELECT * FROM orders";
        const [orders] = await db.query(sql);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

const userOrders = async (req, res) => {
    try {
        const sql = `SELECT * FROM orders WHERE userId = ?`;
        const [orders] = await db.query(sql, [req.body.userId]);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching user orders" });
    }
};

const updateStatus = async (req, res) => {
    try {
        await db.query(`UPDATE orders SET status = ? WHERE id = ?`, [req.body.status, req.body.orderId]);
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error updating status" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await db.query(`UPDATE orders SET payment = ? WHERE id = ?`, [true, orderId]);
            res.json({ success: true, message: "Paid" });
        } else {
            await db.query(`DELETE FROM orders WHERE id = ?`, [orderId]);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Not Verified" });
    }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod };
