import {Request, Response, NextFunction, Router, RequestHandler} from "express";
import fs from "fs"

/*
const stream = fs.createWriteStream("./data/telemetry.log", {flags: 'a'})

export function wrapRouter(router: Router, mountPath: string){
    return function(req: Request, res: Response, next: NextFunction){
        (req as any)._mountPath = mountPath;
        next();
    }
}

export function fullPathTelemetry() {
    return function (req:Request, res:Response, next:NextFunction){
        const start = Date.now();

        res.on ('finish', () => {
            const duration = Date.now() - start;

            const routePath = 
                (req as any).routPath ?? req.route?.path ?? req.originalUrl;

            const entry = JSON.stringify({
                time: new Date().toISOString(),
                method: req.method,
                route: routePath,
                status: req.statusCode,
                durationMs: duration,
                user: req.ip || null,
            });

            stream.write(entry + "\n");
        })

        next();
    }
}
 * */
