const express = require("express");
const courseController = require("../controllers/courseController");
const { courseValidationRules } = require("../middleware/Validator");
const { validateCreateCourse } = require("../validations/courseValidator");

const { hasRole } = require("../middleware/Auth");
const router = express.Router();

router.post(
  "/",
  hasRole(["admin"]),
  validateCreateCourse,
  courseController.createCourse
);

router.put(
  "/:id",
  hasRole(["admin"]),
  validateCreateCourse,
  courseController.updateCourse
);

router.get("/courses", courseController.getCourses);
router.get("/publishedcourses", courseController.getPublished);

router.get("/courses/:id", courseController.getCourseById);

router.delete(
  "/courses/:id",
  hasRole(["admin"]),
  courseController.deleteCourse
);

// Search Courses by title or description (GET)
router.get("/courses/search", courseController.searchCourses);

// Sort Courses by Category (GET)
router.get("/courses/by-category", courseController.sortByCategory);

module.exports = router;
