import getErrorMessage from '../../lib/getErrorMessage'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getDistCountsDal = async () => {
	try {

		const approvedStockReq = await prisma.stock_req_product.aggregate({
			where: {
				stock_request: {
					status: {
						gte: 3,
						notIn: [80, 81, 82]
					}
				}
			},
			_sum: {
				quantity: true
			}
		})

		const approvedServiceReq = await prisma.service_req_product.aggregate({
			where: {
				service_request: {
					status: 23
				}
			},
			_sum: {
				quantity: true
			}
		})

		const approvedEmpServiceReq = await prisma.emp_service_req_product.aggregate({
			where: {
				emp_service_request: {
					status: 13
				}
			},
			_sum: {
				quantity: true
			}
		})

		const handoverCount = await prisma.stock_handover.aggregate({
			where: {
				is_alloted: true
			},
			_sum: {
				quantity: true
			}
		})

		return {
			totalApprovedStockReq: approvedStockReq?._sum?.quantity,
			totalApprovedServiceReq: approvedServiceReq?._sum?.quantity,
			totalEmpApprovedServiceReq: approvedEmpServiceReq?._sum?.quantity,
			TotalHandoverCount: handoverCount?._sum?.quantity
		}

	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}