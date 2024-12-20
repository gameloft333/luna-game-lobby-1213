import { useAuth } from './useAuth';
import { generateInviteCode } from '../lib/utils/inviteCode';

export function useInviteCode() {
  const { user } = useAuth();
  
  const getInviteLink = () => {
    if (!user?.uid) return null;
    
    const inviteCode = generateInviteCode(user.uid);
    const baseUrl = window.location.origin;
    return `${baseUrl}/community?invite=${inviteCode}`;
  };

  return {
    getInviteLink,
    inviteCode: user?.uid ? generateInviteCode(user.uid) : null,
  };
}