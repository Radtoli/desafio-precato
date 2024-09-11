import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const sequelize = new Sequelize("precato", "postgres", process.env.DB_PASSWORD, {
    host: "localhost",
    dialect: "postgres",
});

export default sequelize;