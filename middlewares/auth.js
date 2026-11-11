const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.attachUser = async (req, res, next) => {
  try {
    res.locals.currentUser = null;
    res.locals.isAdmin = false;

    const token = req.cookies.token;
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = user;
      res.locals.currentUser = user;
      res.locals.isAdmin = user.role === "admin";
    }
    next();
  } catch (error) {
    res.clearCookie("token");
    next();
  }
};

exports.requireAuth = (req, res, next) => {
  if (!req.user) return res.redirect("/auth/login?error=Debes%20iniciar%20sesión.");
  next();
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).render("error", {
      title: "Acceso denegado", status: 403, message: "No tienes permisos para realizar esta acción."
    });
  }
  next();
};
