import type { Discussion, DiscussionReply } from '../types/social';

// Mock replies for each discussion
export const MOCK_REPLIES: Record<number, DiscussionReply[]> = {
  1: [
    {
      id: 101,
      author: 'CryptoNewbie',
      content: 'Thanks for the tips! Really helped me get started.',
      timestamp: '1h ago',
      likes: 5,
    },
    {
      id: 102,
      author: 'BlockchainPro',
      content: 'Great guide! I would also add that beginners should start with small investments.',
      timestamp: '45m ago',
      likes: 3,
    },
    {
      id: 103,
      author: 'CryptoMaster',
      content: 'Absolutely! Always remember to DYOR (Do Your Own Research).',
      timestamp: '30m ago',
      likes: 7,
    },
  ],
  2: [
    {
      id: 201,
      author: 'TournamentKing',
      content: 'The weekly tournaments are getting more competitive!',
      timestamp: '4h ago',
      likes: 8,
    },
    {
      id: 202,
      author: 'ProGamer123',
      content: 'Anyone want to form a team for next week?',
      timestamp: '2h ago',
      likes: 4,
    },
  ],
  3: [
    {
      id: 301,
      author: 'NFTCollector',
      content: 'The market is really heating up lately.',
      timestamp: '3h ago',
      likes: 6,
    },
    {
      id: 302,
      author: 'ArtLover',
      content: 'What platforms do you recommend for beginners?',
      timestamp: '2h ago',
      likes: 3,
    },
    {
      id: 303,
      author: 'NFTExpert',
      content: 'OpenSea is a good start, but always check the fees!',
      timestamp: '1h ago',
      likes: 9,
    },
  ],
  4: [
    {
      id: 401,
      author: 'RacingFan',
      content: 'The new meta is all about acceleration builds.',
      timestamp: '2h ago',
      likes: 5,
    },
    {
      id: 402,
      author: 'DriftKing',
      content: 'Handling is still important on technical tracks.',
      timestamp: '1h ago',
      likes: 4,
    },
  ],
  5: [
    {
      id: 501,
      author: 'ChessMaster',
      content: 'The AI has really improved in the latest update.',
      timestamp: '1h ago',
      likes: 7,
    },
    {
      id: 502,
      author: 'GrandMaster',
      content: 'Here\'s a tip: focus on controlling the center early game.',
      timestamp: '30m ago',
      likes: 5,
    },
  ],
};

// Update mock discussions with actual reply counts
export const MOCK_DISCUSSIONS: Discussion[] = [
  {
    id: 1,
    title: 'Tips for Crypto Quest beginners',
    author: 'CryptoMaster',
    replies: MOCK_REPLIES[1].length,
    participants: 3,
    lastActive: '2h ago',
  },
  {
    id: 2,
    title: 'Weekly Tournament Strategies',
    author: 'GamePro',
    replies: MOCK_REPLIES[2].length,
    participants: 2,
    lastActive: '5m ago',
  },
  {
    id: 3,
    title: 'NFT Trading Guide',
    author: 'NFTExpert',
    replies: MOCK_REPLIES[3].length,
    participants: 3,
    lastActive: '1h ago',
  },
  {
    id: 4,
    title: 'Best Meta Racer builds for Season 2',
    author: 'SpeedDemon',
    replies: MOCK_REPLIES[4].length,
    participants: 2,
    lastActive: '30m ago',
  },
  {
    id: 5,
    title: 'AI Chess Master: Advanced Tactics',
    author: 'ChessWizard',
    replies: MOCK_REPLIES[5].length,
    participants: 2,
    lastActive: '15m ago',
  },
];