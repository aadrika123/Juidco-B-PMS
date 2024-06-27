import { PrismaClient } from '@prisma/client'

import foreign_wrapper from './seeder/foreignWrapper.seed'
import uuidSetup from './seeder/uuid.seed'
import productSchema from './seeder/productSchema.seed'

const prisma = new PrismaClient()

async function main() {
	await foreign_wrapper()
	await uuidSetup()
	await productSchema()
}
main()
	.then(async () => {
		console.log('seed executed')
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
	})
