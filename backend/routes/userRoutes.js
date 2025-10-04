import { Router } from 'express';
const router = Router();
import { getAllUsers, updateUser, sendOtp, verifyOtp, completeProfile, refreshAccessToken } from '../controllers/userController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';
import pool from '../db.js';

// GET all users
router.get('/',
    authenticateAdminToken,
    authorize(["view_admins"]),
    getAllUsers);
router.post('/request-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/complete-profile', completeProfile);
router.post('/refresh-token', refreshAccessToken);

// POST update user
router.put('/:id', authenticateToken, updateUser);

router.get('/me', authenticateToken, async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
