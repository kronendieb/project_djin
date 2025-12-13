
import 'dotenv/config';

const app_env = {
    port: `${process.env.PORT}`,
    key: `${process.env.APP_KEY}`,
    secret: `${process.env.APP_SECRET}`,
    client: `${process.env.APP_KEY}@AMER.OAUTHAP`,
    callback_url: `${process.env.APP_CALLBACK_URL}`,
    token_file: `${process.env.APP_TOKEN_NAME}`,
    auth_url: `${process.env.APP_AUTH_URL}`,
    token_url: `${process.env.APP_TOKEN_URL}`,
    session_secret: `${process.env.APP_SESSION_SECRET}`,
}

export default app_env;
