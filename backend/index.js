const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const codeRoutes = require("./routes/codeRoutes");
require("dotenv").config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/code", codeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
