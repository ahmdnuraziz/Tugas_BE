
import Student_M from '../model/Student_M.js';
import { Op } from 'sequelize';

class Student_C {
    async index(req, res) {
        try {
            const { sort, order } = req.query;
            let students;

            if (sort && order) {
                const validSortColumns = ['nama', 'jurusan'];

                if (!validSortColumns.includes(sort)) {
                    return res.status(400).json({ message: "Invalid 'sort' column." });
                }

                students = await Student_M.findAll({
                    order: [[sort, order.toUpperCase()]],
                });
            } else {
                students = await Student_M.findAll();
            }

            const data = {
                message: "Get all students",
                data: students,
            };

            res.json(data);
        } catch (error) {
            console.error("Error fetching students from the database:", error);
            res.status(500).json({ message: "Error fetching students", error: error.message });
        }
    }

    async getById(req, res) {
        const { id } = req.params;

        try {
            const student = await Student_M.findByPk(id);

            if (student) {
                const data = {
                    message: `Get student by ID ${id}`,
                    data: student,
                };
                res.json(data);
            } else {
                res.status(404).json({ message: "Student not found" });
            }
        } catch (error) {
            console.error("Error fetching student from the database:", error);
            res.status(500).json({ message: "Error fetching student", error: error.message });
        }
    }

    async store(req, res) {
        try {
            const { nama, nim, email, jurusan } = req.body;

            if (!nama || !nim || !email || !jurusan) {
                const data = {
                    message: "All fields are required",
                }
                return res.status(400).json(data);
            }

            const newStudent = await Student_M.create({ nama, nim, email, jurusan });
            const data = {
                message: `Menambahkan data student ${nama}`,
                data: newStudent,
            };

            res.json(data);
        } catch (error) {
            console.error("Error adding student to the database:", error);

            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map(err => ({
                    message: err.message,
                    field: err.path,
                }));
                res.status(422).json({ message: "Validation Error", errors: validationErrors });
            } else {
                res.status(500).json({ message: "Error adding student", error: error.message });
            }
        }
    }

    async update(req, res) {
        const { id } = req.params;
        const { nama, nim, email, jurusan } = req.body;

        try {
            const [updatedRowsCount] = await Student_M.update(
                { nama, nim, email, jurusan },
                { where: { id } }
            );

            if (updatedRowsCount > 0) {
                const updatedStudent = await Student_M.findByPk(id);
                const data = {
                    message: `Mengupdate data student id ${id} dengan nama ${nama}`,
                    data: updatedStudent,
                };
                res.json(data);
            } else {
                res.status(404).json({ message: "Student not found for update" });
            }
        } catch (error) {
            console.error("Error updating student in the database:", error);
            res.status(500).json({ message: "Error updating student", error: error.message });
        }
    }

    async destroy(req, res) {
        const { id } = req.params;

        try {
            const studentToDelete = await Student_M.findByPk(id);

            if (studentToDelete) {
                await studentToDelete.destroy();

                const data = {
                    message: `Menghapus data student id ${id}`,
                    data: { id: parseInt(id) },
                };
                res.json(data);
            } else {
                res.status(404).json({ message: "Student not found for deletion" });
            }
        } catch (error) {
            console.error("Error deleting student from the database:", error);
            res.status(500).json({ message: "Error deleting student", error: error.message });
        }
    }
    async getSpecific(req, res) {
        try {
            const { field, value } = req.query;
            if (!field || !value) {
                return res.status(400).json({ message: "Both 'field' and 'value' parameters are required in the query." });
            }

            const students = await Student_M.findAll({
                where: {
                    [field]: {
                        [Op.like]: `%${value}%`
                    },
                },
            });

            if (students.length > 0) {
                const data = {
                    message: `Getting students with ${field} ${value}`,
                    data: students,
                };
                return res.json(data);
            } else {
                return res.status(404).json({ message: "Students not found" });
            }
        } catch (error) {
            console.error("Error getting specific students:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async getByName(req, res) {
        try {
            const { nama } = req.params;

            if (!nama) {
                return res.status(400).json({ message: "The 'nama' parameter is required in the URL." });
            }

            const students = await Student_M.findAll({
                where: {
                    nama: {
                        [Op.like]: `%${nama}%`
                    },
                },
            });

            if (students.length > 0) {
                const data = {
                    message: `Getting students with name ${nama}`,
                    data: students,
                };
                return res.json(data);
            } else {
                return res.status(404).json({ message: "Students not found" });
            }
        } catch (error) {
            console.error("Error getting students by name:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async getByJurusan(req, res) {
        try {
            const { jurusan } = req.params;

            if (!jurusan) {
                return res.status(400).json({ message: "The 'jurusan' parameter is required in the URL." });
            }

            const students = await Student_M.findAll({
                where: {
                    jurusan: {
                        [Op.like]: `%${jurusan}%`
                    },
                },
            });

            if (students.length > 0) {
                const data = {
                    message: `Getting students with jurusan ${jurusan}`,
                    data: students,
                };
                return res.json(data);
            } else {
                return res.status(404).json({ message: "Students not found" });
            }
        } catch (error) {
            console.error("Error getting students by jurusan:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const StudentController = new Student_C();
export default StudentController;