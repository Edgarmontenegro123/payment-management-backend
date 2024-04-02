import express from 'express';
import { getAllUsers, createUser, getUserById } from '../controllers/userController';

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get('/', getAllUsers);

// Ruta para crear un nuevo usuario
router.post('/', createUser);

// Ruta para obtener un usuario por su ID
router.get('/', getUserById);

export default router;
