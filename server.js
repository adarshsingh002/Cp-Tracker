const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const codeforcesRoutes = require("./routes/codeforces");
app.use("/codeforces", codeforcesRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("CP Tracker API running");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});