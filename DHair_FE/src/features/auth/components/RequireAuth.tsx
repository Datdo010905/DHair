import type { ReactNode } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/features/auth/AuthContext';

// Chặn cả khi bấm tab, mở liên kết trực tiếp hoặc quay lại màn hình cũ.
export default function RequireAuth({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    return <>{children}</>;
}
