import { PrismaClient } from "@prisma/client";

import foreign_wrapper from "./seeder/foreignWrapper.seed";


const prisma = new PrismaClient();

async function main() {
  await foreign_wrapper();
  console.log("seed executed")
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
