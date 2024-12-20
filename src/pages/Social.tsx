import { useState, useEffect } from 'react';
import { useSettingsStore } from '../stores/SettingsStore';
import { InviteButton } from '../components/social/InviteButton';
import { Trash2 } from 'lucide-react';
import { deleteDoc, doc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'sonner';

export default function Social() {
  const { testMode } = useSettingsStore();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    // 获取帖子列表
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postList);
    };
    fetchPosts();
  }, []);
  
  const handleDeletePost = async (postId: string) => {
    if (!testMode) return;
    
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(posts.filter(post => post.id !== postId));
      toast.success('帖子已删除');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('删除失败');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            {testMode && (
              <button
                onClick={() => handleDeletePost(post.id)}
                className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                title="删除帖子"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <div className="pr-10"> {/* 为删除按钮留出空间 */}
              <h3 className="text-lg font-medium mb-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{post.content}</p>
            </div>
          </div>
        ))}
      </div>
      <InviteButton testMode={testMode} />
    </div>
  );
} 