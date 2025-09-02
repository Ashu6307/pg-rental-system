import RegisterForm from '../../components/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Registration - PG Rental',
  description: 'Create a new admin account',
};

export default function AdminRegisterPage() {
  return <RegisterForm />;
}
