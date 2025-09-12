"use client";
import { useAuthStore } from '../store/authStore';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { LOGOUT } from '../graphql/mutations/auth/authMutations';

export const useLogout = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const [logoutMutation] = useMutation(LOGOUT);

  const logout = async (userId: string) => {
    try {
      await logoutMutation({ variables: { userId } });

      authStore.clearAuth();

      router.replace('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return logout;
};
