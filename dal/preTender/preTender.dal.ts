import { Request } from 'express'
import getErrorMessage from '../../lib/getErrorMessage'
import { pre_tendering_details_enum, PrismaClient, tendering_type_enum } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()

type preTenderDetailsPayloadType = {
	reference_no: string
	emd: boolean
	estimated_amount: number
	emd_type: pre_tendering_details_enum
	emd_value: number
	pbg_type: pre_tendering_details_enum
	pbg_value: number
	tendering_type: tendering_type_enum
	tenure?: number
	min_supplier?: number
	max_supplier?: number
}

const checkExistence = async (reference_no: string) => {
	try {
		const count = await prisma.tendering_form.count({
			where: {
				reference_no: reference_no,
			},
		})

		return count !== 0 ? true : false
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getPreTenderDal = async (req: Request) => {
	const { reference_no } = req.params
	try {
		if (!reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		if (!(await checkExistence(reference_no))) {
			throw { error: true, message: 'Invalid pre-tender form' }
		}

		const result: any = await prisma.tendering_form.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				id: true,
				reference_no: true,
				status: true,
				isEdited: true,
				isPartial: true,
				basic_details: {
					select: {
						allow_offline_submission: true,
						allow_resubmission: true,
						allow_withdrawl: true,
						payment_mode: true,
						onlinePyment_mode: true,
						offline_banks: true,
						contract_form: true,
						tender_category: true,
						tender_type: true,
					},
				},
				cover_details: {
					select: {
						noOfCovers: true,
						content: true,
						cover_details_docs: {
							select: {
								type: true,
								docPath: true,
							},
						},
					},
				},
				work_details: {
					select: {
						workDiscription: true,
						pre_qualification_details: true,
						product_category: true,
						productSubCategory: true,
						contract_type: true,
						tender_values: true,
						bid_validity: true,
						completionPeriod: true,
						location: true,
						pinCode: true,
						pre_bid: true,
						preBidMeeting: true,
						preBidMeetingAdd: true,
						bidOpeningPlace: true,
						tenderer_class: true,
						invstOffName: true,
						invstOffAdd: true,
						invstOffEmail_Ph: true,
					},
				},
				fee_details: {
					select: {
						tenderFee: true,
						processingFee: true,
						tenderFeePayableTo: true,
						tenderFeePayableAt: true,
						surcharges: true,
						otherCharges: true,
						emd_exemption: true,
						emd_fee: true,
						emdPercentage: true,
						emdAmount: true,
						emdFeePayableTo: true,
						emdFeePayableAt: true,
					},
				},
				critical_dates: {
					select: {
						publishingDate: true,
						bidOpeningDate: true,
						docSaleStartDate: true,
						docSaleEndDate: true,
						seekClariStrtDate: true,
						seekClariEndDate: true,
						bidSubStrtDate: true,
						bidSubEndDate: true,
						preBidMettingDate: true,
					},
				},
				bid_openers: {
					select: {
						id: true,
						reference_no: true,
						b01NameDesig: true,
						b01Email: true,
						b02NameDesig: true,
						b02Email: true,
						b03NameDesig: true,
						b03Email: true,
						bid_openers_docs: {
							select: {
								type: true,
								ReferenceNo: true,
								uniqueId: true,
								nameDesig: true,
								description: true,
								docSize: true,
							},
						},
					},
				},
			},
		})

		//Append document in basic details
		if (result?.basic_details) {
			const basicDetailsDoc = await prisma.tendering_form_docs.findMany({
				where: {
					reference_no: reference_no,
					form: 'basic_details',
				},
				select: {
					ReferenceNo: true,
				},
			})

			await Promise.all(
				basicDetailsDoc.map(async (item: any) => {
					const headers = {
						token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
					}
					await axios
						.post(process.env.DMS_GET || '', { referenceNo: item?.ReferenceNo }, { headers })
						.then(response => {
							item.docUrl = response?.data?.data?.fullPath
						})
						.catch(err => {
							throw err
						})
				})
			)

			result.basic_details.doc = basicDetailsDoc
		}

		//Append document in bid openers
		if (result?.bid_openers) {
			await Promise.all(
				result?.bid_openers?.bid_openers_docs.map(async (item: any) => {
					const headers = {
						token: '8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0',
					}
					await axios
						.post(process.env.DMS_GET || '', { referenceNo: item?.ReferenceNo }, { headers })
						.then(response => {
							item.docUrl = response?.data?.data?.fullPath
						})
						.catch(err => {
							throw err
						})
				}) as any
			)
		}

		return result ? result : null
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const createPreTenderDetailsDal = async (req: Request) => {
	const { reference_no, emd, estimated_amount, emd_type, emd_value, pbg_type, pbg_value, tendering_type, tenure, min_supplier, max_supplier }: preTenderDetailsPayloadType = req.body
	try {
		if (!reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		const boqData = await prisma.boq.findFirst({
			where: { reference_no: reference_no },
			select: { status: true },
		})

		if (!boqData) {
			throw { error: true, message: 'No BOQ found with this reference number' }
		}

		if (boqData?.status !== 42) {
			throw { error: true, message: 'BOQ not ready to be proceeded for pre tender details' }
		}

		let result: any

		await prisma.$transaction(async tx => {
			result = await tx.pre_tendering_details.create({
				data: {
					reference_no: reference_no,
					emd: Boolean(emd),
					estimated_amount: Number(estimated_amount),
					emd_type: emd_type,
					emd_value: Number(emd_value),
					pbg_type: pbg_type,
					pbg_value: Number(pbg_value),
					tendering_type: tendering_type,
					...(tendering_type === 'rate_contract' && { tenure: Number(tenure) }),
					...(tendering_type === 'rate_contract' && { min_supplier: Number(min_supplier) }),
					...(tendering_type === 'rate_contract' && { max_supplier: Number(max_supplier) }),
				},
			})

			await tx.boq.update({
				where: { reference_no: reference_no },
				data: { status: 50 },
			})
		})

		return result
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}

export const getPreTenderDetailsDal = async (req: Request) => {
	const { reference_no } = req.params
	try {
		if (!reference_no) {
			throw { error: true, message: "Reference number is required as 'reference_no'" }
		}

		const result = await prisma.pre_tendering_details.findFirst({
			where: {
				reference_no: reference_no,
			},
			select: {
				reference_no: true,
				boq: true,
				emd: true,
				estimated_amount: true,
				emd_type: true,
				emd_value: true,
				pbg_type: true,
				pbg_value: true,
				tendering_type: true,
				tenure: true,
				min_supplier: true,
				max_supplier: true,
			},
		})

		return result ? result : null
	} catch (err: any) {
		console.log(err)
		return { error: true, message: getErrorMessage(err) }
	}
}
