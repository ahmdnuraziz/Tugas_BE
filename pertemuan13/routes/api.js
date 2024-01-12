import express from "express";
import StudentController from "../controller/StudentController.js";

const router = express.Router();

router.route("/students")
  .get(StudentController.index)
  .post(StudentController.store);

  router.route("/students/specific")
    .get(StudentController.getSpecific);

router.route("/students/:id")  
  .get(StudentController.getById)
  .put(StudentController.update)
  .delete(StudentController.destroy);


export default router;
