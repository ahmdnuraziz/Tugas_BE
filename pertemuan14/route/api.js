
import { Router } from "express";
import StudentController from "../controller/Student_C.js";
import AuthController from "../controller/Auth_C.js";
import Auth_MDW from "../middleware/Auth_MDW.js";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello Express");
});

router.post("/registrasi", AuthController.registrasi);
router.post("/login", AuthController.login);

router.get("/students", Auth_MDW, StudentController.index);
router.post("/students", Auth_MDW, StudentController.store);
router.get("/students/specific", Auth_MDW, StudentController.getSpecific);
router.get("/students?nama=:nama", Auth_MDW, StudentController.getByName);
router.get("/students?jurusan=:jurusan", Auth_MDW, StudentController.getByJurusan);
router.get("/students/:id", Auth_MDW, StudentController.getById);
router.put("/students/:id", Auth_MDW, Auth_MDW, StudentController.update);
router.delete("/students/:id", Auth_MDW, StudentController.destroy);

export default router;