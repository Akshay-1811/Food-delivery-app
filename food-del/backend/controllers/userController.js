import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import db from "../config/db.js";

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = users[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user.id);
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUsers.length > 0) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
        }

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        const [result] = await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

        const token = createToken(result.insertId);
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

export { loginUser, registerUser };
