import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Student_M = sequelize.define('students', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
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

export default Student_M;