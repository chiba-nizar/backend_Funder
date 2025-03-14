const bcrypt = require('bcrypt');
const { pool } = require('../app');

module.exports = async function (req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();
        
        // Query to get the user by email
        const getUserQuery = 'SELECT * FROM user WHERE email = ?';
        const [rows] = await connection.execute(getUserQuery, [email]);

        // Release the connection back to the pool
        connection.release();
        // Check if user exists
        if (rows[0].length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = rows[0];
        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("password",password);
        console.log("user.password",user.password);
        console.log(isMatch);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Sign-in successful',
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Error during sign-in:", err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
