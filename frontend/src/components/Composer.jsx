import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Image as ImageIcon, Music, X } from 'lucide-react';

const Composer = ({ onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const [attachments, setAttachments] = useState({ image: null, audio: null });
    const fileInputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const base64Data = await fileToBase64(file);
            const isImage = file.type.startsWith('image/');

            setAttachments(prev => ({
                ...prev,
                [isImage ? 'image' : 'audio']: {
                    mimeType: file.type,
                    data: base64Data,
                    name: file.name
                }
            }));
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Failed to read file');
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSend = () => {
        const textIsNotEmpty = input.trim().length > 0;
        const hasAttachments = attachments.image || attachments.audio;

        if ((!textIsNotEmpty && !hasAttachments) || isLoading) return;

        onSendMessage(input.trim(), attachments);

        setInput('');
        setAttachments({ image: null, audio: null });
    };

    const removeAttachment = (type) => {
        setAttachments(prev => ({ ...prev, [type]: null }));
    };

    return (
        <footer className="composer-area">
            {(attachments.image || attachments.audio) && (
                <div className="attachments-preview">
                    {attachments.image && (
                        <div className="attachment-chip">
                            <ImageIcon size={14} className="chip-icon" />
                            <span className="chip-name">{attachments.image.name}</span>
                            <button
                                className="chip-remove"
                                onClick={() => removeAttachment('image')}
                                aria-label="Remove image"
                            ><X size={14} /></button>
                        </div>
                    )}
                    {attachments.audio && (
                        <div className="attachment-chip">
                            <Music size={14} className="chip-icon" />
                            <span className="chip-name">{attachments.audio.name}</span>
                            <button
                                className="chip-remove"
                                onClick={() => removeAttachment('audio')}
                                aria-label="Remove audio"
                            ><X size={14} /></button>
                        </div>
                    )}
                </div>
            )}

            <div className="input-container">
                <button
                    className="attach-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    title="Attach file"
                >
                    <Paperclip size={18} />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept="image/png, image/jpeg, image/webp, audio/mp3, audio/wav, audio/m4a"
                />

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message AstroAI..."
                    rows="1"
                    disabled={isLoading}
                />
                <button
                    className={`send-btn ${(input.trim() || attachments.image || attachments.audio) ? 'active' : ''}`}
                    onClick={handleSend}
                    disabled={(!input.trim() && !attachments.image && !attachments.audio) || isLoading}
                >
                    <Send size={16} />
                </button>
            </div>
            <p className="footer-hint">AI can make mistakes. Consider verifying important information.</p>
        </footer>
    );
};

export default Composer;
