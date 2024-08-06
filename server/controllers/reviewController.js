const Review = require('../models/Review');
const Recipe = require('../models/Recipes');

exports.createReview = async (req, res) => {
    const { recipe, rating, review } = req.body;

    try {
        const newReview = new Review({
            recipe,
            rating,
            review,
            user: req.user.id
        });

        const savedReview = await newReview.save();

        // Optionally update the recipe's average rating here

        res.json(savedReview);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getReviewsForRecipe = async (req, res) => {
    try {
        const reviews = await Review.find({ recipe: req.params.recipeId }).populate('user', ['name', 'email']);
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateReview = async (req, res) => {
    const { rating, review } = req.body;

    try {
        let reviewToUpdate = await Review.findById(req.params.id);

        if (!reviewToUpdate) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        // Ensure user owns the review
        if (reviewToUpdate.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        reviewToUpdate.rating = rating;
        reviewToUpdate.review = review;

        await reviewToUpdate.save();
        res.json(reviewToUpdate);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const reviewToDelete = await Review.findById(req.params.id);

        if (!reviewToDelete) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        // Ensure user owns the review
        if (reviewToDelete.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Review.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Review removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
