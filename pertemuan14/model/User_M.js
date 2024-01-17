// models/User.js

import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const User_M = sequelize.define("users", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

(async () => {
    try {
        await User_M.sync();
        console.log("User table created successfully");
    } catch (error) {
        console.error("Unable to create table:", error);
    }
})();

export default User_M;