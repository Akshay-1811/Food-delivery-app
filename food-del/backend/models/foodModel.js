import db from "../config/db.js";
const createTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS foods (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            price FLOAT NOT NULL,
            category VARCHAR(100) NOT NULL,
            image VARCHAR(255) NOT NULL
        );
    `;
    db.query(sql, (err) => {
        if (err) {
            console.error("Error creating table: ", err);
        } else {
            console.log("Foods table created or already exists.");
        }
    });
};
createTable();
export default null; 
