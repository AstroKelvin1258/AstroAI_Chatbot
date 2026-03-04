import React, { useState } from 'react';
import { Plus, X, Trash2, Edit2, Search, Check } from 'lucide-react';

const HistorySidebar = ({
    sessions,
    currentSessionId,
    onSelectSession,
    onNewChat,
    onDeleteSession,
    onRenameSession,
    searchQuery,
    setSearchQuery,
    isOpen,
    onClose
}) => {
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    const startEditing = (e, session) => {
        e.stopPropagation();
        setEditingId(session.id);
        setEditTitle(session.title);
    };

    const saveEdit = (e, id) => {
        e.stopPropagation();
        onRenameSession(id, editTitle);
        setEditingId(null);
    };

    const handleKeyDown = (e, id) => {
        if (e.key === 'Enter') saveEdit(e, id);
        if (e.key === 'Escape') setEditingId(null);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            <aside className={`history-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>History</h2>
                    <button className="new-chat-btn" onClick={onNewChat}>
                        <Plus size={16} />
                        New Chat
                    </button>
                    <button className="close-sidebar-btn" onClick={onClose} aria-label="Close History">
                        <X size={20} />
                    </button>
                </div>

                <div className="search-bar-container">
                    <div className="search-input-wrapper">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
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
                                    {editingId === session.id ? (
                                        <input
                                            type="text"
                                            className="session-rename-input"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(e, session.id)}
                                            onClick={(e) => e.stopPropagation()}
                                            autoFocus
                                            onBlur={(e) => saveEdit(e, session.id)}
                                        />
                                    ) : (
                                        <span className="session-title">{session.title}</span>
                                    )}
                                    <span className="session-date">
                                        {new Date(session.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="session-actions">
                                    {editingId === session.id ? (
                                        <button className="edit-session-btn" onClick={(e) => saveEdit(e, session.id)}>
                                            <Check size={16} />
                                        </button>
                                    ) : (
                                        <button className="edit-session-btn" onClick={(e) => startEditing(e, session)} title="Rename Chat">
                                            <Edit2 size={16} />
                                        </button>
                                    )}
                                    <button
                                        className="edit-session-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteSession(session.id);
                                        }}
                                        title="Delete Chat"
                                    >
                                        <Trash2 size={16} color="var(--danger-color)" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </aside>
        </>
    );
};

export default HistorySidebar;
