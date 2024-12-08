const express = require('express');
const { createMealPlan, getMealPlans, getMealPlanById, updateMealPlan, deleteMealPlan, searchMealPlans } = require('../controllers/mealPlanController');
const auth = require('../middlewares/auth');

const router = express.Router();

// POST a new meal plan
router.post('/', auth, createMealPlan);

// GET all meal plans
router.get('/', auth, getMealPlans);

router.get('/search', searchMealPlans);

router.get('/filter', auth, getMealPlans);

// GET a meal plan by ID
router.get('/:id', auth, getMealPlanById);

// PUT (update) a meal plan by ID
router.put('/:id', auth, updateMealPlan);

// DELETE a meal plan by ID
router.delete('/:id', auth, deleteMealPlan);

module.exports = router;
