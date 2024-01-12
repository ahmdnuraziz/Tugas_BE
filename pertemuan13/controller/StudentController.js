import Student from "../models/students.js";
import { Op } from 'sequelize';

const REQUIRED_DATA = ["nama", "nim", "email", "jurusan"];

class StudentController {
  index = async (req, res) => {
    try {
      const students = await Student.findAll();
      res.json({ message: "Menampilkan semua students", data: students });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  async getById(req, res) {
    const { id } = req.params;

    try {
        const student = await Student.findByPk(id);

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
        console.error("Error menampilkan student dari database:", error);
        res.status(500).json({ message: "Error fetching student", error: error.message });
    }
}

  async store(req, res) {
    try {
        const { nama, nim, email, jurusan } = req.body;

        const newStudent = await Student.create({ nama, nim, email, jurusan });

        const data = {
            message: `Menambahkan data student ${nama}`,
            data: newStudent,
        };

        res.json(data);
    } catch (error) {
        console.error("Error menambahkan ke database:", error);

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
        const [updatedRowsCount] = await Student.update(
            { nama, nim, email, jurusan },
            { where: { id } }
        );

        if (updatedRowsCount > 0) {
            const updatedStudent = await Student.findByPk(id);
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
        const studentToDelete = await Student.findByPk(id);

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

        const students = await Student.findAll({
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
}
const students = new StudentController();

export default students;