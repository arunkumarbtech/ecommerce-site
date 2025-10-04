import { Router } from 'express';
const router = Router();
import { deleteEmployee, updateEmployee } from '../controllers/employeeController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';


// router.delete("/delete/:id", authenticateAdminToken, deleteEmployee);
// router.put("/update/:id", authenticateAdminToken, updateEmployee)

router.delete(
    "/delete/:id",
    authenticateAdminToken,
    authorize(["manage_admins"]),
    deleteEmployee
);

// Update an employee (only admins with edit permission)
router.put(
    "/update/:id",
    authenticateAdminToken,
    authorize(["manage_admins"]),
    updateEmployee
);

export default router;