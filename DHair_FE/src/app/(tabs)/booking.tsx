import { Ionicons } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useServices } from '@/features/services/useServices';
import type { Service } from '@/features/services/types';
import RequireAuth from '@/features/auth/components/RequireAuth';
import { getBookingService, saveBookingService } from '@/features/services/bookingServiceStorage';

type BookingField = 'salon' | 'stylist' | 'service' | 'date' | 'time';
type BookingOption = {
  value: string;
  label: string;
  detail?: string;
};

const NAVY = '#1a3673';

// Dữ liệu mẫu cho giao diện, sẽ thay bằng API salon và stylist.
const salons: BookingOption[] = [
  { value: 'CN001', label: '30Shine - Nguyễn Trãi' },
  { value: 'CN002', label: '30Shine - Cầu Giấy' },
  { value: 'CN003', label: '30Shine - Tân Bình' },
  { value: 'CN004', label: '30Shine - Đà Nẵng' },
];
const stylists: BookingOption[] = [
  { value: 'any', label: 'Salon chọn stylist phù hợp' },
  { value: 'demo-1', label: 'Minh Anh', detail: 'Stylist • Dữ liệu mẫu' },
  { value: 'demo-2', label: 'Hoàng Nam', detail: 'Stylist • Dữ liệu mẫu' },
];
const fields: BookingField[] = ['salon', 'stylist', 'service', 'date', 'time'];
const labels: Record<BookingField, string> = {
  salon: 'Chọn salon',
  stylist: 'Chọn stylist',
  service: 'Chọn dịch vụ',
  date: 'Chọn ngày hẹn',
  time: 'Chọn giờ hẹn',
};
const placeholders: Record<BookingField, string> = {
  salon: '-- Chọn salon --',
  stylist: '-- Chọn thợ cắt tóc --',
  service: '-- Chọn dịch vụ --',
  date: '-- Nhấn để chọn ngày --',
  time: '-- Chọn giờ hẹn --',
};

function padNumber(value: number) {
  return String(value).padStart(2, '0');
}

// Dùng ngày trên thiết bị để tránh lệch ngày khi chuyển sang múi giờ UTC.
function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());
  return `${year}-${month}-${day}`;
}

function createDateOptions(today: Date): BookingOption[] {
  const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const dateOptions: BookingOption[] = [];

  // Cho phép chọn trong 14 ngày, tính từ hôm nay.
  for (let offset = 0; offset < 14; offset++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    let dayName = dayNames[date.getDay()];

    if (offset === 0) dayName = 'Hôm nay';
    if (offset === 1) dayName = 'Ngày mai';

    const displayDate = `${padNumber(date.getDate())}/${padNumber(date.getMonth() + 1)}/${date.getFullYear()}`;
    dateOptions.push({ value: formatDateValue(date), label: `${dayName} • ${displayDate}` });
  }

  return dateOptions;
}

function createTimeOptions(selectedDate: string | undefined, now: Date): BookingOption[] {
  const timeOptions: BookingOption[] = [];
  const isToday = selectedDate === formatDateValue(now);
  const currentTime = `${padNumber(now.getHours())}:${padNumber(now.getMinutes())}`;

  // Khung giờ mẫu: từ 08:00 đến 20:00, cách nhau 30 phút.
  for (let totalMinutes = 8 * 60; totalMinutes <= 20 * 60; totalMinutes += 30) {
    const hour = padNumber(Math.floor(totalMinutes / 60));
    const minute = padNumber(totalMinutes % 60);
    const time = `${hour}:${minute}`;

    if (isToday && time <= currentTime) continue;
    timeOptions.push({ value: time, label: time });
  }

  return timeOptions;
}

function createServiceOptions(services: Service[]): BookingOption[] {
  const serviceOptions: BookingOption[] = [];
  const seenIds = new Set<string>();

  for (const service of services) {
    // Một dịch vụ có thể xuất hiện ở cả hai nhóm; chỉ hiển thị một lần.
    if (seenIds.has(service.MADV)) continue;
    seenIds.add(service.MADV);

    const price = Number(service.GIADV).toLocaleString('vi-VN');
    serviceOptions.push({
      value: service.MADV,
      label: service.TENDV,
      detail: `${price} đ • ${service.THOIGIAN} phút`,
    });
  }

  return serviceOptions;
}

export default function BookingScreen() {
  return (
    <RequireAuth>
      <BookingContent />
    </RequireAuth>
  );
}

// Chỉ khởi tạo form và tải dịch vụ sau khi đã đăng nhập.
function BookingContent() {
  const hairServices = useServices('hair');
  const skinCareServices = useServices('skinCare');
  const [bookingValues, setBookingValues] = useState<Partial<Record<BookingField, BookingOption>>>({
    salon: salons[0],
  });
  const [activeField, setActiveField] = useState<BookingField | null>(null);
  const [note, setNote] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isReviewVisible, setIsReviewVisible] = useState(false);
  const selectionVersion = useRef(0);

  useFocusEffect(useCallback(() => {
    let isActive = true;
    const version = selectionVersion.current;

    async function restoreService() {
      try {
        const savedService = await getBookingService();
        // Không ghi đè nếu người dùng vừa chọn thủ công trong lúc đọc local.
        if (!isActive || !savedService || version !== selectionVersion.current) return;
        const selectedService: BookingOption = {
          value: savedService.MADV,
          label: savedService.TENDV,
          detail: `${savedService.GIADV.toLocaleString('vi-VN')} đ • ${savedService.THOIGIAN} phút`,
        };
        setBookingValues((previous) => {
          if (previous.service?.value === selectedService.value) return previous;
          return { ...previous, service: selectedService, time: undefined };
        });
        setValidationError('');
      } catch {
        if (isActive) setValidationError('Không thể đọc dịch vụ đã lưu. Bạn có thể chọn dịch vụ bên dưới.');
      }
    }

    restoreService();
    return () => { isActive = false; };
  }, []));

  // Chuẩn bị danh sách lựa chọn cho từng bước của form.
  const now = new Date();
  const dateOptions = createDateOptions(now);
  const timeOptions = createTimeOptions(bookingValues.date?.value, now);
  // Trang đặt lịch gộp kết quả từ hai API tóc và chăm sóc da.
  const serviceOptions = createServiceOptions([
    ...hairServices.services,
    ...skinCareServices.services,
  ]);
  const options: Record<BookingField, BookingOption[]> = {
    salon: salons,
    stylist: stylists,
    service: serviceOptions,
    date: dateOptions,
    time: timeOptions,
  };
  const isServiceLoading =
    activeField === 'service' && (hairServices.isLoading || skinCareServices.isLoading);
  const serviceLoadError =
    activeField === 'service' && (hairServices.error || skinCareServices.error);

  function closeModal() {
    setActiveField(null);
    setIsReviewVisible(false);
  }

  function reloadServices() {
    hairServices.reload();
    skinCareServices.reload();
  }

  function handleSelectOption(option: BookingOption) {
    if (!activeField) return;
    if (activeField === 'service') {
      selectionVersion.current += 1;
      const service = [...hairServices.services, ...skinCareServices.services]
        .find((item) => item.MADV === option.value);
      // Ghi nhớ lựa chọn thủ công để lần mở tab sau không quay về dịch vụ cũ.
      if (service) {
        saveBookingService(service).catch(() => {
          setValidationError('Đã chọn dịch vụ nhưng chưa lưu được trên thiết bị.');
        });
      }
    }
    setBookingValues((previous) => {
      const nextSelection = { ...previous, [activeField]: option };

      // Đổi salon thì chọn lại stylist; đổi thông tin hẹn thì chọn lại giờ.
      if (activeField === 'salon') nextSelection.stylist = undefined;
      if (activeField !== 'time') nextSelection.time = undefined;

      return nextSelection;
    });
    setValidationError('');
    setActiveField(null);
  }

  function handleReviewBooking() {
    const missingField = fields.find((field) => !bookingValues[field]);
    if (missingField) {
      setValidationError(`Vui lòng ${labels[missingField].toLowerCase()} trước khi đặt lịch.`);
      setActiveField(missingField);
      return;
    }
    const selectedDate = bookingValues.date;
    const selectedTime = bookingValues.time;
    if (!selectedDate || !selectedTime) return;

    const appointmentDate = new Date(`${selectedDate.value}T${selectedTime.value}:00`);
    if (appointmentDate <= new Date()) {
      setValidationError('Giờ hẹn đã qua. Vui lòng chọn lại ngày và giờ hẹn.');
      setBookingValues((previous) => ({ ...previous, time: undefined }));
      return;
    }
    setValidationError('');
    setIsReviewVisible(true);
  }

  let modalTitle = '';
  if (activeField) modalTitle = labels[activeField];
  if (isReviewVisible) modalTitle = 'Thông tin lịch hẹn';

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-7">
            <Text className="text-[11px] font-bold uppercase tracking-[3px] text-[#6780a3]">
              ĐẶT LỊCH DHAIR
            </Text>
            <View className="mt-2 flex-row items-center justify-between gap-3">
              <Text accessibilityRole="header" className="flex-1 text-[28px] font-bold text-[#172b4d]">
                Đặt lịch hẹn
              </Text>
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#e8eef9]">
                <Ionicons name="calendar-outline" size={24} color={NAVY} />
              </View>
            </View>
            <Text className="mt-1 text-sm leading-5 text-[#64748b]">
              Chọn thời gian, để DHair chăm sóc bạn.
            </Text>
          </View>
          <View>
            {fields.map((field, index) => {
              const isDisabled = field === 'time' && !bookingValues.date;
              return (
                <View key={field} className="min-h-[94px] flex-row">
                  <View className="w-7 items-center">
                    {index < fields.length - 1 && <View style={styles.line} />}
                    <View className="mt-[3px] h-4 w-4 rounded-full border border-[#f7f9fc] bg-[#397fdb]" />
                  </View>
                  <View className="flex-1 pb-[18px] pl-1">
                    <Text className="mb-[9px] text-[14px] font-semibold text-[#172b4d]">
                      {index + 1}. {labels[field]}
                    </Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`${labels[field]}: ${bookingValues[field]?.label || 'Chưa chọn'}`}
                      accessibilityState={{ disabled: isDisabled }}
                      disabled={isDisabled}
                      onPress={() => setActiveField(field)}
                      className="min-h-14 flex-row items-center gap-2 rounded-2xl border border-[#dfe6f0] bg-white px-4 py-3"
                      style={({ pressed }) => [
                        isDisabled && styles.disabled,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text
                        numberOfLines={1}
                        className={`grow shrink text-[15px] leading-[22px] ${bookingValues[field] ? 'text-[#172b4d]' : 'text-[#8794a7]'}`}
                      >
                        {bookingValues[field]?.label || placeholders[field]}
                      </Text>
                      <Ionicons
                        name={field === 'date' ? 'calendar-outline' : 'chevron-down'}
                        size={17}
                        color="#6780a3"
                      />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
          <View className="mt-2">
            <Text className="mb-[9px] text-[14px] font-semibold text-[#172b4d]">
              Ghi chú (Không bắt buộc)
            </Text>
            <TextInput
              accessibilityLabel="Ghi chú cho salon"
              value={note}
              onChangeText={setNote}
              placeholder="VD: Cắt tóc kiểu Ivy League..."
              placeholderTextColor="#94a3b8"
              multiline
              maxLength={500}
              textAlignVertical="top"
              className="min-h-[104px] rounded-2xl border border-[#dfe6f0] bg-white p-4 text-sm leading-6 text-[#172b4d]"
            />
          </View>
          {!!validationError && (
            <Text
              accessibilityRole="alert"
              className="mt-[10px] text-[13px] leading-5 text-[#b42318]"
            >
              {validationError}
            </Text>
          )}
          <View className="mt-auto pt-8">
            <Text className="mb-[18px] text-center text-xs text-[#64748b]">
              Cắt xong ưng thì trả - Huỷ lịch không sao
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleReviewBooking}
              className="min-h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-[#1a3673] px-4 py-4"
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Ionicons name="calendar-outline" size={21} color="white" />
              <Text className="text-base font-bold text-white">Đặt lịch ngay</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        visible={activeField !== null || isReviewVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end bg-[rgba(12,25,44,0.4)]">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng bảng chọn"
            style={StyleSheet.absoluteFill}
            onPress={closeModal}
          />
          <SafeAreaView
            edges={['bottom']}
            className="rounded-t-[22px] bg-white"
            style={styles.sheet}
          >
            <View className="flex-row items-center justify-between border-b border-[#edf0f4] p-5">
              <Text className="text-[18px] font-bold text-[#173c75]">{modalTitle}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Đóng"
                hitSlop={12}
                onPress={closeModal}
              >
                <Ionicons name="close" size={24} color={NAVY} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.options} keyboardShouldPersistTaps="handled">
              {isReviewVisible ? (
                <>
                  {fields.map((field) => (
                    <View key={field} className="gap-[3px] pb-2">
                      <Text className="mt-1 text-[12px] leading-[18px] text-[#777e87]">
                        {labels[field].replace('Chọn ', '')}
                      </Text>
                      <Text className="text-[15px] leading-[23px] text-[#30343a]">
                        {bookingValues[field]?.label}
                      </Text>
                    </View>
                  ))}
                  {!!note.trim() && (
                    <Text className="text-[15px] leading-[23px] text-[#30343a]">
                      Ghi chú: {note.trim()}
                    </Text>
                  )}
                  <Text className="my-[10px] rounded-lg bg-[#e7f1fc] p-[14px] leading-[22px] text-[#173c75]">
                    Đây là bản xem trước giao diện. Lịch hẹn chưa được gửi tới salon.
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    className="min-h-[50px] items-center justify-center rounded-[30px] bg-[#173c75] px-4"
                    onPress={closeModal}
                  >
                    <Text className="text-[16px] font-bold text-white">QUAY LẠI CHỈNH SỬA</Text>
                  </Pressable>
                </>
              ) : (
                activeField && (
                  <>
                    {['salon', 'stylist', 'time'].includes(activeField) && (
                      <Text className="mt-1 text-[12px] leading-[18px] text-[#777e87]">
                        Dữ liệu mẫu để xem trước giao diện.
                      </Text>
                    )}
                    {isServiceLoading && (
                      <ActivityIndicator color={NAVY} className="items-center p-4" />
                    )}
                    {!!serviceLoadError && (
                      <View className="items-center p-4">
                        <Text className="mt-[10px] text-[13px] leading-5 text-[#b42318]">
                          {serviceLoadError}
                        </Text>
                        <Pressable accessibilityRole="button" onPress={reloadServices}>
                          <Text className="p-3 font-semibold text-[#173c75]">Thử lại</Text>
                        </Pressable>
                      </View>
                    )}
                    {!isServiceLoading &&
                      options[activeField].map((option) => (
                        <Pressable
                          key={option.value}
                          accessibilityRole="button"
                          accessibilityState={{
                            selected: bookingValues[activeField]?.value === option.value,
                          }}
                          onPress={() => handleSelectOption(option)}
                          className={`flex-row items-center gap-3 rounded-[10px] border p-[14px] ${bookingValues[activeField]?.value === option.value ? 'border-[#397fdb] bg-[#edf5ff]' : 'border-[#e4e8ee] bg-white'}`}
                        >
                          <View className="flex-1">
                            <Text className="grow shrink text-[15px] leading-[22px] text-[#40444a]">
                              {option.label}
                            </Text>
                            {!!option.detail && (
                              <Text className="mt-1 text-[12px] leading-[18px] text-[#777e87]">
                                {option.detail}
                              </Text>
                            )}
                          </View>
                          {bookingValues[activeField]?.value === option.value && (
                            <Ionicons name="checkmark-circle" size={22} color={NAVY} />
                          )}
                        </Pressable>
                      ))}
                    {!isServiceLoading &&
                      !serviceLoadError &&
                      options[activeField].length === 0 && (
                        <Text className="py-5 leading-[22px] text-[#777e87]">
                          {activeField === 'time'
                            ? 'Hôm nay đã hết khung giờ. Vui lòng chọn ngày khác.'
                            : 'Chưa có lựa chọn khả dụng.'}
                        </Text>
                      )}
                  </>
                )
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Tailwind định dạng giao diện; StyleSheet xử lý vùng cuộn và trạng thái nhấn.
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f9fc' },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
  },
  line: { position: 'absolute', top: 17, bottom: -3, width: 2, backgroundColor: '#75a4e5' },
  disabled: { opacity: 0.55 },
  pressed: { opacity: 0.75 },
  sheet: { maxHeight: '78%', width: '100%', maxWidth: 640, alignSelf: 'center' },
  options: { padding: 18, gap: 10, paddingBottom: 28 },
});
