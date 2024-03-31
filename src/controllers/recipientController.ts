import {Request, Response} from 'express'
import {pool} from '../app'

// Obtener todos los destinatarios
export const getAllRecipients = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM recipients');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los destinatarios:', error);
        res.status(500).json({ message: 'Error al obtener los destinatarios' });
    }
};

// Crear un nuevo destinatario
export const createRecipient = async (req: Request, res: Response) => {
    const { recipient_name, bank_account_number, address } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO recipients (recipient_name, bank_account_number, address) ' +
            'VALUES ($1, $2, $3) RETURNING *',
            [recipient_name, bank_account_number, address]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear el destinatario:', error);
        res.status(500).json({ message: 'Error al crear el destinatario' });
    }
};