import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ServiceSearchCard from '@/features/services/components/ServiceSearchCard';
import type { ServiceCategory } from '@/features/services/types';
import { useServiceSearch } from '@/features/services/useServiceSearch';

const categories: { value: ServiceCategory; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'hair', label: 'Dịch vụ tóc' },
  { value: 'skinCare', label: 'Chăm sóc da' },
];

export default function SearchScreen() {
  const {
    results, isLoading, error, reload,
    query, setQuery, category, setCategory, resetFilters,
  } = useServiceSearch();
  const hasFilters = query.trim().length > 0 || category !== 'all';

  function renderEmptyState() {
    if (isLoading) {
      return (
        <View className="items-center py-16">
          <ActivityIndicator size="large" color="#1a3673" />
          <Text className="mt-4 text-sm text-[#64748b]">Đang tải dịch vụ...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="items-center rounded-2xl bg-white px-6 py-10">
          <Ionicons name="cloud-offline-outline" size={36} color="#8496b0" />
          <Text className="mt-4 text-base font-bold text-[#172b4d]">Chưa thể tải dịch vụ</Text>
          <Text accessibilityRole="alert" className="mt-2 text-center text-sm leading-6 text-[#64748b]">
            {error}
          </Text>
          <Pressable accessibilityRole="button" onPress={reload} className="mt-5 rounded-full bg-[#1a3673] px-6 py-3">
            <Text className="font-semibold text-white">Thử lại</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View className="items-center px-6 py-12">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-[#eaf0f9]">
          <Ionicons name="search-outline" size={32} color="#6780a3" />
        </View>
        <Text className="mt-5 text-base font-bold text-[#172b4d]">
          {hasFilters ? 'Không tìm thấy dịch vụ' : 'Chưa có dịch vụ'}
        </Text>
        <Text className="mt-2 text-center text-sm leading-6 text-[#64748b]">
          {hasFilters ? 'Thử tên dịch vụ khác hoặc đổi nhóm dịch vụ nhé.' : 'Các dịch vụ mới sẽ được cập nhật tại đây.'}
        </Text>
        {hasFilters && (
          <Pressable accessibilityRole="button" onPress={resetFilters} className="mt-5 rounded-full bg-[#1a3673] px-6 py-3">
            <Text className="font-semibold text-white">Xóa bộ lọc</Text>
          </Pressable>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View className="px-5 pb-4 pt-5">
          <View className="mb-5 flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-[11px] font-bold uppercase tracking-[3px] text-[#6780a3]">DHAIR SERVICES</Text>
              <Text className="mt-2 text-[28px] font-bold text-[#172b4d]">Tìm dịch vụ</Text>
              <Text className="mt-1 text-sm leading-5 text-[#64748b]">Một chút chăm sóc, một diện mạo mới.</Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#e8eef9]">
              <Ionicons name="cut-outline" size={25} color="#1a3673" />
            </View>
          </View>

          <View className="min-h-14 flex-row items-center rounded-2xl border border-[#dce4ef] bg-white pl-4 pr-1">
            <Ionicons name="search-outline" size={21} color="#6780a3" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              accessibilityLabel="Tìm theo tên dịch vụ"
              placeholder="Tìm cắt tóc, gội đầu, chăm sóc da..."
              placeholderTextColor="#8b99ad"
              autoCorrect={false}
              returnKeyType="search"
              className="min-h-14 flex-1 px-3 py-3 text-sm text-[#172b4d]"
            />
            {query.length > 0 && (
              <Pressable accessibilityRole="button" accessibilityLabel="Xóa từ khóa" onPress={() => setQuery('')} className="h-11 w-11 items-center justify-center">
                <Ionicons name="close-circle" size={20} color="#8b99ad" />
              </Pressable>
            )}
          </View>

          <View className="mt-4 flex-row flex-wrap gap-2">
            {categories.map((item) => {
              const isSelected = category === item.value;
              return (
                <Pressable
                  key={item.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setCategory(item.value)}
                  className={`min-h-11 justify-center rounded-full border px-4 py-2 ${isSelected ? 'border-[#1a3673] bg-[#1a3673]' : 'border-[#e1e7f0] bg-white'}`}
                >
                  <Text className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-[#64748b]'}`}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <FlatList
          data={results}
          keyExtractor={(item) => item.MADV}
          renderItem={({ item }) => <ServiceSearchCard service={item} />}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={reload}
          ListHeaderComponent={
            <View className="mb-4 mt-1 flex-row items-center justify-between">
              <Text className="text-base font-bold text-[#172b4d]">
                {hasFilters ? 'Kết quả tìm kiếm' : 'Khám phá dịch vụ'}
              </Text>
              {!isLoading && !error && (
                <Text accessibilityLiveRegion="polite" className="text-xs text-[#64748b]">{results.length} dịch vụ</Text>
              )}
            </View>
          }
          ListEmptyComponent={renderEmptyState()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f9fc' },
  container: { flex: 1, width: '100%', maxWidth: 640, alignSelf: 'center' },
  list: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 24 },
});
