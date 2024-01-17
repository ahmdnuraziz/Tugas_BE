// model/Patients.js

import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";

const Patients_M = sequelize.define('patients', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('sembuh', 'meninggal', 'positif'),
        allowNull: false,
    },
    in_date_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    out_date_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.TIME,
        allowNull: false,
    },
});

export default Patients_M;