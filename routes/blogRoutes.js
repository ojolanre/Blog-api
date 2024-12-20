// src/routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware')
const { createBlog,  getPublishedBlogs, getBlogById, getUserBlogs  } = require('../controllers/blogController');

router.use(express.json());
router.post('/', authenticate, createBlog);
router.get('/', getPublishedBlogs);
router.get('/user', authenticate, getUserBlogs)
router.get('/:blogId', getBlogById);

module.exports = router;