# No Blogger

A team collaboration platform with workspace management and invite functionality.

## Features

### Team Invite System
- Secure token-based invitations
- Email notifications
- Support for both existing and new users
- Plan-based team join limits
- 7-day expiration for invite links

For detailed documentation, see [Team Invite Feature](docs/INVITE_FEATURE.md)

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL
- Redis

### Installation

```bash
npm install --legacy-peer-deps
```

### Configuration

Create a `.env` file with the following variables:

```env
# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@example.com

# Frontend URL
FRONTEND_URL=https://example.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Redis
REDIS_URL=redis://localhost:6379
```

### Database Migration

```bash
npm run migration:run
```

### Development

```bash
npm run dev
```

### Testing

```bash
npm test
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── common/           # Common modules and utilities
│   └── services/
│       └── mail/     # Email service
├── features/         # Feature modules
│   ├── teams/        # Team management and invites
│   ├── users/        # User management
│   └── user-auth/    # Authentication
├── constants/        # Constants and enums
└── utils/           # Utility functions
```

## API Documentation

When running in development mode, Swagger documentation is available at:
```
http://localhost:3000/api-docs
```

## License

UNLICENSED
