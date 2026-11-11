const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/authController");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/registro", controller.showRegister);
router.post("/registro", [
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio.").isLength({ max: 80 }),
  body("email").trim().isEmail().withMessage("Introduce un correo válido."),
  body("password").isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres.")
], controller.register);

router.get("/login", controller.showLogin);
router.post("/login", [
  body("email").trim().isEmail().withMessage("Introduce un correo válido."),
  body("password").notEmpty().withMessage("La contraseña es obligatoria.")
], controller.login);

router.post("/logout", requireAuth, controller.logout);

module.exports = router;
