"use client";
import { useAuthStore } from '../store/authStore';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';

const LOGOUT = gql`
  mutation Logout($userId: String!) {
    logout(userId: $userId)
  }
`;

export const useLogout = () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const [logoutMutation] = useMutation(LOGOUT);

  const logout = async (userId: string) => {
    try {
      // Виконуємо серверний логаут (очистка cookie і БД)
      await logoutMutation({ variables: { userId } });

      // Очищуємо стан на фронті
      authStore.clearAuth();

      // Редіректимо на головну
      router.replace('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return logout;
};
