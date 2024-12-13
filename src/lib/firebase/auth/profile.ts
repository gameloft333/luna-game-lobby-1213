import { User, updateProfile } from 'firebase/auth';

interface ProfileUpdate {
  displayName?: string;
  photoURL?: string;
}

export const updateUserProfile = async (user: User, update: ProfileUpdate) => {
  try {
    await updateProfile(user, update);
    return { error: null };
  } catch (error: any) {
    console.error('Profile Update Error:', error);
    return { error: 'Failed to update profile' };
  }
};