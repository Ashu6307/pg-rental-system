import AdminLoginForm from '../../components/AdminLoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | Nestify',
  description: 'Admin portal login for Nestify management system',
  keywords: ['admin', 'login', 'pg rental', 'room rental', 'management', 'portal', 'flat'],
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
