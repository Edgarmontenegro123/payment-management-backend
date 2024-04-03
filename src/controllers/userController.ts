import {Request, Response} from 'express'
import {pool} from '../app'

// Obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM users')

        if(result.rows.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron usuarios'
            })
        }
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
    if(isNaN(userId) || userId <= 0) {
        return res.status(400).json({
            message: 'Id de usuario no válido'
        })
    }
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

    // Validar si todos los campos están presentes
    if(!username || !email || !password || !bank_account_number) {
        return res.status(400).json({
            message: 'Todos los campos son obligatorios'
        })
    }
    // Validar formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(email)) {
        return res.status(400).json({
            message:'Formato de email inválido'
        })
    }
    // Validamos que bank_account_number sean 22 números
    const bankAccountRegex = /^\d{22}$/;
    if (!bankAccountRegex.test(bank_account_number)) {
        return res.status(400).json({
            message: 'El número de cuenta bancaria debe contener exactamente 22 números'
        });
    }

    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password, is_recipient, bank_account_number, is_active) ' +
            'VALUES ($1, $2, $3, COALESCE($4, false), $5, COALESCE($6, true)) RETURNING *',
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