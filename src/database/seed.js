require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("🔄 Starting database seeding...");

    const rolesPath = path.resolve(__dirname, "../../mock/roles.json");
    const rolesData = JSON.parse(fs.readFileSync(rolesPath, "utf-8"));

    const usersPath = path.resolve(__dirname, "../../mock/users.json");
    const usersData = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

    await prisma.user.deleteMany();
    await prisma.role.deleteMany();

    console.log(`🛠 Seeding ${rolesData.length} roles...`);
    for (const role of rolesData) {
      await prisma.role.create({ data: role });
    }

    console.log(`🛠 Seeding ${usersData.length} users...`);
    for (const user of usersData) {
      const exists = rolesData.some((r) => r.id === user.roleId);
      if (!exists) {
        console.warn(`⚠️ Skipping user with unknown roleId: ${user.email}`);
        continue;
      }
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          roleId: user.roleId,
        },
      });
    }

    console.log("✅ Database seeding completed successfully.");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.log("🔌 Prisma Client disconnected");
    process.exit(0);
  });
