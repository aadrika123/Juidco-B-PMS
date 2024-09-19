import getErrorMessage from '../../lib/getErrorMessage'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getLevelCountsDal = async () => {
	try {

		const nonApprovedProcurement = await prisma.procurement.count({
			where: {
				status: {
					in: [0, 10, 11, 13, 20, 21, 23]
				}

			}
		})

		const procurement = await prisma.procurement.count()

		const acticveProcurement = await prisma.procurement.count({
			where: {
				status: {
					notIn: [12, 22, 7]
				}
			}
		})

		const rejectedProcurement = await prisma.procurement.count({
			where: {
				status: {
					in: [12, 22]
				}
			}
		})

		return {
			totalProcurement: procurement,
			totalNonApprovedProcurement: nonApprovedProcurement,
			totalActiveProcurement: acticveProcurement,
			totalRejectedProcurement: rejectedProcurement
		}

	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}