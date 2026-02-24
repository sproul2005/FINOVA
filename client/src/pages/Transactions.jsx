import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { PlusCircle, Trash2, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTransactions = async () => {
        try {
            const { data } = await api.get('/transactions');
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleAddTransaction = async (e) => {
        e.preventDefault();
        try {
            await api.post('/transactions', { amount: Number(amount), type, category, description, date });
            setAmount('');
            setCategory('');
            setDescription('');
            fetchTransactions();
        } catch (error) {
            console.error('Error adding transaction', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await api.delete(`/transactions/${id}`);
                fetchTransactions();
            } catch (error) {
                console.error('Error deleting transaction', error);
            }
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--primary-light)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
    );

    const filteredTransactions = transactions.filter(t =>
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Transaction History</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(450px, 2fr)', gap: '1.5rem', alignItems: 'start' }}>

                {/* Add Transaction Form */}
                <div className="card" style={{ position: 'sticky', top: '90px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '0.75rem' }}>
                            <PlusCircle size={20} />
                        </div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>New Transaction</h2>
                    </div>

                    <form onSubmit={handleAddTransaction}>
                        <div className="form-group" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <label style={{ flex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.5rem', border: `2px solid ${type === 'expense' ? 'var(--danger)' : 'var(--border-color)'}`, backgroundColor: type === 'expense' ? 'var(--danger-bg)' : 'transparent', fontWeight: 500, transition: 'all 0.2s' }}>
                                <input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={(e) => setType(e.target.value)} style={{ display: 'none' }} />
                                <ArrowDownRight size={18} color={type === 'expense' ? 'var(--danger)' : 'var(--text-muted)'} /> Expense
                            </label>
                            <label style={{ flex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.5rem', border: `2px solid ${type === 'income' ? 'var(--success)' : 'var(--border-color)'}`, backgroundColor: type === 'income' ? 'var(--success-bg)' : 'transparent', fontWeight: 500, transition: 'all 0.2s' }}>
                                <input type="radio" name="type" value="income" checked={type === 'income'} onChange={(e) => setType(e.target.value)} style={{ display: 'none' }} />
                                <ArrowUpRight size={18} color={type === 'income' ? 'var(--success)' : 'var(--text-muted)'} /> Income
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Amount</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>₹</div>
                                <input type="number" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required style={{ paddingLeft: '2.5rem', fontSize: '1.25rem', fontWeight: 600 }} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <input type="text" placeholder="e.g. Groceries, Salary" value={category} onChange={(e) => setCategory(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description (Optional)</label>
                            <input type="text" placeholder="Add a note..." value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Save Transaction</button>
                    </form>
                </div>

                {/* Transactions List */}
                <div className="card" style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem', flexShrink: 0 }}>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Recent Records</h2>
                        <div style={{ position: 'relative', width: '250px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '2.5rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', borderRadius: '999px' }}
                            />
                        </div>
                    </div>

                    {filteredTransactions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                            <ReceiptText size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                            <p>No transactions found.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        <th style={{ padding: '1rem', fontWeight: 500 }}>Date</th>
                                        <th style={{ padding: '1rem', fontWeight: 500 }}>Category</th>
                                        <th style={{ padding: '1rem', fontWeight: 500 }}>Description</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 500 }}>Amount</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 500 }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransactions.map(t => (
                                        <tr key={t._id} className="table-row-hover" style={{ borderBottom: '1px solid var(--border-color)', transition: 'all 0.2s' }}>
                                            <td className="table-cell" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="table-cell">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: t.type === 'income' ? 'var(--success)' : 'var(--primary)' }} />
                                                    <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{t.category}</span>
                                                </div>
                                            </td>
                                            <td className="table-cell" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t.description || '-'}</td>
                                            <td className="table-cell" style={{ textAlign: 'right', fontWeight: 700, color: t.type === 'income' ? 'var(--success)' : 'var(--text-main)' }}>
                                                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="table-cell" style={{ textAlign: 'center' }}>
                                                <button onClick={() => handleDelete(t._id)} className="btn btn-ghost" style={{ padding: '0.25rem', color: 'var(--text-light)', minWidth: 'auto', borderRadius: '0.5rem' }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transactions;
