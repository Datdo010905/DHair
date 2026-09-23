// src/features/auth/components/LoginForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function LoginForm() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!phone || !password) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ số điện thoại và mật khẩu!');
            return;
        }

        // Tạm thời hiển thị thông báo và chuyển về trang chủ (tabs) khi bấm đăng nhập thành công
        Alert.alert('Thành công', 'Đăng nhập thành công!', [
            { text: 'OK', onPress: () => router.replace('/(tabs)') }
        ]);
    };

    return (
        <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }}>
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
                            value={phone}
                            onChangeText={setPhone}
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
                            value={password}
                            onChangeText={setPassword}
                            className="flex-1 text-gray-800"
                        />
                    </View>
                </View>

                {/* Nút Đăng nhập */}
                <TouchableOpacity
                    onPress={handleLogin}
                    className="bg-[#1a3673] py-4 rounded-xl items-center shadow-md mb-4"
                >
                    <Text className="text-white font-bold text-lg">Đăng nhập</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-4">
                    <Text className="text-gray-500">Quên mật khẩu? </Text>
                    <TouchableOpacity>
                        <Text className="text-[#1a3673] font-bold">Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}