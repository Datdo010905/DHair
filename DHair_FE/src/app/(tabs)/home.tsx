import Banner from '@/features/home/components/Banner';
import HomeHeader from '@/features/home/components/HomeHeader';
import QuickActions from '@/features/home/components/QuickActions';
import RatingCard from '@/features/home/components/RatingCard';
import ServiceSection from '@/features/home/components/ServiceSection';
import { useServices } from '@/features/services/useServices';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const hairServices = useServices('hair');
  const skinCareServices = useServices('skinCare');
  return (
    <View className="flex-1 bg-gray-50">
      {/* 1. Header */}
      <HomeHeader />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 2. Quick Actions */}
        <QuickActions />

        {/* 3. Rating Card */}
        <RatingCard />

        {/* 4. Banner */}
        <Banner />

        {/* 5. Dịch Vụ Tóc */}
        <ServiceSection
          title="Dịch vụ tóc"
          services={hairServices.services}
          isLoading={hairServices.isLoading}
          error={hairServices.error}
          onReload={hairServices.reload}
        />

        {/* 6. Chăm sóc da */}
        <ServiceSection
          title="Chăm sóc da"
          services={skinCareServices.services}
          isLoading={skinCareServices.isLoading}
          error={skinCareServices.error}
          onReload={skinCareServices.reload}
        />

        {/* Căn lề dưới cùng để không bị lấp bởi Bottom Tab */}
        <View className="h-24" />
      </ScrollView>

      {/* Nút Hotline trôi nổi (Floating Action Button) */}
      <TouchableOpacity className="absolute bottom-4 right-4 bg-[#1a3673] flex-row items-center px-4 py-3 rounded-full shadow-lg">
        <Ionicons name="call" size={20} color="white" />
        <Text className="text-white font-bold ml-2">Hotline</Text>
      </TouchableOpacity>
    </View>
  );
}
