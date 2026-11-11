const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

function setTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
  });
}

exports.showRegister = (req, res) => {
  res.render("auth/register", { title: "Crear cuenta", errors: [], formData: {} });
};

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/register", {
        title: "Crear cuenta",
        errors: errors.array(),
        formData: req.body
      });
    }

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).render("auth/register", {
        title: "Crear cuenta",
        errors: [{ msg: "Ya existe una cuenta con ese correo." }],
        formData: req.body
      });
    }

    const user = await User.create({ name, email, password, role: "user" });
    setTokenCookie(res, signToken(user));
    res.redirect("/libros?success=Cuenta creada correctamente.");
  } catch (error) {
    next(error);
  }
};

exports.showLogin = (req, res) => {
  res.render("auth/login", { title: "Iniciar sesión", errors: [] });
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/login", { title: "Iniciar sesión", errors: errors.array() });
    }

    const user = await User.findOne({ email: req.body.email.toLowerCase().trim() }).select("+password");
    const valid = user && await user.comparePassword(req.body.password);

    if (!valid) {
      return res.status(401).render("auth/login", {
        title: "Iniciar sesión",
        errors: [{ msg: "Correo o contraseña incorrectos." }]
      });
    }

    setTokenCookie(res, signToken(user));
    res.redirect("/libros?success=Bienvenido%20a%20la%20biblioteca.");
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });
  res.redirect("/?success=Sesión%20cerrada.");
};
