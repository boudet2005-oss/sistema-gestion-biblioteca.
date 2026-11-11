const { validationResult } = require("express-validator");
const Book = require("../models/Book");

function ownershipFilter(req) {
  return req.user.role === "admin" ? {} : { owner: req.user._id };
}

exports.index = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = 8;
    const search = (req.query.q || "").trim();
    const filter = ownershipFilter(req);

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.render("books/index", {
      title: "Catálogo de libros",
      books,
      search,
      page,
      pages: Math.max(Math.ceil(total / limit), 1),
      total
    });
  } catch (error) {
    next(error);
  }
};

exports.showCreate = (req, res) => {
  res.render("books/form", { title: "Agregar libro", book: {}, errors: [], formAction: "/libros" });
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("books/form", {
        title: "Agregar libro", book: req.body, errors: errors.array(), formAction: "/libros"
      });
    }

    await Book.create({
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      year: req.body.year || undefined,
      isbn: req.body.isbn,
      description: req.body.description,
      owner: req.user._id
    });
    res.redirect("/libros?success=Libro%20agregado%20correctamente.");
  } catch (error) {
    next(error);
  }
};

exports.show = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, ...ownershipFilter(req) })
      .populate("owner", "name email");
    if (!book) return res.status(404).render("error", {
      title: "Libro no encontrado", status: 404, message: "No existe el libro o no tienes permiso para verlo."
    });
    res.render("books/show", { title: book.title, book });
  } catch (error) {
    next(error);
  }
};

exports.showEdit = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, ...ownershipFilter(req) });
    if (!book) return res.status(404).render("error", {
      title: "Libro no encontrado", status: 404, message: "No existe el libro o no tienes permiso para editarlo."
    });
    res.render("books/form", {
      title: "Editar libro", book, errors: [], formAction: `/libros/${book._id}?_method=PUT`
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const book = await Book.findOne({ _id: req.params.id, ...ownershipFilter(req) });
    if (!book) return res.status(404).render("error", {
      title: "Libro no encontrado", status: 404, message: "No existe el libro o no tienes permiso para editarlo."
    });

    if (!errors.isEmpty()) {
      return res.status(422).render("books/form", {
        title: "Editar libro", book: { ...req.body, _id: book._id },
        errors: errors.array(), formAction: `/libros/${book._id}?_method=PUT`
      });
    }

    Object.assign(book, {
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      year: req.body.year || undefined,
      isbn: req.body.isbn,
      description: req.body.description
    });
    await book.save();
    res.redirect(`/libros/${book._id}?success=Libro%20actualizado.`);
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, ...ownershipFilter(req) });
    if (!book) return res.status(404).render("error", {
      title: "Libro no encontrado", status: 404, message: "No existe el libro o no tienes permiso para eliminarlo."
    });
    res.redirect("/libros?success=Libro%20eliminado.");
  } catch (error) {
    next(error);
  }
};
