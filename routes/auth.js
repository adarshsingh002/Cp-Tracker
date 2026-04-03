const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword
        });
        await user.save();
        res.json({ message: "User created" });

    } catch (err) {
        res.status(500).json({ error: "Signup failed" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});
module.exports = router;