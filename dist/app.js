"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// Cargamos variables de entorno desde el archivo .env
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
// Configuramos la conexión a PostgreSQL
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432')
});
// Verificamos la conexión a PostgreSQL
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error al conectar con la base de datos: ', err);
    }
    console.log('Conexión exitosa a la base de datos PostgreSQL');
    release();
});
// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('The sedulous hyena ate the antelope!');
});
app.listen(port, () => {
    console.log(`server is listening on ${port}`);
});
//# sourceMappingURL=app.js.map