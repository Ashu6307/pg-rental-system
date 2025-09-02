import AdminLoginForm from '../../components/AdminLoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login - PG Rental System',
  description: 'Admin portal login for PG Rental management system',
  keywords: ['admin', 'login', 'pg rental', 'management', 'portal'],
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
