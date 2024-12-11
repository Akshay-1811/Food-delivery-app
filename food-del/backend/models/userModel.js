import db from "../config/db.js"; 
const createUserTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique ID for each user
            name VARCHAR(255) NOT NULL,         -- Name of the user, required field
            email VARCHAR(255) NOT NULL UNIQUE, -- Email of the user, must be unique and required
            password VARCHAR(255) NOT NULL,     -- User's password, required field
            cartData JSON DEFAULT '{}'          -- Cart data, stored as a JSON object with a default value of an empty object
        );
    `;

    db.query(sql, (err) => {
        if (err) {
            console.error("Error creating users table: ", err);
        } else {
            console.log("Users table created or already exists.");
        }
    });
};
createUserTable();

export default null;

