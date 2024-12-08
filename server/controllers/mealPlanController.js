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
        await MealPlan.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Meal Plan removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const filterMealPlans = async (req, res) => {
    try {
        const categories = req.query.categories ? req.query.categories.split(',').map(cat => cat.toLowerCase()) : [];
        const author = req.query.author ? req.query.author : null;

        // Build the search criteria
        const searchCriteria = {};

        if (categories.length > 0) {
            // Case-insensitive regex pattern
            const regexPatterns = categories.map(cat => new RegExp(`^${cat}$`, 'i'));

            searchCriteria.category = { $in: regexPatterns };
        }

        if (author) {
            searchCriteria.createdBy = author;
        }

        // Perform the query with the search criteria
        const mealPlans = await MealPlan.find(searchCriteria).populate('createdBy', 'name').populate({
            path: 'days.breakfast days.lunch days.snacks days.dinner',
            model: 'Recipe'
        });
        res.json(mealPlans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Search meal plans
const searchMealPlans = async (req, res) => {
    try {
        const titleQuery = req.query.title || '';
        const categoryQuery = req.query.categories ? req.query.categories.split(',') : [];

        console.log(`Searching for meal plans with title: ${titleQuery} and categories: ${categoryQuery}`);

        // Build the search criteria
        const searchCriteria = {};

        if (titleQuery) {
            searchCriteria.title = { $regex: titleQuery, $options: 'i' }; // Case-insensitive search by title
        }

        if (categoryQuery.length > 0) {
            searchCriteria.category = { $in: categoryQuery.map(cat => new RegExp(`^${cat}$`, 'i')) };
        }

        // Perform the query with search criteria
        const mealPlans = await MealPlan.find(searchCriteria)
            .populate('createdBy', 'name')
            .populate({
                path: 'days.breakfast days.lunch days.snacks days.dinner',
                model: 'Recipe'
            });

        res.json(mealPlans);
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
    deleteMealPlan,
    searchMealPlans
};
