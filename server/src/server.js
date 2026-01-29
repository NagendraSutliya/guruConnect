require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./routes");

const app = express();

/* DB */
connectDB();

/* Middlewares */
app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api", routes);

/* Health check */
app.get("/", (req, res) => {
  res.json({ status: "GuruConnect API running" });
});

/* Global error fallback */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
