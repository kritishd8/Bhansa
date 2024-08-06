const express = require('express');
const { check } = require('express-validator');
const auth = require('../middlewares/auth');
const {
    createReview,
    getReviewsForRecipe,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post(
    '/',
    [
        auth,
        [
            check('recipe', 'Recipe ID is required').not().isEmpty(),
            check('rating', 'Rating is required').isInt({ min: 1, max: 5 }),
            check('review', 'Review text is required').not().isEmpty()
        ],
    ],
    createReview
);

// @route   GET /api/reviews/:recipeId
// @desc    Get all reviews for a recipe
// @access  Public
router.get('/:recipeId', getReviewsForRecipe);

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put(
    '/:id',
    [
        auth,
        [
            check('rating', 'Rating is required').isInt({ min: 1, max: 5 }),
            check('review', 'Review text is required').not().isEmpty()
        ],
    ],
    updateReview
);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, deleteReview);

module.exports = router;
