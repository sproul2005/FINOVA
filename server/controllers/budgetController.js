const Budget = require('../models/Budget');

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
    try {
        const { month, year, category } = req.query;
        const filter = { userId: req.user._id };

        if (month) filter.month = Number(month);
        if (year) filter.year = Number(year);
        if (category) filter.category = category;

        const budgets = await Budget.find(filter).sort({ year: -1, month: -1 });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a budget
// @route   POST /api/budgets
// @access  Private
const addBudget = async (req, res) => {
    const { category, monthlyLimit, month, year } = req.body;

    if (!category || !monthlyLimit || !month || !year) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const existingBudget = await Budget.findOne({
            userId: req.user._id,
            category,
            month: Number(month),
            year: Number(year)
        });

        if (existingBudget) {
            return res.status(400).json({ message: 'Budget already exists for this category in the specified month' });
        }

        const budget = await Budget.create({
            userId: req.user._id,
            category,
            monthlyLimit: Number(monthlyLimit),
            month: Number(month),
            year: Number(year),
        });

        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        if (budget.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedBudget = await Budget.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedBudget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        if (budget.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await budget.deleteOne();
        res.json({ message: 'Budget removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
};
