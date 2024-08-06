const Recipe = require('../models/Recipes');

exports.createRecipe = async (req, res) => {
    const { title, timeToPrepare, description, ingredients, instructions, category } = req.body;

    try {
        const newRecipe = new Recipe({
            title,
            timeToPrepare,
            description,
            ingredients,
            instructions,
            category,
            createdBy: req.user.id,
        });

        const recipe = await newRecipe.save();
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('createdBy', ['name', 'email']);
        res.json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('createdBy', ['name', 'email']);

        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateRecipe = async (req, res) => {
    const { title, timeToPrepare, description, ingredients, instructions, category } = req.body;

    try {
        let recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }

        // Ensure user owns the recipe
        if (recipe.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        recipe.title = title;
        recipe.timeToPrepare = timeToPrepare;
        recipe.description = description;
        recipe.ingredients = ingredients;
        recipe.instructions = instructions;
        recipe.category = category;

        await recipe.save();
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }

        if (recipe.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Recipe removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.searchRecipes = async (req, res) => {
    try {
        // Extract query parameters
        const nameQuery = req.query.name || '';
        const ingredientsQuery = req.query.ingredients ? req.query.ingredients.split(',') : [];

        console.log(`Searching for recipes with name: ${nameQuery} and ingredients: ${ingredientsQuery}`);

        // Build the search criteria
        const searchCriteria = {};

        if (nameQuery) {
            searchCriteria.title = { $regex: nameQuery, $options: 'i' }; // Case-insensitive search by name
        }

        if (ingredientsQuery.length > 0) {
            searchCriteria.ingredients = { $all: ingredientsQuery.map(ingredient => new RegExp(ingredient, 'i')) };
        }

        // Perform the query with search criteria
        const recipes = await Recipe.find(searchCriteria).populate('createdBy', ['name', 'email']);

        res.json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.filterRecipes = async (req, res) => {
    try {
        // Get the categories from the query parameter and convert them to lowercase
        const categories = req.query.categories ? req.query.categories.split(',').map(cat => cat.toLowerCase()) : [];
        console.log(`Filtering recipes with categories: ${categories}`);

        // Case-insensitive regex pattern
        const regexPatterns = categories.map(cat => new RegExp(`^${cat}$`, 'i'));

        // Perform the query with the regex patterns
        const recipes = await Recipe.find({
            category: { $in: regexPatterns }
        });

        res.json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

