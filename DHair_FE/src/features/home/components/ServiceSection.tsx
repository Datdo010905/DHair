import { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type { Service } from '@/features/services/types';
import { getImageUrl } from '@/services/apiClient';

interface Props {
  title: string;
  data: Service[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

function ServiceImage({ path }: { path: string | null }) {
  const uri = getImageUrl(path);
  const [failedUri, setFailedUri] = useState<string | null>(null);
  if (!uri || uri === failedUri) {
    return (
      <View style={{ height: 128 }} className="bg-gray-100 items-center justify-center">
        <Text className="text-gray-500 text-xs">Chưa có ảnh</Text>
      </View>
    );
  }
  return <Image source={{ uri }} onError={() => setFailedUri(uri)} resizeMode="cover" style={{ width: '100%', height: 128 }} />;
}

export default function ServiceSection({ title, data, loading, error, onRetry }: Props) {
  return (
    <View className="mt-6 pl-4">
      <Text className="text-[#1a3673] font-bold text-lg mb-3 uppercase">
        {title}
      </Text>
      
      {loading ? (
        <View className="py-6 items-center pr-4">
          <ActivityIndicator color="#1a3673" />
          <Text className="mt-2 text-gray-500">Đang tải dịch vụ...</Text>
        </View>
      ) : error ? (
        <View className="pr-4 py-3">
          <Text accessibilityRole="alert" className="text-red-600">{error}</Text>
          <TouchableOpacity accessibilityRole="button" onPress={onRetry} className="mt-3 self-start rounded-lg bg-[#1a3673] px-4 py-2">
            <Text className="text-white font-semibold">Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : data.length === 0 ? (
        <Text className="text-gray-500 py-4">Chưa có dịch vụ đang cung cấp.</Text>
      ) : <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pr-4">
        {data.map((item) => (
          <View
            key={item.MADV}
            style={{
              marginRight: 16,
              width: 154,
              backgroundColor: '#fff',
              borderRadius: 12,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <ServiceImage path={item.HINH} />
            <View className="p-2 items-center">
              <Text className="text-center font-semibold text-[#1a3673] text-sm" numberOfLines={2}>
                {item.TENDV}
              </Text>
              <Text className="mt-1 text-[#1a3673] font-bold text-sm">{item.GIADV.toLocaleString('vi-VN')} đ</Text>
              <Text className="mt-1 text-gray-500 text-xs">{item.THOIGIAN} phút</Text>
            </View>
          </View>
        ))}
      </ScrollView>}
    </View>
  );
}
