// AdminTenants.test.jsx
// Component test for AdminTenants page
import { render, screen } from '@testing-library/react';
import AdminTenants from '../pages/admin/AdminTenants';
describe('AdminTenants', () => {
  it('renders tenant table', () => {
    render(<AdminTenants />);
    expect(screen.getByText('Admin Multi-Tenancy Management')).toBeInTheDocument();
  });
});
