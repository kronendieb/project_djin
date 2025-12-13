import "express-session";

declare module "express-session" {
    interface SessionData{
        verifier?: string;
        access_token?: any;
        refresh_token?: any;
        tokens?: any;
    }
}

export {};
