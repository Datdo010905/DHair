import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { registerAccount } from '../api';

export default function RegisterForm() {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const safeAreaInsets = useSafeAreaInsets();

    // Loại ký tự không phải số, kể cả khi người dùng dán nội dung vào ô nhập.
    const handlePhoneNumberChange = (text: string) => {
        const digitsOnly = text.replace(/\D/g, '');
        const limitedPhoneNumber = digitsOnly.slice(0, 10);
        setPhoneNumber(limitedPhoneNumber);
    };

    // Kiểm tra dữ liệu trước khi gửi yêu cầu lên Backend.
    const validateForm = () => {
        if (!fullName.trim() || !phoneNumber || !password.trim() || !passwordConfirmation.trim()) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
            return false;
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            Alert.alert('Thông báo', 'Số điện thoại phải có đúng 10 chữ số!');
            return false;
        }
        if (!email.trim()) {
            Alert.alert('Thông báo', 'Vui lòng nhập email!');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            Alert.alert('Thông báo', 'Email không hợp lệ!');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Thông báo', 'Mật khẩu phải có ít nhất 6 ký tự!');
            return false;
        }
        // Backend tự trim mật khẩu; tránh lưu khác với dữ liệu đã nhập.
        if (password !== password.trim()) {
            Alert.alert('Thông báo', 'Mật khẩu không được có khoảng trắng ở đầu hoặc cuối!');
            return false;
        }
        if (password !== passwordConfirmation) {
            Alert.alert('Thông báo', 'Mật khẩu xác nhận không khớp!');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        // Không gửi thêm yêu cầu khi lần trước chưa hoàn tất.
        if (isSubmitting) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await registerAccount({ fullName, phone: phoneNumber, email, password });
            Alert.alert('Thành công', 'Đăng ký tài khoản thành công!', [
                // Quay về Login có sẵn trong lịch sử để tránh tạo màn trùng.
                { text: 'OK', onPress: () => router.dismissTo('/(auth)/login') },
            ]);
        } catch (error) {
            let errorMessage = 'Không thể đăng ký tài khoản. Vui lòng thử lại.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            Alert.alert('Thông báo', errorMessage);
        } finally {
            // Mở lại form sau cả trường hợp thành công và thất bại.
            setIsSubmitting(false);
        }
    };

    const submitButtonText = isSubmitting ? 'Đang đăng ký...' : 'Đăng ký';

    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={[styles.scrollContent, { paddingBottom: safeAreaInsets.bottom }]}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
        >
            {/* Nhận diện DHair, đồng bộ giữa các trang tài khoản. */}
            <View className="bg-[#1a3673] pt-9 pb-9 px-6 items-center shadow-sm mb-6">
                <Image
                    source={require('../../../../assets/img/logoTo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                    accessibilityLabel="DHair"
                />
                <Text className="text-gray-200 text-lg font-medium tracking-wide text-center">
                    DHair - Cắt tóc theo phong cách của bạn!
                </Text>
            </View>

            {/* Nội dung form và các nút điều hướng. */}
            <View className="px-6 justify-center pb-8">
                <View className="mb-6 items-center">
                    <Text className="text-2xl font-bold text-[#1a3673] text-center">ĐĂNG KÝ</Text>
                    <Text className="text-gray-500 mt-1 text-center">
                        Tạo tài khoản DHair của bạn
                    </Text>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2">Họ và tên</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                        <Ionicons
                            name="person-outline"
                            size={20}
                            color="#6b7280"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            placeholder="Nhập họ và tên"
                            placeholderTextColor="#9ca3af"
                            accessibilityLabel="Họ và tên"
                            editable={!isSubmitting}
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                            maxLength={100}
                            className="flex-1 min-w-0 text-gray-800"
                        />
                    </View>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2">Số điện thoại</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                        <Ionicons
                            name="call-outline"
                            size={20}
                            color="#6b7280"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            placeholder="Nhập số điện thoại"
                            placeholderTextColor="#9ca3af"
                            accessibilityLabel="Số điện thoại"
                            editable={!isSubmitting}
                            value={phoneNumber}
                            onChangeText={handlePhoneNumberChange}
                            keyboardType="phone-pad"
                            maxLength={10}
                            autoComplete="tel"
                            className="flex-1 min-w-0 text-gray-800"
                        />
                    </View>
                </View>

                {/* Lưu email để người dùng có thể khôi phục mật khẩu sau này. */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2">Email</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color="#6b7280"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            placeholder="Nhập email"
                            placeholderTextColor="#9ca3af"
                            accessibilityLabel="Email"
                            editable={!isSubmitting}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoComplete="email"
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={100}
                            className="flex-1 min-w-0 text-gray-800"
                        />
                    </View>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2">Mật khẩu</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color="#6b7280"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            placeholder="Nhập mật khẩu"
                            placeholderTextColor="#9ca3af"
                            accessibilityLabel="Mật khẩu"
                            editable={!isSubmitting}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={50}
                            className="flex-1 min-w-0 text-gray-800"
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            accessibilityRole="button"
                            accessibilityLabel={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            className="p-2 ml-1"
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#6b7280"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2">Xác nhận mật khẩu</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                        <Ionicons
                            name="shield-checkmark-outline"
                            size={20}
                            color="#6b7280"
                            style={styles.inputIcon}
                        />
                        <TextInput
                            placeholder="Nhập lại mật khẩu"
                            placeholderTextColor="#9ca3af"
                            accessibilityLabel="Xác nhận mật khẩu"
                            editable={!isSubmitting}
                            value={passwordConfirmation}
                            onChangeText={setPasswordConfirmation}
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            maxLength={50}
                            className="flex-1 min-w-0 text-gray-800"
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            accessibilityRole="button"
                            accessibilityLabel={
                                showConfirmPassword
                                    ? 'Ẩn mật khẩu xác nhận'
                                    : 'Hiện mật khẩu xác nhận'
                            }
                            className="p-2 ml-1"
                        >
                            <Ionicons
                                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#6b7280"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleRegister}
                    disabled={isSubmitting}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
                    style={isSubmitting ? styles.disabledButton : undefined}
                    className="bg-[#1a3673] py-4 rounded-xl items-center shadow-md mt-2 mb-4"
                >
                    <Text className="text-white font-bold text-lg">{submitButtonText}</Text>
                </TouchableOpacity>
                <View className="flex-row flex-wrap items-center justify-center mt-4">
                    <Text className="text-gray-500">Đã có tài khoản? </Text>
                    <TouchableOpacity
                        onPress={() => router.dismissTo('/(auth)/login')}
                        accessibilityRole="link"
                        className="py-2"
                    >
                        <Text className="text-[#1a3673] font-bold">Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

// NativeWind dùng cho bố cục, màu sắc; StyleSheet giữ các thông số lặp lại.
const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    logo: {
        width: 200,
        height: 80,
        marginBottom: 8,
    },
    inputIcon: {
        marginRight: 10,
    },
    disabledButton: {
        opacity: 0.6,
    },
});
