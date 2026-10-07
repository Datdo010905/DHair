// Màn hình đặt lịch: tải lựa chọn, kiểm tra giờ trống và gửi giá trị lựa chọn cho backend.
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
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
import { useAuth } from '@/features/auth/AuthContext';
import { loginAccount } from '@/features/auth/api';
import { createBooking, getAvailability, getBookingOptions } from '@/features/booking/api';
import type { Availability, BookingOptions } from '@/features/booking/api';

type BookingField = 'salon' | 'stylist' | 'service' | 'date' | 'time';
type BookingOption = {
  value: string;
  label: string;
  detail?: string;
};

const NAVY = '#1a3673';

const fields: BookingField[] = ['salon', 'stylist', 'service', 'date', 'time'];
const labels: Record<BookingField, string> = {
  salon: 'Chọn Salon',
  stylist: 'Chọn Stylist',
  service: 'Chọn Dịch vụ',
  date: 'Chọn Ngày hẹn',
  time: 'Chọn Giờ hẹn',
};
const placeholders: Record<BookingField, string> = {
  salon: '-- Chọn salon --',
  stylist: '-- Chọn thợ cắt tóc --',
  service: '-- Chọn dịch vụ --',
  date: '-- Nhấn để chọn ngày --',
  time: '-- Chọn giờ hẹn --',
};

// Giới hạn ngày từ server, thống nhất theo múi giờ Việt Nam.
function createDateOptions(today: string, lastDay: string): BookingOption[] {
  if (!today || !lastDay) return [];
  const options: BookingOption[] = [];
  const day = new Date(`${today}T00:00:00Z`);
  while (day.toISOString().slice(0, 10) <= lastDay) {
    const value = day.toISOString().slice(0, 10);
    const displayDate = value.split('-').reverse().join('/');
    options.push({ value, label: value === today ? `Hôm nay • ${displayDate}` : displayDate });
    day.setUTCDate(day.getUTCDate() + 1);
  }
  return options;
}

function createServiceOptions(services: Service[]): BookingOption[] {
  const serviceOptions: BookingOption[] = [];
  const seenIds = new Set<string>();

  for (const service of services) {
    const serviceId = service.MADV.trim();
    // Một dịch vụ có thể xuất hiện ở cả hai nhóm; chỉ hiển thị một lần.
    if (seenIds.has(serviceId)) continue;
    seenIds.add(serviceId);

    const price = Number(service.GIADV).toLocaleString('vi-VN');
    serviceOptions.push({
      value: serviceId,
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
  const { user } = useAuth();
  const hairServices = useServices('hair');
  const skinCareServices = useServices('skinCare');
  const [bookingValues, setBookingValues] = useState<Partial<Record<BookingField, BookingOption>>>(
    {},
  );
  const [activeField, setActiveField] = useState<BookingField | null>(null);
  const [note, setNote] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isReviewVisible, setIsReviewVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const selectionVersion = useRef(0);
  const [catalog, setCatalog] = useState<BookingOptions | null>(null);
  const [catalogBranch, setCatalogBranch] = useState<string | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadedKey, setLoadedKey] = useState('');
  const [timesLoading, setTimesLoading] = useState(false);
  const [timesError, setTimesError] = useState('');
  const [reloadVersion, setReloadVersion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const submitLock = useRef(false);
  const branchId = bookingValues.salon?.value || '';
  const staffId = bookingValues.stylist?.value || '';
  const serviceId = bookingValues.service?.value || '';
  const date = bookingValues.date?.value || '';
  const canLoadTimes = !!(branchId && staffId && serviceId && date);
  const queryKey = JSON.stringify([branchId, staffId, serviceId, date, reloadVersion]);

  useFocusEffect(
    useCallback(() => {
      // Tải lại khi quay về tab và khi người dùng để màn hình mở lâu.
      setReloadVersion((value) => value + 1);
      const timer = setInterval(() => setReloadVersion((value) => value + 1), 60000);
      return () => clearInterval(timer);
    }, []),
  );

  useEffect(() => {
    const controller = new AbortController();
    setCatalogLoading(true);
    setCatalogError('');
    getBookingOptions(branchId, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setCatalog(result);
        setCatalogBranch(branchId);
        setBookingValues((previous) => {
          const next = { ...previous };
          if (
            next.salon &&
            !result.branches.some((item) => item.MACHINHANH.trim() === next.salon?.value)
          ) {
            next.salon = undefined;
            next.stylist = undefined;
            next.time = undefined;
          }
          if (
            next.stylist &&
            !result.stylists.some((item) => item.MANV.trim() === next.stylist?.value)
          ) {
            next.stylist = undefined;
            next.time = undefined;
          }
          if (next.date && (next.date.value < result.today || next.date.value > result.lastDay)) {
            next.date = undefined;
            next.time = undefined;
          }
          return next;
        });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setCatalogError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCatalogLoading(false);
      });
    return () => controller.abort();
  }, [branchId, reloadVersion]);

  useEffect(() => {
    const controller = new AbortController();
    setAvailability(null);
    setLoadedKey('');
    setTimesError('');
    setTimesLoading(canLoadTimes);
    if (!canLoadTimes) return () => controller.abort();
    getAvailability({ branchId, staffId, serviceId, date }, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setAvailability(result);
        setLoadedKey(queryKey);
        setBookingValues((previous) => {
          if (!previous.time || result.slots.some((slot) => slot.time === previous.time?.value))
            return previous;
          return { ...previous, time: undefined };
        });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setTimesError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setTimesLoading(false);
      });
    return () => controller.abort();
  }, [branchId, staffId, serviceId, date, canLoadTimes, queryKey]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const version = selectionVersion.current;

      async function restoreService() {
        try {
          const savedService = await getBookingService();
          // Không ghi đè nếu người dùng vừa chọn thủ công trong lúc đọc local.
          if (!isActive || !savedService || version !== selectionVersion.current) return;
          const selectedService: BookingOption = {
            value: savedService.MADV.trim(),
            label: savedService.TENDV,
            detail: `${savedService.GIADV.toLocaleString('vi-VN')} đ • ${savedService.THOIGIAN} phút`,
          };
          setBookingValues((previous) => {
            if (previous.service?.value === selectedService.value) return previous;
            return { ...previous, service: selectedService, time: undefined };
          });
          setValidationError('');
        } catch {
          if (isActive)
            setValidationError('Không thể đọc dịch vụ đã lưu. Bạn có thể chọn dịch vụ bên dưới.');
        }
      }

      restoreService();
      return () => {
        isActive = false;
      };
    }, []),
  );

  // Chuẩn bị danh sách lựa chọn cho từng bước của form.
  const dateOptions = createDateOptions(catalog?.today || '', catalog?.lastDay || '');
  const salons = (catalog?.branches || []).map((item) => ({
    value: item.MACHINHANH.trim(),
    label: item.TENCHINHANH?.trim() || item.MACHINHANH.trim(),
    detail: item.DIACHI?.trim() || undefined,
  }));
  const stylists =
    catalogBranch === branchId
      ? (catalog?.stylists || []).map((item) => ({
          value: item.MANV.trim(),
          label: item.HOTEN.trim(),
        }))
      : [];
  const timeOptions =
    loadedKey === queryKey
      ? (availability?.slots || []).map((slot) => ({
          value: slot.time,
          label: `${slot.time} – ${slot.endTime}`,
          detail: `${availability?.duration} phút`,
        }))
      : [];
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
    if (submitLock.current) return;
    setActiveField(null);
    setIsReviewVisible(false);
    setPassword('');
    setPasswordError('');
  }

  function reloadServices() {
    setReloadVersion((value) => value + 1);
    hairServices.reload();
    skinCareServices.reload();
  }

  function handleSelectOption(option: BookingOption) {
    if (!activeField) return;
    if (activeField === 'service') {
      selectionVersion.current += 1;
      const service = [...hairServices.services, ...skinCareServices.services].find(
        (item) => item.MADV.trim() === option.value,
      );
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

    const appointmentDate = new Date(`${selectedDate.value}T${selectedTime.value}:00+07:00`);
    if (appointmentDate <= new Date()) {
      setValidationError('Giờ hẹn đã qua. Vui lòng chọn lại ngày và giờ hẹn.');
      setBookingValues((previous) => ({ ...previous, time: undefined }));
      return;
    }
    setValidationError('');
    if (
      !dateOptions.some((option) => option.value === selectedDate.value) ||
      timesLoading ||
      loadedKey !== queryKey ||
      !timeOptions.some((option) => option.value === selectedTime.value)
    ) {
      setValidationError('Vui lòng tải và chọn lại giờ trống.');
      setBookingValues((previous) => ({ ...previous, time: undefined }));
      setReloadVersion((value) => value + 1);
      return;
    }
    setPassword('');
    setPasswordError('');
    setIsReviewVisible(true);
  }

  async function submitBooking() {
    if (
      submitLock.current ||
      !user ||
      !bookingValues.time ||
      timesLoading ||
      loadedKey !== queryKey
    )
      return;
    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu tài khoản để xác nhận.');
      return;
    }
    submitLock.current = true;
    setSubmitting(true);
    setPasswordError('');
    let passwordVerified = false;
    try {
      // Giống web: xác minh mật khẩu trước khi tạo lịch, không lưu mật khẩu hoặc đổi phiên.
      const account = await loginAccount({ phone: user.accountId, password });
      if (account.accountId !== user.accountId) {
        throw new Error('Tài khoản xác nhận không khớp với phiên hiện tại.');
      }
      passwordVerified = true;
      const result = await createBooking({
        branchId,
        staffId,
        serviceId,
        date,
        time: bookingValues.time.value,
        note,
        accountId: user.accountId,
      });
      setIsReviewVisible(false);
      setBookingValues((previous) => ({ ...previous, date: undefined, time: undefined }));
      setNote('');
      setValidationError('');
      Alert.alert('Đặt lịch thành công', `Mã lịch hẹn: ${result.MALICH.trim()}`);
      router.push('/history');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Không thể đặt lịch. Vui lòng thử lại.';
      if (!passwordVerified) {
        // Sai mật khẩu vẫn giữ thông tin lịch để người dùng có thể nhập lại.
        setPasswordError(message);
        return;
      }
      setIsReviewVisible(false);
      setValidationError(message);
      setBookingValues((previous) => ({ ...previous, time: undefined }));
      Alert.alert('Chưa xác nhận được lịch hẹn', message);
    } finally {
      setPassword('');
      submitLock.current = false;
      setSubmitting(false);
      if (passwordVerified) setReloadVersion((value) => value + 1);
    }
  }

  const isCatalogField =
    activeField === 'salon' || activeField === 'stylist' || activeField === 'date';
  const loading =
    isServiceLoading ||
    (isCatalogField && catalogLoading) ||
    (activeField === 'time' &&
      (timesLoading || (canLoadTimes && loadedKey !== queryKey && !timesError)));
  const loadError =
    serviceLoadError || (isCatalogField && catalogError) || (activeField === 'time' && timesError);

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
              <Text
                accessibilityRole="header"
                className="flex-1 text-[28px] font-bold text-[#172b4d]"
              >
                Đặt lịch hẹn
              </Text>
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#e8eef9]">
                <Ionicons name="calendar-outline" size={24} color={NAVY} />
              </View>
            </View>
            <Text className="mt-1 text-sm leading-5 text-[#64748b]">
              Đặt từ hôm nay đến 4 ngày tới. Salon phục vụ 08:00–22:00.
            </Text>
          </View>
          <View>
            {fields.map((field, index) => {
              const isDisabled =
                (field === 'stylist' && !branchId) || (field === 'time' && !canLoadTimes);
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
              maxLength={200}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-end bg-[rgba(12,25,44,0.4)]"
        >
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
                    Thời gian: {availability?.duration ?? '…'} phút. Giá dự kiến:{' '}
                    {availability?.price.toLocaleString('vi-VN') ?? '…'} đ.
                  </Text>
                  {timesLoading && <ActivityIndicator color={NAVY} />}
                  <Text className="mb-2 text-sm font-semibold text-[#30343a]">
                    Mật khẩu tài khoản
                  </Text>
                  <TextInput
                    accessibilityLabel="Mật khẩu xác nhận đặt lịch"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="current-password"
                    editable={!submitting}
                    value={password}
                    onChangeText={(value) => {
                      setPassword(value);
                      setPasswordError('');
                    }}
                    placeholder="Nhập mật khẩu tài khoản"
                    className="mb-3 min-h-12 rounded-xl border border-[#e4e8ee] px-4 py-3 text-[#30343a]"
                  />
                  {!!passwordError && (
                    <Text accessibilityRole="alert" className="mb-3 text-sm text-[#b42318]">
                      {passwordError}
                    </Text>
                  )}
                  {!!timesError && (
                    <Pressable accessibilityRole="button" onPress={reloadServices}>
                      <Text className="py-3 text-sm text-[#b42318]">
                        {timesError} Nhấn để thử lại.
                      </Text>
                    </Pressable>
                  )}
                  {!bookingValues.time && (
                    <Text className="py-3 text-sm text-[#b42318]">
                      Giờ đã chọn không còn trống. Đóng bảng này để chọn lại.
                    </Text>
                  )}
                  <Pressable
                    accessibilityRole="button"
                    className="min-h-[50px] items-center justify-center rounded-[30px] bg-[#173c75] px-4"
                    onPress={submitBooking}
                    disabled={
                      submitting ||
                      !password ||
                      !bookingValues.time ||
                      timesLoading ||
                      loadedKey !== queryKey
                    }
                    style={
                      (submitting ||
                        !password ||
                        !bookingValues.time ||
                        timesLoading ||
                        loadedKey !== queryKey) &&
                      styles.disabled
                    }
                  >
                    <Text className="text-[16px] font-bold text-white">
                      {submitting ? 'ĐANG ĐẶT LỊCH...' : 'XÁC NHẬN ĐẶT LỊCH'}
                    </Text>
                  </Pressable>
                </>
              ) : (
                activeField && (
                  <>
                    {loading && <ActivityIndicator color={NAVY} className="items-center p-4" />}
                    {!!loadError && (
                      <View className="items-center p-4">
                        <Text className="mt-[10px] text-[13px] leading-5 text-[#b42318]">
                          {loadError}
                        </Text>
                        <Pressable accessibilityRole="button" onPress={reloadServices}>
                          <Text className="p-3 font-semibold text-[#173c75]">Thử lại</Text>
                        </Pressable>
                      </View>
                    )}
                    {!loading &&
                      !loadError &&
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
                    {!loading && !loadError && options[activeField].length === 0 && (
                      <Text className="py-5 leading-[22px] text-[#777e87]">
                        {activeField === 'time'
                          ? 'Không còn khoảng trống đủ thời lượng. Vui lòng chọn ngày hoặc stylist khác.'
                          : 'Chưa có lựa chọn khả dụng.'}
                      </Text>
                    )}
                  </>
                )
              )}
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
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
