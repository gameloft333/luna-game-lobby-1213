export function TaskCenter({ testMode = false }: { testMode?: boolean }) {
  const { t } = useTranslation();
  const { updateTokens } = useUserProfile();
  const { state, canClaimTask, claimTask, resetTasks } = useTaskRewards(testMode);
  
  return (
    <div className="space-y-4">
      {/* 标题和测试模式标识 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold dark:text-white">
          {t('taskCenter.title')}
        </h2>
        {testMode && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
            Test Mode
          </span>
        )}
      </div>

      {/* 任务列表 */}
      <div className="space-y-4">
        {/* ... 现有的任务列表代码 ... */}
      </div>

      {/* 测试模式下的重置按钮 - 确保显示在底部 */}
      {testMode && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={resetTasks}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Reset All Tasks
          </button>
        </div>
      )}
    </div>
  );
} 