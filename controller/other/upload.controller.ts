import { Request, Response } from 'express'
import { uploadGetUrlDal } from '../../dal/other/upload.dal'

export const uploadGetUrl = async (req: Request, res: Response) => {
	const result: any = await uploadGetUrlDal(req)
	if (!result?.error) {
		res.status(200).json({
			status: true,
			data: result,
		})
	} else {
		res.status(400).json({
			status: false,
			message: `Upload failed`,
			error: result?.message,
		})
	}
}
