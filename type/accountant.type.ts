export type boqData = {
	reference_no: string
	procurement_no: string
	procurement: [
		{
			id: string
			description: string
			quantity: number
			unit: string
			rate: number
			gst: number
			amount?: number
			remark: string,
			hsn_code?: string
		},
	]
	gst?: number
	estimated_cost?: number
	remark?: string
	ulb_id: string
	hsn_code?: string
	gstChecked?: boolean
}

// export type boqData = {
// 	reference_no: string
// 	procurement: [
// 		{
// 			procurement_no: string
// 			description: string
// 			quantity: number
// 			unit: string
// 			rate: number
// 			amount: number
// 			remark: string
// 		},
// 	]
// 	gst?: number
// 	estimated_cost?: number
// 	remark?: string
// 	ulb_id: string
// 	hsn_code?: string
// }

export type basicDetailsPtType = {
	reference_no: string
	allow_offline_submission: Boolean
	allow_resubmission: Boolean
	allow_withdrawl: Boolean
	payment_mode: string
	onlinePyment_mode?: String
	offline_banks?: String
	contract_form: String[]
	tender_category: String[]
	tender_type: String[]
}
