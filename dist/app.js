"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const paymentsRoutes_1 = __importDefault(require("./routes/paymentsRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// Cargamos variables de entorno desde el archivo .env
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const port = 3000;
// Middleware para procesar solicitudes JSON
app.use(express_1.default.json());
// Configuramos la conexión a PostgreSQL
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432')
});
exports.pool = pool;
// Verificamos la conexión a PostgreSQL
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error connecting to the database: ', err);
    }
    console.log('Connection to PostgreSQL database successful');
    release();
});
// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('Welcome to the payment management system!');
});
// Importamos las rutas
app.use('/users', usersRoutes_1.default);
app.use('/payments', paymentsRoutes_1.default);
app.use('/login', authRoutes_1.default);
app.listen(port, () => {
    console.log(`server is listening on ${port}`);
});
//# sourceMappingURL=app.js.map