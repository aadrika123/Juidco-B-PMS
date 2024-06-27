import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const productSchema = async () => {
	await prisma.$queryRaw`CREATE SCHEMA IF NOT EXISTS product;
;
`
}

export default productSchema
