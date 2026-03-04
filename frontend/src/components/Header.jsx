import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ onToggleSidebar }) => {
    return (
        <header className="chat-header">
            <button
                className="mobile-menu-btn"
                onClick={onToggleSidebar}
                title="Toggle History"
                aria-label="Toggle History"
            >
                <Menu size={24} />
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
