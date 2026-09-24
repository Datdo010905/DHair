import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Service } from '@/features/services/types';
import { getImageUrl } from '@/services/apiClient';

interface ServiceSectionProps {
  title: string;
  services: Service[];
  isLoading: boolean;
  error: string | null;
  onReload: () => void;
}

function ServiceImage({ path }: { path: string | null }) {
  const uri = getImageUrl(path);
  const [failedUri, setFailedUri] = useState<string | null>(null);
  if (!uri || uri === failedUri) {
    return (
      <View style={styles.image} className="bg-gray-100 items-center justify-center">
        <Text className="text-gray-500 text-xs">Chưa có ảnh</Text>
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      onError={() => setFailedUri(uri)}
      resizeMode="cover"
      style={styles.image}
    />
  );
}

export default function ServiceSection({
  title,
  services,
  isLoading,
  error,
  onReload,
}: ServiceSectionProps) {
  // Xử lý lần lượt từng trạng thái để tránh nhiều toán tử điều kiện lồng nhau.
  function renderContent() {
    if (isLoading) {
      return (
        <View className="py-6 items-center pr-4">
          <ActivityIndicator color="#1a3673" />
          <Text className="mt-2 text-gray-500">Đang tải dịch vụ...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="pr-4 py-3">
          <Text accessibilityRole="alert" className="text-red-600">
            {error}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={onReload}
            className="mt-3 self-start rounded-lg bg-[#1a3673] px-4 py-2"
          >
            <Text className="text-white font-semibold">Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (services.length === 0) {
      return <Text className="text-gray-500 py-4">Chưa có dịch vụ đang cung cấp.</Text>;
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pr-4">
        {services.map((service) => (
          <View
            key={service.MADV}
            className="mr-4 overflow-hidden rounded-xl bg-white"
            style={styles.card}
          >
            <ServiceImage path={service.HINH} />
            <View className="p-2 items-center">
              <Text className="text-center font-semibold text-[#1a3673] text-sm" numberOfLines={2}>
                {service.TENDV}
              </Text>
              <Text className="mt-1 text-[#1a3673] font-bold text-sm">
                {service.GIADV.toLocaleString('vi-VN')} đ
              </Text>
              <Text className="mt-1 text-gray-500 text-md font-semibold">{service.THOIGIAN} phút</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }

  return (
    <View className="mt-6 pl-4">
      <Text className="text-[#1a3673] font-bold text-lg mb-3 uppercase">{title}</Text>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 150 },
  card: {
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 0,
    borderWidth: 0.5,
    borderColor: '#497fed',
  },
});
