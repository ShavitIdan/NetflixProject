const express = require("express");
require("./config/db");
const cors = require("cors");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
    
app.use(cors());

app.get("/", (req, res) => res.send("Hello World!"));
/*this is eden comment*/

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
