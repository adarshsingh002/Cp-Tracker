const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/:handle", async (req, res) => {
    try {
        const handle = req.params.handle;

        const response = await fetch(
            `https://codeforces.com/api/user.status?handle=${handle}`
        );

        const data = await response.json();

        if (data.status !== "OK") {
            return res.status(404).json({ error: "User not found" });
        }

        const submissions = data.result;

        const solved = submissions.filter(sub => sub.verdict === "OK");

        const uniqueProblems = new Map();
        solved.forEach(sub => {
            uniqueProblems.set(sub.problem.name, sub.problem);
        });

        const problems = Array.from(uniqueProblems.values());

        //total solved
        const totalSolved = problems.length;

        let difficulty = {};
        problems.forEach(p => {
            if (p.rating) {
                difficulty[p.rating] = (difficulty[p.rating] || 0) + 1;
            }
        });

        let tags = {};
        problems.forEach(p => {
            p.tags.forEach(tag => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        });

        //save to db
        await User.findOneAndUpdate(
            { handle },
            { handle, totalSolved, difficulty, tags },
            { upsert: true }
        );

        //send response
        res.json({
            handle,
            totalSolved,
            difficulty,
            tags
        });

    } catch (err) {
        res.status(500).json({ error: "Error processing data" });
    }
});

module.exports = router;