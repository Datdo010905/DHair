import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { getImageUrl } from '@/services/apiClient';
import type { Service } from '../types';

export default function ServiceSearchCard({ service }: { service: Service }) {
  const imageUrl = getImageUrl(service.HINH);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = imageUrl && imageUrl !== failedUrl;
  let categoryLabel = 'Dịch vụ';
  if (service.LOAI === 'CT') categoryLabel = 'Dịch vụ tóc';
  if (service.LOAI === 'CSD') categoryLabel = 'Chăm sóc da';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Xem chi tiết ${service.TENDV}`}
      onPress={() => router.push({ pathname: '/services/[id]', params: { id: service.MADV } })}
      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
      className="mb-3 flex-row rounded-2xl border border-[#e7ecf3] bg-white p-3"
    >
      <View className="h-28 w-24 overflow-hidden rounded-xl bg-[#edf2fa]">
        {showImage ? (
          <Image
            source={{ uri: imageUrl }}
            accessibilityLabel={service.TENDV}
            resizeMode="cover"
            onError={() => setFailedUrl(imageUrl)}
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          <View className="flex-1 items-center justify-center gap-2">
            <Ionicons name="image-outline" size={26} color="#8496b0" />
            <Text className="text-[10px] text-[#64748b]">Chưa có ảnh</Text>
          </View>
        )}
      </View>

      <View className="flex-1 pl-3">
        <Text className="text-[10px] font-semibold uppercase tracking-wider text-[#6780a3]">
          {categoryLabel}
        </Text>
        <Text className="mt-1 text-[16px] font-bold leading-6 text-[#172b4d]" numberOfLines={2}>
          {service.TENDV}
        </Text>
        {!!service.MOTA && (
          <Text className="mt-1 text-xs leading-5 text-[#718096]" numberOfLines={2}>
            {service.MOTA}
          </Text>
        )}
        <View className="mt-3 flex-row flex-wrap items-center justify-between gap-2">
          <Text className="text-[16px] font-bold text-[#1a3673]">
            {Number(service.GIADV).toLocaleString('vi-VN')} đ
          </Text>
          <View className="flex-row items-center gap-1 rounded-full bg-[#f3f6fa] px-2 py-1">
            <Ionicons name="time-outline" size={12} color="#64748b" />
            <Text className="text-[11px] text-[#64748b]">{service.THOIGIAN} phút</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
