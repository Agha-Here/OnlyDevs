import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatWindow } from '../components/chat/ChatWindow';

// You should fetch this from your backend or contex
import { getAllCreators } from '../lib/supabase';

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = React.useState<{ id: string; username: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string>('');

  React.useEffect(() => {
    // Example: show all creators except self
    getAllCreators().then(creators => {
      setUsers(creators
        .filter(c => c.profile && c.profile.id !== user?.id)
        .map(c => ({ id: c.profile!.id, username: c.profile!.username }))
      );
    });
  }, [user]);

  return (
    <div className="flex h-[80vh] bg-dark-900 rounded-xl overflow-hidden shadow-lg">
      <ChatSidebar
        users={users}
        selectedUserId={selectedUserId}
        onSelect={(id, username) => {
          setSelectedUserId(id);
          setSelectedUsername(username);
        }}
      />
      <div className="flex-1">
        {selectedUserId ? (
          <ChatWindow selectedUserId={selectedUserId} selectedUsername={selectedUsername} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a user to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};