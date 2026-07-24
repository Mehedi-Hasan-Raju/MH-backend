import express from "express";
import {
  postEducation,
  deleteEducation,
  getAllEducations,
} from "../controller/educationController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", isAuthenticated, postEducation);
router.delete("/delete/:id", isAuthenticated, deleteEducation);
router.get("/getall", getAllEducations);

export default router;