import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const uuidSetup = async () => {
	await prisma.$queryRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
`
}

export default uuidSetup
