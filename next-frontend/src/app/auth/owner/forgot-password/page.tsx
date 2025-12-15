import ForgotPasswordForm from '../../components/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Owner Forgot Password | Nestify',
  description: 'Reset your owner account password for property management',
};

export default function OwnerForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
