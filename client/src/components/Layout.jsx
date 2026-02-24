import React, { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
                    <h2 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>FINOVA</h2>
                </div>
                <nav style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavLink
                        to="/maind"
                        end
                        className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`}
                        style={({ isActive }) => ({ borderRadius: 0, padding: '1rem 1.5rem', justifyContent: 'flex-start', boxShadow: 'none', color: isActive ? 'white' : 'var(--text-muted)' })}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/maind/transactions"
                        className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`}
                        style={({ isActive }) => ({ borderRadius: 0, padding: '1rem 1.5rem', justifyContent: 'flex-start', boxShadow: 'none', color: isActive ? 'white' : 'var(--text-muted)' })}
                    >
                        Transactions
                    </NavLink>
                    <NavLink
                        to="/maind/budgets"
                        className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`}
                        style={({ isActive }) => ({ borderRadius: 0, padding: '1rem 1.5rem', justifyContent: 'flex-start', boxShadow: 'none', color: isActive ? 'white' : 'var(--text-muted)' })}
                    >
                        Budgets
                    </NavLink>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Topbar */}
                <header className="topbar">
                    <div style={{ fontWeight: 500 }}>
                        Welcome back, {user?.name || 'User'}
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary">
                        Logout
                    </button>
                </header>

                {/* Page Content */}
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
