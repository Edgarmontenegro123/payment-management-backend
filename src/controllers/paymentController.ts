import {Request, Response} from 'express'
import {pool} from '../app'

// Función para obtener todos los pagos
const getAllPayments = async (req: Request, res: Response) => {
    try{
        const result = await pool.query('SELECT * FROM payments')

        if(result.rows.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron pagos'
            })
        }
        res.status(200).json(result.rows)
    } catch (error) {
        console.error('Error al obtener los pagos: ', error)
        res.status(500).json({message: 'Error al obtener los pagos'})
    }
}

// Función para obtener pagos por ID de usuario
const getPaymentsByUserId = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)
    if(isNaN(userId) || userId <= 0) {
        return res.status(400).json({
            message: 'Id de usuario no válido'
        })
    }
    try {
        const result = await pool.query(
            'SELECT * FROM payments WHERE sender_id = $1',
            [userId]
        )
        if(result.rowCount === 0) {
            return res.status(404).json({
                message: 'No se encontraron pagos realizados por este usuario'
            })
        }
        return res.status(200).json(result.rows)
    } catch (error) {
        console.error('Error al obtener los pagos por Id de usuario: ', error)
        res.status(500).json({
            message: 'Error al obtener los pagos por Id de usuario'
        })
    }
}

// Función para crear un nuevo pago
const createPayment = async (req: Request, res: Response) => {
    const {amount, date, payment_type, recipient_id, sender_id} = req.body

    // Validar que los campos necesarios estén presentes
    if (!amount || !date || !payment_type || !recipient_id || !sender_id) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    // Validamos la cantidad del pago
    if(amount <= 0) {
        return res.status(400).json({
            message: 'El monto del pago debe ser mayor a cero'
        })
    }
    // Validamos tipo de pago
    const allowedPaymentTypes = ['Débito', 'Crédito', 'Transferencia', 'Cheque']
    if(!allowedPaymentTypes.includes(payment_type)) {
        return res.status(400).json({
            message: 'Los tipos de pago aceptado son Débito, Crédito, Transferencia o Cheque'
        })
    }

    if(sender_id === recipient_id) {
        return res.status(400).json({
            message: 'No puedes realizar pagos a ti mismo!'
        })
    }
    try {
        // Verificamos si existen sender_id y recipient_id
        const senderExists = await pool.query('SELECT * FROM users WHERE id = $1',
            [sender_id])
        const recipientExists = await pool.query('SELECT * FROM users WHERE id = $1',
            [recipient_id])
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
            [amount, date, payment_type, recipient_id, sender_id]
        )
        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error al crear el pago: ', error)
        res.status(500).json({
            message: 'Error al crear el pago'
        })
    }
}

// Exportamos las funciones del controlador
export { getAllPayments, getPaymentsByUserId, createPayment };