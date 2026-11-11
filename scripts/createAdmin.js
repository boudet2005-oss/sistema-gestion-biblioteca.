require("dotenv").config();
const connectDB = require("../config/database");
const createAdminIfConfigured = require("../config/createAdmin");

(async () => {
  try {
    await connectDB();
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("Define ADMIN_EMAIL y ADMIN_PASSWORD en .env.");
    }
    await createAdminIfConfigured();
    console.log("Proceso finalizado.");
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();
