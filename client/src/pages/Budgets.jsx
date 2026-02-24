import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { IndianRupee, Target } from 'lucide-react';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [expenseBreakdown, setExpenseBreakdown] = useState([]);
    const [loading, setLoading] = useState(true);

    const [category, setCategory] = useState('');
    const [monthlyLimit, setMonthlyLimit] = useState('');
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const fetchData = async () => {
        try {
            const [budgetsRes, summaryRes] = await Promise.all([
                api.get(`/budgets?month=${currentMonth}&year=${currentYear}`),
                api.get('/transactions/summary')
            ]);
            setBudgets(budgetsRes.data);
            setExpenseBreakdown(summaryRes.data.categoryBreakdown);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentMonth, currentYear]);

    const handleAddBudget = async (e) => {
        e.preventDefault();
        try {
            await api.post('/budgets', {
                category,
                monthlyLimit: Number(monthlyLimit),
                month: currentMonth,
                year: currentYear
            });
            setCategory('');
            setMonthlyLimit('');
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding budget');
        }
    };

    const handleDeleteBudget = async (id) => {
        if (window.confirm('Delete this budget?')) {
            await api.delete(`/budgets/${id}`);
            fetchData();
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--primary-light)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
    );

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Monthly Budgets <span style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>({monthNames[currentMonth - 1]} {currentYear})</span></h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 2fr)', gap: '1.5rem', alignItems: 'start' }}>

                {/* Add Budget Form */}
                <div className="card" style={{ position: 'sticky', top: '90px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '0.75rem' }}>
                            <Target size={20} />
                        </div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Set Budget Target</h2>
                    </div>

                    <form onSubmit={handleAddBudget}>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <input type="text" placeholder="e.g. Groceries" value={category} onChange={(e) => setCategory(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Monthly Limit</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</div>
                                <input type="number" step="1" placeholder="0.00" value={monthlyLimit} onChange={(e) => setMonthlyLimit(e.target.value)} required style={{ paddingLeft: '2rem' }} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Create Target</button>
                    </form>
                </div>

                {/* Budgets Progress */}
                <div className="card" style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem', flexShrink: 0 }}>Spending vs. Limits</h2>

                    {budgets.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                            <Target size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                            <p>No budgets set for this month.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
                            {budgets.map(b => {
                                const expense = expenseBreakdown.find(exp => exp._id.toLowerCase() === b.category.toLowerCase());
                                const spent = expense ? expense.totalAmount : 0;
                                const limit = b.monthlyLimit;
                                const percentage = Math.min((spent / limit) * 100, 100);
                                const isOverBudget = spent >= limit;
                                const isWarning = percentage > 80 && !isOverBudget;

                                let barColor = 'var(--primary)';
                                if (isOverBudget) barColor = 'var(--danger)';
                                else if (isWarning) barColor = 'var(--warning)';

                                return (
                                    <div key={b._id} style={{ position: 'relative', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
                                            <div>
                                                <h3 style={{ fontWeight: 600, fontSize: '1rem', textTransform: 'capitalize', marginBottom: '0.25rem' }}>{b.category}</h3>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                    {isOverBudget ? 'Over budget by ' : 'Remaining: '}
                                                    <span style={{ fontWeight: 600, color: isOverBudget ? 'var(--danger)' : 'var(--text-main)' }}>
                                                        ₹{Math.abs(limit - spent).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                                <div style={{ fontSize: '0.875rem' }}>
                                                    <span style={{ color: isOverBudget ? 'var(--danger)' : 'var(--text-main)', fontWeight: 600 }}>₹{spent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                    <span style={{ color: 'var(--text-muted)' }}> / ₹{limit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                </div>
                                                <button onClick={() => handleDeleteBudget(b._id)} style={{ color: 'var(--text-light)', fontSize: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--danger)'} onMouseOut={(e) => e.target.style.color = 'var(--text-light)'}>
                                                    Remove Target
                                                </button>
                                            </div>
                                        </div>

                                        {/* Progress Bar Container */}
                                        <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${percentage}%`,
                                                backgroundColor: barColor,
                                                borderRadius: '999px',
                                                transition: 'width 0.5s ease-out, background-color 0.3s ease'
                                            }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Budgets;
