import { router, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PlatformPressable } from 'expo-router/react-navigation';
import { useAuth } from '@/features/auth/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  return (

    <Tabs
      initialRouteName="home"
      screenListeners={({ route }) => ({
        tabPress: (event) => {
          const requiresLogin = ['booking', 'history', 'profile'].includes(route.name);

          if (!user && requiresLogin) {
            // Giữ tab hiện tại trong lịch sử để nút Back từ Login quay về đúng chỗ.
            event.preventDefault();
            router.push('/(auth)/login');
          }
        },
      })}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1a3673', // Màu icon khi được chọn
        tabBarInactiveTintColor: '#8e8e93', // Màu icon khi không chọn
        tabBarButton: (props) => (
          <PlatformPressable
            {...props}
            pressOpacity={1}
            pressColor="transparent"
            android_ripple={{ color: 'transparent' }}
            hoverEffect={{ ...props.hoverEffect, activeOpacity: 0 }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Tìm kiếm',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="booking"
        options={{
          title: 'Đặt lịch',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'Lịch sử',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'time' : 'time-outline'} size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Thông tin',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'information-circle' : 'information-circle-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
