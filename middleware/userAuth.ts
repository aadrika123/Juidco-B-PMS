import { Request, Response, NextFunction } from "express"

export const srAuth = (req: Request, res: Response, next: NextFunction) => {
    const roleLabelsHeader = req.headers['role-label'];

    if (typeof roleLabelsHeader !== 'string') {
        return res.status(400).send({ message: 'Invalid role labels format' });
    }

    const roleLabelsArray: string[] = JSON.parse(roleLabelsHeader);

    const label: number[] = roleLabelsArray.map(label => {
        const number = Number(label);
        if (isNaN(number)) {
            throw new Error('Invalid number in role labels');
        }
        return number;
    });

    if (!label) {
        res.status(401).send({ error: true, message: "Role label is required as 'role-label' in headers" })
    }
    if (!label.includes(1)) {
        res.status(401).send({ error: true, message: "User not authorized to access this api" })
    } else {
        next()
    }
}


export const daAuth = (req: Request, res: Response, next: NextFunction) => {
    const roleLabelsHeader = req.headers['role-label'];

    if (typeof roleLabelsHeader !== 'string') {
        return res.status(400).send({ message: 'Invalid role labels format' });
    }

    const roleLabelsArray: string[] = JSON.parse(roleLabelsHeader);

    const label: number[] = roleLabelsArray.map(label => {
        const number = Number(label);
        if (isNaN(number)) {
            throw new Error('Invalid number in role labels');
        }
        return number;
    });

    if (!label) {
        res.status(401).send({ error: true, message: "Role label is required as 'role-label' in headers" })
    }
    if (!label.includes(2)) {
        res.status(401).send({ error: true, message: "User not authorized to access this api" })
    } else {
        next()
    }
}


export const accAuth = (req: Request, res: Response, next: NextFunction) => {
    const roleLabelsHeader = req.headers['role-label'];

    if (typeof roleLabelsHeader !== 'string') {
        return res.status(400).send({ message: 'Invalid role labels format' });
    }

    const roleLabelsArray: string[] = JSON.parse(roleLabelsHeader);

    const label: number[] = roleLabelsArray.map(label => {
        const number = Number(label);
        if (isNaN(number)) {
            throw new Error('Invalid number in role labels');
        }
        return number;
    });

    if (!label) {
        res.status(401).send({ error: true, message: "Role label is required as 'role-label' in headers" })
    }
    if (!label.includes(3)) {
        res.status(401).send({ error: true, message: "User not authorized to access this api" })
    } else {
        next()
    }
}


export const distAuth = (req: Request, res: Response, next: NextFunction) => {
    const roleLabelsHeader = req.headers['role-label'];

    if (typeof roleLabelsHeader !== 'string') {
        return res.status(400).send({ message: 'Invalid role labels format' });
    }

    const roleLabelsArray: string[] = JSON.parse(roleLabelsHeader);

    const label: number[] = roleLabelsArray.map(label => {
        const number = Number(label);
        if (isNaN(number)) {
            throw new Error('Invalid number in role labels');
        }
        return number;
    });

    if (!label) {
        res.status(401).send({ error: true, message: "Role label is required as 'role-label' in headers" })
    }
    if (!label.includes(4)) {
        res.status(401).send({ error: true, message: "User not authorized to access this api" })
    } else {
        next()
    }
}
