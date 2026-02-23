import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, IndianRupee, TrendingUp, CreditCard } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        categoryBreakdown: []
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sumRes, transRes] = await Promise.all([
                    api.get('/transactions/summary'),
                    api.get('/transactions')
                ]);
                setSummary(sumRes.data);
                setTransactions(transRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--primary-light)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const pieData = summary.categoryBreakdown.map((item) => ({
        name: item._id,
        value: item.totalAmount
    }));

    const areaData = [...transactions].reverse().map(t => ({
        name: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        amount: t.amount,
    })).slice(-10);

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Financial Overview</h1>
                <button className="btn btn-secondary">
                    <CreditCard size={18} /> Add Method
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Total Balance</div>
                            <div className="stat-value">₹{summary.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '0.75rem' }}>
                            <IndianRupee size={24} />
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center' }}><TrendingUp size={16} style={{ marginRight: '0.25rem' }} /> +4.5%</span> from last month
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Total Income</div>
                            <div className="stat-value" style={{ color: 'var(--success)' }}>+₹{summary.totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: '0.75rem' }}>
                            <ArrowUpRight size={24} />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Total Expenses</div>
                            <div className="stat-value" style={{ color: 'var(--danger)' }}>-₹{summary.totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '0.75rem' }}>
                            <ArrowDownRight size={24} />
                        </div>
                    </div>
                </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                {/* Main Chart */}
                <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Transaction Flow</h2>
                    <div style={{ width: '100%', height: '300px', position: 'relative' }}>
                        {areaData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-light)' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-light)' }} tickFormatter={(val) => `₹${val}`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)', fontWeight: 500, backgroundColor: 'var(--surface-solid)', color: 'var(--text-main)' }}
                                        itemStyle={{ color: 'var(--primary)' }}
                                        formatter={(value) => `₹${value}`}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data available</div>
                        )}
                    </div>
                </div>

                {/* Expenses Pie Chart */}
                <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Expense Breakdown</h2>
                    <div style={{ height: '200px', width: '100%' }}>
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)', fontWeight: 500, backgroundColor: 'var(--surface-solid)', color: 'var(--text-main)' }}
                                        itemStyle={{ color: 'var(--text-main)' }}
                                        formatter={(value) => `₹${value}`}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No expenses recorded.</div>
                        )}
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem', flex: 1, overflowY: 'auto' }}>
                        {pieData.map((item, idx) => (
                            <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS[idx % COLORS.length] }} />
                                    <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{item.name}</span>
                                </div>
                                <span style={{ fontWeight: 600 }}>₹{item.value.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
