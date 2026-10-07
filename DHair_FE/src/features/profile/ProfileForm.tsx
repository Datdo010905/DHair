import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

interface ProfileFormProps {
  mode: 'edit' | 'password';
  fullName: string;
  phone: string;
  initialEmail: string;
  onSave: (fullName: string, email: string) => Promise<void>;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  disabled: boolean;
}

function PasswordField({ label, value, onChangeText, disabled }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-[#334155]">{label}</Text>

      <View className="min-h-14 flex-row items-center rounded-xl border border-[#dfe6f0] bg-[#f8fafc] pl-4 pr-1">
        <TextInput
          accessibilityLabel={label}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={label}
          placeholderTextColor="#94a3b8"
          className="min-h-14 flex-1 py-3 text-sm text-[#172b4d]"
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${visible ? 'Ẩn' : 'Hiện'} ${label.toLowerCase()}`}
          onPress={() => setVisible(!visible)}
          className="h-12 w-12 items-center justify-center"
        >
          <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color="#6780a3" />
        </Pressable>
      </View>
    </View>
  );
}

export default function ProfileForm({
  mode,
  fullName,
  phone,
  initialEmail,
  onSave,
  onChangePassword,
}: ProfileFormProps) {
  const [name, setName] = useState(fullName);
  const [email, setEmail] = useState(initialEmail);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const saveLock = useRef(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function save() {
    if (saveLock.current) return;

    if (mode === 'edit') {
      if (!name.trim() || name.trim().length > 100) {
        setError('Họ và tên phải có từ 1 đến 100 ký tự.');
        return;
      }

      const cleanEmail = email.trim();

      if (
        cleanEmail.length > 100 ||
        (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
      ) {
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

      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword.length > 50) {
      setError('Mật khẩu mới không được vượt quá 50 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại.');
      return;
    }

    saveLock.current = true;
    setSaving(true);
    setError('');

    try {
      await onChangePassword(currentPassword, newPassword);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể đổi mật khẩu.');
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  }

  return (
    <View>
      {mode === 'edit' ? (
        <>
          <Text className="mb-2 text-sm font-semibold text-[#334155]">Họ và tên</Text>
          <TextInput
            accessibilityLabel="Họ và tên"
            value={name}
            onChangeText={setName}
            maxLength={100}
            editable={!saving}
            autoCapitalize="words"
            placeholder="Nhập họ và tên"
            placeholderTextColor="#94a3b8"
            className="mb-4 min-h-14 rounded-xl border border-[#dfe6f0] bg-[#f8fafc] px-4 py-3 text-sm text-[#172b4d]"
          />

          <Text className="mb-2 text-sm font-semibold text-[#334155]">Số điện thoại</Text>
          <View className="mb-1 min-h-14 flex-row items-center justify-between rounded-xl bg-[#f0f3f8] px-4 py-3">
            <Text className="text-sm text-[#64748b]">{phone}</Text>
            <Ionicons name="lock-closed-outline" size={16} color="#8794a7" />
          </View>
          <Text className="mb-4 text-xs leading-5 text-[#8794a7]">
            Số điện thoại dùng để đăng nhập.
          </Text>

          <Text className="mb-2 text-sm font-semibold text-[#334155]">Email (không bắt buộc)</Text>
          <TextInput
            accessibilityLabel="Email"
            value={email}
            onChangeText={setEmail}
            maxLength={100}
            editable={!saving}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Nhập email của bạn"
            placeholderTextColor="#94a3b8"
            className="mb-4 min-h-14 rounded-xl border border-[#dfe6f0] bg-[#f8fafc] px-4 py-3 text-sm text-[#172b4d]"
          />
        </>
      ) : (
        <>
          <PasswordField
            label="Mật khẩu hiện tại"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            disabled={saving}
          />

          <PasswordField
            label="Mật khẩu mới"
            value={newPassword}
            onChangeText={setNewPassword}
            disabled={saving}
          />

          <PasswordField
            label="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            disabled={saving}
          />
        </>
      )}

      {!!error && (
        <Text accessibilityRole="alert" className="mb-3 text-sm text-[#b42318]">
          {error}
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: saving }}
        disabled={saving}
        onPress={save}
        className="mt-2 min-h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-[#1a3673] p-4"
        style={{ opacity: saving ? 0.5 : 1 }}
      >
        {saving && <ActivityIndicator color="white" />}
        <Text className="text-base font-bold text-white">
          {saving ? 'Đang lưu...' : mode === 'edit' ? 'Lưu thay đổi' : 'Đổi mật khẩu'}
        </Text>
      </Pressable>
    </View>
  );
}
