import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

interface ProfileFormProps {
  mode: 'edit' | 'password';
  fullName: string;
  phone: string;
  initialEmail: string;
  onSave: (fullName: string, email: string) => Promise<void>;
}

function PasswordField({ label }: { label: string }) {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-[#334155]">{label}</Text>
      <View className="min-h-14 flex-row items-center rounded-xl border border-[#dfe6f0] bg-[#f8fafc] pl-4 pr-1">
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={setValue}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={label}
          placeholderTextColor="#94a3b8"
          className="min-h-14 flex-1 py-3 text-sm text-[#172b4d]"
        />
        <Pressable accessibilityRole="button" accessibilityLabel={`${visible ? 'Ẩn' : 'Hiện'} ${label.toLowerCase()}`} onPress={() => setVisible(!visible)} className="h-12 w-12 items-center justify-center">
          <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6780a3" />
        </Pressable>
      </View>
    </View>
  );
}

export default function ProfileForm({ mode, fullName, phone, initialEmail, onSave }: ProfileFormProps) {
  const [name, setName] = useState(fullName);
  const [email, setEmail] = useState(initialEmail);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const saveLock = useRef(false);

  async function save() {
    if (saveLock.current || mode !== 'edit') return;
    if (!name.trim() || name.trim().length > 100) {
      setError('Họ và tên phải có từ 1 đến 100 ký tự.');
      return;
    }
    const cleanEmail = email.trim();
    if (cleanEmail.length > 100 || (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))) {
      setError('Vui lòng nhập email đúng định dạng, tối đa 100 ký tự.');
      return;
    }
    saveLock.current = true;
    setSaving(true);
    setError('');
    try {
      await onSave(name.trim(), cleanEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu thông tin.');
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  }

  return (
    <View>
      {mode === 'password' && <View className="mb-6 flex-row items-start gap-2 rounded-xl bg-[#edf3fc] p-3">
        <Ionicons name="information-circle-outline" size={18} color="#6780a3" />
        <Text className="flex-1 text-xs leading-5 text-[#526987]">Giao diện xem trước. Chức năng lưu thay đổi chưa khả dụng.</Text>
      </View>}

      {mode === 'edit' ? (
        <>
          <Text className="mb-2 text-sm font-semibold text-[#334155]">Họ và tên</Text>
          <TextInput accessibilityLabel="Họ và tên" value={name} onChangeText={setName} maxLength={100} editable={!saving} autoCapitalize="words" placeholder="Nhập họ và tên" placeholderTextColor="#94a3b8" className="mb-4 min-h-14 rounded-xl border border-[#dfe6f0] bg-[#f8fafc] px-4 py-3 text-sm text-[#172b4d]" />

          <Text className="mb-2 text-sm font-semibold text-[#334155]">Số điện thoại</Text>
          <View className="mb-1 min-h-14 flex-row items-center justify-between rounded-xl bg-[#f0f3f8] px-4 py-3">
            <Text className="text-sm text-[#64748b]">{phone}</Text>
            <Ionicons name="lock-closed-outline" size={16} color="#8794a7" />
          </View>
          <Text className="mb-4 text-xs leading-5 text-[#8794a7]">Số điện thoại dùng để đăng nhập.</Text>

          <Text className="mb-2 text-sm font-semibold text-[#334155]">Email (không bắt buộc)</Text>
          <TextInput accessibilityLabel="Email" value={email} onChangeText={setEmail} maxLength={100} editable={!saving} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" placeholder="Nhập email của bạn" placeholderTextColor="#94a3b8" className="mb-4 min-h-14 rounded-xl border border-[#dfe6f0] bg-[#f8fafc] px-4 py-3 text-sm text-[#172b4d]" />
        </>
      ) : (
        <>
          <PasswordField label="Mật khẩu hiện tại" />
          <PasswordField label="Mật khẩu mới" />
          <PasswordField label="Nhập lại mật khẩu mới" />
        </>
      )}

      {!!error && <Text accessibilityRole="alert" className="mb-3 text-sm text-[#b42318]">{error}</Text>}
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: saving || mode === 'password' }} disabled={saving || mode === 'password'} onPress={save} className="mt-2 min-h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-[#1a3673] p-4" style={{ opacity: saving || mode === 'password' ? 0.5 : 1 }}>
        {saving && <ActivityIndicator color="white" />}
        <Text className="text-base font-bold text-white">{saving ? 'Đang lưu...' : mode === 'edit' ? 'Lưu thay đổi' : 'Đổi mật khẩu'}</Text>
      </Pressable>
    </View>
  );
}
