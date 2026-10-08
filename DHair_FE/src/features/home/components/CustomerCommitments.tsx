import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type Commitment = {
  id: string;
  title: string;
  summary: string;
  content: string;
  icon: keyof typeof Ionicons.glyphMap;
};

// Nội dung chăm sóc khách hàng tập trung vào giá rõ ràng và lựa chọn phù hợp.
const commitments: Commitment[] = [
  {
    id: 'pricing',
    title: 'Minh bạch chi phí',
    summary: 'Biết giá trước khi lựa chọn',
    content:
      'Bạn có thể xem giá dịch vụ trước khi đặt lịch. Dịch vụ phát sinh được tư vấn và thống nhất với bạn trước khi thực hiện, giúp bạn chủ động ngân sách.',
    icon: 'receipt-outline',
  },
  {
    id: 'consultation',
    title: 'Tư vấn phù hợp',
    summary: 'Theo nhu cầu và ngân sách của bạn',
    content:
      'DHair tư vấn dịch vụ dựa trên nhu cầu và ngân sách của bạn. Hãy trao đổi mong muốn với stylist trước khi bắt đầu; bạn chủ động quyết định dịch vụ sẽ sử dụng.',
    icon: 'chatbubbles-outline',
  },
  {
    id: 'appointments',
    title: 'Đặt lịch có trách nhiệm',
    summary: 'Chủ động lịch hẹn, thuận tiện cho mọi người',
    content:
      'Vui lòng đến đúng giờ hẹn. Nếu không thể đến, hãy chủ động hủy lịch trong mục Lịch sử khi lịch còn cho phép hủy để salon sắp xếp phục vụ khách khác. Khi cần thay đổi lịch, hãy trao đổi với salon để được hỗ trợ.',
    icon: 'calendar-outline',
  },
  {
    id: 'aftercare',
    title: 'Chăm sóc sau dịch vụ',
    summary: 'Giữ mái tóc đẹp cả khi về nhà',
    content:
      'Hãy trao đổi với stylist để được hướng dẫn cách chăm sóc tại nhà phù hợp với dịch vụ đã sử dụng. Nếu có điều chưa hài lòng, bạn vui lòng phản hồi trực tiếp với salon để được tiếp nhận và trao đổi hướng xử lý.',
    icon: 'heart-outline',
  },
];

export default function CustomerCommitments() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Chỉ mở một mục mỗi lần để phần chính sách gọn trên màn hình mobile.
  function toggleCommitment(id: string) {
    setExpandedId((currentId) => (currentId === id ? null : id));
  }

  return (
    <View className="mx-4 mt-6 overflow-hidden rounded-2xl border border-[#dce5f3] bg-white">
      <View className="bg-[#f0f5ff] p-5">
        <View className="mb-3 flex-row items-center gap-2">
          <Ionicons name="shield-checkmark-outline" size={20} color="#1a3673" />
          <Text className="text-xs font-bold tracking-wide text-[#1a3673]">
            CHÍNH SÁCH & CAM KẾT
          </Text>
        </View>
        <Text accessibilityRole="header" className="text-xl font-bold text-[#1a3673]">
          An tâm làm đẹp cùng DHair
        </Text>
        <Text className="mt-2 text-sm leading-5 text-gray-600">
          Chi phí rõ ràng, lựa chọn phù hợp và đồng hành sau mỗi lần ghé salon.
        </Text>
      </View>

      {commitments.map((item) => {
        const isExpanded = expandedId === item.id;

        return (
          <View key={item.id} className="border-b border-[#edf1f7]">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.title}
              accessibilityState={{ expanded: isExpanded }}
              accessibilityHint="Mở hoặc thu gọn nội dung chính sách"
              onPress={() => toggleCommitment(item.id)}
              className="min-h-16 flex-row items-center gap-3 px-4 py-4"
            >
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#f0f5ff]">
                <Ionicons name={item.icon} size={21} color="#1a3673" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-[#1a3673]">{item.title}</Text>
                <Text className="mt-1 text-xs leading-5 text-gray-600">{item.summary}</Text>
              </View>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#1a3673"
              />
            </Pressable>
            {isExpanded && (
              <Text className="px-4 pb-4 text-sm leading-6 text-gray-700">
                {item.content}
              </Text>
            )}
          </View>
        );
      })}

      <View className="gap-3 p-4">
        <Text className="text-center text-sm leading-5 text-gray-600">
          Chọn dịch vụ phù hợp, dành thời gian chăm sóc bản thân.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/booking')}
          className="min-h-12 items-center justify-center rounded-xl bg-[#1a3673] px-4 py-3"
        >
          <Text className="text-sm font-bold text-white">Đặt lịch ngay</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/search')}
          className="min-h-12 items-center justify-center rounded-xl border border-[#1a3673] px-4 py-3"
        >
          <Text className="text-sm font-bold text-[#1a3673]">Khám phá dịch vụ</Text>
        </Pressable>
      </View>
    </View>
  );
}
