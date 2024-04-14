import {User} from '../models/User';
import {generateToken} from '../config/auth';
import {pool} from '../app';

// Función para autenticar a un usuario y generar un token JWT
export const authenticateUser = async (email: string, password: string): Promise<string | null> => {
    try {
        // Buscar al usuario en la base de datos utilizando el nombre de usuario
        const result = await pool.query('SELECT * FROM users WHERE email = $1',
            [email]);
        // Verificar si se encontró un usuario con el nombre de usuario proporcionado
        if (result.rows.length === 0) {
            return null; // No se encontró ningún usuario
        }
        const user: User = result.rows[0];
        // Verificar si la contraseña coincide
        if (user.password === password) {
            // Generar y devolver un token JWT si las credenciales son válidas
            return generateToken(user.id.toString());
        } else {
            // Devolver null si las credenciales son inválidas
            return null;
        }
    } catch (error) {
        console.error('Error al autenticar al usuario: ', error);
        throw new Error('Error al autenticar al usuario');
    }
};
