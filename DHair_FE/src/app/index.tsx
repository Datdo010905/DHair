import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  function handleExplore() {
    // Thay trang chào mừng bằng trang chủ để nút Back không quay lại đây.
    router.replace('/(tabs)/home');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View className="flex-row items-center gap-2">
          <Ionicons name="cut-outline" size={28} color="#1a3673" />
          <Text className="text-2xl font-bold text-[#1a3673]">DHair</Text>
        </View>

        {/* Hình minh họa bằng icon, không cần tải ảnh từ mạng. */}
        <View className="my-10 items-center rounded-[32px] bg-[#1a3673] px-6 py-12">
          <View className="mb-6 h-28 w-28 items-center justify-center rounded-full bg-white">
            <Ionicons name="cut-outline" size={58} color="#1a3673" />
          </View>
          <Text className="text-center text-xl font-semibold text-white">Phong cách của bạn</Text>
          <Text className="mt-2 text-center text-base text-blue-100">Sự chăm chút của DHair</Text>
        </View>

        <Text className="text-sm font-semibold uppercase tracking-widest text-[#1a3673]">
          Chào mừng đến với DHair
        </Text>
        <Text className="mt-3 text-[32px] font-bold leading-[40px] text-slate-900">
          Một diện mạo mới, một ngày tự tin.
        </Text>
        <Text className="mt-4 text-base leading-7 text-slate-500">
          Khám phá dịch vụ chăm sóc tóc, tìm phong cách yêu thích và đặt lịch với salon ngay trên
          điện thoại của bạn.
        </Text>

        <View className="mt-auto pt-10">
          <Pressable
            accessibilityRole="button"
            onPress={handleExplore}
            className="min-h-14 flex-row items-center justify-center gap-3 rounded-2xl bg-[#1a3673] px-6 py-4"
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text className="text-base font-bold text-white">Khám phá ngay</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </Pressable>
          <Text className="mt-4 text-center text-sm text-slate-500">
            Khám phá tự do, không cần đăng nhập
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// StyleSheet giữ bố cục vùng cuộn; Tailwind định dạng các thành phần bên trong.
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f9fc' },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    padding: 24,
  },
  pressed: { opacity: 0.8 },
});
