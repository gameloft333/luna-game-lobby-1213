import React from 'react';
import { UserPlus, Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useInviteCode } from '../../hooks/useInviteCode';
import { InviteRewardsList } from './InviteRewards/InviteRewardsList';

interface InviteButtonProps {
  className?: string;
  testMode?: boolean;
}

export function InviteButton({ className, testMode = false }: InviteButtonProps) {
  const { getInviteLink, inviteCode } = useInviteCode();
  const [copied, setCopied] = React.useState(false);
  const [currentProgress, setCurrentProgress] = React.useState(0);
  const [claimedRewards, setClaimedRewards] = React.useState<string[]>([]);

  const handleAddInvite = (count: number) => {
    if (!testMode) return;
    setCurrentProgress(prev => prev + count);
  };

  const handleReset = () => {
    if (!testMode) return;
    setCurrentProgress(0);
    setClaimedRewards([]);
  };

  const handleInvite = async () => {
    const inviteLink = getInviteLink();
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy invite link:', err);
    }
  };

  if (!inviteCode) return null;

  return (
    <>
      <InviteRewardsList
        currentProgress={currentProgress}
        claimedRewards={claimedRewards}
        setClaimedRewards={setClaimedRewards}
        testMode={testMode}
        onAddInvite={handleAddInvite}
        onReset={handleReset}
      />
      <button
        onClick={handleInvite}
        className={cn(
          "w-full px-4 py-3",
          "bg-blue-500 hover:bg-blue-600",
          "text-white font-medium",
          "flex items-center justify-center gap-2",
          "transition-all duration-200",
          "fixed bottom-20 md:bottom-6 left-0",
          "shadow-lg backdrop-blur-md",
          className
        )}
      >
        {copied ? (
          <>
            <Check className="w-5 h-5" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5" />
            <span>Invite Friends</span>
            <span className="text-blue-200 ml-2">({inviteCode})</span>
            <Copy className="w-4 h-4 ml-1" />
          </>
        )}
      </button>
    </>
  );
}