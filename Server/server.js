const express = require("express");
require("./config/db");
const cors = require("cors");
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
    
app.use(cors());

app.use('/api/auth', authRoutes);

app.get("/", (req, res) => res.send("Hello World!"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
