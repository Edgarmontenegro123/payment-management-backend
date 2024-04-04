import jwt from 'jsonwebtoken';
import jwtConfig from './jwtConfig';

// Función para generar un token JWT
export const generateToken = (userId: string): string => {
    const payload = { userId };
    const { secretKey, expiresIn } = jwtConfig; // Obtiene la clave secreta y el tiempo de expiración desde la configuración
    return jwt.sign(payload, secretKey, { expiresIn });
};
