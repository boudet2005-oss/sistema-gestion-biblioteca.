# Sistema de Gestión de Biblioteca

Aplicación web full-stack desarrollada con Node.js, Express, MongoDB Atlas, EJS y autenticación JWT. Permite registrar usuarios y administrar una colección de libros con permisos por roles.

## Funcionalidades

- Registro e inicio de sesión de usuarios.
- Contraseñas protegidas mediante hash bcrypt (implementación `bcryptjs`).
- Autenticación JWT almacenada en cookie `HttpOnly`.
- Roles `user` y `admin`.
- CRUD de libros: crear, listar, ver detalles, editar y eliminar.
- Los usuarios administran sus propios libros.
- El administrador puede consultar, editar y eliminar los libros de todos los usuarios.
- Búsqueda por título, autor y categoría.
- Paginación del catálogo.
- Validación de formularios y manejo global de errores.
- Vistas dinámicas EJS y diseño adaptable a móviles.
- Cabeceras de seguridad con Helmet.

## Tecnologías

- Node.js 20 o superior
- Express
- MongoDB Atlas y Mongoose
- EJS
- JWT (`jsonwebtoken`)
- bcrypt (`bcryptjs`)
- Helmet, express-validator, cookie-parser y method-override

## Requisitos previos

Instala Node.js y npm. Crea una base de datos gratuita en MongoDB Atlas y configura el acceso de red y un usuario de base de datos.

## Instalación local

1. Descarga o clona el proyecto.
2. Abre una terminal dentro de la carpeta del proyecto.
3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Copia `.env.example` a un archivo llamado `.env`.
5. Completa `MONGODB_URI` con la cadena de conexión de MongoDB Atlas.
6. Define `JWT_SECRET` con una cadena larga, privada y aleatoria.
7. Inicia el servidor:

   ```bash
   npm run dev
   ```

8. Abre `http://localhost:3000`.

Para iniciar en modo normal:

```bash
npm start
```

## Crear administrador

Hay dos opciones:

**Opción automática:** configura `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `.env`. Al iniciar la aplicación se crea esa cuenta con rol `admin` si no existe. Si ya existe, se asegura que tenga ese rol.

**Opción por script:** configura las mismas variables y ejecuta:

```bash
npm run create-admin
```

No publiques el archivo `.env` ni compartas las credenciales del administrador.

## Despliegue en Render

1. Sube el proyecto a un repositorio de GitHub.
2. En Render crea un servicio **Web Service** y conecta el repositorio.
3. Build Command: `npm install`.
4. Start Command: `npm start`.
5. En Environment añade:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = cadena de MongoDB Atlas
   - `JWT_SECRET` = secreto largo y aleatorio
   - `JWT_EXPIRES_IN` = `1d`
   - `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` = opcionales, para crear el administrador inicial.
6. Despliega. Render proporciona una URL HTTPS para la aplicación.

La aplicación utiliza `process.env.PORT`, como requiere Render. Comprueba la ruta `/health` después del despliegue.

## Estructura del proyecto

```text
biblioteca-nodejs/
├── config/
│   ├── createAdmin.js
│   └── database.js
├── controllers/
│   ├── authController.js
│   └── bookController.js
├── middlewares/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── Book.js
│   └── User.js
├── public/
│   └── css/style.css
├── routes/
│   ├── auth.js
│   └── books.js
├── scripts/
├── views/
│   ├── auth/
│   ├── books/
│   ├── layouts/
│   └── partials/
├── .env.example
├── .gitignore
├── app.js
├── package.json
└── README.md
```

## Rutas principales

| Método | Ruta | Función |
|---|---|---|
| GET | `/` | Página de inicio |
| GET | `/auth/registro` | Formulario de registro |
| POST | `/auth/registro` | Registrar usuario |
| GET | `/auth/login` | Formulario de acceso |
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/logout` | Cerrar sesión |
| GET | `/libros` | Listar libros propios o todos si es admin |
| GET | `/libros/nuevo` | Formulario de creación |
| POST | `/libros` | Crear libro |
| GET | `/libros/:id` | Ver detalle |
| GET | `/libros/:id/editar` | Formulario de edición |
| PUT | `/libros/:id` | Actualizar libro |
| DELETE | `/libros/:id` | Eliminar libro |
| GET | `/health` | Comprobar estado del servidor |

## Notas de seguridad

- Las contraseñas se almacenan como hashes bcrypt; nunca en texto plano.
- El JWT se guarda en una cookie `HttpOnly`, `SameSite=Lax` y `Secure` en producción.
- Las rutas de libros requieren autenticación y comprueban la propiedad del registro.
- Los roles se asignan en el servidor; el formulario de registro no permite elegir `admin`.
- Mantén las variables secretas fuera de GitHub.
- Para un despliegue público de mayor exigencia conviene añadir protección CSRF, limitación de intentos de login, política de renovación de tokens y pruebas automatizadas.

## Autor

Proyecto final del curso optativo de Node.js.
