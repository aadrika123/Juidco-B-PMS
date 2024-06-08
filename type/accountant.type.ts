
export type boqData = {
    reference_no:string,
    procurement: [
        {
            procurement_no: string,
            description: string,
            quantity: number,
            unit: string,
            rate: number,
            amount: number,
            remark: string
        }
    ],
    gst?: number,
    estimated_cost?: number,
    remark?: string,
    ulb_id: string
}