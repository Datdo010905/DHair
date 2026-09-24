import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth/AuthContext';
import ProfileForm from './ProfileForm';

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
  const { user, signOut } = useAuth();
  const [panel, setPanel] = useState<ProfilePanel | null>(null);
  if (!user) return null;

  const nameParts = user.fullName.trim().split(/\s+/);
  let initials = nameParts.slice(-2).map((part) => part.charAt(0)).join('').toUpperCase();
  if (!initials || user.fullName === user.accountId) initials = 'KH';

  function closePanel() {
    setPanel(null);
  }

  function handleSignOut() {
    closePanel();
    router.replace('/(tabs)/home');
    signOut();
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
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
          <Pressable accessibilityRole="button" onPress={() => setPanel('edit')} className="mt-5 min-h-11 flex-row items-center justify-center gap-2 rounded-xl bg-[#31528a] px-4 py-3">
            <Ionicons name="create-outline" size={18} color="white" />
            <Text className="text-sm font-semibold text-white">Chỉnh sửa thông tin</Text>
          </Pressable>
        </View>

        <Text className="mb-3 mt-6 text-base font-bold text-[#172b4d]">Thông tin cá nhân</Text>
        <View className="rounded-3xl border border-[#e3e9f2] bg-white px-4 py-1">
          <InfoRow icon="person-outline" label="Họ và tên" value={user.fullName} />
          <View className="h-px bg-[#f0f3f8]" />
          <InfoRow icon="call-outline" label="Số điện thoại" value={user.accountId} />
          <View className="h-px bg-[#f0f3f8]" />
          <InfoRow icon="mail-outline" label="Email" value="Chưa có thông tin hiển thị" />
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
                <ProfileForm key={panel} mode={panel} fullName={user.fullName} phone={user.accountId} />
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
