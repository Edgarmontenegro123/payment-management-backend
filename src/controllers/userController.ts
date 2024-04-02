import {Request, Response} from 'express'
import {pool} from '../app'

// Obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM users')
        res.status(200).json(result.rows)
    } catch (error) {
        console.log('Error al obtener los usuarios: ', error)
        res.status(500).json({
            message: 'Error al obtener los usuarios'
        })
    }
}

// Función para obtener un usuario por su ID
export const getUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response) => {
    const {username, email, password, is_recipient, bank_account_number, is_active} = req.body
    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password, is_recipient, bank_account_number, is_active) ' +
            'VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [username, email, password, is_recipient, bank_account_number, is_active]
        )
        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error al crear el usuario: ', error)
        res.status(500).json({
            message: 'Error al crear el usuario'
        })
    }
}