# Cross-Border E-Commerce Temporary Chat System

A real-time chat system for cross-border e-commerce that enables temporary communication without requiring friend requests.

## Features

- ✅ No friend request required - instant messaging
- ✅ Built-in translation (MyMemory API)
- ✅ Voice-to-text conversion
- ✅ Video calling (WebRTC)
- ✅ Temporary accounts with auto-cleanup
- ✅ Social media links integration
- ✅ User remarks/notes
- ✅ Community suggestions system
- ✅ Standalone integration ready

## Tech Stack

- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB with Mongoose
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Real-time**: WebSocket (Socket.IO)
- **Video**: WebRTC
- **Translation**: MyMemory API

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)

### Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

3. Start MongoDB:
```bash
mongod
```

4. Run the application:
```bash
npm start
# or for development
npm run dev
```

5. Access at: `http://localhost:3000`

## Deployment

### Production Server Setup

1. Install PM2 for process management:
```bash
npm install -g pm2
```

2. Start with PM2:
```bash
pm2 start server.js --name chat-system
pm2 save
pm2 startup
```

3. Setup Nginx reverse proxy (optional but recommended):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/verify` - Verify token

### Users
- `GET /api/user/search?q=username` - Search users
- `GET /api/user/:userId` - Get user details
- `PUT /api/user/:userId/social-links` - Update social links
- `GET /api/user/conversations?userId=id` - Get conversations

### Suggestions
- `POST /api/suggestions` - Submit suggestion
- `GET /api/suggestions` - Get all suggestions
- `POST /api/suggestions/:id/vote` - Vote on suggestion

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `NODE_ENV` - Environment (development/production)

## Security Considerations

- Change JWT_SECRET in production
- Enable HTTPS/TLS
- Implement rate limiting
- Add input validation
- Use CORS policies

## License

MIT
