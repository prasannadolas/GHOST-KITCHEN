const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('../routes/auth');
const kitchenRoutes = require('../routes/kitchens');
const orderRoutes = require('../routes/order');
const menuRoutes = require('../routes/menu');
const adminRoutes = require('../routes/admin');
const userRoutes = require('../routes/user');

const app = express();
app.set('trust proxy', 1);

// Render will automatically inject a port here. We default to 5000 for local testing.
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// 🌐 DEPLOYMENT UPDATE: Allow requests from anywhere (your future Vercel URL)
app.use(cors({
    origin: '*', 
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/kitchens', kitchenRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint (Great for testing if Render is awake!)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// Handle 404 for API routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ghost Kitchen API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Ghost Kitchen API Server running on port ${PORT}`);
    console.log(`Ready to receive requests from Vercel!`);
});