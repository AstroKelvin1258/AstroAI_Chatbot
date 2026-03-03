import React, { useRef, useEffect } from 'react';
import Header from './Header';
import MessageBubble from './MessageBubble';
import Composer from './Composer';

const ChatWindow = ({
    messages,
    isLoading,
    error,
    onSendMessage,
    onClearChat,
    onToggleSidebar
}) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <main className="chat-window-container">
            <Header onToggleSidebar={onToggleSidebar} />

            <div className="chat-messages-area">
                <div className="messages-list">
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} message={msg} />
                    ))}

                    {isLoading && (
                        <div className="message-wrapper wrapper-assistant">
                            <div className="message-bubble bubble-assistant loading-bubble">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {error && (
                    <div className="error-toast">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {error}
                    </div>
                )}
            </div>

            <div className="chat-actions-bar">
                {messages.length > 1 && (
                    <button className="clear-chat-btn" onClick={onClearChat}>
                        Clear Chat
                    </button>
                )}
            </div>

            <Composer onSendMessage={onSendMessage} isLoading={isLoading} />
        </main>
    );
};

export default ChatWindow;
