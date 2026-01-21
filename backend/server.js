const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const platformRoutes = require('./routes/platformRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
app.use((req, res, next) => {
    console.log(` Incoming Request: ${req.method} ${req.url}`);
    next(); // Pass it on
});
// Middleware
app.use(cors());
app.use(express.json());

// --- Debugging Body Parser ---
app.use((req, res, next) => {
    console.log("Body received:", req.body);
    next();
});
// Routes
app.use('/api', platformRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
