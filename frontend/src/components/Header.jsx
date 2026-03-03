import React from 'react';

const Header = ({ onToggleSidebar }) => {
    return (
        <header className="chat-header">
            <button
                className="mobile-menu-btn"
                onClick={onToggleSidebar}
                title="Toggle History"
                aria-label="Toggle History"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
            <div className="header-info">
                <h1>AstroAI</h1>
                <span className="subtitle">by Kelvin</span>
            </div>
            <div className="header-spacer"></div>
        </header>
    );
};

export default Header;
