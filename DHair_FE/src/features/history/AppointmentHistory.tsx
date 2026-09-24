import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createSampleAppointments } from './sampleAppointments';
import type { Appointment, AppointmentStatus } from './sampleAppointments';

type HistoryFilter = 'all' | AppointmentStatus;
const filters: { value: HistoryFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'upcoming', label: 'Sắp tới' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];
const statusStyles: Record<AppointmentStatus, { label: string; color: string; background: string }> = {
  upcoming: { label: 'Sắp tới', color: '#2458a6', background: '#edf3ff' },
  completed: { label: 'Hoàn thành', color: '#15745c', background: '#eaf7f0' },
  cancelled: { label: 'Đã hủy', color: '#a54a4a', background: '#fff0f0' },
};

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusStyles[appointment.status];
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
              <Text className="text-xs text-[#64748b]">{appointment.time} · {appointment.duration} phút</Text>
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
            <View>
              <Text className="text-[11px] text-[#8794a7]">Stylist</Text>
              <Text className="mt-1 text-sm text-[#334155]">{appointment.stylist}</Text>
            </View>
          </View>
        )}
      </View>
      <View className="flex-row flex-wrap items-center justify-between gap-2 border-t border-[#f0f3f8] px-4 py-2">
        <Text className="text-base font-bold text-[#1a3673]">{appointment.price.toLocaleString('vi-VN')} đ</Text>
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
    </View>
  );
}

export default function AppointmentHistory() {
  const [appointments] = useState(createSampleAppointments);
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
          <View className="mt-5 flex-row items-center gap-3 rounded-2xl border border-[#e0e8f5] bg-[#edf3fc] p-3">
            <Ionicons name="information-circle-outline" size={20} color="#6780a3" />
            <Text className="flex-1 text-xs leading-5 text-[#526987]">Dữ liệu minh họa · Đây chưa phải lịch hẹn thực tế của bạn.</Text>
          </View>
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
          renderItem={({ item }) => <AppointmentCard appointment={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text accessibilityLiveRegion="polite" className="mb-4 text-xs text-[#8794a7]">{filteredAppointments.length} lịch hẹn minh họa</Text>
          }
          ListEmptyComponent={
            <View className="items-center px-4 py-12">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-[#e8eef9]">
                <Ionicons name="calendar-clear-outline" size={32} color="#6780a3" />
              </View>
              <Text className="mt-5 text-base font-bold text-[#172b4d]">Chưa có lịch hẹn</Text>
              <Text className="mt-2 text-center text-sm leading-6 text-[#64748b]">Lịch hẹn thuộc nhóm này sẽ xuất hiện tại đây.</Text>
            </View>
          }
          ListFooterComponent={
            <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/booking')} className="mb-2 mt-2 min-h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-[#1a3673] p-4">
              <Ionicons name="add" size={22} color="white" />
              <Text className="text-sm font-bold text-white">Đặt lịch mới</Text>
            </Pressable>
          }
        />
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
