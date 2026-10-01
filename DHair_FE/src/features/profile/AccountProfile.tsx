import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth/AuthContext';
import ProfileForm from './ProfileForm';
import { getProfile, updateProfile, changePassword } from './api';
import type { CustomerProfile } from './api';

type ProfilePanel = 'edit' | 'password' | 'logout';
const panelTitles: Record<ProfilePanel, string> = {
  edit: 'Chỉnh sửa thông tin',
  password: 'Đổi mật khẩu',
  logout: 'Đăng xuất',
};

function InfoRow({ label, value, icon }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View className="flex-row items-center gap-3 py-3">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#f0f4fb]">
        <Ionicons name={icon} size={19} color="#6780a3" />
      </View>
      <View className="flex-1">
        <Text className="text-[11px] text-[#8794a7]">{label}</Text>
        <Text className="mt-1 text-sm font-medium leading-5 text-[#334155]">{value}</Text>
      </View>
    </View>
  );
}

function MenuRow({ title, description, icon, onPress }: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1 })} className="flex-row items-center gap-3 py-4">
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#edf2fa]">
        <Ionicons name={icon} size={21} color="#1a3673" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-[#172b4d]">{title}</Text>
        <Text className="mt-1 text-xs leading-5 text-[#8794a7]">{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={17} color="#94a3b8" />
    </Pressable>
  );
}

export default function AccountProfile() {
  const { user, setUser, signOut } = useAuth();
  const [panel, setPanel] = useState<ProfilePanel | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const request = useRef<AbortController | null>(null);
  const saving = useRef(false);
  const token = user?.token || '';

  const loadProfile = useCallback(async () => {
    if (saving.current) return;
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError('');
    try {
      const result = await getProfile(token, controller.signal);
      if (controller.signal.aborted) return;
      setProfile(result);
      // Chỉ cập nhật tên của đúng phiên đang mở, giữ lại token và mã đăng nhập.
      setUser(previous => previous?.token === token ? { ...previous, fullName: result.fullName } : previous);
    } catch (err) {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Không thể tải thông tin.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [token, setUser]);

  useFocusEffect(useCallback(() => {
    setProfile(null);
    void loadProfile();
    return () => request.current?.abort();
  }, [loadProfile]));

  async function saveProfile(fullName: string, email: string) {
    if (saving.current) return;
    saving.current = true;
    request.current?.abort();
    setLoading(false);
    try {
      const result = await updateProfile(token, fullName, email);
      setProfile(result);
      setUser(previous => previous?.token === token ? { ...previous, fullName: result.fullName } : previous);
      setError('');
      setPanel(null);
      Alert.alert('Thành công', 'Đã lưu thông tin cá nhân.');
    } finally {
      saving.current = false;
    }
  }

  async function savePassword(
    currentPassword: string,
    newPassword: string,
  ) {
    if (saving.current) return;

    saving.current = true;

    try {
      await changePassword(
        token,
        currentPassword,
        newPassword,
      );

      setPanel(null);

      Alert.alert(
        'Thành công',
        'Đổi mật khẩu thành công.',
      );
    } finally {
      saving.current = false;
    }
  }
  if (!user) return null;

  const nameParts = user.fullName.trim().split(/\s+/);
  let initials = nameParts.slice(-2).map((part) => part.charAt(0)).join('').toUpperCase();
  if (!initials || user.fullName === user.accountId) initials = 'KH';

  function closePanel() {
    if (saving.current) return;
    setPanel(null);
  }

  function handleSignOut() {
    closePanel();
    router.replace('/(tabs)/home');
    signOut();
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void loadProfile()} />}>
        <Text className="text-[11px] font-bold uppercase tracking-[3px] text-[#6780a3]">DHAIR & BẠN</Text>
        <Text className="mt-2 text-[28px] font-bold text-[#172b4d]">Tài khoản</Text>
        <Text className="mt-1 text-sm leading-5 text-[#64748b]">Thông tin của bạn, trong tầm tay.</Text>

        <View className="mt-6 overflow-hidden rounded-3xl bg-[#1a3673] p-5">
          <View className="flex-row items-center gap-4">
            <View className="h-[68px] w-[68px] items-center justify-center rounded-full border border-[#5475ab] bg-[#31528a]">
              <Text className="text-2xl font-bold text-white">{initials}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-[#bccde9]">Xin chào,</Text>
              <Text className="mt-1 text-xl font-bold leading-7 text-white">{user.fullName}</Text>
              <Text className="mt-1 text-sm text-[#d1ddf0]">{user.accountId}</Text>
            </View>
          </View>
          <Pressable accessibilityRole="button" disabled={!profile || loading} accessibilityState={{ disabled: !profile || loading }} onPress={() => setPanel('edit')} style={{ opacity: !profile || loading ? 0.5 : 1 }} className="mt-5 min-h-11 flex-row items-center justify-center gap-2 rounded-xl bg-[#31528a] px-4 py-3">
            <Ionicons name="create-outline" size={18} color="white" />
            <Text className="text-sm font-semibold text-white">Chỉnh sửa thông tin</Text>
          </Pressable>
        </View>

        <Text className="mb-3 mt-6 text-base font-bold text-[#172b4d]">Thông tin cá nhân</Text>
        {loading && <ActivityIndicator color="#1a3673" className="mb-3" />}
        {!!error && (
          <View className="mb-3 rounded-xl bg-[#fff0f0] p-3">
            <Text accessibilityRole="alert" className="text-sm text-[#b42318]">{error}</Text>
            <Pressable accessibilityRole="button" onPress={() => void loadProfile()} className="min-h-11 justify-center">
              <Text className="font-semibold text-[#1a3673]">Thử lại</Text>
            </Pressable>
          </View>
        )}
        <View className="rounded-3xl border border-[#e3e9f2] bg-white px-4 py-1">
          <InfoRow icon="person-outline" label="Họ và tên" value={profile?.fullName || user.fullName} />
          <View className="h-px bg-[#f0f3f8]" />
          <InfoRow icon="call-outline" label="Số điện thoại" value={profile?.phone || 'Chưa tải được thông tin'} />
          <View className="h-px bg-[#f0f3f8]" />
          <InfoRow icon="mail-outline" label="Email" value={profile ? profile.email || 'Chưa có email' : 'Chưa tải được thông tin'} />
        </View>

        <Text className="mb-3 mt-6 text-base font-bold text-[#172b4d]">Quản lý tài khoản</Text>
        <View className="rounded-3xl border border-[#e3e9f2] bg-white px-4">
          <MenuRow icon="lock-closed-outline" title="Đổi mật khẩu" description="Quản lý mật khẩu đăng nhập" onPress={() => setPanel('password')} />
          <View className="h-px bg-[#f0f3f8]" />
          <MenuRow icon="calendar-outline" title="Lịch sử lịch hẹn" description="Xem các lịch hẹn của bạn" onPress={() => router.push('/(tabs)/history')} />
        </View>

        <Pressable accessibilityRole="button" onPress={() => setPanel('logout')} className="mt-6 min-h-14 flex-row items-center justify-center gap-2 rounded-2xl border border-[#f2dede] bg-[#fff5f5] p-4">
          <Ionicons name="log-out-outline" size={21} color="#b34c4c" />
          <Text className="text-sm font-bold text-[#b34c4c]">Đăng xuất</Text>
        </Pressable>
        <Text className="mt-6 text-center text-[11px] tracking-widest text-[#94a3b8]">DHAIR · CHĂM SÓC PHONG CÁCH CỦA BẠN</Text>
      </ScrollView>

      <Modal visible={panel !== null} transparent animationType="slide" onRequestClose={closePanel}>
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable accessibilityRole="button" accessibilityLabel="Đóng cửa sổ" onPress={closePanel} style={StyleSheet.absoluteFill} />
          <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.sheet}>
            <View className="flex-row items-center justify-between gap-3 border-b border-[#edf1f6] px-5 py-3">
              <Text accessibilityRole="header" className="flex-1 text-lg font-bold text-[#172b4d]">{panel ? panelTitles[panel] : ''}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Đóng" onPress={closePanel} className="h-11 w-11 items-center justify-center rounded-full bg-[#f1f5f9]">
                <Ionicons name="close" size={22} color="#64748b" />
              </Pressable>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
              {panel === 'logout' && (
                <View>
                  <View className="mb-4 h-14 w-14 items-center justify-center self-center rounded-full bg-[#fff0f0]">
                    <Ionicons name="log-out-outline" size={28} color="#b34c4c" />
                  </View>
                  <Text className="text-center text-base font-bold text-[#172b4d]">Bạn muốn đăng xuất?</Text>
                  <Text className="mt-2 text-center text-sm leading-6 text-[#64748b]">Bạn có thể đăng nhập lại để tiếp tục đặt lịch và xem thông tin tài khoản.</Text>
                  <Pressable accessibilityRole="button" onPress={handleSignOut} className="mt-6 min-h-14 items-center justify-center rounded-2xl bg-[#b34c4c] p-4">
                    <Text className="text-base font-bold text-white">Đăng xuất</Text>
                  </Pressable>
                  <Pressable accessibilityRole="button" onPress={closePanel} className="mt-2 min-h-12 items-center justify-center rounded-2xl p-3">
                    <Text className="text-sm font-semibold text-[#64748b]">Ở lại</Text>
                  </Pressable>
                </View>
              )}
              {(panel === 'edit' || panel === 'password') && (
                <ProfileForm key={panel} mode={panel} fullName={profile?.fullName || user.fullName} phone={profile?.phone || user.accountId} initialEmail={profile?.email || ''} onSave={saveProfile} onChangePassword={savePassword}/>
              )}
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f9fc' },
  content: { padding: 20, paddingBottom: 28, width: '100%', maxWidth: 640, alignSelf: 'center' },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15, 30, 52, 0.4)' },
  sheet: { maxHeight: '90%', width: '100%', maxWidth: 640, alignSelf: 'center', backgroundColor: 'white', borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' },
  form: { padding: 20, paddingBottom: 28 },
});
