// AdminGDPRConsents.test.jsx
// Component test for AdminGDPRConsents page
import { render, screen } from '@testing-library/react';
import AdminGDPRConsents from '../pages/admin/AdminGDPRConsents';
describe('AdminGDPRConsents', () => {
  it('renders GDPR consent table', () => {
    render(<AdminGDPRConsents />);
    expect(screen.getByText('Admin GDPR/Data Consent Management')).toBeInTheDocument();
  });
});
