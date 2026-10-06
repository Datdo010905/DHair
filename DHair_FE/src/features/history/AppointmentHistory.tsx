import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth/AuthContext';
import { appointmentStatuses, cancelAppointment, getHistory } from './api';
import type { Appointment, AppointmentStatus } from './api';
import CancelAppointmentModal from './CancelAppointmentModal';

type HistoryFilter = 'all' | AppointmentStatus;
const filters: { value: HistoryFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  ...appointmentStatuses.map(status => ({ value: status, label: status })),
];
const statusStyles: Record<AppointmentStatus, { label: string; color: string; background: string }> = {
  'Đã đến': { label: 'Đã đến', color: '#087e8b', background: '#e6f7f9' },
  'Đã đặt': { label: 'Đã đặt', color: '#2458a6', background: '#edf3ff' },
  'Đang chờ': { label: 'Đang chờ', color: '#722ed1', background: '#f9f0ff' },
  'Đang thực hiện': { label: 'Đang thực hiện', color: '#ad6800', background: '#fff7e6' },
  'Hoàn thành': { label: 'Hoàn thành', color: '#15745c', background: '#eaf7f0' },
  'Đã huỷ': { label: 'Đã huỷ', color: '#a54a4a', background: '#fff0f0' },
};

function AppointmentCard({ appointment, onCancel }: { appointment: Appointment; onCancel: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusStyles[appointment.status as AppointmentStatus] || {
    label: appointment.status, color: '#64748b', background: '#f1f5f9',
  };
  const [year, month, day] = appointment.date.split('-');

  return (
    <View className="mb-4 overflow-hidden rounded-3xl border border-[#e3e9f2] bg-white">
      <View className="p-4">
        <View className="mb-4 flex-row items-center justify-between gap-2">
          <Text className="text-[11px] font-semibold tracking-wider text-[#8794a7]">#{appointment.id}</Text>
          <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: status.background }}>
            <Text className="text-[11px] font-semibold" style={{ color: status.color }}>{status.label}</Text>
          </View>
        </View>
        <View className="flex-row items-start gap-4">
          <View className="w-16 items-center rounded-2xl bg-[#f0f4fb] py-3">
            <Text className="text-[10px] font-bold uppercase text-[#6780a3]">Tháng {month}</Text>
            <Text className="mt-1 text-3xl font-bold text-[#1a3673]">{day}</Text>
            <Text className="text-[10px] text-[#6780a3]">{year}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold leading-6 text-[#172b4d]">{appointment.service}</Text>
            <View className="mt-2 flex-row items-center gap-1.5">
              <Ionicons name="time-outline" size={14} color="#6780a3" />
              <Text className="text-xs text-[#64748b]">{appointment.time} · Tổng dịch vụ {appointment.duration} phút</Text>
            </View>
            <View className="mt-2 flex-row items-start gap-1.5">
              <Ionicons name="location-outline" size={14} color="#6780a3" />
              <Text className="flex-1 text-xs leading-4 text-[#64748b]">{appointment.salon}</Text>
            </View>
          </View>
        </View>

        {expanded && (
          <View className="mt-4 gap-3 rounded-2xl bg-[#f7f9fc] p-4">
            <View>
              <Text className="text-[11px] text-[#8794a7]">Địa chỉ salon</Text>
              <Text className="mt-1 text-sm leading-5 text-[#334155]">{appointment.address}</Text>
            </View>
            {appointment.details.map(detail => (
              <View key={detail.id} className="border-t border-[#e3e9f2] pt-3">
                <Text className="text-sm font-semibold text-[#334155]">{detail.service} × {detail.quantity}</Text>
                <Text className="mt-1 text-sm text-[#64748b]">Stylist: {detail.stylist}</Text>
                <Text className="mt-1 text-xs text-[#64748b]">{detail.duration} phút · {detail.price.toLocaleString('vi-VN')} đ</Text>
                {!!detail.note && (
                  <Text className="mt-2 text-sm leading-5 text-[#334155]">
                    {appointment.status === 'Đã huỷ' ? 'Lý do hủy' : 'Ghi chú'}: {detail.note}
                  </Text>
                )}
              </View>
            ))}
            {appointment.details.length === 0 && <Text className="text-sm text-[#64748b]">Chưa có chi tiết dịch vụ.</Text>}
          </View>
        )}
      </View>
      <View className="flex-row flex-wrap items-center justify-between gap-2 border-t border-[#f0f3f8] px-4 py-2">
        <View>
          <Text className="text-[10px] text-[#64748b]">Giá dự kiến</Text>
          <Text className="text-base font-bold text-[#1a3673]">{appointment.price.toLocaleString('vi-VN')} đ</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${expanded ? 'Thu gọn' : 'Xem chi tiết'} lịch hẹn ${appointment.id}`}
          accessibilityState={{ expanded }}
          onPress={() => setExpanded(!expanded)}
          className="min-h-11 flex-row items-center gap-2 px-1"
        >
          <Text className="text-xs font-semibold text-[#6780a3]">{expanded ? 'Thu gọn' : 'Chi tiết lịch hẹn'}</Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={15} color="#6780a3" />
        </Pressable>
      </View>
      {appointment.status === 'Đã đặt' && (
        <Pressable accessibilityRole="button" accessibilityLabel={`Hủy lịch ${appointment.id}`} onPress={onCancel} className="min-h-12 items-center justify-center border-t border-[#f0f3f8] px-4 py-3">
          <Text className="text-sm font-semibold text-[#b42318]">Hủy lịch</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function AppointmentHistory() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const request = useRef<AbortController | null>(null);
  const token = user?.token || '';

  const loadHistory = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError('');
    try {
      const result = await getHistory(token, controller.signal);
      if (controller.signal.aborted) return;
      setAppointments(result.appointments);
      setReasons(result.cancellationReasons);
      setSelectedAppointment(previous => {
        if (!previous) return null;
        return result.appointments.find(item => item.id === previous.id) || null;
      });
    } catch (err) {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Không thể tải lịch hẹn.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [token]);

  useFocusEffect(useCallback(() => {
    setAppointments([]);
    setSelectedAppointment(null);
    void loadHistory();
    return () => request.current?.abort();
  }, [loadHistory]));

  async function confirmCancellation(reason: string, otherReason: string) {
    if (!selectedAppointment) return;
    try {
      const updated = await cancelAppointment(token, selectedAppointment.id, reason, otherReason);
      // Không để phản hồi tải danh sách cũ ghi đè kết quả vừa hủy.
      request.current?.abort();
      setAppointments(previous => previous.map(item => item.id === updated.id ? updated : item));
      setSelectedAppointment(null);
      Alert.alert('Đã hủy lịch', 'Lý do hủy đã được gửi tới salon.');
      void loadHistory();
    } catch (err) {
      // Có thể salon đã đổi trạng thái hoặc mạng ngắt sau khi server lưu thành công.
      void loadHistory();
      throw err;
    }
  }
  const [filter, setFilter] = useState<HistoryFilter>('all');
  const filteredAppointments = appointments.filter((appointment) => filter === 'all' || appointment.status === filter);

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View className="px-5 pb-4 pt-5">
          <Text className="text-[11px] font-bold uppercase tracking-[3px] text-[#6780a3]">LỊCH HẸN DHAIR</Text>
          <View className="mt-2 flex-row items-center justify-between gap-3">
            <Text className="flex-1 text-[28px] font-bold text-[#172b4d]">Lịch hẹn của bạn</Text>
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#e8eef9]">
              <Ionicons name="calendar-outline" size={24} color="#1a3673" />
            </View>
          </View>
          <Text className="mt-1 text-sm leading-5 text-[#64748b]">Theo dõi những lần chăm sóc bản thân.</Text>
        </View>

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {filters.map((item) => {
              const selected = filter === item.value;
              return (
                <Pressable
                  key={item.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setFilter(item.value)}
                  className={`min-h-11 justify-center rounded-full border px-4 ${selected ? 'border-[#1a3673] bg-[#1a3673]' : 'border-[#e1e7f0] bg-white'}`}
                >
                  <Text className={`text-xs font-semibold ${selected ? 'text-white' : 'text-[#64748b]'}`}>{item.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AppointmentCard appointment={item} onCancel={() => setSelectedAppointment(item)} />}
          refreshing={loading}
          onRefresh={() => void loadHistory()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View className="mb-4">
              {loading && <ActivityIndicator color="#1a3673" />}
              {!!error && (
                <View className="mb-3 rounded-xl bg-[#fff0f0] p-3">
                  <Text accessibilityRole="alert" className="text-sm text-[#b42318]">{error}</Text>
                  <Pressable accessibilityRole="button" onPress={() => void loadHistory()} className="min-h-11 justify-center">
                    <Text className="font-semibold text-[#1a3673]">Thử lại</Text>
                  </Pressable>
                </View>
              )}
              {!loading && !error && <Text accessibilityLiveRegion="polite" className="text-xs text-[#8794a7]">{filteredAppointments.length} lịch hẹn</Text>}
            </View>
          }
          ListEmptyComponent={
            !loading && !error ? <View className="items-center px-4 py-12">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-[#e8eef9]">
                <Ionicons name="calendar-clear-outline" size={32} color="#6780a3" />
              </View>
              <Text className="mt-5 text-base font-bold text-[#172b4d]">Chưa có lịch hẹn</Text>
              <Text className="mt-2 text-center text-sm leading-6 text-[#64748b]">Lịch hẹn thuộc nhóm này sẽ xuất hiện tại đây.</Text>
            </View> : null
          }
          ListFooterComponent={
            <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/booking')} className="mb-2 mt-2 min-h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-[#1a3673] p-4">
              <Ionicons name="add" size={22} color="white" />
              <Text className="text-sm font-bold text-white">Đặt lịch mới</Text>
            </Pressable>
          }
        />
        {selectedAppointment && (
          <CancelAppointmentModal
            key={selectedAppointment.id}
            appointment={selectedAppointment} reasons={reasons}
            onClose={() => setSelectedAppointment(null)} onConfirm={confirmCancellation}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f9fc' },
  container: { flex: 1, width: '100%', maxWidth: 640, alignSelf: 'center' },
  filters: { paddingHorizontal: 20, paddingBottom: 20, gap: 8 },
  list: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 24 },
});
