const Blog = require('../models/blogModel');
const User = require('../models/userModel');

const createBlog = async (req, res) => {
try {
     const { title, description, tags, body } = req.body;
     // get the user from req.user(set in the auth middleware)
     const author = req.user.userId
     // Calculate reading time (example: words per 200 words per minute)
     const wordCount = body.trim().split(/\s+/).length;
     const readingTime = Math.ceil(wordCount / 200);

 const newBlog = new Blog({
        title,
        description,
        tags,
        body,
        author,
       reading_time: readingTime,
     });

     await newBlog.save();

     res.status(201).json(newBlog);
     } catch (error) {
     res.status(500).json({ message: 'Error creating blog', error: error.message });
     }
   };


const getPublishedBlogs = async (req, res) => {
   try {
     const { state, page=1, pageSize = 20, author, title, tags, orderBy = 'timestamp' } = req.query;
     const pageNumber = parseInt(page)
     const limit = parseInt(pageSize)
     const skip = (pageNumber - 1) * limit

     const query = {
       ...(state && { state }), // if state exists, add it to the query object
       ...(author && { author: { $regex: author, $options: 'i' } }), // search author
       ...(title && { title: { $regex: title, $options: 'i' } }), // search title
       ...(tags && { tags: { $in: Array.isArray(tags) ? tags : [tags] } }), // search tags
      };
      const sortOptions = {};
     if (orderBy) {
        sortOptions[orderBy] =  orderBy === 'timestamp' ? -1 : 1; // -1 descending, 1 ascending
     }

       const blogs = await Blog.find(query)
           .sort(sortOptions)
           .skip(skip)
          .limit(limit)
          .populate({
              path: 'author',
              select: 'first_name last_name email',
           });
       res.status(200).json(blogs);
      } catch (error) {
         res.status(500).json({ message: 'Error getting blogs', error: error.message });
    }
 };

 const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId).populate({
            path: 'author',
            select: 'first_name last_name email',
        });;
          if (!blog) {
             return res.status(404).json({ message: 'Blog not found' });
          }
       blog.read_count += 1; // Increment read count
       await blog.save();
     res.status(200).json(blog);
      } catch (error) {
         res.status(500).json({ message: 'Error getting blog', error: error.message });
     }
 };

const getUserBlogs = async (req, res) => {
     try{
       const author = req.user.userId; //get user id from auth middleware
       const blogs = await Blog.find({author});
      res.status(200).json(blogs);
     }catch (error){
      res.status(500).json({message: "Error getting user's blog", error: error.message})
     }
 };

 const updateBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { title, description, tags, body, state } = req.body;
        const userId = req.user.userId; // get id from authentication middleware
        const blog = await Blog.findById(blogId);
         if (!blog) {
           return res.status(404).json({ message: 'Blog not found' });
        }
       if (blog.author.toString() !== userId){
           return res.status(403).json({message: "You do not have permissions to perform this operation"})
        }
        if (state && blog.author.toString() !== userId){
            return res.status(403).json({message: "You do not have permissions to update the state of the blog post"})
        }

        // Update blog with new data
        blog.title = title ?? blog.title
        blog.description = description ?? blog.description
        blog.tags = tags ?? blog.tags
         blog.body = body ?? blog.body
        blog.state = state ?? blog.state
          await blog.save()

        res.status(200).json({message: 'Blog updated successfully', blog});
    } catch (error) {
       res.status(500).json({ message: 'Error updating blog', error: error.message });
     }
};

const deleteBlog = async (req, res) => {
    try {
          const { blogId } = req.params;
        const userId = req.user.userId; // get id from authentication middleware
         const blog = await Blog.findById(blogId);
         if (!blog) {
             return res.status(404).json({ message: 'Blog not found' });
         }
        if (blog.author.toString() !== userId){
          return res.status(403).json({message: "You do not have permissions to perform this operation"})
         }
        await Blog.findByIdAndDelete(blogId);

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog', error: error.message });
    }
};

module.exports = {
    createBlog,
    getPublishedBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    getUserBlogs
};
