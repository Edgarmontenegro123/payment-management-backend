import express from 'express'
import {verifyAuthToken} from '../middlewares/authMiddleware'
import {getPayments, createPayment} from '../controllers/paymentController'

const router = express.Router();

// Ruta para obtener un pago por Id de usuario
router.get('/', verifyAuthToken, getPayments)

// Ruta para crear un nuevo pago
router.post('/', verifyAuthToken, createPayment);

export default router;
