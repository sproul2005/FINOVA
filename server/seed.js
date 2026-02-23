require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing
        await User.deleteMany();
        await Transaction.deleteMany();
        await Budget.deleteMany();

        // Create a default user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // We bypass the pre-save hook by inserting directly if we already hashed, or we can just use create and the hook will hash it.
        // Let's use create!
        const defaultUser = await User.create({
            name: 'Satya Prakash Roul',
            email: 'satyaprakashroul324@gmail.com',
            password: 'Satya@2005', // Will be hashed by pre-save hook
        });

        console.log(`Created user: ${defaultUser.email}`);

        // Create Budgets
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        await Budget.create([
            { userId: defaultUser._id, category: 'Groceries', monthlyLimit: 500, month: currentMonth, year: currentYear },
            { userId: defaultUser._id, category: 'Rent', monthlyLimit: 1500, month: currentMonth, year: currentYear },
            { userId: defaultUser._id, category: 'Transport', monthlyLimit: 200, month: currentMonth, year: currentYear },
            { userId: defaultUser._id, category: 'Entertainment', monthlyLimit: 300, month: currentMonth, year: currentYear },
            { userId: defaultUser._id, category: 'Utilities', monthlyLimit: 150, month: currentMonth, year: currentYear },
        ]);

        // Create Transactions
        const transactions = [];
        const categories = ['Groceries', 'Transport', 'Entertainment', 'Utilities', 'Dining Out'];

        // Income
        transactions.push({
            userId: defaultUser._id,
            amount: 4000,
            type: 'income',
            category: 'Salary',
            description: 'Monthly Salary',
            date: new Date(new Date().setDate(new Date().getDate() - 15)), // 15 days ago
        });

        // Generate random expenses
        for (let i = 0; i < 20; i++) {
            const randomDaysAgo = Math.floor(Math.random() * 28);
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            const randomAmount = Math.floor(Math.random() * 100) + 10;

            transactions.push({
                userId: defaultUser._id,
                amount: randomAmount,
                type: 'expense',
                category: randomCategory,
                description: `Expense for ${randomCategory}`,
                date: new Date(new Date().setDate(new Date().getDate() - randomDaysAgo)),
            });
        }

        await Transaction.insertMany(transactions);

        console.log('Seed data imported successfully!');
        process.exit();

    } catch (error) {
        console.error(`Error with seed data: ${error}`);
        process.exit(1);
    }
};

seedData();
