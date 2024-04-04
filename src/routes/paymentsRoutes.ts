import express from 'express';
import {getPayments, createPayment} from '../controllers/paymentController';

const router = express.Router();

// Ruta para obtener un pago por Id de usuario
router.get('/', getPayments)

// Ruta para crear un nuevo pago
router.post('/', createPayment);

export default router;
