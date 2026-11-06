import Banner from '@/features/home/components/Banner';
import CustomerCommitments from '@/features/home/components/CustomerCommitments';
import HomeHeader from '@/features/home/components/HomeHeader';
import QuickActions from '@/features/home/components/QuickActions';
import RatingCard from '@/features/home/components/RatingCard';
import ServiceSection from '@/features/home/components/ServiceSection';
import { useServices } from '@/features/services/useServices';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Mở DHair AI tư vấn kiểu tóc"
          onPress={() => router.push('/hair-advisor')}
          className="mx-4 mt-6 flex-row items-center gap-4 rounded-2xl bg-[#1a3673] p-5"
        >
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#304c85]">
            <Ionicons name="sparkles" size={25} color="#dce8ff" />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-bold tracking-[2px] text-[#c1d2f2]">
              DHAIR AI · XEM TRƯỚC
            </Text>
            <Text className="mt-1 text-lg font-bold text-white">Kiểu tóc nào dành cho bạn?</Text>
            <Text className="mt-1 text-xs leading-5 text-[#dce8ff]">
              Khám phá trợ lý tư vấn kiểu tóc của bạn.
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={22} color="white" />
        </TouchableOpacity>

        {/* 3. Rating Card */}
        <RatingCard />

        {/* 4. Banner */}
        <Banner />

        {/* Chính sách chăm sóc khách hàng và lối vào đặt lịch, tìm dịch vụ. */}
        <CustomerCommitments />

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
