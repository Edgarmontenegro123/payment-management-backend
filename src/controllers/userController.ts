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

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response) => {
    const {username, email, password} = req.body
    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, password]
        )
        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error('Error al crear el usuario: ', error)
        res.status(500).json({
            message: 'Error al crear el usuario'
        })
    }
}