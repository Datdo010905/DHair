// src/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Ẩn header của từng tab để tự code header riêng
        tabBarActiveTintColor: '#1a3673', // Màu icon khi được chọn
        tabBarInactiveTintColor: '#8e8e93', // Màu icon khi không chọn
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      {/* 1. Tab Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 2. Tab Tìm kiếm */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Tìm kiếm',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 3. Tab Đặt lịch (Nút to ở giữa) */}
      <Tabs.Screen
        name="booking"
        options={{
          title: '', // Ẩn chữ đi để nút nổi bật
          tabBarIcon: ({ focused }) => (
            <View className="w-14 h-14 bg-[#1a3673] rounded-full items-center justify-center border-4 border-white shadow-md" style={{ marginTop: -20 }}>
              <Ionicons name="calendar" size={24} color="white" />
            </View>
          ),
        }}
      />

      {/* 4. Tab Lịch sử (Đồng hồ) */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'Lịch sử',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'time' : 'time-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 5. Tab Thông tin */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Thông tin',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}