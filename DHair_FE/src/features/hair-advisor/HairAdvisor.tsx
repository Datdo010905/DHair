import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = { id: number; role: 'assistant' | 'user'; text: string };

const welcomeMessage: Message = {
  id: 0,
  role: 'assistant',
  text: 'Chào bạn! Mình là trợ lý kiểu tóc DHair. Bạn đang muốn thay đổi diện mạo hay tìm một kiểu tóc dễ chăm sóc? Hãy chia sẻ kiểu tóc bạn thích nhé.',
};

const suggestions = [
  'Kiểu tóc hợp khuôn mặt tròn',
  'Tóc mỏng nên chọn kiểu nào?',
  'Mình thích tóc ngắn, dễ chăm sóc',
];

// Dữ liệu minh họa giao diện, chưa phải kết quả tư vấn từ AI.
const hairstyles = [
  {
    name: 'Layer tự nhiên',
    tag: 'Nhẹ nhàng',
    description: 'Các lớp tóc mềm, tạo chuyển động tự nhiên.',
    icon: 'leaf-outline' as const,
  },
  {
    name: 'Bob ngang cằm',
    tag: 'Gọn gàng',
    description: 'Đường cắt gọn, điểm nhấn cho diện mạo mới.',
    icon: 'cut-outline' as const,
  },
  {
    name: 'Side part',
    tag: 'Thanh lịch',
    description: 'Ngôi tóc rõ nét, linh hoạt khi tạo kiểu.',
    icon: 'sparkles-outline' as const,
  },
];

export default function HairAdvisor() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const nextMessageId = useRef(1);
  const canSend = draft.trim().length > 0;

  function sendPreviewMessage(text: string) {
    const content = text.trim();
    if (!content) return;

    const userId = nextMessageId.current++;
    const assistantId = nextMessageId.current++;
    setMessages((current) => [
      ...current,
      { id: userId, role: 'user', text: content },
      {
        id: assistantId,
        role: 'assistant',
        text: 'Đây là phản hồi mẫu để bạn trải nghiệm giao diện. Khi tính năng AI được kết nối, mình sẽ tư vấn dựa trên thông tin bạn chia sẻ. Hiện tại, bạn có thể khám phá các kiểu tóc minh họa bên dưới nhé.',
      },
    ]);
    setDraft('');
  }

  function resetConversation() {
    setMessages([welcomeMessage]);
    setDraft('');
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View className="flex-row items-center gap-3 border-b border-[#e4eaf3] bg-white px-4 py-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            onPress={goBack}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#f1f5fa]"
          >
            <Ionicons name="arrow-back" size={22} color="#1a3673" />
          </Pressable>
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#1a3673]">
            <Ionicons name="sparkles" size={22} color="#ffffff" />
          </View>
          <View className="flex-1">
            <Text accessibilityRole="header" className="text-lg font-bold text-[#172b4d]">
              DHair AI
            </Text>
            <Text className="mt-0.5 text-xs text-[#64748b]">Trợ lý tư vấn kiểu tóc</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Bắt đầu hội thoại mới"
            onPress={resetConversation}
            className="h-11 w-11 items-center justify-center rounded-full bg-[#f1f5fa]"
          >
            <Ionicons name="create-outline" size={22} color="#1a3673" />
          </Pressable>
        </View>

        <View className="flex-row items-center justify-center gap-2 bg-[#edf2fc] px-4 py-2">
          <Ionicons name="information-circle-outline" size={16} color="#52678c" />
          <Text className="flex-shrink text-xs leading-5 text-[#52678c]">
            Bản xem trước giao diện · Chưa kết nối AI
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.conversation}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            if (messages.length > 1) scrollRef.current?.scrollToEnd({ animated: true });
          }}
        >
          <View className="mb-7 mt-3 items-center">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-3xl border border-[#dbe5f6] bg-[#eaf0fc]">
              <Ionicons name="sparkles-outline" size={30} color="#1a3673" />
            </View>
            <Text className="text-[10px] font-bold tracking-[3px] text-[#6780a3]">
              MỘT DIỆN MẠO MỚI
            </Text>
            <Text className="mt-2 text-center text-2xl font-bold text-[#172b4d]">
              Tìm kiểu tóc của riêng bạn
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-[#64748b]">
              Từ một ý tưởng nhỏ đến mái tóc bạn yêu thích.
            </Text>
          </View>

          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <View key={message.id} className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
                <Text className="mb-1.5 px-1 text-[11px] font-semibold text-[#6780a3]">
                  {isUser ? 'Bạn' : 'DHair AI · Mẫu'}
                </Text>
                <View
                  style={styles.bubble}
                  className={`rounded-2xl px-4 py-3 ${isUser ? 'rounded-tr-sm bg-[#1a3673]' : 'rounded-tl-sm border border-[#e4eaf3] bg-white'}`}
                >
                  <Text
                    selectable
                    className={`text-sm leading-6 ${isUser ? 'text-white' : 'text-[#344563]'}`}
                  >
                    {message.text}
                  </Text>
                </View>
              </View>
            );
          })}

          {messages.length === 1 && (
            <View className="mb-6 gap-2">
              <Text className="mb-1 text-xs font-semibold text-[#6780a3]">
                BẮT ĐẦU VỚI MỘT GỢI Ý
              </Text>
              {suggestions.map((suggestion) => (
                <Pressable
                  key={suggestion}
                  accessibilityRole="button"
                  onPress={() => sendPreviewMessage(suggestion)}
                  className="min-h-12 flex-row items-center gap-3 rounded-xl border border-[#dce5f3] bg-white px-4 py-3"
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color="#6780a3" />
                  <Text className="flex-1 text-sm text-[#344563]">{suggestion}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#6780a3" />
                </Pressable>
              ))}
            </View>
          )}

          <View className="mt-2 rounded-2xl border border-[#dce5f3] bg-[#edf2fc] p-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="albums-outline" size={18} color="#1a3673" />
              <Text className="flex-1 text-base font-bold text-[#172b4d]">Một chút cảm hứng</Text>
            </View>
            <Text className="mb-4 mt-1 text-xs leading-5 text-[#64748b]">
              Kiểu tóc minh họa · Chưa cá nhân hóa
            </Text>
            {hairstyles.map((hairstyle) => (
              <View
                key={hairstyle.name}
                className="mb-2 flex-row items-center gap-3 rounded-xl bg-white p-3"
              >
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4fa]">
                  <Ionicons name={hairstyle.icon} size={24} color="#1a3673" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-[#172b4d]">
                    {hairstyle.name}{' '}
                    <Text className="text-xs font-normal text-[#6780a3]">· {hairstyle.tag}</Text>
                  </Text>
                  <Text className="mt-1 text-xs leading-5 text-[#64748b]">
                    {hairstyle.description}
                  </Text>
                </View>
              </View>
            ))}
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/(tabs)/booking')}
              className="mt-2 min-h-12 flex-row items-center justify-center gap-2 rounded-xl bg-[#1a3673] px-4 py-3"
            >
              <Ionicons name="calendar-outline" size={18} color="white" />
              <Text className="text-sm font-bold text-white">Đặt lịch với stylist</Text>
            </Pressable>
          </View>
        </ScrollView>

        <View className="border-t border-[#e4eaf3] bg-white px-4 pb-2 pt-3">
          <View className="flex-row items-end gap-2 rounded-2xl border border-[#dce5f3] bg-[#f7f9fc] p-2">
            <TextInput
              accessibilityLabel="Tin nhắn tư vấn kiểu tóc"
              value={draft}
              onChangeText={setDraft}
              placeholder="Bạn muốn kiểu tóc như thế nào?"
              placeholderTextColor="#8290a6"
              multiline
              maxLength={1000}
              style={styles.input}
              className="flex-1 px-2 py-3 text-sm text-[#172b4d]"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Gửi tin nhắn mẫu"
              accessibilityState={{ disabled: !canSend }}
              disabled={!canSend}
              onPress={() => sendPreviewMessage(draft)}
              className={`h-11 w-11 items-center justify-center rounded-xl ${canSend ? 'bg-[#1a3673]' : 'bg-[#e1e7f0]'}`}
            >
              <Ionicons name="arrow-up" size={22} color={canSend ? '#ffffff' : '#8290a6'} />
            </Pressable>
          </View>
          <Text className="mt-2 text-center text-[10px] leading-4 text-[#8290a6]">
            Hội thoại mẫu chỉ hiển thị trong phiên xem này.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f9fc' },
  container: { flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center' },
  conversation: { padding: 20, paddingBottom: 24 },
  bubble: { maxWidth: '92%' },
  input: { minHeight: 44, maxHeight: 120, textAlignVertical: 'top' },
});
