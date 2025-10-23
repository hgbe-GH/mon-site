import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('@/features/AdminDashboard'), { ssr: false });

export default function AdminPage() {
  return <AdminDashboard />;
}
