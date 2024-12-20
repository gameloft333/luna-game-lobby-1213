export default function Earn() {
  const { testMode } = useTestMode(); // 假设你有一个 useTestMode hook

  return (
    <div className="container mx-auto px-4 py-8">
      <TaskCenter testMode={testMode} />
      {/* 其他组件 */}
    </div>
  );
} 