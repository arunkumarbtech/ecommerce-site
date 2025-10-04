import pool from '../db.js';

// Get addresses for a user
const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user.id; // from auth middleware
        const query = 'SELECT * FROM addresses WHERE user_id = $1';
        const { rows } = await pool.query(query, [userId]);

        res.json(rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// Update Address for the user
const updateUserAddress = async (req, res) => {
    const { addressId } = req.params;
    const { addressName, addressNumber, address } = req.body;

    if (!addressName?.trim() || !addressNumber?.toString().trim() || !address?.trim()) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const result = await pool.query(
            `UPDATE addresses
             SET name = $1, mobile_number = $2, address = $3
             WHERE address_id = $4`,
            [addressName, addressNumber, address, addressId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.status(200).json({ message: "Address updated successfully" });
    } catch (error) {
        console.error("Error updating address:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete address
const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;

        if (!addressId) {
            return res.status(400).json({ message: 'Address ID is required' });
        }

        const result = await pool.query(
            'DELETE FROM addresses WHERE address_id = $1 RETURNING *',
            [addressId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add new address
const addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressName, addressNumber, address } = req.body;

        if (!addressName?.trim() || !addressNumber?.toString().trim() || !address?.trim()) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const result = await pool.query(
            `INSERT INTO addresses (user_id, name, mobile_number, address)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, addressName, addressNumber, address]
        );

        res.status(201).json({ message: "Address added successfully", address: result.rows[0] });
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { getUserAddresses, updateUserAddress, deleteAddress, addAddress };
