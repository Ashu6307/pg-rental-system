import ForgotPasswordForm from '../../components/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Owner Forgot Password - PG Rental',
  description: 'Reset your owner account password',
};

export default function OwnerForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
