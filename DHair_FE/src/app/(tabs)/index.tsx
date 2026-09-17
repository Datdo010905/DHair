import HomeHeader from '@/features/home/components/HomeHeader';
import ServiceSection from '@/features/home/components/ServiceSection';
import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Dữ liệu giả lập (Mock data)
const HAIR_SERVICES = [
  { id: '1', title: 'Cắt gội combo 1', image: require('../../../assets/img/product/cat-goi-combo-1-1.jpg') },
  { id: '2', title: 'Uốn Tiêu Chuẩn 1', image: require('../../../assets/img/product/uon-tieu-chuan.jpg') },
  { id: '3', title: 'Uốn Tiêu Chuẩn 2', image: require('../../../assets/img/product/cat-goi-combo-1-3.jpg') },
  { id: '4', title: 'Cắt xả tạo kiểu', image: require('../../../assets/img/product/cat-goi-combo-3.png') },
];

const SKIN_CARE_SERVICES = [
  { id: '1', title: 'Massage body tinh dầu', image: require('../../../assets/img/product/goi-thu-gian-3.png') },
  { id: '2', title: 'Gội đầu dưỡng sinh 1', image: require('../../../assets/img/product/goi-thu-gian-2.png') },
  { id: '3', title: 'Gội đầu dưỡng sinh 2', image: require('../../../assets/img/product/goi-thu-gian.png') },
  { id: '4', title: 'Lấy ráy tai', image: require('../../../assets/img/product/lay-ray-tai-1-1.jpg') },
];

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* 1. Header */}
        <HomeHeader />

        {/* 2. Quick Actions (Tạm code cứng ở đây, sau có thể tách file) */}
        <View className="flex-row justify-around mt-6 px-4">
          {['Ưu đãi', 'Cam kết', 'Hệ thống Salon'].map((item, index) => (
            <TouchableOpacity key={index} className="items-center">
              <View className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-sm mb-2 border border-gray-100">
                <Ionicons name={index === 0 ? "gift-outline" : index === 1 ? "shield-checkmark-outline" : "globe-outline"} size={24} color="#1a3673" />
              </View>
              <Text className="text-xs text-gray-600">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 3. Rating Card */}
        <View className="mx-4 mt-6 bg-[#f0f5ff] p-4 rounded-2xl flex-row items-center gap-4">
          <View className="w-12 h-12 bg-[#1a3673] rounded-full items-center justify-center">
            <Text className="text-white font-bold text-xs text-center">DHair</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[#1a3673] font-bold text-sm mb-1">MỜI ANH ĐÁNH GIÁ CHẤT LƯỢNG PHỤC VỤ</Text>
            <View className="flex-row">
              {[1,2,3,4,5].map(star => (
                <Ionicons key={star} name="star" size={20} color="#ffb800" />
              ))}
            </View>
          </View>
        </View>

        {/* 4. Banner (Ảnh giả lập) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6 pl-4">
           <View style={{ width: 400, height: 140, marginRight: 16, backgroundColor: '#bfdbfe', borderRadius: 12, overflow: 'hidden' }}>
              <Image
                source={require('../../../assets/img/SLIDE/slideshow_1.jpg')}
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
              />
           </View>
           <View style={{ width: 400, height: 140, marginRight: 16, backgroundColor: '#93c5fd', borderRadius: 12, overflow: 'hidden' }}>
              <Image
                source={require('../../../assets/img/SLIDE/slideshow_2.jpg')}
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
              />
           </View>
           <View style={{ width: 400, height: 140, marginRight: 16, backgroundColor: '#93c5fd', borderRadius: 12, overflow: 'hidden' }}>
              <Image
                source={require('../../../assets/img/SLIDE/slideshow_3.jpg')}
                resizeMode="cover"
                style={{ width: '100%', height: '100%' }}
              />
           </View>
        </ScrollView>

        {/* 5. Dịch Vụ Tóc */}
        <ServiceSection title="Dịch vụ tóc" data={HAIR_SERVICES} />

        {/* 6. Chăm sóc da */}
        <ServiceSection title="Chăm sóc da" data={SKIN_CARE_SERVICES} />

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