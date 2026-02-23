const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        category: {
            type: String,
            required: true,
        },
        monthlyLimit: {
            type: Number,
            required: true,
        },
        month: {
            type: Number,
            required: true, // 1-12
        },
        year: {
            type: Number,
            required: true, // e.g., 2026
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate budgets for the same category in the same month/year per user
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
