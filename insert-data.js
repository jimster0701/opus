import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create the system user if it doesn't exist
  const systemUser = await prisma.user.upsert({
    where: { id: "system" },
    update: {}, // If it already exists, do nothing.
    create: {
      id: "system",
      name: "System",
      email: "system@example.com",
      displayName: "System Account",
    },
  });

  console.log("System user created or already exists");

  // Create tags
  const tags = [
    { name: "Self-care", icon: "🧘" },
    { name: "Study", icon: "📚" },
    { name: "Fitness", icon: "🏋️" },
    { name: "Social", icon: "👥" },
    { name: "Travel", icon: "✈️" },
    { name: "Nature", icon: "🌳" },
    { name: "Business", icon: "💼" },
    { name: "Retail", icon: "🛍️" },
    { name: "Dream", icon: "💭" },
    { name: "Maybe", icon: "❓" },
    { name: "Food", icon: "🍔" },
    { name: "Health", icon: "💊" },
    { name: "Hobby", icon: "🎨" },
    { name: "Family", icon: "👪" },
    { name: "Friends", icon: "👫" },
    { name: "Work", icon: "💼" },
    { name: "Home", icon: "🏠" },
    { name: "Personal", icon: "🧑‍🤝‍🧑" },
    { name: "Finance", icon: "💰" },
    { name: "Education", icon: "🎓" },
    { name: "Entertainment", icon: "🎭" },
  ];

  tags.forEach(async (tag) => {
    const createdTag = await prisma.tag.create({
      data: {
        name: tag.name,
        icon: tag.icon,
        colour: "#ffffff",
        userId: systemUser.id,
      },
    });
  });
  console.log("Tags created");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
