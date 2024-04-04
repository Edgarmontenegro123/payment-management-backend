import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import jwtConfig from '../config/jwtConfig'

const secretKey = jwtConfig.secretKey

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    // Obtener el token JWT de la cabecera Authorization
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó un token de autenticación' });
    }

    try {
        // Verificar y decodificar el token JWT
        const decodedToken = jwt.verify(token, secretKey) as { userId: string };

        // Agregar el ID de usuario decodificado al objeto de solicitud
        req.userId = decodedToken.userId;

        // Llamar a next() para pasar al siguiente middleware
        next();
    } catch (error) {
        console.error('Error al verificar el token JWT:', error);
        return res.status(401).json({ message: 'Token de autenticación inválido' });
    }
};
