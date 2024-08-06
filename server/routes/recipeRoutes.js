const express = require('express');
const { check } = require('express-validator');
const auth = require('../middlewares/auth');
const {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    filterRecipes
} = require('../controllers/recipeController');

const router = express.Router();

// @route   POST /api/recipes
// @desc    Create a new recipe
// @access  Private (Cook role)
router.post(
    '/',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('timeToPrepare', 'Time to prepare is required').not().isEmpty(),
            check('description', 'Description is required').not().isEmpty(),
            check('ingredients', 'Ingredients are required').isArray().notEmpty(),
            check('instructions', 'Instructions are required').not().isEmpty(),
            check('category', 'At least one category is required').isArray().notEmpty(),
        ],
    ],
    createRecipe
);

// @route   GET /api/recipes
// @desc    Get all recipes
// @access  Public
router.get('/', getAllRecipes);

// Search recipes by name
router.get('/search', searchRecipes);

// Filter recipes by categories
router.get('/filter', filterRecipes);

// @route   GET /api/recipes/:id
// @desc    Get a recipe by ID
// @access  Public
router.get('/:id', getRecipeById);

// @route   PUT /api/recipes/:id
// @desc    Update a recipe
// @access  Private (Cook role)
router.put(
    '/:id',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('timeToPrepare', 'Time to prepare is required').not().isEmpty(),
            check('description', 'Description is required').not().isEmpty(),
            check('ingredients', 'Ingredients are required').isArray().notEmpty(),
            check('instructions', 'Instructions are required').not().isEmpty(),
            check('category', 'At least one category is required').isArray().notEmpty(),
        ],
    ],
    updateRecipe
);

// @route   DELETE /api/recipes/:id
// @desc    Delete a recipe
// @access  Private (Cook role)
router.delete('/:id', auth, deleteRecipe);

module.exports = router;
