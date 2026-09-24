import { Ionicons } from '@expo/vector-icons'; // Icon có sẵn trong Expo
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/features/auth/AuthContext';

export default function HomeHeader() {
  const { user, signOut } = useAuth();
  const displayName = user ? user.fullName : 'DHair Mobile';
  const authButtonLabel = user ? 'Đăng xuất' : 'Đăng nhập';
  const authButtonIcon = user ? 'log-out-outline' : 'log-in-outline';

  const handleAuthPress = () => {
    if (user) {
      signOut();
      router.replace('/(tabs)/home');
      return;
    }

    router.push('/(auth)/login');
  };

  return (
    <View className="bg-[#1a3673] pt-1 pb-1 px-4 rounded-b-[15px] flex-row items-center justify-between">
      {/* Cụm Avatar + Thông tin */}
      <View className="flex-1 flex-row items-center gap-3 mr-3">
        <Image
          source={require('../../../../assets/img/userProfile.jpg')}
          resizeMode="cover"
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: 'green',
          }}
        />
        <View className="flex-1">
          <Text className="text-white font-bold text-lg" numberOfLines={1}>{displayName}</Text>
          <Text className="text-gray-300 text-xs">Chưa có hạng thành viên</Text>
        </View>
      </View>

      {/* Đổi nút theo trạng thái đăng nhập hiện tại. */}
      <TouchableOpacity
        onPress={handleAuthPress}
        accessibilityRole="button"
        accessibilityLabel={authButtonLabel}
        className="items-center py-2"
      >
        <Ionicons name={authButtonIcon} size={28} color="white" />
        <Text className="text-white text-xs mt-1">{authButtonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
