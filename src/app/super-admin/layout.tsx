import ProtectedRoute from '@/components/ProtectedRoute';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="super_admin" fallbackPath="/dashboard">
      {children}
    </ProtectedRoute>
  );
}
