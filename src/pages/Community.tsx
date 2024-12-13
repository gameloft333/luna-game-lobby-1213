import React from 'react';
import { MessageSquare, Users, Send } from 'lucide-react';

const discussions = [
  {
    id: 1,
    title: 'Tips for Crypto Quest beginners',
    author: 'CryptoMaster',
    replies: 23,
    participants: 15,
    lastActive: '2h ago',
  },
  {
    id: 2,
    title: 'Weekly Tournament Strategies',
    author: 'GamePro',
    replies: 45,
    participants: 28,
    lastActive: '5m ago',
  },
  {
    id: 3,
    title: 'NFT Trading Guide',
    author: 'NFTExpert',
    replies: 67,
    participants: 34,
    lastActive: '1h ago',
  },
];

export default function Community() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold dark:text-white">Community</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          New Discussion
        </button>
      </div>

      <div className="grid gap-4">
        {discussions.map((discussion) => (
          <div
            key={discussion.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1 dark:text-white">
                  {discussion.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Started by {discussion.author}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {discussion.lastActive}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{discussion.replies} replies</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{discussion.participants} participants</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-20 md:bottom-6 right-6">
        <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700">
          <Send className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}