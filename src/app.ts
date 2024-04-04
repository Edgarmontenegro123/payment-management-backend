import express from 'express'
import {Pool} from 'pg'
import dotenv from 'dotenv'
import usersRoutes from './routes/usersRoutes'
import paymentsRoutes from './routes/paymentsRoutes'
import authRoutes from './routes/authRoutes'

// Cargamos variables de entorno desde el archivo .env
dotenv.config()

const app = express()
const port = 3000

// Middleware para procesar solicitudes JSON
app.use(express.json())

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
        return console.error('Error connecting to the database: ', err)
    }
    console.log('Connection to PostgreSQL database successful')
    release()
})

// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('Welcome to the payment management system!');
})

// Importamos las rutas
app.use('/users', usersRoutes)
app.use('/payments', paymentsRoutes)
app.use('/login', authRoutes)

app.listen(port, () => {
    console.log(`server is listening on ${port}`)
});

export { app, pool } // Exportamos app y pool