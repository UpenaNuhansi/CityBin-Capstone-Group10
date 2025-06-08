require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const settingsRouter = require('./routers/settingsRouter');
const binRoutes = require('./routers/binRoutes');
const reportRoutes = require('./routers/reportRoutes');
const notificationRoutes = require('./routers/notificationRoutes');
const auth = require('./middlewares/auth');


const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('DB connected!'))
  .catch(err => console.error('DB connection error:', err));

// Routes
try {
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/bins', binRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/notifications', notificationRoutes);
} catch (err) {
  console.error('Route mounting error:', err);
  process.exit(1);
}

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

//Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>{ console.log(`Server running on port ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});