// backend/src/seed.js
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Service from './models/Service.js';
import Task from './models/Task.js';
import Offer from './models/Offer.js';
import Booking from './models/Booking.js';
import Review from './models/Review.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/skillsapp';

const categories = [
  'Furniture Assembly',
  'Moving Help', 
  'Mounting & Installation',
  'Cleaning',
  'Yardwork',
  'Handyman',
  'Delivery',
  'Pet Care',
  'Photography',
  'Tutoring'
];

const locations = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA'
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Task.deleteMany({});
    await Offer.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    const users = [];
    
    // Admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      location: 'San Francisco, CA',
      bio: 'Platform administrator',
      verified: { idVerified: true, backgroundChecked: true }
    });
    await admin.save();
    users.push(admin);

    // Provider users
    const providers = [];
    for (let i = 1; i <= 5; i++) {
      const provider = new User({
        name: `Provider ${i}`,
        email: `provider${i}@example.com`,
        password: 'password123',
        role: 'provider',
        location: locations[i % locations.length],
        bio: `Experienced professional in ${categories[i % categories.length].toLowerCase()}`,
        hourlyRate: 25 + (i * 5),
        categories: [categories[i % categories.length], categories[(i + 1) % categories.length]],
        skills: ['Professional', 'Reliable', 'Fast'],
        verified: { 
          idVerified: Math.random() > 0.3, 
          backgroundChecked: Math.random() > 0.2 
        },
        rating: 4.0 + (Math.random() * 1),
        reviewCount: Math.floor(Math.random() * 50) + 10
      });
      await provider.save();
      users.push(provider);
      providers.push(provider);
    }

    // Customer users
    const customers = [];
    for (let i = 1; i <= 3; i++) {
      const customer = new User({
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        password: 'password123',
        role: 'customer',
        location: locations[(i + 5) % locations.length],
        bio: `Looking for reliable help with various tasks`
      });
      await customer.save();
      users.push(customer);
      customers.push(customer);
    }

    console.log('✅ Created users');

    // Create services
    const services = [];
    for (let i = 0; i < 8; i++) {
      const provider = providers[i % providers.length];
      const service = new Service({
        owner: provider._id,
        title: `${categories[i % categories.length]} Service`,
        description: `Professional ${categories[i % categories.length].toLowerCase()} service. I have ${Math.floor(Math.random() * 10) + 2} years of experience and provide high-quality work.`,
        category: categories[i % categories.length],
        price: 50 + (Math.random() * 100),
        rating: 4.0 + (Math.random() * 1),
        tags: ['Professional', 'Reliable', 'Fast'],
        coverImage: `https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=400&auto=format&fit=crop`,
        availabilityText: 'Available weekdays 9AM-6PM, weekends by appointment',
        isActive: true
      });
      await service.save();
      services.push(service);
    }

    console.log('✅ Created services');

    // Create tasks
    const tasks = [];
    for (let i = 0; i < 6; i++) {
      const customer = customers[i % customers.length];
      const location = locations[i % locations.length];
      const task = new Task({
        title: `Need help with ${categories[i % categories.length]}`,
        description: `I need assistance with ${categories[i % categories.length].toLowerCase()}. Looking for someone reliable and experienced.`,
        category: categories[i % categories.length],
        locationText: location,
        geo: {
          type: 'Point',
          coordinates: [-74.006 + (Math.random() - 0.5) * 0.1, 40.7128 + (Math.random() - 0.5) * 0.1]
        },
        photos: [`https://images.unsplash.com/photo-${1600000000000 + i}?q=80&w=400&auto=format&fit=crop`],
        budgetType: Math.random() > 0.5 ? 'fixed' : 'hourly',
        budget: 75 + (Math.random() * 150),
        scheduledAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Within next week
        status: ['open', 'assigned', 'completed'][Math.floor(Math.random() * 3)],
        client: customer._id
      });
      await task.save();
      tasks.push(task);
    }

    console.log('✅ Created tasks');

    // Create offers
    const offers = [];
    for (let i = 0; i < 8; i++) {
      const task = tasks[i % tasks.length];
      const provider = providers[i % providers.length];
      
      // Don't create offers for completed tasks
      if (task.status === 'completed') continue;
      
      const offer = new Offer({
        task: task._id,
        provider: provider._id,
        message: `Hi! I'd love to help you with this ${task.category.toLowerCase()} task. I have experience in this area and can complete it professionally.`,
        proposedPrice: task.budget * (0.8 + Math.random() * 0.4), // 80-120% of budget
        proposedTimeWindow: ['2-4 hours', 'Half day', 'Full day', 'Tomorrow morning'][Math.floor(Math.random() * 4)],
        status: ['sent', 'accepted', 'declined'][Math.floor(Math.random() * 3)]
      });
      await offer.save();
      offers.push(offer);
    }

    console.log('✅ Created offers');

    // Create bookings
    const bookings = [];
    for (let i = 0; i < 4; i++) {
      const service = services[i % services.length];
      const customer = customers[i % customers.length];
      
      const booking = new Booking({
        service: service._id,
        customer: customer._id,
        provider: service.owner,
        status: ['pending', 'confirmed', 'completed'][Math.floor(Math.random() * 3)],
        scheduledAt: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000), // Within next 2 weeks
        notes: 'Please arrive on time and bring necessary tools.',
        totalPrice: service.price,
        source: 'service',
        paymentStatus: Math.random() > 0.5 ? 'paid' : 'unpaid'
      });
      await booking.save();
      bookings.push(booking);
    }

    console.log('✅ Created bookings');

    // Create reviews
    for (let i = 0; i < 6; i++) {
      const service = services[i % services.length];
      const customer = customers[i % customers.length];
      
      const review = new Review({
        service: service._id,
        author: customer._id,
        rating: 3 + Math.floor(Math.random() * 3), // 3-5 stars
        text: ['Great service!', 'Very professional.', 'Would recommend!', 'Excellent work.', 'Fast and reliable.'][Math.floor(Math.random() * 5)]
      });
      await review.save();
    }

    console.log('✅ Created reviews');

    // Create conversations and messages
    for (let i = 0; i < 3; i++) {
      const customer = customers[i % customers.length];
      const provider = providers[i % providers.length];
      
      const conversation = new Conversation({
        members: [customer._id, provider._id],
        serviceId: services[i % services.length]._id,
        lastMessageAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
      await conversation.save();

      // Add some messages
      const messages = [
        'Hi! I\'m interested in your service.',
        'Great! When would you like to schedule it?',
        'How about this weekend?',
        'That works for me. I\'ll send you the details.'
      ];

      for (let j = 0; j < messages.length; j++) {
        const message = new Message({
          conversation: conversation._id,
          sender: j % 2 === 0 ? customer._id : provider._id,
          text: messages[j],
          seenBy: [j % 2 === 0 ? customer._id : provider._id]
        });
        await message.save();
      }

      // Update conversation with last message
      conversation.lastMessage = messages[messages.length - 1];
      conversation.lastMessageSender = provider._id;
      await conversation.save();
    }

    console.log('✅ Created conversations and messages');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nDemo accounts:');
    console.log('Admin: admin@example.com / password123');
    console.log('Providers: provider1@example.com / password123 (provider2, provider3, etc.)');
    console.log('Customers: customer1@example.com / password123 (customer2, customer3)');
    console.log('\nTotal created:');
    console.log(`- ${users.length} users (1 admin, ${providers.length} providers, ${customers.length} customers)`);
    console.log(`- ${services.length} services`);
    console.log(`- ${tasks.length} tasks`);
    console.log(`- ${offers.length} offers`);
    console.log(`- ${bookings.length} bookings`);
    console.log(`- 6 reviews`);
    console.log(`- 3 conversations with messages`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
