import { View, Text } from 'react-native';
import RequireAuth from '@/features/auth/components/RequireAuth';

export default function HistoryScreen() {
  return (
    <RequireAuth>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-bold">Trang Lịch Sử</Text>
      </View>
    </RequireAuth>
  );
}
