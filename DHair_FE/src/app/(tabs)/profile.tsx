import RequireAuth from '@/features/auth/components/RequireAuth';
import AccountProfile from '@/features/profile/AccountProfile';

export default function ProfileScreen() {
  return (
    <RequireAuth>
      <AccountProfile />
    </RequireAuth>
  );
}
