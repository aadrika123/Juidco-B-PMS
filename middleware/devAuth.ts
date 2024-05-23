import { Request, Response, NextFunction } from "express"

const devAuth = (req: Request, res: Response, next: NextFunction) => {
    const { devPassword }: { devPassword: string } = req?.body
    const correctPassword = process.env.DEV_PASS
    if (!devPassword) {
        res.send("Dev Password is required as 'devPassword'")
    }
    if (devPassword !== correctPassword) {
        res.send("Dev Password is incorrect")
    } else {
        next()
    }
}

export default devAuth