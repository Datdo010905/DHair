import { useRef, useState } from 'react';
import {
  ActivityIndicator,
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

interface Props {
  appointment: Appointment;
  reasons: string[];
  onClose: () => void;
  onConfirm: (reason: string, otherReason: string) => Promise<void>;
}

export default function CancelAppointmentModal({
  appointment,
  reasons,
  onClose,
  onConfirm,
}: Props) {
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [showReasons, setShowReasons] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  const canCancel = appointment.status === 'Đã đặt';

  function close() {
    if (!submitLock.current) onClose();
  }

  async function submit() {
    if (submitLock.current || !canCancel) return;
    if (!reason || !reasons.includes(reason)) {
      setError('Vui lòng chọn lý do hủy.');
      return;
    }
    if (reason === 'Khác' && !otherReason.trim()) {
      setError('Vui lòng nhập lý do hủy.');
      return;
    }
    submitLock.current = true;
    setSubmitting(true);
    setError('');
    try {
      await onConfirm(reason, otherReason.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể hủy lịch. Vui lòng thử lại.');
    } finally {
      submitLock.current = false;
      setSubmitting(false);
    }
  }

  return (
    <Modal visible transparent animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView
        className="flex-1 justify-end bg-black/40"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView
          edges={['bottom']}
          className="w-full max-w-[640px] self-center rounded-t-3xl bg-white"
          style={{ maxHeight: '90%' }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 20, gap: 14 }}
          >
            <Text accessibilityRole="header" className="text-xl font-bold text-[#172b4d]">
              Hủy lịch hẹn
            </Text>
            <View className="rounded-2xl bg-[#f0f4fb] p-4">
              <Text className="font-semibold text-[#172b4d]">{appointment.service}</Text>
              <Text className="mt-2 text-sm text-[#64748b]">
                {appointment.time} · {appointment.date.split('-').reverse().join('/')}
              </Text>
              <Text className="mt-1 text-sm text-[#64748b]">{appointment.salon}</Text>
            </View>
            {!canCancel && (
              <Text className="text-sm text-[#b42318]">
                Lịch hiện ở trạng thái {appointment.status}, không thể hủy.
              </Text>
            )}
            <Text className="text-sm font-semibold text-[#172b4d]">Lý do hủy *</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Chọn lý do hủy"
              accessibilityState={{ expanded: showReasons }}
              disabled={submitting || !canCancel}
              onPress={() => setShowReasons((value) => !value)}
              className="min-h-12 justify-center rounded-xl border border-[#dfe6f0] px-4 py-3"
            >
              <Text className="text-sm text-[#172b4d]">{reason || '-- Chọn lý do hủy --'} ▾</Text>
            </Pressable>
            {showReasons &&
              reasons.map((item) => (
                <Pressable
                  key={item}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: reason === item }}
                  disabled={submitting || !canCancel}
                  onPress={() => {
                    setReason(item);
                    setShowReasons(false);
                    setError('');
                  }}
                  className={`min-h-12 justify-center rounded-xl border px-4 py-3 ${reason === item ? 'border-[#1a3673] bg-[#edf3ff]' : 'border-[#e3e9f2]'}`}
                >
                  <Text className="text-sm text-[#172b4d]">{item}</Text>
                </Pressable>
              ))}
            {reason === 'Khác' && (
              <TextInput
                accessibilityLabel="Nhập lý do khác"
                placeholder="Nhập lý do hủy..."
                multiline
                value={otherReason}
                onChangeText={setOtherReason}
                maxLength={194}
                editable={!submitting && canCancel}
                textAlignVertical="top"
                className="min-h-24 rounded-xl border border-[#dfe6f0] p-4 text-sm text-[#172b4d]"
              />
            )}
            <Text className="text-xs leading-5 text-[#64748b]">
              Lý do hủy sẽ thay thế ghi chú của lịch hẹn. Bạn xác nhận hủy lịch này?
            </Text>
            {!!error && (
              <Text accessibilityRole="alert" className="text-sm text-[#b42318]">
                {error}
              </Text>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={submit}
              disabled={submitting || !canCancel}
              className="min-h-12 flex-row items-center justify-center gap-2 rounded-xl bg-[#b42318] p-3"
              style={{ opacity: submitting || !canCancel ? 0.5 : 1 }}
            >
              {submitting && <ActivityIndicator color="white" />}
              <Text className="font-bold text-white">
                {submitting ? 'Đang hủy...' : 'Xác nhận hủy lịch'}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={close}
              disabled={submitting}
              className="min-h-12 items-center justify-center rounded-xl border border-[#dfe6f0] p-3"
            >
              <Text className="font-semibold text-[#172b4d]">
                {canCancel ? 'Giữ lịch hẹn' : 'Đóng'}
              </Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
