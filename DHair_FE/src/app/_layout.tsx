import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/features/auth/AuthContext';
import '../../global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" hidden={false} />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Trang index là trang chào mừng khi mở app từ đầu. */}
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  );
}
