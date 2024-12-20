export function InviteRewards({ testMode = false }: { testMode?: boolean }) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user?.uid) return;

    // 在测试模式下，不从数据库读取，使用本地存储
    if (testMode) {
      const savedData = localStorage.getItem('testInviteRewards');
      if (savedData) {
        const { progress, claimed } = JSON.parse(savedData);
        setCurrentProgress(progress);
        setClaimedRewards(claimed);
      }
      return;
    }

    // 正常模式下从数据库读取
    const docRef = doc(db, 'userInvites', user.uid);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setCurrentProgress(doc.data().invitedCount || 0);
        setClaimedRewards(doc.data().claimedRewards || []);
      }
    });

    return () => unsubscribe();
  }, [user?.uid, testMode]);

  // 添加测试用的重置函数
  const handleReset = async () => {
    if (!testMode) return;
    
    setCurrentProgress(0);
    setClaimedRewards([]);
    localStorage.setItem('testInviteRewards', JSON.stringify({
      progress: 0,
      claimed: []
    }));
  };

  // 添加测试用的增加邀请数函数
  const handleAddInvite = (count: number) => {
    if (!testMode) return;
    
    setCurrentProgress(prev => prev + count);
    localStorage.setItem('testInviteRewards', JSON.stringify({
      progress: currentProgress + count,
      claimed: claimedRewards
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold dark:text-white">
          {t('social.inviteRewards')}
        </h2>
        {testMode && (
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              Test Mode
            </span>
            <button
              onClick={() => handleAddInvite(1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              +1 邀请
            </button>
            <button
              onClick={() => handleAddInvite(5)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              +5 邀请
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              重置
            </button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="mb-6">
          <p className="text-lg font-medium dark:text-white">
            {t('social.invitedCount', { count: currentProgress })}
          </p>
        </div>
        
        <InviteRewardsList
          currentProgress={currentProgress}
          claimedRewards={claimedRewards}
          setClaimedRewards={setClaimedRewards}
          testMode={testMode}
          onAddInvite={handleAddInvite}
          onReset={handleReset}
        />
      </div>
    </div>
  );
} 