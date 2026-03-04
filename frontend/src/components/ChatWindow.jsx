import React, { useRef, useEffect } from 'react';
import Header from './Header';
import MessageBubble from './MessageBubble';
import Composer from './Composer';
import { AlertCircle, Trash2 } from 'lucide-react';

const ChatWindow = ({
    messages,
    isLoading,
    error,
    onSendMessage,
    onClearChat,
    onRegenerate,
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
                        <MessageBubble
                            key={index}
                            message={msg}
                            isLast={index === messages.length - 1}
                            onRegenerate={onRegenerate}
                        />
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
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}
            </div>

            <div className="chat-actions-bar">
                {messages.length > 1 && (
                    <button className="clear-chat-btn" onClick={onClearChat} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Trash2 size={14} /> Clear Chat
                    </button>
                )}
            </div>

            <Composer onSendMessage={onSendMessage} isLoading={isLoading} />
        </main>
    );
};

export default ChatWindow;
