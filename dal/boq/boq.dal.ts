import { Request } from 'express'
import getErrorMessage from '../../lib/getErrorMessage'
import { PrismaClient } from '@prisma/client'
import { boqData } from '../../type/accountant.type'
import { uploadedDoc } from '../../type/common.type'
import { imageUploader } from '../../lib/imageUploader'
import { imageUploaderV2 } from '../../lib/imageUploaderV2'
import axios from 'axios'
import { getPreTenderV2Dal } from '../accountant/accPreProcurement.dal'

const prisma = new PrismaClient()

export const getBoqByRefNoDal = async (req: Request) => {
	const { reference_no } = req.params
	try {
		const result: any = await prisma.boq.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				reference_no: true,
				gst: true,
				estimated_cost: true,
				hsn_code: true,
				remark: true,
				status: true,
				isEdited: true,
				procurement_stocks: {
					select: {
						procurement_no: true,
						quantity: true,
						rate: true,
						remark: true,
						description: true,
						gst: true,
						category: {
							select: {
								name: true,
							},
						},
						subCategory: {
							select: {
								name: true,
							},
						},
						unit: {
							select: {
								name: true,
							},
						},
					},
				},
				boq_doc: {
					select: {
						docPath: true,
					},
				},
				tendering_form: {
					select: {
						isPartial: true,
					},
				},
			},
		})

		return [result]
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

// export const editBoqDal = async (req: Request) => {
// 	const { boqData } = req.body
// 	try {
// 		const formattedBoqData: boqData = JSON.parse(boqData)
// 		const img = req.files as Express.Multer.File[]
// 		let arrayToSend: any[] = []
// 		let docToSend: any[] = []

// 		await Promise.all(
// 			formattedBoqData?.procurement.map(async item => {
// 				const preparedData = {
// 					// reference_no: formattedBoqData?.reference_no,
// 					procurement_no: item?.procurement_no,
// 					description: item?.description,
// 					quantity: item?.quantity,
// 					unit: item?.unit,
// 					rate: item?.rate,
// 					amount: item?.amount,
// 					remark: item?.remark,
// 				}
// 				arrayToSend.push(preparedData)
// 			})
// 		)

// 		const preparedBoq = {
// 			// reference_no: formattedBoqData?.reference_no,
// 			gst: formattedBoqData?.gst,
// 			estimated_cost: formattedBoqData?.estimated_cost,
// 			remark: formattedBoqData?.remark,
// 			isEdited: true,
// 			hsn_code: formattedBoqData?.hsn_code,
// 		}

// 		if (img) {
// 			const uploaded: uploadedDoc[] = await imageUploader(img) //It will return reference number and unique id as an object after uploading.

// 			uploaded.map((doc: uploadedDoc) => {
// 				const preparedBoqDoc = {
// 					reference_no: formattedBoqData?.reference_no,
// 					ReferenceNo: doc?.ReferenceNo,
// 					uniqueId: doc?.uniqueId,
// 					remark: formattedBoqData?.remark,
// 				}
// 				docToSend.push(preparedBoqDoc)
// 			})
// 		}

// 		//start transaction
// 		await prisma.$transaction(async tx => {
// 			await tx.boq.update({
// 				where: {
// 					reference_no: formattedBoqData?.reference_no,
// 				},
// 				data: preparedBoq,
// 			})

// 			// await tx.boq_procurement.updateMany({
// 			//     where: {
// 			//         reference_no: formattedBoqData?.reference_no
// 			//     },
// 			//     data: arrayToSend
// 			// })

// 			await Promise.all(
// 				formattedBoqData?.procurement.map(async item => {
// 					const preparedData = {
// 						// reference_no: formattedBoqData?.reference_no,
// 						procurement_no: item?.procurement_no,
// 						description: item?.description,
// 						quantity: item?.quantity,
// 						unit: item?.unit,
// 						rate: item?.rate,
// 						amount: item?.amount,
// 						remark: item?.remark,
// 					}
// 					await tx.boq_procurement.update({
// 						where: {
// 							procurement_no: item?.procurement_no,
// 						},
// 						data: preparedData,
// 					})
// 				})
// 			)

// 			if (img) {
// 				await tx.boq_doc.deleteMany({
// 					where: {
// 						reference_no: formattedBoqData?.reference_no,
// 					},
// 				})
// 				await tx.boq_doc.createMany({
// 					data: docToSend,
// 				})
// 			}
// 		})

// 		return 'BOQ Edited'
// 	} catch (err: any) {
// 		console.log(err)
// 		return { error: true, message: getErrorMessage(err) }
// 	}
// }

export const editBoqDal = async (req: Request) => {
	const { boqData } = req.body
	try {
		const formattedBoqData: boqData = JSON.parse(boqData)
		const img = req.files as Express.Multer.File[]
		let docToSend: any[] = []

		// const reference_no: string = generateReferenceNumber(formattedBoqData?.ulb_id)

		const procData = await prisma.procurement.findFirst({
			where: {
				procurement_no: formattedBoqData?.procurement_no,
			},
			select: {
				status: true,
			},
		})

		if (procData?.status !== 14 && procData?.status !== 24) {
			throw {
				error: true,
				message: `Procurement : ${formattedBoqData?.procurement_no} is not valid for BOQ`,
			}
		}

		if (img) {
			const uploaded: string[] = await imageUploaderV2(img) //It will return path for the uploaded document(s).

			uploaded.map(doc => {
				const preparedBoqDoc = {
					reference_no: formattedBoqData?.reference_no,
					docPath: doc,
					remark: formattedBoqData?.remark,
				}
				docToSend.push(preparedBoqDoc)
			})
		}

		//start transaction
		await prisma.$transaction(async tx => {
			await tx.boq.update({
				where: {
					reference_no: formattedBoqData?.reference_no,
				},
				data: {
					procurement_no: formattedBoqData?.procurement_no,
					estimated_cost: formattedBoqData?.estimated_cost,
					remark: formattedBoqData?.remark,
					hsn_code: formattedBoqData?.hsn_code,
				},
			})

			if (img) {
				await tx.boq_doc.deleteMany({
					where: {
						reference_no: formattedBoqData?.reference_no,
					},
				})
				await tx.boq_doc.createMany({
					data: docToSend,
				})
			}

			await Promise.all(
				formattedBoqData?.procurement.map(async item => {
					const procStock: any = await prisma.procurement_stocks.findFirst({
						where: {
							id: item?.id,
						},
					})

					delete procStock.id
					delete procStock.createdAt
					delete procStock.updatedAt

					// await tx.procurement_stocks_history.create({
					// 	data: procStock,
					// })

					await tx.procurement_stocks.update({
						where: {
							id: item?.id,
						},
						data: {
							boq_procurement_no: formattedBoqData?.procurement_no,
							rate: Number(item?.rate),
							gst: Number(item?.gst),
							remark: item?.remark,
						},
					})
				})
			)

			// await tx.notification.create({
			// 	data: {
			// 		role_id: Number(process.env.ROLE_SR),
			// 		title: 'BOQ created',
			// 		destination: 10,
			// 		description: `BOQ created for procurement Number : ${formattedBoqData?.procurement_no}`,
			// 	},
			// })
		})

		return 'Updated'
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}
