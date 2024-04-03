import express from 'express';
import {getAllPayments, createPayment, getPaymentsByUserId} from '../controllers/paymentController';

const router = express.Router();

// Ruta para obtener todos los pagos
router.get('/', getAllPayments);

// Ruta para obtener un pago por Id de usuario
router.get('/:id', getPaymentsByUserId)

// Ruta para crear un nuevo pago
router.post('/', createPayment);

export default router;
