import ForgotPasswordForm from '../../components/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Forgot Password - PG Rental',
  description: 'Reset your user account password',
};

export default function UserForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
