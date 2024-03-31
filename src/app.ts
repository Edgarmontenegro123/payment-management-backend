import express from 'express';
import {Pool} from 'pg';
import dotenv from 'dotenv'

// Cargamos variables de entorno desde el archivo .env
dotenv.config()

const app = express();
const port = 3000;

// Configuramos la conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432')
})

// Verificamos la conexión a PostgreSQL
pool.connect((err: any, client: any, release: () => void) => {
    if(err) {
        return console.error('Error al conectar con la base de datos: ', err)
    }
    console.log('Conexión exitosa a la base de datos PostgreSQL')
    release()
})

// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('The sedulous hyena ate the antelope!');
});

app.listen(port, () => {
    console.log(`server is listening on ${port}`);
});

export { app, pool }; // Exportamos app y pool