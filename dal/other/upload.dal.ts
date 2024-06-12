import { Request } from "express";
import getErrorMessage from "../../lib/getErrorMessage";
import { imageUploader } from "../../lib/imageUploader";
import axios from "axios";


export const uploadGetUrlDal = async (req: Request) => {
    let docUrl: string = ''
    try {
        const img = req.files as Express.Multer.File[]
        if (!img) {
            throw { error: true, message: 'Invalid document data' }
        }

        const uploaded = await imageUploader(img)   //It will return reference number and unique id as an object after uploading.

        await Promise.all(
            uploaded.map(async (item: any) => {
                const headers = {
                    "token": "8Ufn6Jio6Obv9V7VXeP7gbzHSyRJcKluQOGorAD58qA1IQKYE0"
                }
                await axios.post(process.env.DMS_GET || '', { "referenceNo": item?.ReferenceNo }, { headers })
                    .then((response) => {
                        docUrl = response?.data?.data?.fullPath
                    }).catch((err) => {
                        throw err
                    })
            })
        )
        return docUrl
    } catch (err: any) {
        console.log(err)
        return { error: true, message: getErrorMessage(err) }
    }
}
