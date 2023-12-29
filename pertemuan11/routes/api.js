import express from "express";
import StudentController from "../controller/StudentController.js";

const router = express.Router();

router.route("/students")
  .get(StudentController.index)
  .post(StudentController.store);

// router.route("/students/:id")
//   .put(StudentController.update)
//   .delete(StudentController.destroy);

export default router;
