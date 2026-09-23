import { Ionicons } from '@expo/vector-icons'; // Icon có sẵn trong Expo
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

export default function HomeHeader() {
  return (
    // bg-[#1a3673] là mã màu xanh tương tự ảnh
    <View className="bg-[#1a3673] pt-12 pb-6 px-4 rounded-b-[30px] flex-row items-center justify-between">
      {/* Cụm Avatar + Thông tin */}
      <View className="flex-row items-center gap-3">
        <Image
          source={require('../../../../assets/img/userProfile.jpg')}
          resizeMode="cover"
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: 'white',
          }}
        />
        <View>
          <Text className="text-white font-bold text-lg">DHair Mobile</Text>
          <Text className="text-gray-300 text-xs">Chưa có hạng thành viên</Text>
        </View>
      </View>

      {/* nút đăng nhập */}
      <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
        <Ionicons name="log-in-outline" size={28} color="white"/>
      </TouchableOpacity>
    </View>
  );
}