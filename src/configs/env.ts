import { config as configEnv } from 'dotenv';
import { str, num, cleanEnv } from 'envalid';

configEnv();

export const envs = cleanEnv(process.env, {
    NODE_ENV: str<NodeEnv>({
        devDefault: 'development',
        choices: ['development', 'test', 'production']
    }),
    JWT_SECRET: str(),
    COOKIE_SECRET: str(),
    CORS_WHITE_LIST: str(),
    BACKEND_URL: str(),
    SMTP_SERVER: str(),
    SMTP_PORT: num(),
    SMTP_USER: str(),
    SMTP_PASSWORD: str()
});

export const CORS_WHITE_LIST = envs.CORS_WHITE_LIST.split(',');
