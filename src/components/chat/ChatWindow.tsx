import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChatMessage, fetchMessages, sendMessage, subscribeToMessages } from '../../lib/supabase';

interface ChatWindowProps {
  selectedUserId: string;
  selectedUsername: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUserId, selectedUsername }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchMessages(user.id, selectedUserId)
      .then(setMessages)
      .finally(() => setLoading(false));
    // Subscribe to new messages
    const channel = subscribeToMessages(user.id, selectedUserId, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => { channel.unsubscribe(); };
  }, [user, selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    await sendMessage(user.id, selectedUserId, input.trim());
    setInput('');
  };

  if (!user) return <div className="p-4 text-gray-400">Please log in to chat.</div>;

  return (
    <div className="flex flex-col h-full bg-dark-800 rounded-xl shadow-lg">
      <div className="p-4 border-b border-dark-700 font-bold text-lg text-white">
        Chat with @{selectedUsername}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="text-gray-400">Loading messages...</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`px-4 py-2 rounded-2xl max-w-xs break-words
                ${msg.sender_id === user.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-700 text-gray-200'
                }`}>
                {msg.message}
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 border-t border-dark-700 flex gap-2">
        <input
          className="flex-1 rounded-xl px-4 py-2 bg-dark-900 text-white border border-dark-700 focus:outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message…"
        />
        <button
          type="submit"
          className="bg-secondary-500 hover:bg-secondary-400 text-white px-4 py-2 rounded-xl font-semibold"
        >
          Send
        </button>
      </form>
    </div>
  );
};