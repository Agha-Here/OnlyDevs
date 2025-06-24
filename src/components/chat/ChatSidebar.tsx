import React from 'react';

interface ChatSidebarProps {
  users: { id: string; username: string }[];
  selectedUserId: string | null;
  onSelect: (id: string, username: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ users, selectedUserId, onSelect }) => (
  <div className="w-64 bg-dark-900 border-r border-dark-700 h-full flex flex-col">
    <div className="p-4 font-bold text-lg text-white border-b border-dark-700">Chats</div>
    <div className="flex-1 overflow-y-auto">
      {users.map(u => (
        <button
          key={u.id}
          className={`w-full text-left px-4 py-3 hover:bg-dark-700 transition
            ${selectedUserId === u.id ? 'bg-dark-700 text-primary-400' : 'text-white'}`}
          onClick={() => onSelect(u.id, u.username)}
        >
          @{u.username}
        </button>
      ))}
    </div>
  </div>
);