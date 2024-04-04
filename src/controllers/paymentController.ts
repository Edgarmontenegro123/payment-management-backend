import {Request, Response} from 'express'
import {pool} from '../app'

// Función para obtener todos los pagos o a partir de queries filtrar
const getPayments = async (req: Request, res: Response) => {
    try {
        let query = 'SELECT * FROM payments WHERE 1 = 1';
        const queryParams: any[] = [];
        const { userId, amount, date, payment_type } = req.query;

        if (userId) {
            const parsedUserId = parseInt(userId as string);
            if (isNaN(parsedUserId) || parsedUserId <= 0) {
                return res.status(400).json({ message: 'Id de usuario no válido' });
            }
            query += ' AND sender_id = $' + (queryParams.length + 1);
            queryParams.push(parsedUserId);
        }

        if (amount) {
            const parsedAmount = parseFloat(amount as string);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                return res.status(400).json({ message: 'Monto no válido' });
            }
            query += ` AND amount = $${queryParams.length + 1}`;
            queryParams.push(parsedAmount);
        }

        if (date) {
            query += ` AND date = $${queryParams.length + 1}`;
            queryParams.push(date);
        }

        if (payment_type) {
            query += ` AND payment_type = $${queryParams.length + 1}`;
            queryParams.push(payment_type);
        }

        const result = await pool.query(query, queryParams);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron pagos según el filtro' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los pagos: ', error);
        res.status(500).json({ message: 'Error interno del servidor' });
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
export { getPayments, createPayment };