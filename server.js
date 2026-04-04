const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const codeforcesRoutes = require("./routes/codeforces");
app.use("/codeforces", codeforcesRoutes);

app.get("/", (req, res) => {
    res.send("CP Tracker API running");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.listen(5001, () => {
    console.log("Server running on port 5001");
});