// src/features/auth/components/LoginForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { loginAccount } from '@/features/auth/api';
import { useAuth } from '@/features/auth/AuthContext';

export default function LoginForm() {
    const { next } = useLocalSearchParams<{ next?: string }>();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setUser } = useAuth();

    const handlePhoneChange = (text: string) => {
        const digitsOnly = text.replace(/\D/g, '');
        setPhone(digitsOnly.slice(0, 10));
    };

    const handleLogin = async () => {
        if (isSubmitting) {
            return;
        }

        if (!phone || !password) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ số điện thoại và mật khẩu!');
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            Alert.alert('Thông báo', 'Số điện thoại phải có đúng 10 chữ số!');
            return;
        }

        setIsSubmitting(true);
        try {
            // Chỉ báo thành công sau khi Backend kiểm tra tài khoản và mật khẩu.
            const loggedInUser = await loginAccount({ phone, password });
            setUser(loggedInUser);
            // Tiếp tục luồng đặt lịch; dịch vụ đã được lưu local trước khi đăng nhập.
            if (next === 'booking') {
                router.dismissTo('/(tabs)/booking');
                return;
            }
            Alert.alert('Thành công', 'Đăng nhập thành công!', [
                // Đóng các màn xác thực phía trên và quay về trang chủ.
                { text: 'OK', onPress: () => router.dismissTo('/(tabs)/home') },
            ]);
        } catch (error) {
            let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            Alert.alert('Thông báo', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const loginButtonText = isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập';

    return (
        <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <View className="bg-[#1a3673] pt-9 pb-9 px-6 items-center shadow-sm mb-6">
                <Image
                    source={require('../../../../assets/img/logoTo.png')}
                    style={{
                        width: 200,
                        height: 80,
                        marginBottom: 8
                    }}
                    resizeMode="contain"
                />
                {/* Slogan */}
                <Text className="text-gray-200 text-lg font-medium tracking-wide">
                    DHair - Cắt tóc theo phong cách của bạn!
                </Text>
            </View>

            <View className="px-6 justify-center pb-8">
                {/* Tiêu đề */}
                <View className="mb-6 items-center">
                    <Text className="text-2xl font-bold text-[#1a3673] uppercase">Đăng nhập</Text>
                    <Text className="text-gray-500 mt-1">Chào mừng bạn quay trở lại!</Text>
                </View>

                {/* Ô nhập Số điện thoại */}
                <View className="mb-4">
                    <Text className="text-gray-700 font-semibold mb-2">Số điện thoại</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                        <Ionicons name="call-outline" size={20} color="#6b7280" style={{ marginRight: 10 }} />
                        <TextInput
                            placeholder="Nhập số điện thoại của bạn"
                            placeholderTextColor="#9ca3af"
                            keyboardType="phone-pad"
                            maxLength={10}
                            editable={!isSubmitting}
                            value={phone}
                            onChangeText={handlePhoneChange}
                            className="flex-1 text-gray-800"
                        />
                    </View>
                </View>

                {/* Ô nhập Mật khẩu */}
                <View className="mb-6">
                    <Text className="text-gray-700 font-semibold mb-2">Mật khẩu</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
                        <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={{ marginRight: 10 }} />
                        <TextInput
                            placeholder="Nhập mật khẩu"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isSubmitting}
                            value={password}
                            onChangeText={setPassword}
                            className="flex-1 text-gray-800"
                        />
                    </View>
                </View>

                {/* Nút Đăng nhập */}
                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={isSubmitting}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
                    className="bg-[#1a3673] py-4 rounded-xl items-center shadow-md mb-4"
                >
                    <Text className="text-white font-bold text-lg">{loginButtonText}</Text>
                </TouchableOpacity>

                {/* Quên mật khẩu */}
                <TouchableOpacity
                    onPress={() => router.push('/(auth)/forgot')}
                    className="items-center mt-2"
                >
                    <Text className="text-[#1a3673] font-semibold">
                        Quên mật khẩu?
                    </Text>
                </TouchableOpacity>

                {/* Chuyển sang đăng ký */}
                <View className="flex-row justify-center mt-4">
                    <Text className="text-gray-500">Chưa có tài khoản? </Text>

                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/register')}
                    >
                        <Text className="text-[#1a3673] font-bold">
                            Đăng ký ngay
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
