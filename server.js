const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = '070320';

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ExamenFinal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch(err => {
  console.error('Error al conectar a MongoDB:', err);
});

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('usuarios', userSchema);

app.post('/api/registro', async (req, res) => {
  const { nombre, apellido, email, password, rol } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      nombre,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    const payload = {
      user: {
        id: newUser._id,
        nombre: newUser.nombre,
        email: newUser.email
      },
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000)
    };

    const token = jwt.encode(payload, JWT_SECRET);

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
      user: payload.user
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({
      message: 'Error al registrar el usuario',
      error: error.message
    });
  }
});


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Buscar al usuario por su email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
      }
  
      // Verificar la contraseña
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }
  
      // Crear el payload para el JWT
      const payload = {
        user: {
          id: user._id,
          nombre: user.nombre,
          email: user.email
        },
        iat: Date.now(),
        exp: Date.now() + (24 * 60 * 60 * 1000) // 1 día de expiración
      };
  
      const token = jwt.encode(payload, JWT_SECRET);
  
      res.status(200).json({
        message: 'Login exitoso',
        token,
        user: payload.user
      });
    } catch (error) {
      console.error('Error en el login:', error);
      res.status(500).json({
        message: 'Error al iniciar sesión',
        error: error.message
      });
    }
  });
  /*nuevo*/
  const reviewSchema = new mongoose.Schema({
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true }, // Relación con el usuario
    restaurante: { type: String, required: true },
    comentario: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
  });
  
  const Review = mongoose.model('resenas', reviewSchema);


  // Ruta para agregar una nueva reseña
  app.post('/api/resenas', async (req, res) => {
    const { restaurante, comentario } = req.body; 
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }
  
    try {
      const decoded = jwt.decode(token, JWT_SECRET);
  
      const nuevaResena = new Review({ 
        usuarioId: decoded.user.id, // Obtener el ID del usuario del token
        restaurante, 
        comentario, 
        fecha: Date.now() 
      });
  
      await nuevaResena.save();
  
      res.status(201).json({
        message: 'Reseña creada con éxito',
        reseña: nuevaResena
      });
    } catch (error) {
      console.error('Error al crear la reseña:', error);
      res.status(500).json({
        message: 'Error al crear la reseña',
        error: error.message
      });
    }
  });
  
  
  

  // Ruta para obtener todas las reseñas
  app.get('/api/resenas', async (req, res) => {
    try {
      // Buscar todas las reseñas en la base de datos
      const resenas = await Review.find(); // Usar 'Review' en lugar de 'Resena'
  
      if (resenas.length === 0) {
        return res.status(404).json({ message: 'No hay reseñas disponibles' });
      }
  
      res.status(200).json({ resenas });
    } catch (error) {
      console.error('Error al obtener las reseñas:', error);
      res.status(500).json({
        message: 'Error al obtener las reseñas',
        error: error.message
      });
    }
  });
  

  app.delete('/api/resenas/:id', async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }
  
    try {
      const decoded = jwt.decode(token, JWT_SECRET);
      const resena = await Review.findOneAndDelete({ _id: id, usuarioId: decoded.user.id });
  
      if (!resena) {
        return res.status(404).json({ message: 'Reseña no encontrada o no autorizada' });
      }
  
      res.status(200).json({ message: 'Reseña eliminada con éxito' });
    } catch (error) {
      console.error('Error al eliminar la reseña:', error);
      res.status(500).json({ message: 'Error al eliminar la reseña', error: error.message });
    }
  });
  

  /*finaliza nuevo*/
  

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });