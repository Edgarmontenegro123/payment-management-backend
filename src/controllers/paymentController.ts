import {Request, Response} from 'express'
import {pool} from '../app'

// Función para obtener todos los pagos
const getAllPayments = async (req: Request, res: Response) => {
    try{
        const result = await pool.query('SELECT * FROM payments')
        res.json(result.rows)
    } catch (error) {
        console.error('Error al obtener los pagos: ', error)
        res.status(500).json({message: 'Error al obtener los pagos'})
    }
}

// Función para crear un nuevo pago
const createPayment = async (req: Request, res: Response) => {
    const {amount, date, payment_type, recipient_id, sender_id} = req.body
    if(sender_id === recipient_id) {
        return res.status(400).json({
            message: 'No puedes realizar pagos a ti mismo!'
        })
    }
    try {
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
export { getAllPayments, createPayment };