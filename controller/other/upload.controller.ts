import { Request, Response } from "express";
import { uploadGetUrlDal } from "../../dal/other/upload.dal";

export const uploadGetUrl = async (req: Request, res: Response) => {
    const result: any = await uploadGetUrlDal(req)
    if (!result?.error) {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="exported_data.csv"');
        res.status(200).send(result);
    } else {
        res.status(400).json({
            status: false,
            message: `Pre procurement creation failed`,
            error: result?.message
        })
    }
}