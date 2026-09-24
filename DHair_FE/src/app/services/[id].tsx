import { useLocalSearchParams } from 'expo-router';
import ServiceDetails from '@/features/services/components/ServiceDetails';

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ServiceDetails key={id} id={id} />;
}
