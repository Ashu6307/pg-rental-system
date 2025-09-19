# Invoice System Configuration

## Environment Variables Setup

The invoice system requires the following environment variables to be configured. Copy `.env.example` to `.env` and update with your actual values.

### Required Configuration

#### Database Configuration

```env
MONGODB_URI=mongodb://localhost:27017/pg-rental-system
```

#### Invoice Settings

```env
DEFAULT_TAX_RATE=18                 # Default tax percentage (customizable per invoice)
DEFAULT_PAYMENT_TERMS=30            # Default payment terms in days
DEFAULT_CURRENCY=INR                # Default currency for invoices
DEFAULT_LOCALE=en-IN               # Default locale for formatting
```

#### SMTP Email Configuration

```env
SMTP_HOST=smtp.gmail.com           # SMTP server host
SMTP_PORT=587                      # SMTP server port
SMTP_SECURE=false                  # true for 465, false for other ports
SMTP_USER=your-email@domain.com    # SMTP username
SMTP_PASS=your-app-password        # SMTP password or app password
```

#### Pagination Defaults

```env
DEFAULT_PAGE=1                     # Default page number for pagination
DEFAULT_PAGE_LIMIT=10              # Default number of items per page
```

### Features

#### Fully Dynamic Configuration

- **No hardcoded values**: All configurations are driven by environment variables
- **Flexible tax rates**: Set different tax rates per invoice or use system default
- **Configurable payment terms**: Customize payment due dates per invoice
- **Multi-currency support**: Change currency and locale formatting
- **Dynamic pagination**: Adjust default page sizes through environment variables

#### Email Service

- **SMTP configuration**: Fully configurable email settings
- **No static email templates**: All email content is dynamically generated
- **Environment validation**: System validates all required SMTP settings

#### PDF Generation

- **Dynamic formatting**: Currency and date formatting based on locale settings
- **No static templates**: All PDF content is generated from database data
- **Configurable styling**: All styling can be modified through code without hardcoded values

### Usage

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your actual configuration values

3. Start the server:

   ```bash
   npm start
   ```

### API Endpoints

All invoice endpoints are available at `/api/invoices`:

- `POST /api/invoices` - Create new invoice
- `GET /api/invoices` - Get all invoices with filtering
- `GET /api/invoices/stats` - Get invoice statistics
- `GET /api/invoices/:id` - Get specific invoice
- `PUT /api/invoices/:id` - Update invoice
- `PATCH /api/invoices/:id/mark-paid` - Mark invoice as paid
- `GET /api/invoices/:id/pdf` - Generate PDF
- `POST /api/invoices/:id/send-email` - Send invoice via email

### Security

- All endpoints require JWT authentication
- Role-based access control (owner, admin, tenant)
- Input validation and sanitization
- Environment variable validation