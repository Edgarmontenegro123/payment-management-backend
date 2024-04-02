import express from 'express';
import {getAllPayments, createPayment} from '../controllers/paymentController';

const router = express.Router();

// Ruta para obtener todos los pagos
router.get('/', getAllPayments);

// Ruta para crear un nuevo pago
router.post('/', createPayment);

export default router;
