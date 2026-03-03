import React from 'react';

const HistorySidebar = ({
    sessions,
    currentSessionId,
    onSelectSession,
    onNewChat,
    onDeleteSession,
    isOpen,
    onClose
}) => {
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            <aside className={`history-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>History</h2>
                    <button className="new-chat-btn" onClick={onNewChat}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Chat
                    </button>
                    <button className="close-sidebar-btn" onClick={onClose} aria-label="Close History">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="session-list">
                    {sessions.length === 0 ? (
                        <div className="no-sessions">No previous chats</div>
                    ) : (
                        sessions.map((session) => (
                            <div
                                key={session.id}
                                className={`session-item ${session.id === currentSessionId ? 'active' : ''}`}
                                onClick={() => onSelectSession(session.id)}
                            >
                                <div className="session-info">
                                    <span className="session-title">{session.title}</span>
                                    <span className="session-date">
                                        {new Date(session.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <button
                                    className="delete-session-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteSession(session.id);
                                    }}
                                    title="Delete Chat"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </aside>
        </>
    );
};

export default HistorySidebar;
