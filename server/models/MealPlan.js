const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1 // Minimum duration of 1 day
    },
    days: [
        {
            day: {
                type: Number,
                required: true
            },
            breakfast: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Recipe'
            }],
            lunch: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Recipe'
            }],
            snacks: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Recipe'
            }],
            dinner: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Recipe'
            }]
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
