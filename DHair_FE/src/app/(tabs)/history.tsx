import RequireAuth from '@/features/auth/components/RequireAuth';
import AppointmentHistory from '@/features/history/AppointmentHistory';

export default function HistoryScreen() {
  return (
    <RequireAuth>
      <AppointmentHistory />
    </RequireAuth>
  );
}
