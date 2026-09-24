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
import { requestPasswordReset } from '../api';

export default function ForgotPasswordForm() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
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
        if (!phoneNumber.trim()) {
            Alert.alert('Thông báo', 'Vui lòng nhập số điện thoại!');
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

        return true;
    };

    const handlePasswordReset = async () => {
        // Không gửi thêm yêu cầu khi lần trước chưa hoàn tất.
        if (isSubmitting) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await requestPasswordReset({ phone: phoneNumber, email });
            Alert.alert(
                'Thông báo',
                'Yêu cầu khôi phục mật khẩu đã được tiếp nhận. Vui lòng kiểm tra email để nhận mật khẩu mới.',
                // Quay về Login có sẵn trong lịch sử để tránh tạo màn trùng.
                [{ text: 'OK', onPress: () => router.dismissTo('/(auth)/login') }],
            );
        } catch (error) {
            let errorMessage = 'Không thể khôi phục mật khẩu. Vui lòng thử lại.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            Alert.alert('Thông báo', errorMessage);
        } finally {
            // Mở lại form sau cả trường hợp thành công và thất bại.
            setIsSubmitting(false);
        }
    };

    const submitButtonText = isSubmitting ? 'Đang gửi yêu cầu...' : 'Tiếp tục';

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
                    <Text className="text-2xl font-bold text-[#1a3673] text-center">
                        QUÊN MẬT KHẨU
                    </Text>
                    <Text className="text-gray-500 mt-1 text-center">
                        Nhập số điện thoại và email đã đăng ký để khôi phục tài khoản
                    </Text>
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
                            placeholder="Nhập số điện thoại đã đăng ký"
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
                            placeholder="Nhập email đã đăng ký"
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

                <TouchableOpacity
                    onPress={handlePasswordReset}
                    disabled={isSubmitting}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
                    style={isSubmitting ? styles.disabledButton : undefined}
                    className="bg-[#1a3673] py-4 rounded-xl items-center shadow-md mt-2 mb-4"
                >
                    <Text className="text-white font-bold text-lg">{submitButtonText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.dismissTo('/(auth)/login')}
                    accessibilityRole="link"
                    className="self-center py-2 mt-4"
                >
                    <Text className="text-[#1a3673] font-bold">Quay lại đăng nhập</Text>
                </TouchableOpacity>
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
