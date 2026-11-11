require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const { attachUser } = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");
const createAdminIfConfigured = require("./config/createAdmin");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://cdn.jsdelivr.net"],
      "style-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com", "data:"]
    }
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(require("method-override")("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.success = req.query.success || null;
  res.locals.error = req.query.error || null;
  next();
});
app.use(attachUser);

app.get("/", (req, res) => {
  res.render("home", { title: "Inicio" });
});

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use("/libros", bookRoutes);

app.use((req, res) => {
  res.status(404).render("error", {
    title: "Página no encontrada",
    status: 404,
    message: "La página que buscas no existe."
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
    await createAdminIfConfigured();
    app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`));
  } catch (error) {
    console.error("No se pudo iniciar la aplicación:", error.message);
    process.exit(1);
  }
}

if (require.main === module) start();

module.exports = app;
