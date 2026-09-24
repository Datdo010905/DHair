import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Expo Router tự mở trang này khi đường dẫn không tồn tại.
export default function NotFoundScreen() {
  function handleGoHome() {
    router.replace('/(tabs)/home');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View className="mb-6 h-28 w-28 items-center justify-center rounded-full bg-blue-50">
          <Ionicons name="compass-outline" size={60} color="#1a3673" />
        </View>
        <Text className="text-7xl font-bold text-[#1a3673]">404</Text>
        <Text className="mt-4 text-center text-2xl font-bold text-slate-900">
          Không tìm thấy trang
        </Text>
        <Text className="mt-3 text-center text-base leading-7 text-slate-500">
          Có vẻ bạn đã đi lạc một chút. Trang này không tồn tại hoặc đã được chuyển sang địa chỉ
          khác.
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={handleGoHome}
          className="mt-8 min-h-14 w-full flex-row items-center justify-center gap-3 rounded-2xl bg-[#1a3673] px-6 py-4"
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Ionicons name="home-outline" size={20} color="white" />
          <Text className="text-base font-bold text-white">Về trang chủ</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f9fc' },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    padding: 24,
  },
  pressed: { opacity: 0.8 },
});
