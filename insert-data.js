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
    { name: "Self-care", icon: "🧘", colour: "#A3D2CA" }, // Soft teal
    { name: "Study", icon: "📚", colour: "#6C63FF" }, // Calm blue
    { name: "Fitness", icon: "🏋️", colour: "#FF6B6B" }, // Energetic red
    { name: "Social", icon: "👥", colour: "#4ECDC4" }, // Fresh turquoise
    { name: "Travel", icon: "✈️", colour: "#00B4D8" }, // Sky blue
    { name: "Nature", icon: "🌳", colour: "#2E8B57" }, // Forest green
    { name: "Business", icon: "💼", colour: "#3D3D3D" }, // Dark grey (professional)
    { name: "Retail", icon: "🛍️", colour: "#FF9F1C" }, // Vibrant orange
    { name: "Dream", icon: "💭", colour: "#B388EB" }, // Dreamy purple
    { name: "Maybe", icon: "❓", colour: "#9E9E9E" }, // Neutral grey
    { name: "Food", icon: "🍔", colour: "#FF7F50" }, // Coral (warm and inviting)
    { name: "Health", icon: "💊", colour: "#EF476F" }, // Health red-pink
    { name: "Hobby", icon: "🎨", colour: "#F4A261" }, // Artsy orange
    { name: "Family", icon: "👪", colour: "#F5B7B1" }, // Soft pink
    { name: "Friends", icon: "👫", colour: "#48CAE4" }, // Friendly blue
    { name: "Work", icon: "💼", colour: "#495057" }, // Dark muted blue
    { name: "Home", icon: "🏠", colour: "#7FB069" }, // Cozy green
    { name: "Personal", icon: "🧑‍🤝‍🧑", colour: "#CDB4DB" }, // Light lavender
    { name: "Finance", icon: "💰", colour: "#06D6A0" }, // Money green
    { name: "Education", icon: "🎓", colour: "#118AB2" }, // Academic blue
    { name: "Entertainment", icon: "🎭", colour: "#FFB4A2" }, // Playful peach
    { name: "Planning", icon: "🗓️", colour: "#6D6875" }, // Muted violet (organized feeling)
    { name: "Organization", icon: "🗄️", colour: "#8D99AE" }, // Soft steel blue
    { name: "Appointments", icon: "📋", colour: "#FFD166" }, // Bright yellow (attention-grabbing)
    { name: "Meditation", icon: "🧘‍♂️", colour: "#B5E48C" }, // Calming light green
    { name: "Spirituality", icon: "🕯️", colour: "#F9C74F" }, // Warm golden
    { name: "Shopping", icon: "🛒", colour: "#FFADAD" }, // Soft pink (fun vibe)
    { name: "Music", icon: "🎵", colour: "#9D4EDD" }, // Rich purple
    { name: "Cleaning", icon: "🧹", colour: "#90E0EF" }, // Clean aqua
    { name: "Volunteering", icon: "🤝", colour: "#43AA8B" }, // Helping green
    { name: "Pets", icon: "🐕", colour: "#FFB703" }, // Playful gold
    { name: "Art", icon: "🎨", colour: "#F4A261" }, // Artsy orange (dupe.)
    { name: "Cooking", icon: "🍳", colour: "#F77F00" }, // Tasty orange
    { name: "Celebration", icon: "🎉", colour: "#E5989B" }, // Festive pink-red
  ];
  tags.forEach(async (tag) => {
    const createdTag = await prisma.tag.create({
      data: {
        name: tag.name,
        icon: tag.icon,
        colour: tag.colour,
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
