import { Request, Response, NextFunction } from "express"

export const endpointLog = (req: Request, res: Response, next: NextFunction) => {
    console.log("INCOMING\n", req.method, req.url, "\nsession: ", req.sessionID, req.session);
    next();
}
