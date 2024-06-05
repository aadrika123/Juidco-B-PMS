import { Request, Response, NextFunction } from "express"

export const srAuth = (req: Request, res: Response, next: NextFunction) => {
    const roleIdHeader = req.headers['role-id'];
    console.log(req)

    if (typeof roleIdHeader !== 'string') {
        return res.status(400).send({ message: 'Invalid role ID format' });
    }

    const roleIdArray: string[] = JSON.parse(roleIdHeader);

    const roleId: number[] = roleIdArray.map(roleId => {
        const number = Number(roleId);
        if (isNaN(number)) {
            throw new Error('Invalid number in role ID');
        }
        return number;
    });

    if (!roleId) {
        res.status(401).send({ error: true, message: "Role ID is required as 'role-id' in headers" })
    }
    if (!roleId.includes(59)) {
        res.status(401).send({ error: true, message: "User not authorized to access this api" })
    } else {
        next()
    }
}


export const daAuth = (req: Request, res: Response, next: NextFunction) => {
    const roleIdHeader = req.headers['role-id'];

    if (typeof roleIdHeader !== 'string') {
        return res.status(400).send({ message: 'Invalid role ID format' });
    }

    const roleIdArray: string[] = JSON.parse(roleIdHeader);

    const roleId: number[] = roleIdArray.map(roleId => {
        const number = Number(roleId);
        if (isNaN(number)) {
            throw new Error('Invalid number in role ID');
        }
        return number;
    });

    if (!roleId) {
        res.status(401).send({ error: true, message: "Role ID is required as 'role-id' in headers" })
    }
    if (!roleId.includes(60)) {
        res.status(401).send({ error: true, message: "User not authorized to access this api" })
    } else {
        next()
    }
}


export const accAuth = (req: Request, res: Response, next: NextFunction) => {
    const roleIdHeader = req.headers['role-id'];

    if (typeof roleIdHeader !== 'string') {
        return res.status(400).send({ message: 'Invalid role ID format' });
    }

    const roleIdArray: string[] = JSON.parse(roleIdHeader);

    const roleId: number[] = roleIdArray.map(roleId => {
        const number = Number(roleId);
        if (isNaN(number)) {
            throw new Error('Invalid number in role ID');
        }
        return number;
    });

    if (!roleId) {
        res.status(401).send({ error: true, message: "Role ID is required as 'role-id' in headers" })
    }
    if (!roleId.includes(61)) {
        res.status(401).send({ error: true, message: "User not authorized to access this api" })
    } else {
        next()
    }
}


export const distAuth = (req: Request, res: Response, next: NextFunction) => {
    const roleIdHeader = req.headers['role-id'];

    if (typeof roleIdHeader !== 'string') {
        return res.status(400).send({ message: 'Invalid role ID format' });
    }

    const roleIdArray: string[] = JSON.parse(roleIdHeader);

    const roleId: number[] = roleIdArray.map(roleId => {
        const number = Number(roleId);
        if (isNaN(number)) {
            throw new Error('Invalid number in role ID');
        }
        return number;
    });

    if (!roleId) {
        res.status(401).send({ error: true, message: "Role ID is required as 'role-id' in headers" })
    }
    if (!roleId.includes(62)) {
        res.status(401).send({ error: true, message: "User not authorized to access this api" })
    } else {
        next()
    }
}
