import getErrorMessage from '../../lib/getErrorMessage'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getTenderCountsDal = async () => {
	try {

		const totalApprovedTender = await prisma.boq.count({
			where: {
				status: 70
			}
		})

		const totalLeastCost = await prisma.boq.count({
			where: {
				status: 70,
				pre_tendering_details: {
					tendering_type: 'least_cost'
				}
			}
		})

		const totalQcbs = await prisma.boq.count({
			where: {
				status: 70,
				pre_tendering_details: {
					tendering_type: 'qcbs'
				}
			}
		})

		const totalRateContract = await prisma.boq.count({
			where: {
				status: 70,
				pre_tendering_details: {
					is_rate_contract: true
				}
			}
		})

		return {
			totalApprovedTender: totalApprovedTender,
			totalLeastCost: totalLeastCost,
			totalQcbs: totalQcbs,
			totalRateContract: totalRateContract
		}

	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}