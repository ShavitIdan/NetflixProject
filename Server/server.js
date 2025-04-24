const express = require("express");
require("./config/db");
const cors = require("cors");
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');
const videoRoutes = require('./routes/videoRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
    
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/tmdb', tmdbRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/reviews', reviewRoutes);

app.get("/", (req, res) => res.send("Hello World!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
