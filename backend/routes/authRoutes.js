const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const signToken = (user) =>
    jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });

router.post("/register", async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hash, role });
        res.status(201).json({ token: signToken(user) });
    } catch (err) {
        res.status(400).json({ mesaj: "Kayıt başarısız", hata: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ mesaj: "Email veya şifre hatalı" });
        }
        res.json({ token: signToken(user) });
    } catch (err) {
        res.status(500).json({ mesaj: "Giriş başarısız", hata: err.message });
    }
});

router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ mesaj: "Kullanıcı getirilemedi", hata: err.message });
    }
});

module.exports = router;
