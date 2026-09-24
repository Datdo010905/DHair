import { Ionicons } from '@expo/vector-icons'; // Icon có sẵn trong Expo
import { Text, TouchableOpacity, View } from 'react-native';

export default function RatingCard() {
    return (
        <View className="mx-4 mt-6 bg-[#f0f5ff] p-4 rounded-2xl flex-row items-center gap-4">
            <View className="h-14 w-14 items-center justify-center gap-1 rounded-2xl bg-[#1a3673]">
                <Ionicons name="cut-outline" size={22} color="white" />
                <Text className="text-xs font-bold tracking-wide text-white">
                    DHair
                </Text>
            </View>
            <View className="flex-1">
                <Text className="text-[#1a3673] font-bold text-sm mb-1">CHẤT LƯỢNG PHỤC VỤ TẬN TÌNH</Text>
                <View className="flex-row">
                    {[1, 2, 3, 4, 5].map(star => (
                        <Ionicons key={star} name="star" size={20} color="#ffb800" />
                    ))}
                </View>
            </View>
        </View>
    );
}
