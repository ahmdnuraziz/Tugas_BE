
import { Router } from "express";
import PatientsController from "../controller/Patients_C.js";
import AuthController from "../controller/Auth_C.js";
import Auth_MDW from "../middleware/Auth_MDW.js";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello Express");
});

router.post("/registrasi", AuthController.registrasi);
router.post("/login", AuthController.login);

router.get("/patients", Auth_MDW, PatientsController.index);
router.post("/patients", Auth_MDW, PatientsController.store);
router.get("/patients/specific", Auth_MDW, PatientsController.getSpecific);
router.get("/patients/:id", Auth_MDW, PatientsController.getById);
router.put("/patients/:id", Auth_MDW, PatientsController.update);
router.delete("/patients/:id", Auth_MDW, PatientsController.destroy);

export default router;