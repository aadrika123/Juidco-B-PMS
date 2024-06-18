import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

const extractRoles = async (userId: number) => {
    const data: any = await prisma.$queryRaw`
    select wf_role_id from wf_roleusermaps where user_id=${userId}
    `;
    return data.map((item: any) => item?.wf_role_id);
};

export const srAuth = async (req: Request, res: Response, next: NextFunction) => {
    const roles = await extractRoles(req?.body?.auth?.id);
    if (!roles) {
        res.status(401).send({ error: true, message: 'Role ID is required' });
    }
    if (!roles.includes(Number(process.env.ROLE_SR))) {
        res.status(401).send({ error: true, message: 'User not authorized to access this api' });
    } else {
        next();
    }
};

export const daAuth = async (req: Request, res: Response, next: NextFunction) => {
    const roles = await extractRoles(req?.body?.auth?.id);
    if (!roles) {
        res.status(401).send({ error: true, message: 'Role ID is required' });
    }
    if (!roles.includes(Number(process.env.ROLE_DA))) {
        res.status(401).send({ error: true, message: 'User not authorized to access this api' });
    } else {
        next();
    }
};

export const accAuth = async (req: Request, res: Response, next: NextFunction) => {
    const roles = await extractRoles(req?.body?.auth?.id);
    if (!roles) {
        res.status(401).send({ error: true, message: 'Role ID is required' });
    }
    if (!roles.includes(Number(process.env.ROLE_ACC))) {
        res.status(401).send({ error: true, message: 'User not authorized to access this api' });
    } else {
        next();
    }
};

export const distAuth = async (req: Request, res: Response, next: NextFunction) => {
    const roles = await extractRoles(req?.body?.auth?.id);
    if (!roles) {
        res.status(401).send({ error: true, message: 'Role ID is required' });
    }
    if (!roles.includes(Number(process.env.ROLE_DIST))) {
        res.status(401).send({ error: true, message: 'User not authorized to access this api' });
    } else {
        next();
    }
};
