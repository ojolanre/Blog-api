// src/routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware')
const { createBlog, getPublishedBlogs, getBlogById, updateBlog, deleteBlog, getUserBlogs, renderHomePage,renderCreateBlogPage } = require('../controllers/blogController');

router.use(express.json());
router.post('/', authenticate, createBlog);
router.get('/', renderHomePage);
// router.get('/', getPublishedBlogs);
router.get('/user', authenticate, getUserBlogs)
router.get('/create', authenticate, renderCreateBlogPage);
router.get('/:blogId', getBlogById);
router.patch('/:blogId', authenticate, updateBlog);
router.put('/:blogId', authenticate, updateBlog);
router.delete('/:blogId', authenticate, deleteBlog);

module.exports = router;