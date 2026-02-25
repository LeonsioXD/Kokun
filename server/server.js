const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/kokunshop')
    .then(() => console.log('¡Conectado a MongoDB excitósamente!'))
    .catch((err) => console.log('Error al conectar:', err));

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    historialCompras: { type: Array, default: [] }
}, { collection: 'usuarios' });

const Usuario = mongoose.model('Usuario', usuarioSchema);

const productoSchema = new mongoose.Schema({
    id: String,
    titulo: String,
    imagen: String,
    categoria: {
        nombre: String,
        id: String
    },
    precio: Number
}, { collection: 'productos' });

const Producto = mongoose.model('Producto', productoSchema);

app.get('/', (req, res) => {
    res.send('El servidor de Kokun Shop está funcionando.');
});

app.get('/api/productos', async (req, res) => {
    try {
        const productosDesdeDB = await Producto.find();
        res.json(productosDesdeDB);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al buscar los productos' });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }

        const nuevoUsuario = new Usuario({ nombre, email, password });
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: { _id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email } });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar al usuario' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario || usuario.password !== password) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        res.json({ mensaje: 'Inicio de sesión exitoso', usuario: { _id: usuario._id, nombre: usuario.nombre, email: usuario.email, historialCompras: usuario.historialCompras } });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

app.post('/api/comprar', async (req, res) => {
    try {
        const { usuarioId, productos, total } = req.body;

        const nuevaCompra = {
            idCompra: new Date().getTime().toString(),
            fecha: new Date().toLocaleString(),
            productos,
            total
        };

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            usuarioId,
            { $push: { historialCompras: nuevaCompra } },
            { new: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ mensaje: 'Compra realizada con éxito', historial: usuarioActualizado.historialCompras });
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar la compra' });
    }
});
const Puerto = 3000;
app.listen(Puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${Puerto}`);
});
