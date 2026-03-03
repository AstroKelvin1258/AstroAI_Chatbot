import React from 'react';

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';

    // Format timestamp safely
    const timeString = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <div className={`message-wrapper ${isUser ? 'wrapper-user' : 'wrapper-assistant'}`}>
            <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
                {message.text}

                {message.attachmentNote && (
                    <div className="attachment-note">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                        {message.attachmentNote}
                    </div>
                )}

                {timeString && (
                    <span className="message-timestamp">{timeString}</span>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;
