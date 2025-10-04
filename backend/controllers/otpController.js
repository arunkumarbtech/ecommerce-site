import pool from '../db.js';

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Request OTP
export const requestOTP = async (req, res) => {
    const { number } = req.body;
    try {
        const otp = generateOTP();
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

        const result = await pool.query(
            'UPDATE users SET otp=$1, otp_expiry=$2 WHERE number=$3 RETURNING *',
            [otp, expiry, number]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Mobile number not found' });
        }

      res.json({ message: 'OTP generated! Check console.', generatedOTP: otp });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};