const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/bookController");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();
const validateBook = [
  body("title").trim().notEmpty().withMessage("El título es obligatorio.").isLength({ max: 160 }),
  body("author").trim().notEmpty().withMessage("El autor es obligatorio.").isLength({ max: 120 }),
  body("category").trim().notEmpty().withMessage("La categoría es obligatoria.").isLength({ max: 80 }),
  body("year").optional({ checkFalsy: true }).isInt({ min: 0, max: new Date().getFullYear() + 1 })
    .withMessage("Introduce un año válido."),
  body("isbn").optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body("description").optional({ checkFalsy: true }).trim().isLength({ max: 2000 })
];

router.use(requireAuth);
router.get("/", controller.index);
router.get("/nuevo", controller.showCreate);
router.post("/", validateBook, controller.create);
router.get("/:id/editar", controller.showEdit);
router.get("/:id", controller.show);
router.put("/:id", validateBook, controller.update);
router.delete("/:id", controller.destroy);

module.exports = router;
