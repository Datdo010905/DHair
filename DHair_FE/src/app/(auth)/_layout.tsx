import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: true,
        headerTitle: "Đăng nhập", // Tiêu đề hiện ở thanh header
        headerTintColor: '#1a3673', // Màu của nút back và chữ tiêu đề
      }} 
    >
      <Stack.Screen name="login" options={{ title: 'Đăng nhập' }} />
    </Stack>
  );
}