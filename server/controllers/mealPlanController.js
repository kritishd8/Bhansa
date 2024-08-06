const MealPlan = require('../models/MealPlan');
const Recipe = require('../models/Recipes');

// Create a new meal plan
const createMealPlan = async (req, res) => {
    try {
        const mealPlan = new MealPlan({
            ...req.body,
            createdBy: req.user.id
        });
        await mealPlan.save();
        res.status(201).json(mealPlan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all meal plans
const getMealPlans = async (req, res) => {
    try {
        const mealPlans = await MealPlan.find().populate('createdBy', 'name').populate({
            path: 'days.breakfast days.lunch days.snacks days.dinner',
            model: 'Recipe'
        });
        res.json(mealPlans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get a meal plan by ID
const getMealPlanById = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id).populate('createdBy', 'name').populate({
            path: 'days.breakfast days.lunch days.snacks days.dinner',
            model: 'Recipe'
        });
        if (!mealPlan) {
            return res.status(404).json({ msg: 'Meal Plan not found' });
        }
        res.json(mealPlan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update a meal plan by ID
const updateMealPlan = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id);
        if (!mealPlan) {
            return res.status(404).json({ msg: 'Meal Plan not found' });
        }
        if (mealPlan.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        const updatedMealPlan = await MealPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMealPlan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete a meal plan by ID
const deleteMealPlan = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id);
        if (!mealPlan) {
            return res.status(404).json({ msg: 'Meal Plan not found' });
        }
        if (mealPlan.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await mealPlan.remove();
        res.json({ msg: 'Meal Plan removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    createMealPlan,
    getMealPlans,
    getMealPlanById,
    updateMealPlan,
    deleteMealPlan
};
