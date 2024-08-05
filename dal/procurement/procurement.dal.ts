import { Request } from 'express'
import getErrorMessage from '../../lib/getErrorMessage'
import { PrismaClient, procurement } from '@prisma/client'
import { procurementType } from '../stockReceiver/preProcurement.dal'

const prisma = new PrismaClient()

export const getProcurementByProcurementNoDal = async (req: Request) => {
	const { procurement_no } = req.params
	try {
		const result = await prisma.procurement.findFirst({
			where: {
				procurement_no: procurement_no,
			},
			select: {
				id: true,
				procurement_no: true,
				category: true,
				total_rate: true,
				isEdited: true,
				is_partial: true,
				status: true,
				remark: true,
				procurement_stocks: {
					select: {
						id: true,
						category: {
							select: {
								id: true,
								name: true,
							},
						},
						subCategory: {
							select: {
								id: true,
								name: true,
							},
						},
						unit: {
							select: {
								id: true,
								name: true,
							},
						},
						brand: {
							select: {
								id: true,
								name: true,
							},
						},
						gst: true,
						remark: true,
						rate: true,
						quantity: true,
						description: true,
						total_rate: true,
					},
				},
				supplier_master: true,
				post_procurement: true,
				receivings: true,
			},
		})

		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

type extendedProcurementType = procurementType & {
	id: string
}

export const editProcurementDal = async (req: Request) => {
	const { procurement_no, category, procurement }: { procurement_no: string; category: string; procurement: extendedProcurementType[] } = req.body

	// let updatedProcData: procurement

	try {
		const total_rate = procurement.reduce((total, item) => total + item?.total_rate, 0)
		//start transaction
		await prisma.$transaction(async tx => {
			await tx.procurement.update({
				where: { procurement_no: procurement_no },
				data: {
					category: { connect: { id: category } },
					total_rate: total_rate,
				},
			})

			await Promise.all(
				procurement.map(async item => {
					await tx.procurement_stocks.update({
						where: {
							id: item?.id,
						},
						data: {
							category_masterId: category,
							subCategory_masterId: item?.subcategory,
							unit_masterId: item?.unit,
							rate: Number(item?.rate),
							quantity: Number(item?.quantity),
							total_rate: Number(item?.total_rate),
							description: item?.description,
						},
					})
				})
			)
		})

		return 'Updated'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: err?.message }
	}
}
