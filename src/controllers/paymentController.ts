import { Request, Response } from 'express';
import { pool } from '../app';

const getPayments = async (req: Request, res: Response) => {
    try {
        // Obtener el ID del usuario autenticado desde el objeto de solicitud
        const userId = req.userId;
        // Construir la consulta SQL base
        let query = `
            SELECT * FROM payments 
            WHERE (sender_id = $1 OR recipient_id = $1)
        `;
        const queryParams: any[] = [userId];
        // Verificamos si hay parámetros de consulta para agregarlos (filtrado)
        const {amount, date, payment_type} = req.query

        if(amount && !isNaN(parseFloat(amount as string))) {
            query += ` AND amount = $${queryParams.length + 1}`
            queryParams.push(parseFloat(amount as string))
        }
        if(date && isValidDate(date as string)) {
            query += ` AND date = $${queryParams.length + 1}`
            queryParams.push(date)
        }
        if(payment_type) {
            query += ` AND payment_type = $${queryParams.length + 1}`
            queryParams.push(payment_type)
        }

        // Ejecutar la consulta con el ID del usuario autenticado
        const result = await pool.query(query, queryParams);
        // Verificar si no se encontraron datos y devolver un mensaje en su lugar
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pagos para el usuario actual' });
        }
        // Devolver los pagos asociados al usuario autenticado
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los pagos: ', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
// Función auxiliar para verificar si una cadena es una fecha válida
const isValidDate = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}
// Función para crear un nuevo pago
const createPayment = async (req: Request, res: Response) => {
    const Payment = req.body
    // Validar que los campos necesarios estén presentes
    if (!Payment.amount || !Payment.date || !Payment.payment_type || !Payment.recipient_id || !Payment.sender_id) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    // Validamos la cantidad del pago
    if(Payment.amount <= 0) {
        return res.status(400).json({
            message: 'El monto del pago debe ser mayor a cero'
        })
    }
    // Validamos tipo de pago
    const allowedPaymentTypes = ['Débito', 'Crédito', 'Transferencia', 'Cheque']
    if(!allowedPaymentTypes.includes(Payment.payment_type)) {
        return res.status(400).json({
            message: 'Los tipos de pago aceptado son Débito, Crédito, Transferencia o Cheque'
        })
    }
    if(Payment.sender_id === Payment.recipient_id) {
        return res.status(400).json({
            message: 'No puedes realizar pagos a ti mismo!'
        })
    }
    try {
        // Verificamos si existen sender_id y recipient_id
        const senderExists = await pool.query('SELECT * FROM users WHERE id = $1',
            [Payment.sender_id])
        const recipientExists = await pool.query('SELECT * FROM users WHERE id = $1',
            [Payment.recipient_id])
        if(senderExists.rows.length === 0) {
            return res.status(404).json({
                message: 'El usuario remitente no existe'
            })
        }
        if(recipientExists.rows.length === 0) {
            return res.status(404).json({
                message: 'El usuario receptor no existe'
            })
        }

        const result = await pool.query(
            'INSERT INTO payments (amount, date, payment_type, recipient_id, sender_id) VALUES (' +
            '$1, $2, $3, $4, $5) RETURNING *',
            [Payment.amount, Payment.date, Payment.payment_type, Payment.recipient_id, Payment.sender_id]
        )
        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error al crear el pago: ', error)
        res.status(500).json({
            message: 'Error al crear el pago'
        })
    }
}

export { getPayments, createPayment};