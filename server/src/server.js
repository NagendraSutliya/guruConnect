require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/feedback", require("./routes/feedback.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/public", require("./routes/public.routes"));
app.use("/api/teacher", require("./routes/teacher.routes"));

app.listen(5000, () => console.log("GuruConnect API running on 5000"));
