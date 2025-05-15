const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // if you’re using cookies/auth headers
}));
app.use(express.json());

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/blogs', require('./routes/blogRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
