import { useState, useEffect } from 'react';
import './App.css';
import HistorySidebar from './components/HistorySidebar';
import ChatWindow from './components/ChatWindow';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/chat' : 'http://localhost:3001/api/chat');

function App() {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('astroai_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing sessions from localStorage', e);
      }
    }
    return [{
      id: Date.now().toString(),
      title: 'New Chat',
      updatedAt: Date.now(),
      messages: [{ role: 'assistant', text: 'Hello, I am AstroAI by Kelvin. How can I help you today?', timestamp: Date.now() }]
    }];
  });

  const [currentSessionId, setCurrentSessionId] = useState(sessions[0]?.id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('astroai_sessions', JSON.stringify(sessions));
    // Also keep current session correctly set if sessions list empties
    if (sessions.length > 0 && !sessions.find(s => s.id === currentSessionId)) {
      setCurrentSessionId(sessions[0].id);
    }
  }, [sessions, currentSessionId]);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = currentSession?.messages || [];

  const handleNewChat = () => {
    const newSessionId = Date.now().toString();
    const newSession = {
      id: newSessionId,
      title: 'New Chat',
      updatedAt: Date.now(),
      messages: [{ role: 'assistant', text: 'Hello, I am AstroAI by Kelvin. How can I help you today?', timestamp: Date.now() }]
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleSelectSession = (id) => {
    setCurrentSessionId(id);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteSession = (id) => {
    setSessions(prev => {
      const newSessions = prev.filter(s => s.id !== id);
      if (newSessions.length === 0) {
        const newSessionId = Date.now().toString();
        const newSession = {
          id: newSessionId,
          title: 'New Chat',
          updatedAt: Date.now(),
          messages: [{ role: 'assistant', text: 'Hello, I am AstroAI by Kelvin. How can I help you today?', timestamp: Date.now() }]
        };
        setCurrentSessionId(newSessionId);
        return [newSession];
      }
      return newSessions;
    });
  };

  const handleRenameSession = (id, newTitle) => {
    if (!newTitle.trim()) return;
    updateSession(id, { title: newTitle.trim() });
  };

  const handleClearChat = () => {
    if (!currentSessionId) return;
    updateSession(currentSessionId, {
      messages: [{ role: 'assistant', text: 'Hello, I am AstroAI by Kelvin. How can I help you today?', timestamp: Date.now() }]
    });
    setError(null);
  };

  const updateSession = (id, updates) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, ...updates, updatedAt: Date.now() };
      }
      return s;
    }));
  };

  const handleSendMessage = async (text, attachments) => {
    if ((!text.trim() && !attachments.image && !attachments.audio) || isLoading) return;

    setError(null);

    let attachmentNote = '';
    if (attachments.image) attachmentNote += `Attached image: ${attachments.image.name} `;
    if (attachments.audio) attachmentNote += `Attached audio: ${attachments.audio.name}`;

    const newUserMsg = {
      role: 'user',
      text: text.trim(),
      attachmentNote: attachmentNote.trim() || undefined,
      timestamp: Date.now()
    };

    const newMessages = [...messages, newUserMsg];

    let newTitle = currentSession.title;
    if (messages.length === 1 && messages[0].role === 'assistant') {
      const words = text.trim().split(' ').slice(0, 5).join(' ');
      newTitle = words.length > 0 ? words + (text.split(' ').length > 5 ? '...' : '') : 'New Chat';
      if (attachments.image && !text.trim()) newTitle = 'Image shared';
      if (attachments.audio && !text.trim()) newTitle = 'Voice note';
    }

    updateSession(currentSessionId, {
      messages: newMessages,
      title: newTitle
    });

    setIsLoading(true);

    try {
      const formattedMessages = newMessages.map((msg, index) => {
        let content = msg.text || '';
        // If this is the newly added message and it has attachments, append the note
        if (index === newMessages.length - 1 && attachmentNote) {
          content += content ? ` [System Note: User attached - ${attachmentNote}]` : `[System Note: User attached - ${attachmentNote}]`;
        }
        return {
          role: msg.role,
          content: content || 'User sent an attachment.'
        };
      });

      const requestBody = {
        messages: formattedMessages,
      };

      if (attachments.image) {
        requestBody.images = [{ mimeType: attachments.image.mimeType, data: attachments.image.data }];
      }
      if (attachments.audio) {
        requestBody.audio = { mimeType: attachments.audio.mimeType, data: attachments.audio.data };
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const newAssistantMsg = {
        role: 'assistant',
        text: data.reply,
        timestamp: Date.now()
      };

      updateSession(currentSessionId, {
        messages: [...newMessages, newAssistantMsg]
      });

    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (isLoading || messages.length === 0) return;

    // Find last user message
    const lastUserMsgIndex = [...messages].reverse().findIndex(m => m.role === 'user');
    if (lastUserMsgIndex === -1) return; // No user message to regenerate from

    const actualIndex = messages.length - 1 - lastUserMsgIndex;

    // Slice off everything after the last user message
    const newMessages = messages.slice(0, actualIndex + 1);
    updateSession(currentSessionId, { messages: newMessages });

    setIsLoading(true);
    setError(null);
    try {
      const formattedMessages = newMessages.map((msg) => ({
        role: msg.role,
        content: msg.text || msg.content || 'User sent an attachment.'
      }));

      const requestBody = { messages: formattedMessages };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to get response');

      const newAssistantMsg = {
        role: 'assistant',
        text: data.reply,
        timestamp: Date.now()
      };

      updateSession(currentSessionId, {
        messages: [...newMessages, newAssistantMsg]
      });

    } catch (err) {
      console.error('Regenerate error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSessions = sessions.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="app-container">
      <HistorySidebar
        sessions={filteredSessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        error={error}
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        onRegenerate={handleRegenerate}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
}

export default App;
