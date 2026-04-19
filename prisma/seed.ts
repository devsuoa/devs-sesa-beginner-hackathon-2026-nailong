import { prisma } from "@/lib/prisma";

async function main() {
  const result = await prisma.location.createMany({
    data: [
      { name: "Mercury ☀️",  currentConditions: "extreme heat"         },
      { name: "Venus 🟠",    currentConditions: "clear"                },
      { name: "Mars 🔴",     currentConditions: "dust storm"           },
      { name: "Jupiter 🪐",  currentConditions: "solar flare warning"  },
      { name: "Saturn 💫",   currentConditions: "clear"                },
      { name: "Uranus 🌀",   currentConditions: "ice storm"            },
      { name: "Neptune 🌊",  currentConditions: "clear"                },
    ],
    skipDuplicates: true,
  });
  console.log(`Seeded ${result.count} planets`);
}

main().catch(console.error).finally(() => prisma.$disconnect());