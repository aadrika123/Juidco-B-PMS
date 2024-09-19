import { Console } from 'console';
import getErrorMessage from '../../lib/getErrorMessage'
import { PrismaClient, service_enum } from '@prisma/client'

const prisma = new PrismaClient()

export const getDistCountsDal = async () => {
	try {

		const schema: any = await prisma.$queryRawUnsafe(`
			SELECT table_name
			FROM information_schema.tables
			WHERE table_schema = 'product'
		  `);

		if (schema?.length === 0) {
			throw new Error('No product')
		}

		const total: any[] = await prisma.$queryRawUnsafe(
			`
			SELECT SUM(opening_quantity) AS total_sum
			FROM ${schema.map((table: any) => `product.${table.table_name}`).join(' UNION ALL SELECT SUM(opening_quantity) AS total_sum FROM ')}
		`);

		const remaining: any[] = await prisma.$queryRawUnsafe(
			`
			SELECT SUM(quantity) AS total_sum
			FROM ${schema.map((table: any) => `product.${table.table_name}`).join(' UNION ALL SELECT SUM(quantity) AS total_sum FROM ')}
		`);

		const dead = await prisma.inventory_dead_stock.aggregate({
			_sum: {
				quantity: true
			}
		})

		const movement = await prisma.stock_req_product.aggregate({
			where: {
				stock_request: {
					status: {
						notIn: [-2, -1, 0, 1, 2, 80, 81, 82]
					}
				}
			},
			_sum: {
				quantity: true
			}
		})

		return {
			totalStocks: total[0].total_sum,
			remainingStocks: remaining[0].total_sum,
			deadStocks: dead?._sum?.quantity,
			stocksInMovement: movement?._sum?.quantity
		}

	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}