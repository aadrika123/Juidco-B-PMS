import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export const receivingImageUploader = async (img: any, receiving_no: string) => {
    const toReturn: any[] = []
    try {
        await Promise.all(
            img.map(async (item: any) => {
                const dataToUpload: any = {
                    name: item?.filename,
                    destination: item?.destination,
                    mime_type: item?.mimetype,
                    size: String(item?.size),
                    path: item?.path,
                    receiving_no: receiving_no
                }
                const uploadedImg = await prisma.receiving_image.create({
                    data: dataToUpload
                })
            })
        )
    } catch (err) {
        // console.log(err)
        throw err
    }
    return toReturn
}
