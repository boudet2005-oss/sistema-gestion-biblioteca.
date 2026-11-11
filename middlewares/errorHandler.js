module.exports = (err, req, res, next) => {
  console.error(err);

  if (err.name === "CastError") {
    return res.status(404).render("error", {
      title: "Recurso no encontrado", status: 404, message: "El identificador proporcionado no es válido."
    });
  }

  if (err.code === 11000) {
    return res.status(409).render("error", {
      title: "Dato duplicado", status: 409, message: "Ya existe un registro con esos datos."
    });
  }

  res.status(500).render("error", {
    title: "Error del servidor",
    status: 500,
    message: process.env.NODE_ENV === "production"
      ? "Ha ocurrido un error inesperado. Inténtalo más tarde."
      : err.message
  });
};
