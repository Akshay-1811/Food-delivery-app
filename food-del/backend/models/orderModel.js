import db from "../config/db.js"; 
const createOrderTable = () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId VARCHAR(255) NOT NULL,
            items JSON NOT NULL,  -- Storing items as a JSON string for array-like data
            amount FLOAT NOT NULL,
            address JSON NOT NULL,  -- Storing address as a JSON object
            status VARCHAR(100) DEFAULT 'Food Processing',
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            payment BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
    `;
   db.query(sql, (err) => {
        if (err) {
            console.error("Error creating orders table: ", err);
        } else {
            console.log("Orders table created or already exists.");
        }
    });
};
createOrderTable();
export default null;
