# Application Test Guide

## Prerequisites
1. Docker Desktop must be running
2. All containers should be built and running

## Quick Test Steps

### 1. Start the Application
```bash
docker-compose up --build
```

### 2. Check Health
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{
  "status": "ok",
  "db": "connected",
  "time": "2024-01-01T00:00:00.000Z"
}
```

### 3. Seed Database (Optional)
```bash
docker-compose exec backend npm run seed
```

### 4. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Manual Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login with existing user
- [ ] Logout functionality
- [ ] Protected routes work

### Task Management
- [ ] Post new task with photos
- [ ] Browse tasks with filters
- [ ] Submit offer for task
- [ ] Accept/decline offers
- [ ] Task assignment flow

### Messaging
- [ ] Start conversation
- [ ] Send/receive messages
- [ ] Real-time updates
- [ ] Message notifications

### Payments
- [ ] Create booking
- [ ] Process payment (mock)
- [ ] Verify payment status

### File Uploads
- [ ] Upload task photos
- [ ] Upload service images
- [ ] Upload profile images

## Demo Accounts
- Admin: admin@example.com / password123
- Provider: provider1@example.com / password123
- Customer: customer1@example.com / password123

## Troubleshooting

### Common Issues
1. **Docker not running**: Start Docker Desktop
2. **Port conflicts**: Check if ports 3000, 5000, 27017 are available
3. **Database connection**: Ensure MongoDB container is running
4. **Build errors**: Check Docker logs for specific errors

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo
```

### Reset Everything
```bash
# Stop and remove all containers
docker-compose down

# Remove volumes (WARNING: This will delete all data)
docker-compose down -v

# Rebuild and start
docker-compose up --build
```
