const Transaction = require('../models/Transaction');

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
    try {
        const { startDate, endDate, category, type } = req.query;

        // Base filter for current user
        const filter = { userId: req.user._id };

        // Apply optional filters
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (category) filter.category = category;
        if (type) filter.type = type;

        const transactions = await Transaction.find(filter).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get transaction summary (dashboard analytics)
// @route   GET /api/transactions/summary
// @access  Private
const getTransactionSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        // Aggregation pipeline for total income, expense, and balance
        const summary = await Transaction.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$type',
                    totalAmount: { $sum: '$amount' }
                }
            }
        ]);

        let totalIncome = 0;
        let totalExpense = 0;

        summary.forEach((item) => {
            if (item._id === 'income') totalIncome = item.totalAmount;
            if (item._id === 'expense') totalExpense = item.totalAmount;
        });

        const balance = totalIncome - totalExpense;

        // Aggregation pipeline for category-wise expense breakdown
        const categoryBreakdown = await Transaction.aggregate([
            { $match: { userId, type: 'expense' } },
            {
                $group: {
                    _id: '$category',
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        res.json({
            totalIncome,
            totalExpense,
            balance,
            categoryBreakdown
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
    const { amount, type, category, description, date } = req.body;

    if (!amount || !type || !category) {
        return res.status(400).json({ message: 'Please provide required fields (amount, type, category)' });
    }

    try {
        const transaction = await Transaction.create({
            userId: req.user._id,
            amount,
            type,
            category,
            description,
            date: date ? new Date(date) : Date.now(),
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Ensure user owns transaction
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Ensure user owns transaction
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await transaction.deleteOne();

        res.json({ message: 'Transaction removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTransactions,
    getTransactionSummary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
};
