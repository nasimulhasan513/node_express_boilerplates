import dotenv from "dotenv";

dotenv.config();

export const { DB_URL, DEBUG_MODE, JWT_SECRET } = process.env;
