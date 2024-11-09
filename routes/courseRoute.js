const express = require("express");
const courseController = require("../controllers/courseController");
const { courseValidationRules } = require("../middlewares/validator");
const router = express.Router();

router.post("/", courseValidationRules(), courseController.createCourse);

router.put("/:id", courseValidationRules(), courseController.updateCourse);

router.get("/courses", courseController.getCourses);

router.get("/courses/:id", courseController.getCourseById);

router.delete("/courses/:id", courseController.deleteCourse);

module.exports = router;