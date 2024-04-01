import express from 'express';
import {getAllRecipients, createRecipient} from '../controllers/recipientController';

const router = express.Router();

// Ruta para obtener todos los destinatarios
router.get('/recipients', getAllRecipients);

// Ruta para crear un nuevo destinatario
router.post('/recipients', createRecipient);

export default router;
