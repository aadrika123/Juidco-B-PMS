import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const extractRoleName = async (id: number): Promise<string> => {
    const data: any = await prisma.$queryRaw`
    select role_name from wf_roles where id=${id}
    `
    return data[0]?.role_name as string
}