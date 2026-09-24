import { Ionicons } from '@expo/vector-icons'; // Icon có sẵn trong Expo
import { Text, TouchableOpacity, View } from 'react-native';

export default function QuickActions() {
    return (
        <View className="flex-row justify-around mt-6 px-4">
            {['Ưu đãi', 'Cam kết', 'Hệ thống Salon'].map((item, index) => (
                <TouchableOpacity key={index} className="items-center">
                    <View className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-sm mb-2 border border-gray-100">
                        <Ionicons name={index === 0 ? "gift-outline" : index === 1 ? "shield-checkmark-outline" : "globe-outline"} size={24} color="#1a3673" />
                    </View>
                    <Text className="text-sm text-gray-600">{item}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
