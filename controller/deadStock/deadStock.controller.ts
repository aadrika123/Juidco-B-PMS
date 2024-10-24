import { Request, Response } from 'express'
import { getItemDal } from '../../dal/deadStock/deadStock.dal'



export const getItem = async (req: Request, res: Response) => {
	const result: any = await getItemDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			message: `Item list fetched successfully`,
			data: result?.data,
			pagination: result?.pagination
		})
	} else {
		res.status(404).json({
			status: false,
			message: `Error while fetching item list`,
			error: result?.message,
		})
	}
}