import { Router } from "express";
import {getCategories} from "../controller/categoryController.js";

//GET all categories
const router = Router();

router.get("/", getCategories);

export default router;