const express = require("express");
const courseController = require("../controllers/courseController");
const { courseValidationRules } = require("../middleware/Validator");

const router = express.Router();

router.post("/", hasRole(['admin']), courseValidationRules(), courseController.createCourse);

router.put("/:id", hasRole(['admin']), courseValidationRules(), courseController.updateCourse);

router.get("/courses", courseController.getCourses);

router.get("/courses/:id", courseController.getCourseById);

router.delete("/courses/:id", hasRole(['admin']), courseController.deleteCourse);

module.exports = router;