import db from "../config/db.js";
import fs from 'fs';

const listFood = (req, res) => {
    const sql = "SELECT * FROM foods";
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ success: false, message: "Error fetching food items" });
        }
        res.json({ success: true, data: result });
    });
};

const addFood = (req, res) => {
    try {
        const image_filename = req.file.filename;
        const sql = `INSERT INTO foods (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)`;
        const values = [
            req.body.name,
            req.body.description,
            req.body.price,
            req.body.category,
            image_filename
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, message: "Error adding food item" });
            }
            res.json({ success: true, message: "Food Added", id: result.insertId });
        });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

const removeFood = (req, res) => {
    const id = req.body.id;

    const findSql = `SELECT image FROM foods WHERE id = ?`;
    db.query(findSql, [id], (err, result) => {
        if (err || result.length === 0) {
            console.error(err || "Food not found");
            return res.json({ success: false, message: "Error finding food" });
        }

        const food = result[0];
        fs.unlink(`uploads/${food.image}`, (fsErr) => {
            if (fsErr) console.error(fsErr);

            const deleteSql = `DELETE FROM foods WHERE id = ?`;
            db.query(deleteSql, [id], (delErr) => {
                if (delErr) {
                    console.error(delErr);
                    return res.json({ success: false, message: "Error deleting food" });
                }
                res.json({ success: true, message: "Food Removed" });
            });
        });
    });
};

export { listFood, addFood, removeFood };
