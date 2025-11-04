# On‑Demand Skills App (MERN + Docker)

A complete service marketplace platform for connecting customers with local service providers. Built with modern web technologies and containerized for easy deployment.

## 🚀 Features

### Core Functionality
- **Task Posting**: Customers can post tasks with photos, location, and budget
- **Provider Offers**: Providers can submit offers for tasks
- **Real-time Messaging**: In-app chat with Socket.IO
- **Payment Processing**: Stripe integration with mock fallback
- **Service Listings**: Providers can create and manage service offerings
- **Reviews & Ratings**: Post-booking review system
- **Favorites**: Save services for later
- **File Uploads**: Image uploads for tasks, services, and profiles

### User Roles
- **Customers**: Post tasks, book services, manage bookings
- **Providers**: Submit offers, create services, manage availability
- **Admin**: Platform management and moderation

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express** (ESM modules)
- **MongoDB** with Mongoose
- **Socket.IO** for real-time messaging
- **Stripe** for payments (with mock fallback)
- **Multer** for file uploads
- **Express Validator** for input validation
- **JWT** for authentication

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** + **Zod** for forms
- **Socket.IO Client** for real-time features
- **React Hot Toast** for notifications
- **Date-fns** for date handling

### DevOps
- **Docker** + **Docker Compose**
- **MongoDB** container
- **Nginx** for frontend serving
- **Mailpit** for email testing (optional)

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd on-demand-skills-app
```

### 2. Build and Run
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up --build -d
```

### 3. Seed Database (Optional)
```bash
# Seed with demo data
docker-compose exec backend npm run seed
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health
- **Mailpit** (if enabled): http://localhost:8025

## 👥 Demo Accounts

After seeding the database, you can use these accounts:

### Admin
- **Email**: admin@example.com
- **Password**: password123
- **Role**: Admin (full platform access)

### Providers
- **Email**: provider1@example.com
- **Password**: password123
- **Role**: Provider (can create services and submit offers)
- **Additional**: provider2@example.com, provider3@example.com, etc.

### Customers
- **Email**: customer1@example.com
- **Password**: password123
- **Role**: Customer (can post tasks and book services)
- **Additional**: customer2@example.com, customer3@example.com

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables (configured in `docker-compose.yml`):

#### Required
- `PORT`: Backend server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT tokens
- `MONGO_URI`: MongoDB connection string
- `FRONTEND_URL`: Frontend URL for CORS and redirects

#### Optional
- `STRIPE_SECRET_KEY`: Stripe secret key for payments
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret
- `CLOUDINARY_URL`: Cloudinary URL for cloud image storage
- `NODE_ENV`: Environment (development/production)

### Payment Configuration

#### Stripe (Production)
1. Create a Stripe account and get your API keys
2. Uncomment and configure in `docker-compose.yml`:
   ```yaml
   - STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   - STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```
3. Restart the backend container

#### Mock Payments (Development)
If Stripe is not configured, the app automatically falls back to mock payments that immediately mark bookings as paid.

### File Storage

#### Local Storage (Default)
Files are stored in `./backend/uploads` and served via Express static middleware.

#### Cloudinary (Optional)
1. Create a Cloudinary account
2. Uncomment and configure in `docker-compose.yml`:
   ```yaml
   - CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
   ```
3. Restart the backend container

## 📱 Usage Guide

### For Customers

1. **Sign Up/Login** with a customer account
2. **Post a Task**:
   - Go to "Post Task" in the navbar
   - Fill in task details, location, budget, and photos
   - Submit and wait for provider offers
3. **Review Offers**:
   - View offers on your task detail page
   - Accept the best offer to create a booking
4. **Make Payment**:
   - Complete payment via Stripe or mock payment
   - Message your provider to coordinate
5. **Leave Reviews**:
   - After completion, rate and review your provider

### For Providers

1. **Sign Up/Login** and become a provider
2. **Create Services**:
   - Go to "Post Service" to create service listings
   - Set your rates, availability, and skills
3. **Browse Tasks**:
   - Visit the Task Board to find relevant tasks
   - Submit offers with your proposed price and timeline
4. **Manage Bookings**:
   - View accepted offers in your dashboard
   - Communicate with customers via messaging
5. **Build Reputation**:
   - Complete jobs to earn reviews and ratings

### For Admins

1. **Login** with admin credentials
2. **Monitor Platform**:
   - View all users, tasks, and services
   - Moderate content and handle disputes
3. **Manage Users**:
   - Approve provider applications
   - Handle user reports and issues

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Tasks
- `GET /api/tasks` - List tasks with filters
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PATCH /api/tasks/:id` - Update task
- `POST /api/tasks/:id/assign` - Assign task to provider

### Offers
- `POST /api/offers/task/:id` - Submit offer for task
- `GET /api/offers/task/:id` - Get task offers
- `GET /api/offers/my` - Get user's offers
- `PATCH /api/offers/:id/status` - Update offer status

### Messaging
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create/get conversation
- `GET /api/messages/conversation/:id` - Get conversation messages
- `POST /api/messages/conversation/:id` - Send message

### Payments
- `POST /api/payments/checkout` - Create payment session
- `POST /api/payments/webhooks/stripe` - Stripe webhook
- `GET /api/payments/status/:bookingId` - Get payment status

### File Uploads
- `POST /api/uploads/single` - Upload single image
- `POST /api/uploads/multiple` - Upload multiple images
- `DELETE /api/uploads/:filename` - Delete uploaded file

## 🧪 Testing

### Manual Testing Checklist

1. **Authentication Flow**
   - [ ] User registration
   - [ ] User login/logout
   - [ ] Protected route access

2. **Task Management**
   - [ ] Create task with photos
   - [ ] Browse and filter tasks
   - [ ] Submit and manage offers
   - [ ] Accept offers and create bookings

3. **Messaging**
   - [ ] Start conversations
   - [ ] Send/receive real-time messages
   - [ ] Message notifications

4. **Payments**
   - [ ] Create payment session
   - [ ] Complete mock payment
   - [ ] Verify booking status

5. **File Uploads**
   - [ ] Upload task photos
   - [ ] Upload service images
   - [ ] Upload profile images

### Health Check
```bash
# Check if all services are running
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "ok",
  "db": "connected",
  "time": "2024-01-01T00:00:00.000Z"
}
```

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**:
   - Set `NODE_ENV=production`
   - Configure production MongoDB URI
   - Set up Stripe production keys
   - Configure Cloudinary for file storage

2. **Security**:
   - Use strong JWT secrets
   - Enable HTTPS
   - Configure CORS for production domain
   - Set up rate limiting

3. **Monitoring**:
   - Set up logging
   - Monitor database performance
   - Track payment transactions
   - Monitor real-time connections

### Docker Production Build
```bash
# Build for production
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API health endpoint
- Review the demo accounts
- Check Docker container logs
- Ensure all environment variables are set

## 🔄 Updates

### Recent Changes
- Added real-time messaging with Socket.IO
- Implemented task posting and offer system
- Added Stripe payment integration
- Created comprehensive user profiles
- Added file upload functionality
- Implemented review and rating system
