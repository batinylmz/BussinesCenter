module.exports = (req, res, next) => {
    if (!["admin", "manager"].includes(req.role)) {
        return res.status(403).json({ mesaj: "Bu işlem için yetkiniz yok. Admin veya Manager rolü gereklidir." });
    }
    next();
};
