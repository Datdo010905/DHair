import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth/AuthContext';
import { getImageUrl } from '@/services/apiClient';
import { saveBookingService } from '../bookingServiceStorage';
import { useServiceDetails } from '../useServiceDetails';

export default function ServiceDetails({ id }: { id: string }) {
  const { service, isLoading, error, reload } = useServiceDetails(id);
  const { user } = useAuth();
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const savingRef = useRef(false);
  const imageUrl = getImageUrl(service?.HINH ?? null);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/search');
  }

  async function handleBookNow() {
    if (!service || savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
    setSaveError('');

    try {
      // Đợi lưu xong để trang đặt lịch luôn đọc được lựa chọn mới nhất.
      await saveBookingService(service);
      if (user) {
        router.dismissTo('/(tabs)/booking');
      } else {
        router.push({ pathname: '/(auth)/login', params: { next: 'booking' } });
      }
    } catch {
      setSaveError('Chưa lưu được dịch vụ. Vui lòng bấm Đặt lịch ngay để thử lại.');
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }

  function renderContent() {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center gap-4">
          <ActivityIndicator size="large" color="#1a3673" />
          <Text className="text-sm text-[#64748b]">Đang tải chi tiết dịch vụ...</Text>
        </View>
      );
    }

    if (error || !service) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={40} color="#8496b0" />
          <Text accessibilityRole="alert" className="mt-4 text-center leading-6 text-[#64748b]">
            {error || 'Không tìm thấy dịch vụ.'}
          </Text>
          <Pressable accessibilityRole="button" onPress={reload} className="mt-5 rounded-full bg-[#1a3673] px-6 py-3">
            <Text className="font-semibold text-white">Thử lại</Text>
          </Pressable>
        </View>
      );
    }

    // Backend lưu các bước quy trình ngăn cách bằng dấu gạch ngang hoặc xuống dòng.
    const steps = (service.QUYTRINH || '').split(/\r?\n|-/).map((step) => step.trim()).filter(Boolean);
    let categoryLabel = 'Dịch vụ';
    if (service.LOAI === 'CT') categoryLabel = 'Dịch vụ tóc';
    if (service.LOAI === 'CSD') categoryLabel = 'Chăm sóc da';

    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View className="overflow-hidden rounded-3xl bg-[#e8eef9]" style={styles.image}>
            {imageUrl && imageUrl !== failedImage ? (
              <Image
                source={{ uri: imageUrl }}
                accessibilityLabel={service.TENDV}
                resizeMode="cover"
                onError={() => setFailedImage(imageUrl)}
                style={styles.image}
              />
            ) : (
              <View className="flex-1 items-center justify-center gap-3">
                <Ionicons name="image-outline" size={48} color="#8496b0" />
                <Text className="text-sm text-[#64748b]">Chưa có ảnh dịch vụ</Text>
              </View>
            )}
          </View>

          <View className="mt-6">
            <Text className="text-xs font-bold uppercase tracking-widest text-[#6780a3]">{categoryLabel}</Text>
            <Text className="mt-2 text-[27px] font-bold leading-9 text-[#172b4d]">{service.TENDV}</Text>
            <View className="mt-4 flex-row flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e1e8f2] bg-white p-4">
              <View>
                <Text className="text-xs text-[#64748b]">Giá dịch vụ</Text>
                <Text className="mt-1 text-2xl font-bold text-[#1a3673]">{Number(service.GIADV).toLocaleString('vi-VN')} đ</Text>
              </View>
              <View className="flex-row items-center gap-2 rounded-full bg-[#edf2fa] px-3 py-2">
                <Ionicons name="time-outline" size={17} color="#1a3673" />
                <Text className="text-sm font-semibold text-[#1a3673]">{service.THOIGIAN} phút</Text>
              </View>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-lg font-bold text-[#172b4d]">Về dịch vụ</Text>
            <Text className="mt-3 text-[15px] leading-7 text-[#64748b]">
              {service.MOTA?.trim() || 'Thông tin mô tả đang được cập nhật.'}
            </Text>
          </View>

          {steps.length > 0 && (
            <View className="mt-6 rounded-2xl bg-white p-5">
              <Text className="mb-4 text-lg font-bold text-[#172b4d]">Quy trình dịch vụ</Text>
              {steps.map((step, index) => (
                <View key={`${index}-${step}`} className="mb-3 flex-row items-start gap-3">
                  <View className="h-7 w-7 items-center justify-center rounded-full bg-[#edf2fa]">
                    <Text className="text-xs font-bold text-[#1a3673]">{index + 1}</Text>
                  </View>
                  <Text className="flex-1 text-sm leading-7 text-[#64748b]">{step}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <View className="border-t border-[#e7ecf3] bg-white px-5 pb-3 pt-4">
          {!!saveError && (
            <Text accessibilityRole="alert" className="mb-3 text-sm leading-5 text-red-600">{saveError}</Text>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isSaving, busy: isSaving }}
            disabled={isSaving}
            onPress={handleBookNow}
            style={({ pressed }) => ({ opacity: pressed || isSaving ? 0.7 : 1 })}
            className="min-h-14 flex-row items-center justify-center gap-3 rounded-2xl bg-[#1a3673] px-4 py-4"
          >
            {isSaving ? <ActivityIndicator color="white" /> : <Ionicons name="calendar-outline" size={21} color="white" />}
            <Text className="text-base font-bold text-white">{isSaving ? 'Đang lưu lựa chọn...' : 'Đặt lịch ngay'}</Text>
          </Pressable>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View className="flex-row items-center gap-3 px-4 py-2">
          <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" onPress={goBack} className="h-11 w-11 items-center justify-center rounded-full bg-white">
            <Ionicons name="arrow-back" size={22} color="#172b4d" />
          </Pressable>
          <Text className="text-base font-bold text-[#172b4d]">Chi tiết dịch vụ</Text>
        </View>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f9fc' },
  container: { flex: 1, width: '100%', maxWidth: 640, alignSelf: 'center' },
  content: { padding: 20, paddingBottom: 28 },
  image: { width: '100%', height: 240 },
});
