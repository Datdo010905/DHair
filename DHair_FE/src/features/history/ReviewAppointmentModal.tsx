import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Appointment } from './api';

type Props = {
  appointment: Appointment;
  onClose: () => void;
  onConfirm: (rating: number, comment: string) => Promise<void>;
};

export default function ReviewAppointmentModal({ appointment, onClose, onConfirm }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);

  function close() {
    if (!lock.current) onClose();
  }

  async function submit() {
    if (lock.current) return;
    if (!rating) {
      setError('Vui lòng chọn số sao trước khi gửi.');
      return;
    }
    lock.current = true;
    setSaving(true);
    setError('');
    try {
      await onConfirm(rating, comment.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi đánh giá.');
    } finally {
      lock.current = false;
      setSaving(false);
    }
  }

  return (
    <Modal visible animationType="slide" onRequestClose={close}>
      <SafeAreaView className="flex-1 bg-[#f7f9fc]">
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24 }}>
            <Text accessibilityRole="header" className="text-2xl font-bold text-[#1a3673]">
              Đánh giá trải nghiệm
            </Text>
            <Text className="mt-2 text-sm leading-6 text-gray-600">
              {appointment.salon} · #{appointment.id}
            </Text>
            <Text className="mt-6 text-base font-semibold text-gray-800">
              Bạn hài lòng với lần ghé salon này chứ?
            </Text>
            <View className="my-5 flex-row flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityLabel={`${value} sao`}
                  accessibilityState={{ selected: rating === value, disabled: saving }}
                  disabled={saving}
                  onPress={() => setRating(value)}
                  className="h-12 w-12 items-center justify-center"
                >
                  <Ionicons
                    name={value <= rating ? 'star' : 'star-outline'}
                    size={34}
                    color="#b7791f"
                  />
                </Pressable>
              ))}
            </View>
            <Text className="mb-2 text-sm text-gray-700">Nhận xét (không bắt buộc)</Text>
            <TextInput
              accessibilityLabel="Nhận xét về trải nghiệm tại salon"
              value={comment}
              onChangeText={setComment}
              editable={!saving}
              multiline
              maxLength={500}
              textAlignVertical="top"
              placeholder="Điều bạn hài lòng hoặc mong salon cải thiện…"
              className="min-h-36 rounded-2xl border border-gray-300 bg-white p-4 text-base text-gray-800"
            />
            <Text className="mt-2 text-right text-xs text-gray-500">
              {comment.length}/500 ký tự
            </Text>
            <Text className="my-4 text-sm leading-6 text-gray-600">
              Mỗi lịch được đánh giá một lần. Phản hồi chỉ hiển thị với bạn và người quản lý salon.
            </Text>
            {!!error && (
              <Text accessibilityRole="alert" className="mb-4 text-sm text-red-700">
                {error}
              </Text>
            )}
            <Pressable
              accessibilityRole="button"
              disabled={saving}
              onPress={submit}
              className="min-h-12 items-center justify-center rounded-xl bg-[#1a3673] p-3"
            >
              <Text className="font-bold text-white">{saving ? 'Đang gửi…' : 'Gửi đánh giá'}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={saving}
              onPress={close}
              className="mt-3 min-h-12 items-center justify-center p-3"
            >
              <Text className="font-semibold text-[#1a3673]">Đóng</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
