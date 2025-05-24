const Blog = require("../models/Blog");

exports.getAllBlog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 5; // Default to 5 items per page
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find().skip(skip).limit(limit),
      Blog.countDocuments()
    ]);

    res.status(200).json({
      blogs,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

exports.getLatestBlog = async (req, res) => {
  try {
    const posts = await Blog.find().limit(5);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

exports.createBlog = async (req, res) => {
  if (!req.body.title || !req.body.content) {
    return res
      .status(500)
      .json({ error: "Please provide all required fields" });
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newPost = new Blog({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    return res.status(201).json(savedPost);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.updateBlog = async (req, res) => {
  if (!req.body.title || !req.body.content || !req.params.id) {
    return res
      .status(500)
      .json({ error: "Please provide all required fields" });
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  try {
    const updatePost = await Blog.findByIdAndUpdate(req.params.id, {
      ...req.body,
      slug,
      userId: req.user.id,
    });
    if (!updatePost) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog updated", blog: updatePost });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
