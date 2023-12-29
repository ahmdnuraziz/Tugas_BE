import Student from "../models/students.js";

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

  store = async (req, res) => {
    try {
      const { nama, nim, email, jurusan } = req.body;
      const missingFields = REQUIRED_DATA.filter((el) => !req.body[el]);

      if (missingFields.length > 0) {
        throw new Error(`Field ${missingFields.join(",")} harus diisi`);
      }

      const newStudent = await Student.create({ nama, nim, email, jurusan });

      res.json({
        message: 'Menambahkan data student',
        data: newStudent,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
const students = new StudentController();

export default students;