const express = require('express');
const dotenv = require('dotenv');
// Load env vars immediately
dotenv.config();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
// const userRoutes = require('./routes/userRoutes'); // If exists, else ignore?
const platformRoutes = require('./routes/platformRoutes');
const githubRoutes = require('./routes/githubRoutes');
const authRoutes = require('./routes/authRoutes');

// Connect to database
connectDB();

const app = express();
app.use((req, res, next) => {
    console.log(` Incoming Request: ${req.method} ${req.url}`);
    next(); // Pass it on
});
// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Frontend origin
    credentials: true // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());

// --- Debugging Body Parser ---
app.use((req, res, next) => {
    console.log("Body received:", req.body);
    next();
});
// Routes
app.use('/api', platformRoutes);
app.use('/api/devStats/github', githubRoutes);
app.use('/api/auth', authRoutes); // Auth Routes (Request OTP, Verify OTP, Signup)

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
