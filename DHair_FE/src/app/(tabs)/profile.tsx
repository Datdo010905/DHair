import { View, Text } from 'react-native';
import RequireAuth from '@/features/auth/components/RequireAuth';

export default function ProfileScreen() {
  return (
    <RequireAuth>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-bold">Trang Hồ Sơ</Text>
      </View>
    </RequireAuth>
  );
}
