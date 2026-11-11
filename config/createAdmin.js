const User = require("../models/User");

async function createAdminIfConfigured() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;

  const email = ADMIN_EMAIL.toLowerCase().trim();
  const existing = await User.findOne({ email });

  if (!existing) {
    await User.create({
      name: ADMIN_NAME || "Administrador",
      email,
      password: ADMIN_PASSWORD,
      role: "admin"
    });
    console.log(`Administrador inicial creado: ${email}`);
  } else if (existing.role !== "admin") {
    existing.role = "admin";
    await existing.save();
    console.log(`Rol de administrador actualizado: ${email}`);
  }
}

module.exports = createAdminIfConfigured;
