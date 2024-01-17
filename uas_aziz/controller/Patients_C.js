import Patients_M from '../model/Patients_M.js';
import { Op } from 'sequelize';

class Patients_C {
    async index(req, res) {
        try {
            const { name, address, status, sort, order } = req.query;
            let whereClause = {};
            let orderClause = [];

            // Handle filtering
            if (name) {
                whereClause.name = { [Op.like]: `%${name}%` };
            }

            if (address) {
                whereClause.address = { [Op.like]: `%${address}%` };
            }

            if (status) {
                whereClause.status = status;
            }

            // Handle sorting
            if (sort && order) {
                orderClause = [[sort, order.toUpperCase()]];
            }

            const patients = await Patients_M.findAll({
                where: whereClause,
                order: orderClause,
            });

            const data = {
                message: "Get all patients",
                data: patients,
            };

            res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching patients from the database:", error);
            res.status(500).json({ message: "Error fetching patients", error: error.message });
        }
    }

    async getById(req, res) {
        const { id } = req.params;

        try {
            const patients = await Patients_M.findByPk(id);

            if (patients) {
                const data = {
                    message: `Get patients by ID ${id}`,
                    data: patients,
                };
                res.status(200).json(data);
            } else {
                res.status(404).json({ message: "Patients not found" });
            }
        } catch (error) {
            console.error("Error fetching patients from the database:", error);
            res.status(500).json({ message: "Error fetching patients", error: error.message });
        }
    }

    async store(req, res) {
        try {
            const { name, phone, address, status, in_date_at, out_date_at, timestamp } = req.body;

            // Simple validation
            const requiredFields = ['name', 'phone', 'address', 'status', 'in_date_at', 'out_date_at', 'timestamp'];
            const missingFields = [];

            requiredFields.forEach(field => {
                if (!req.body[field]) {
                    missingFields.push(field);
                }
            });

            if (missingFields.length > 0) {
                return res.status(422).json({
                    message: "Validation Error",
                    errors: `Missing required fields: ${missingFields.join(', ')}`
                });
            }

            const newPatients = await Patients_M.create({ name, phone, address, status, in_date_at, out_date_at, timestamp });

            const data = {
                message: `Added new Patient: ${name}`,
                data: newPatients,
            };

            // respone berhasil respone 201
            res.status(201).json(data);
        } catch (error) {
            console.error("Error adding Patients to the database:", error);

            // cek error validation dari sequelize
            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map(err => ({
                    message: err.message,
                    field: err.path,
                }));
                // status error 422 - validation error
                res.status(422).json({ message: "Validation Error", errors: validationErrors });
            } else {
                // status error 500
                res.status(500).json({ message: "Error adding patient", error: error.message });
            }
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const { name, phone, address, status, out_date_at } = req.body;

        try {
            const [updatedRowsCount] = await Patients_M.update(
                { name, phone, address, status, out_date_at },
                { where: { id } }
            );

            if (updatedRowsCount > 0) {
                const updatedPatients = await Patients_M.findByPk(id);
                const data = {
                    message: `Resource is updated successfully`,
                    data: updatedPatients,
                };
                res.status(200).json(data);
            } else {
                res.status(404).json({ message: "Resource not found" });
            }
        } catch (error) {
            console.error("Error updating patient in the database:", error);
            res.status(500).json({ message: "Error updating patient", error: error.message });
        }
    }

    async destroy(req, res) {
        const { id } = req.params;

        try {
            const patientsToDelete = await Patients_M.findByPk(id);

            if (patientsToDelete) {
                await patientsToDelete.destroy();

                const data = {
                    message: `Deleted patient with ID ${id}`,
                    data: { id: parseInt(id) },
                };
                res.status(200).json(data);
            } else {
                res.status(404).json({ message: "Patient not found for deletion" });
            }
        } catch (error) {
            console.error("Error deleting patient from the database:", error);
            res.status(500).json({ message: "Error deleting patient", error: error.message });
        }
    }

    async getSpecific(req, res) {
        try {
            const { field, value } = req.query;
            if (!field || !value) {
                return res.status(400).json({ message: "Both 'field' and 'value' parameters are required in the query." });
            }

            const patients = await Patients_M.findAll({
                where: {
                    [field]: {
                        [Op.like]: `%${value}%`
                    },
                },
            });

            if (patients.length > 0) {
                const data = {
                    message: `Getting patients with ${field} ${value}`,
                    data: patients,
                };
                return res.status(200).json(data);
            } else {
                return res.status(404).json({ message: "Patients not found" });
            }
        } catch (error) {
            console.error("Error getting specific patients:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const PatientsController = new Patients_C();
export default PatientsController;