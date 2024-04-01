import express from 'express';
import { getAllUsers, createUser, getUserById } from '../controllers/userController';

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get('/users', getAllUsers);

// Ruta para crear un nuevo usuario
router.post('/users', createUser);

// Ruta para obtener un usuario por su ID
router.get('/users/:id', getUserById);

export default router;
