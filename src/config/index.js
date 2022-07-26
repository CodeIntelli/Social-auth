import dotenv from "dotenv"
dotenv.config({ path: "./.env" });
// All Config.env Variables will be called here. This will be create just because you dont have to need call all time process.env.variables. Many time this will not working For that reason this will benifical.
export const {
    PORT,
    DB_URL,
    DEBUG_MODE,
    JWT_SECRET,
    JWT_EXPIRE,
    COOKIE_EXPIRE,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    CALLBACK_URL,
} = process.env;
