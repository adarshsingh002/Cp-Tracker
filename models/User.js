const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, sparse: true },
    password: String,
    handle: {
        type: String,
        unique: true,
        sparse: true
    },
    totalSolved: {
        type: Number,
        default: 0
    },
    difficulty: {
        type: Object,
        default: {}
    },
    tags: {
        type: Object,
        default: {}
    }
});

module.exports = mongoose.model("User", userSchema);