const express = require('express');
const router = express.Router();
const { signup, signin } = require('../controllers/userController');

router.use(express.json());

// Route for rendering the signup page
router.get('/signup', (req, res) => {
    res.render('signup');
});

// Route for rendering the signin page
router.get('/signin', (req, res) => {
  res.render('signin');
});

router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;