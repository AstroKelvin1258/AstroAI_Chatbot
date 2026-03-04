import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Paperclip, RefreshCw } from 'lucide-react';

const MessageBubble = ({ message, isLast, onRegenerate }) => {
    const isUser = message.role === 'user';
    const [copied, setCopied] = useState(false);

    // Format timestamp safely
    const timeString = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(message.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`message-wrapper ${isUser ? 'wrapper-user' : 'wrapper-assistant'}`}>
            <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
                {isUser ? (
                    <div style={{ whiteSpace: 'pre-wrap' }}>{message.text}</div>
                ) : (
                    <ReactMarkdown
                        className="markdown-body"
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{ margin: 0, borderRadius: '8px', background: 'transparent' }}
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        }}
                    >
                        {message.text}
                    </ReactMarkdown>
                )}

                {message.attachmentNote && (
                    <div className="attachment-note">
                        <Paperclip size={14} />
                        {message.attachmentNote}
                    </div>
                )}

                <div className="message-actions" style={{ justifyContent: isUser ? 'flex-end' : 'space-between' }}>
                    {timeString && (
                        <span className="message-timestamp" style={{ margin: 0, alignSelf: 'center' }}>{timeString}</span>
                    )}

                    {!isUser && (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="action-btn-sm" onClick={handleCopy} title="Copy Message">
                                {copied ? <Check size={14} color="var(--success-color)" /> : <Copy size={14} />}
                            </button>
                            {isLast && onRegenerate && (
                                <button className="action-btn-sm" onClick={onRegenerate} title="Regenerate Response">
                                    <RefreshCw size={14} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
