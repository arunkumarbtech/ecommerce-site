import { Router } from 'express';
const router = Router();
import { getUserAddresses, updateUserAddress, deleteAddress, addAddress } from '../controllers/addressController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';

router.get('/user', authenticateToken, getUserAddresses);

router.delete('/deleteaddress/:addressId', authenticateToken, deleteAddress);

router.put('/:addressId', authenticateToken, updateUserAddress);

router.post('/addAddress', authenticateToken, addAddress);

export default router;
