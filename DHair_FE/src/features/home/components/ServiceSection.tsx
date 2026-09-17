import { Image, ScrollView, Text, TouchableOpacity, View, type ImageSourcePropType } from 'react-native';

interface ServiceItem {
  id: string;
  title: string;
  image: ImageSourcePropType;
}

interface Props {
  title: string;
  data: ServiceItem[];
}

export default function ServiceSection({ title, data }: Props) {
  return (
    <View className="mt-6 pl-4">
      <Text className="text-[#1a3673] font-bold text-lg mb-3 uppercase">
        {title}
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pr-4">
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{
              marginRight: 16,
              width: 144,
              backgroundColor: '#fff',
              borderRadius: 12,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Image
              source={item.image}
              resizeMode="cover"
              style={{ width: '100%', height: 128 }}
            />
            <View className="p-2 items-center">
              <Text className="text-center font-semibold text-[#1a3673] text-sm" numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}