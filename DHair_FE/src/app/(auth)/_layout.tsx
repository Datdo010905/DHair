import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: true,
        headerTintColor: '#1a3673', // Màu của nút back và chữ tiêu đề
      }} 
    >
      <Stack.Screen name="login" options={{ title: 'Đăng nhập' }} />
      <Stack.Screen name="register" options={{ title: 'Đăng ký' }} />
      <Stack.Screen name="forgot" options={{ title: 'Quên mật khẩu' }} />
    </Stack>
  );
}
