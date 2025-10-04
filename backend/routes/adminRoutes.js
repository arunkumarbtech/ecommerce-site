import express from "express";
import jwt from "jsonwebtoken";
import pool from "../db.js"; // your db connection
import { adminLogin, getEmployees, getAdminMe, createEmployee } from "../controllers/authadminController.js";
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

router.post('/login', adminLogin)
router.get('/all', authenticateAdminToken, authorize(['view_admins']), getEmployees);
router.get('/me', authenticateAdminToken, getAdminMe);
router.post('/create/employee', authenticateAdminToken, authorize(['manage_admins']), createEmployee);


export default router;