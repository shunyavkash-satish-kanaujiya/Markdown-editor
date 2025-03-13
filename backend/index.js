const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const codeRoutes = require("./routes/codeRoutes");
require("dotenv").config();

const app = express();
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: [
      "https://shunyavkash-satish-kanaujiya.github.io",
      "https://shunyavkash-satish-kanaujiya.github.io/Markdown-editor/",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use("/api/code", codeRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
