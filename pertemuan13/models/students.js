import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

// model define
const Student = sequelize.define("Student", {
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nim: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jurusan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

try {
    Student.sync().then(() => {
        console.log("The table Student was created");
    });
} catch (error) {
    console.log("Cannot create table: ", error);
}
export default Student;