import pool from '../db.js';
import jwt from "jsonwebtoken";
const { sign, verify } = jwt;

// Generate tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, number: user.number },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "8h" }
    );

    const refreshToken = jwt.sign(
        { id: user.id, number: user.number },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
};

// Save refresh token in DB
const saveRefreshToken = async (userId, refreshToken) => {
    await pool.query(
        "UPDATE users SET refresh_token = $1, refresh_token_expiry = $2 WHERE id = $3",
        [refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), userId]
    );
};

// GET all users
const getAllUsers = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user info by ID
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, number, email } = req.body;

    if (!username || !number || !email) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const { rows: existingUsername } = await pool.query(
            "SELECT id FROM users WHERE username = $1 AND id != $2",
            [username, id]
        );
        if (existingUsername.length > 0) {
            return res.status(409).json({ error: "Username already exists." });
        }

        const { rows: existingEmail } = await pool.query(
            "SELECT id FROM users WHERE email = $1 AND id != $2",
            [email, id]
        );
        if (existingEmail.length > 0) {
            return res.status(409).json({ error: "Email already exists." });
        }

        const { rows } = await pool.query(
            `UPDATE users SET username = $1, number = $2, email = $3 WHERE id = $4 RETURNING *`,
            [username, number, email, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        res.json(rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

// STEP 1: Send OTP
const sendOtp = async (req, res) => {
    const { number } = req.body;

    if (!number) {
        return res.status(400).json({ error: "Mobile number is required." });
    }

    try {
        const { rows: existingUsers } = await pool.query(
            "SELECT * FROM users WHERE number = $1",
            [number]
        );

        // Generate OTP (4 digits) & expiry (5 mins)
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const expiry = new Date(Date.now() + 5 * 60 * 1000);

        if (existingUsers.length > 0) {
            // Existing user → just update OTP
            await pool.query(
                "UPDATE users SET otp = $1, otp_expiry = $2 WHERE id = $3",
                [otp, expiry, existingUsers[0].id]
            );
            return res.json({
                message: "OTP sent to existing user",
                isNewUser: false,
                otp
            });
        } else {
            // New user → create temp entry with only number & OTP
            const { rows: newUser } = await pool.query(
                "INSERT INTO users (number, otp, otp_expiry) VALUES ($1, $2, $3) RETURNING *",
                [number, otp, expiry]
            );
            return res.json({
                message: "OTP sent to new user",
                isNewUser: true,
                otp
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};


const verifyOtp = async (req, res) => {
    const { number, otp } = req.body;

    if (!number || !otp) {
        return res.status(400).json({ error: "Number and OTP are required." });
    }

    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE number = $1", [number]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const user = rows[0];
        const now = new Date();

        if (user.otp !== otp || !user.otp_expiry || new Date(user.otp_expiry) < now) {
            return res.status(401).json({ error: "Invalid or expired OTP." });
        }

        // Clear OTP once verified
        await pool.query("UPDATE users SET otp = NULL, otp_expiry = NULL WHERE id = $1", [user.id]);

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token in DB
        await saveRefreshToken(user.id, refreshToken);

        if (!user.username || !user.email || !user.dob) {
            return res.json({
                message: "OTP verified. Please complete profile.",
                needProfile: true,
                accessToken
            });
        }

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,          // false because frontend is localhost:5173 (http)
            sameSite: "none",       // must be None for cross-site
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });


        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     secure: false,      
        //     sameSite: "none", 
        //     path: "/",    
        //     maxAge: 7 * 24 * 60 * 60 * 1000,
        // });

        // Existing user → login success
        return res.json({
            message: "Login successful",
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                number: user.number,
                email: user.email,
                dob: user.dob
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};


const completeProfile = async (req, res) => {
    const { number, username, email, dob } = req.body;

    if (!number || !username || !email || !dob) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE number = $1", [number]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const user = rows[0];

        // Update profile
        const { rows: updated } = await pool.query(
            "UPDATE users SET username = $1, email = $2, dob = $3 WHERE id = $4 RETURNING *",
            [username, email, dob, user.id]
        );

        const updatedUser = updated[0];

        const formattedDob = new Date(updatedUser.dob);
        const day = String(formattedDob.getDate()).padStart(2, '0');
        const month = String(formattedDob.getMonth() + 1).padStart(2, '0');
        const year = formattedDob.getFullYear();
        const dobString = `${day}-${month}-${year}`;

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(updatedUser);

        // Save refresh token
        await saveRefreshToken(updatedUser.id, refreshToken);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            message: "Profile completed & login successful",
            accessToken,
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                dob: dobString,
                number: updatedUser.number
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error" });
    }
};

const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token required" });
    }

    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE refresh_token = $1", [refreshToken]);
        if (rows.length === 0) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: "Expired refresh token" });
            }

            const accessToken = jwt.sign(
                { id: decoded.id, number: decoded.number },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "8h" }
            );

            return res.json({ accessToken });
        });
    } catch (err) {
        console.error("Refresh error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};



export {
    getAllUsers,
    updateUser,
    completeProfile,
    verifyOtp,
    sendOtp,
    refreshAccessToken
};
