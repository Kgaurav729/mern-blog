const Blog = require('../models/Blog');
const User = require('../models/User');

exports.getAllBlogs = async (req, res) => {
  try {
    const { category, author } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (author) filter.author = author;

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.createBlog = async (req, res) => {
  const { title, category, content, image } = req.body;

  try {
    const user = await User.findById(req.user); 
    const blog = new Blog({
      title,
      category,
      content,
      image,
      author: user.name,
      userId: user._id
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    if (blog.userId.toString() !== req.user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, {
      ...req.body,
      updatedAt: new Date()
    }, { new: true });

    res.status(200).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.userId.toString() !== req.user) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
