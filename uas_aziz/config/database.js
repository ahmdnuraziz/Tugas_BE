

import { Sequelize } from "sequelize";
import "dotenv/config";

const {
    DATABASE_DB,
    USERNAME_DB,
    PASSWORD_DB,
    HOST_DB,
} = process.env;

const sequelize = new Sequelize({
    database: DATABASE_DB,
    username: USERNAME_DB,
    password: PASSWORD_DB,
    host: HOST_DB,
    dialect: "mysql",
    logging: console.log,
});

const testDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected");
    } catch (error) {
        console.error("Cannot connect to the database:", error);
    }
};

testDatabaseConnection();

export default sequelize;