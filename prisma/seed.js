const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = "Password123!";
  const hashedPassword = await hash(defaultPassword, 10);

  await prisma.user.upsert({
    where: { email: "admin@fik.local" },
    update: {
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
    create: {
      name: "Admin",
      email: "admin@fik.local",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
    },
  });

  const students = [
    { name: "Mahasiswa 1", email: "2110511125@student.fik.local", studentNumber: "2110511125" },
    { name: "Mahasiswa 2", email: "2110511162@student.fik.local", studentNumber: "2110511162" },
    { name: "Mahasiswa 3", email: "2110511166@student.fik.local", studentNumber: "2110511166" },
  ];

  for (const student of students) {
    await prisma.user.upsert({
      where: { email: student.email },
      update: {
        name: student.name,
        password: hashedPassword,
        role: "MAHASISWA",
        isActive: true,
        studentNumber: student.studentNumber,
      },
      create: {
        ...student,
        password: hashedPassword,
        role: "MAHASISWA",
        isActive: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
