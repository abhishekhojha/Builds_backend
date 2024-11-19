const { validationResult } = require("express-validator");
const Course = require("../models/Course");

// Create a new course with validation
exports.createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate(
      "teachers students categoriesIds"
    );
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single course by ID with validation
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "teachers students categoriesIds"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a course by ID with validation
exports.updateCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("teachers students categoriesIds");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Search course 
exports.searchCourses = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    // Validate the search term: it should be a string and at least 3 characters long
    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length < 3) {
      return res.status(400).json({ error: 'Invalid search term. It must be a string with at least 3 characters.' });
    }

    // Prepare the search query
    const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search
    const query = {
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } }
      ]
    };

    // Fetch courses matching the query
    const courses = await Course.find(query)
      .populate('categoriesIds') // Populate category details if needed
      .populate('teachers') // Populate teachers details if needed
      .sort({ createdAt: -1 }); // Sort by creation date

    // Return the courses found
    return res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while searching for courses.' });
  }
};

// Courses by category
exports.sortByCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;

    // Validate categoryId: ensure it's a valid ObjectId
    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID.' });
    }

    // Create query object to filter by category
    const query = { categoriesIds: mongoose.Types.ObjectId(categoryId) };

    // Fetch courses filtered by category
    const courses = await Course.find(query)
      .populate('categoriesIds') // Populate category details if needed
      .populate('teachers') // Populate teachers details if needed
      .sort({ createdAt: -1 }); // Sort by creation date

    // Return the filtered courses
    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching courses by category.' });
  }
};

// Delete a course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
