import { Request, Response } from 'express';
import {authenticateUser} from "../services/authenticationService";

// Controlador para manejar las solicitudes de inicio de sesión
export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body

    try {
        const token = await authenticateUser(email, password)
        if(token) {
            res.status(200).json({token})
        } else {
            res.status(401).json({
                message: 'Credenciales inválidas'
            })
        }
    } catch (error) {
        console.error('Error al procesar la solicitud de inicio de sesión: ', error)
        res.status(500).json({
            message: 'Error interno en el servidor'
        })
    }
};
