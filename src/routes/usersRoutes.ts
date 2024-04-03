import express from 'express';
import {getAllUsers, createUser, getUserById, updateUserStatus} from '../controllers/userController';

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get('/', getAllUsers);
// Ruta para obtener un usuario por su ID
router.get('/:id', getUserById);
// Ruta para crear un nuevo usuario
router.post('/', createUser);
// Ruta para actualizar el estado de activación de un usuario
router.put(':id/status', updateUserStatus)


export default router;
