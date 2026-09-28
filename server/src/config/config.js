import dotenv from 'dotenv'
dotenv.config()

export const config = {
    PORT: process.env.PORT,
    LOCAL_DB_URI: process.env.LOCAL_DB_URI,
    CLOUD_DB_URI: process.env.CLOUD_DB_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
}
