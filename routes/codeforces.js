const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/:handle", async (req, res) => {
    try {
        const handle = req.params.handle;

        const response = await fetch(
            `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}`
        );

        if (!response.ok) {
            return res.status(502).json({ error: "Codeforces API unavailable" });
        }

        const data = await response.json();

        if (data.status !== "OK") {
            return res.status(404).json({ error: "User not found" });
        }

        const submissions = data.result;

        const solved = submissions.filter(sub => sub.verdict === "OK");

        const uniqueProblems = new Map();
        solved.forEach(sub => {
            const p = sub.problem;
            if (!p) return;
            const key = `${p.contestId}-${p.index}`;
            uniqueProblems.set(key, p);
        });

        const problems = Array.from(uniqueProblems.values());

        const totalSolved = problems.length;

        let difficulty = {};
        problems.forEach(p => {
            if (p.rating !== undefined) {
                difficulty[p.rating] = (difficulty[p.rating] || 0) + 1;
            }
        });

        let tags = {};
        problems.forEach(p => {
            if (p.tags && Array.isArray(p.tags)) {
                p.tags.forEach(tag => {
                    tags[tag] = (tags[tag] || 0) + 1;
                });
            }
        });

        await User.findOneAndUpdate(
            { handle },
            { handle, totalSolved, difficulty, tags },
            { upsert: true, new: true }
        );

        res.json({
            handle,
            totalSolved,
            difficulty,
            tags
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;