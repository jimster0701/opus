import { PrismaClient } from "@prisma/client";
import { defaultInterests, defaultUser } from "~/const/defaultVar";

const prisma = new PrismaClient();

async function main() {
  const systemUser = await prisma.user.upsert({
    where: { id: "system" },
    update: {},
    create: {
      id: "system", // assuming your schema allows custom string IDs
      name: "system",
      email: "system@opus.com",
      emailVerified: null,
      displayName: "System",
      image: defaultUser.image,
      themePreset: "unset",
    },
  });

  for (const interest of defaultInterests) {
    const { createdBy, ...cleanedInterest } = interest; // Remove `createdBy` if it exists
    await prisma.interest.upsert({
      where: { id: interest.id },
      update: {},
      create: {
        ...cleanedInterest,
        createdById: systemUser.id,
      },
    });
  }
}

main()
  .then(() => {
    console.log("✅ Seed completed");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error("❌ Seed error", e);
    return prisma.$disconnect();
  });
