const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();
// Middleware to parse JSON
app.use(express.json());

// Create a connection pool and export it for use in other modules
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection pool
pool.getConnection()
    .then(connection => {
        console.log("Connection to DB established");
        connection.release(); // Release connection back to the pool
    })
    .catch(err => {
        console.error("Error while connecting to DB", err);
    });

// Export the pool to be used in other files
module.exports.pool = pool;

// Define the POST route that uses the user controller to create a new user
app.use("/api/user", require("./routes/user"));
app.use("/api/authentication", require("./routes/authentification"));


app.get('/', (req, res) =>{
    res.send("hello")

});
const port = 3000;
app.listen(port , ()=>{
    console.log(`backend runing on port ${port}`);
});