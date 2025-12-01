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

const MONGO_URI = process.env.MONGO_URI || 'mongodb://skills-mongo:27017/skills-app';

// Default Password for everyone: "123456"
const PASSWORD_HASH = '$2a$10$wI.q/L8x/..'; // Pre-hashed "123456" to save time, or use await bcrypt.hash('123456', 10) inside main

const SRI_LANKAN_LOCATIONS = [
  { name: 'Colombo 03', geo: { type: 'Point', coordinates: [79.8612, 6.9271] } },
  { name: 'Kandy', geo: { type: 'Point', coordinates: [80.6337, 7.2906] } },
  { name: 'Nugegoda', geo: { type: 'Point', coordinates: [79.8997, 6.8649] } },
  { name: 'Mount Lavinia', geo: { type: 'Point', coordinates: [79.8655, 6.8336] } },
  { name: 'Galle', geo: { type: 'Point', coordinates: [80.2210, 6.0535] } },
  { name: 'Battaramulla', geo: { type: 'Point', coordinates: [79.9149, 6.9016] } },
  { name: 'Maharagama', geo: { type: 'Point', coordinates: [79.9234, 6.8480] } },
  { name: 'Kurunegala', geo: { type: 'Point', coordinates: [80.3609, 7.4818] } },
  { name: 'Negombo', geo: { type: 'Point', coordinates: [79.8737, 7.2008] } },
  { name: 'Matara', geo: { type: 'Point', coordinates: [80.5550, 5.9549] } },
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

    const hashedPassword = await bcrypt.hash('123456', 10);

    // --- 1. CREATE USERS ---
    const users = [];

    // Admin
    const admin = new User({
      name: 'Admin User',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin',
      location: 'Colombo',
      bio: 'Platform administrator',
      verified: { idVerified: true, backgroundChecked: true },
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff'
    });
    await admin.save();
    users.push(admin);

    // Providers (Real Sri Lankan Profiles)
    const providerData = [
      {
        name: 'Kasun Perera',
        email: 'kasun@test.com',
        location: 'Colombo 03',
        bio: 'Certified electrician with 10 years of experience in industrial and domestic wiring. I specialize in troubleshooting complex electrical issues.',
        hourlyRate: 2500,
        categories: ['Electrical', 'Smart Home'],
        skills: ['Wiring', 'CCTV', 'Safety Inspection'],
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        name: 'Dilani Silva',
        email: 'dilani@test.com',
        location: 'Kandy',
        bio: 'Professional English tutor specializing in IELTS and O/L support. I have a BA in English and 5 years of teaching experience.',
        hourlyRate: 1500,
        categories: ['Tutoring', 'Education'],
        skills: ['English', 'IELTS', 'Creative Writing'],
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        name: 'Roshan Liyanage',
        email: 'roshan@test.com',
        location: 'Nugegoda',
        bio: 'Professional mover with a 14ft lorry. We handle packing, safe transport, and unloading. Your furniture is safe with us.',
        hourlyRate: 3000,
        categories: ['Moving', 'Delivery'],
        skills: ['Heavy Lifting', 'Driving', 'Packing'],
        avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
      },
      {
        name: 'Chamari Jayasinghe',
        email: 'chamari@test.com',
        location: 'Mount Lavinia',
        bio: 'Deep cleaning specialist for homes and offices. I bring my own professional equipment and eco-friendly cleaning solutions.',
        hourlyRate: 1200,
        categories: ['Cleaning', 'Housekeeping'],
        skills: ['Deep Clean', 'Sanitization', 'Organization'],
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
      },
      {
        name: 'Nuwan Pradeep',
        email: 'nuwan@test.com',
        location: 'Galle',
        bio: 'Expert carpenter and furniture assembler. IKEA specialist. I can fix broken chairs, build cabinets, and restore antique furniture.',
        hourlyRate: 2000,
        categories: ['Furniture Assembly', 'Carpentry'],
        skills: ['Woodwork', 'Assembly', 'Restoration'],
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
      }
    ];

    const providers = [];
    for (const p of providerData) {
      const user = new User({
        ...p,
        password: hashedPassword,
        role: 'provider',
        verified: { idVerified: true, backgroundChecked: Math.random() > 0.3 },
        rating: 4.5 + (Math.random() * 0.5), // High ratings for demo
        reviewCount: Math.floor(Math.random() * 20) + 5,
        availabilityText: 'Weekdays 8am - 6pm'
      });
      await user.save();
      users.push(user);
      providers.push(user);
    }

    // Customers (Real Sri Lankan Profiles)
    const customerData = [
      { name: 'Tharindu Bandara', email: 'tharindu@test.com', location: 'Battaramulla', avatar: 'https://randomuser.me/api/portraits/men/11.jpg' },
      { name: 'Ishara Madushan', email: 'ishara@test.com', location: 'Maharagama', avatar: 'https://randomuser.me/api/portraits/men/54.jpg' },
      { name: 'Saman Kumara', email: 'saman@test.com', location: 'Kurunegala', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
      { name: 'Dinusha Senanayake', email: 'dinusha@test.com', location: 'Negombo', avatar: 'https://randomuser.me/api/portraits/women/29.jpg' },
      { name: 'Priyantha Gamage', email: 'priyantha@test.com', location: 'Matara', avatar: 'https://randomuser.me/api/portraits/men/76.jpg' }
    ];

    const customers = [];
    for (const c of customerData) {
      const user = new User({
        ...c,
        password: hashedPassword,
        role: 'customer',
        bio: 'Looking for reliable help with daily tasks.',
        verified: { idVerified: Math.random() > 0.5, backgroundChecked: false }
      });
      await user.save();
      users.push(user);
      customers.push(user);
    }

    console.log('✅ Created users');

    // --- 2. CREATE SERVICES ---
    const servicesList = [
      {
        title: 'Professional House Wiring & Repairs',
        description: 'I provide complete house wiring, breaker upgrades, and fault fixing. Licensed electrician with safety certification.',
        category: 'Electrical',
        price: 2500,
        image: 'https://picsum.photos/id/60/600/400' // Electrical tools
      },
      {
        title: 'IELTS Speaking & Writing Classes',
        description: 'Individual classes for students targeting band 7.0+. Online or physical classes in Kandy. Materials provided.',
        category: 'Tutoring',
        price: 3000,
        image: 'https://picsum.photos/id/201/600/400' // Person studying
      },
      {
        title: 'Reliable Lorry for Moving (14ft)',
        description: '14 feet lorry available for hire. Experienced helpers included. We handle loading and unloading carefully.',
        category: 'Moving',
        price: 4500,
        image: 'https://picsum.photos/id/1073/600/400' // Moving truck
      },
      {
        title: 'Deep House Cleaning Service',
        description: 'Full house deep cleaning including bathrooms, kitchens, and windows. We use eco-friendly products.',
        category: 'Cleaning',
        price: 1500,
        image: 'https://picsum.photos/id/284/600/400' // Cleaning
      },
      {
        title: 'IKEA & Damro Furniture Assembly',
        description: 'Expert assembly for wardrobes, beds, and tables. I bring my own tools and ensure everything is stable.',
        category: 'Furniture Assembly',
        price: 2000,
        image: 'https://picsum.photos/id/96/600/400' // Furniture assembly
      },
      {
        title: 'Wedding Photography Package',
        description: 'Full day coverage with preshoot. High quality editing and digital album delivery within 2 weeks.',
        category: 'Photography',
        price: 85000,
        image: 'https://picsum.photos/id/250/600/400' // Photography
      },
      {
        title: 'Plumbing Repairs & Installation',
        description: 'Fixing leaks, installing taps, and bathroom fittings. Fast service for emergencies in Galle area.',
        category: 'Plumbing',
        price: 1500,
        image: 'https://picsum.photos/id/431/600/400' // Plumbing
      },
      {
        title: 'Laptop Repair & OS Installation',
        description: 'Screen replacement, battery changes, and Windows/Mac OS installation. Data recovery services available.',
        category: 'Handyman',
        price: 3500,
        image: 'https://picsum.photos/id/119/600/400' // Laptop repair
      },
      {
        title: 'Garden Maintenance & Landscaping',
        description: 'Monthly garden maintenance packages available. Grass cutting, weeding, and planting.',
        category: 'Yardwork',
        price: 4000,
        image: 'https://picsum.photos/id/152/600/400' // Gardening
      },
      {
        title: 'Dog Walking & Pet Sitting',
        description: 'Trustworthy pet care when you are away. Daily walks and feeding for dogs and cats.',
        category: 'Pet Care',
        price: 1000,
        image: 'https://picsum.photos/id/200/600/400' // Pet care
      }
    ];

    const services = [];
    for (let i = 0; i < servicesList.length; i++) {
      const provider = providers[i % providers.length];
      const serviceData = servicesList[i];
      const service = new Service({
        owner: provider._id,
        provider: provider._id, // Some logic uses 'owner', some 'provider', populating both for safety
        title: serviceData.title,
        description: serviceData.description,
        category: serviceData.category,
        price: serviceData.price,
        rating: 4.5 + (Math.random() * 0.5),
        image: serviceData.image, // Using 'image' to match frontend ServiceCard
        coverImage: serviceData.image, // Backup field
        availabilityText: provider.availabilityText,
        isActive: true,
        tags: ['Professional', 'Reliable']
      });
      await service.save();
      services.push(service);
    }
    console.log('✅ Created services');

    // --- 3. CREATE TASKS ---
    const tasksList = [
      {
        title: 'Repair A/C in Master Bedroom',
        description: 'My LG inverter A/C is not cooling properly. It makes a strange humming noise and then stops. Need a technician to check the gas level and service it. Location is near Parliament road.',
        budget: 5000,
        category: 'Electrical',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600'
      },
      {
        title: 'Move Furniture to Apartment',
        description: 'Need help moving a sofa set, double door fridge, and washing machine from ground floor to 3rd floor. No elevator available, so you need strong helpers.',
        budget: 12000,
        category: 'Moving',
        image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=600'
      },
      {
        title: 'Grade 8 Maths Tuition Needed',
        description: 'Looking for a home tutor for my son. Sinhala medium Grade 8 Mathematics. 2 days per week (Tuesday and Thursday). Must be patient.',
        budget: 2000,
        category: 'Tutoring',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600'
      },
      {
        title: 'Wedding Photographer for Homecoming',
        description: 'Need a budget-friendly photographer for a small homecoming function in Negombo. 4 hours coverage. Digital album only.',
        budget: 45000,
        category: 'Photography',
        image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=600'
      },
      {
        title: 'Fix Leaking Water Pump',
        description: 'Water pump motor is leaking and making a loud noise. Brand is Singer. Need repair ASAP as we have no water in the tank.',
        budget: 3500,
        category: 'Plumbing',
        image: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=600'
      },
      {
        title: 'Garden Cleaning and Grass Cutting',
        description: '10 perch land needs grass cutting and general cleanup. There are some old boxes to remove as well. Green waste must be taken away.',
        budget: 6000,
        category: 'Yardwork',
        image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=600'
      },
      {
        title: 'Typing 50 Pages in Sinhala',
        description: 'I have a handwritten manuscript that needs to be typed in Unicode Sinhala. Font size 12. Must be completed by Friday.',
        budget: 4000,
        category: 'Delivery', // Using closest category or add Admin
        image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=600'
      },
      {
        title: 'Transport for Trip to Nuwara Eliya',
        description: 'Need a KDH van with a driver for a 2-day trip to Nuwara Eliya starting from Maharagama. 8 passengers. AC required.',
        budget: 35000,
        category: 'Delivery', // Using closest or add Transport
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600'
      },
      {
        title: 'Tiling a Bathroom Floor',
        description: 'Small bathroom (6x8) needs re-tiling. I have the tiles, need labor and cement work. Please bring your own cutter.',
        budget: 15000,
        category: 'Handyman',
        image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600'
      },
      {
        title: 'Graphic Design for FB Page',
        description: 'Need 5 social media posts designed for a clothing brand. Modern and minimalist style. I will provide the photos.',
        budget: 8000,
        category: 'Photography', // Close enough for demo
        image: 'https://images.unsplash.com/photo-1662947852193-70b139587b96?w=600&auto=format&fit=crop'
      },
      {
        title: 'Sofa Cleaning Service',
        description: 'L-shape fabric sofa needs deep cleaning / shampooing to remove stains. Light grey color.',
        budget: 7500,
        category: 'Cleaning',
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=600'
      },
      {
        title: 'CCTV Camera Installation',
        description: 'Install 4 cameras around my house. I have the DVR and cameras, need wiring and setup. Two cameras are outdoor.',
        budget: 10000,
        category: 'Electrical',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=600'
      },
      {
        title: 'Catering for Alms Giving (Dana)',
        description: 'Breakfast dana for 15 monks. Need menu proposals and pricing. Must be delivered by 6:30 AM.',
        budget: 25000,
        category: 'Delivery',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600'
      },
      {
        title: 'Car Interior Detailing',
        description: 'Full interior cleaning for a Toyota Premio. Seats, carpets, and dashboard. Remove smoke smell if possible.',
        budget: 6500,
        category: 'Cleaning',
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=600'
      },
      {
        title: 'Plastering a Wall',
        description: 'A boundary wall extension needs plastering. Approx 200 sqft. Sand and cement provided.',
        budget: 12000,
        category: 'Handyman',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600'
      }
    ];

    const tasks = [];
    for (let i = 0; i < tasksList.length; i++) {
      const taskData = tasksList[i];
      const customer = customers[i % customers.length];
      const task = new Task({
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        locationText: customer.location, // Use customer's location
        geo: { type: 'Point', coordinates: [0, 0] }, // Placeholder
        photos: [taskData.image],
        budgetType: 'fixed',
        budget: taskData.budget,
        scheduledAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        status: 'open',
        client: customer._id
      });
      await task.save();
      tasks.push(task);
    }
    console.log('✅ Created tasks');

    // --- 4. CREATE OFFERS ---
    const offers = [];
    for (let i = 0; i < 8; i++) {
      const task = tasks[i % tasks.length];
      const provider = providers[i % providers.length];
      
      const offer = new Offer({
        task: task._id,
        provider: provider._id,
        message: `Hi! I'd love to help you with this ${task.category} task. I have prior experience and can start immediately.`,
        proposedPrice: task.budget,
        proposedTimeWindow: 'Tomorrow Morning',
        status: 'sent'
      });
      await offer.save();
      offers.push(offer);
    }
    console.log('✅ Created offers');

    // --- 5. CREATE BOOKINGS ---
    const bookings = [];
    for (let i = 0; i < 5; i++) {
      const service = services[i % services.length];
      const customer = customers[i % customers.length];
      
      const booking = new Booking({
        service: service._id,
        customer: customer._id,
        provider: service.owner,
        status: ['pending', 'confirmed', 'completed'][i % 3],
        scheduledAt: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        notes: 'Please arrive on time.',
        totalPrice: service.price,
        source: 'service',
        paymentStatus: 'paid'
      });
      await booking.save();
      bookings.push(booking);
    }
    console.log('✅ Created bookings');

    // --- 6. CREATE REVIEWS ---
    for (let i = 0; i < 8; i++) {
      const service = services[i % services.length];
      const customer = customers[(i + 1) % customers.length];
      
      const review = new Review({
        service: service._id,
        author: customer._id,
        rating: 4 + Math.floor(Math.random() * 2), // 4 or 5 stars
        text: ['Excellent work!', 'Highly recommended.', 'Very professional.', 'Good job, but arrived slightly late.'][i % 4]
      });
      await review.save();
    }
    console.log('✅ Created reviews');

    // --- 7. CREATE CONVERSATIONS ---
    for (let i = 0; i < 3; i++) {
      const customer = customers[i];
      const provider = providers[i];
      const service = services[i];

      const conversation = new Conversation({
        members: [customer._id, provider._id],
        serviceId: service._id,
        lastMessageAt: new Date()
      });
      await conversation.save();

      const msgs = [
        { sender: customer._id, text: "Hi, is this service available this weekend?" },
        { sender: provider._id, text: "Yes, I am free on Saturday." },
        { sender: customer._id, text: "Great, I will book it now." }
      ];

      for (const m of msgs) {
        await new Message({
          conversation: conversation._id,
          sender: m.sender,
          text: m.text,
          seenBy: [m.sender]
        }).save();
      }
      
      conversation.lastMessage = msgs[msgs.length - 1].text;
      conversation.lastMessageSender = msgs[msgs.length - 1].sender;
      await conversation.save();
    }
    console.log('✅ Created conversations');

    console.log('\n🎉 Database seeded successfully with Sri Lankan data!');
    console.log('\nDemo accounts (Password: 123456):');
    console.log('Providers: kasun@test.com, dilani@test.com, roshan@test.com');
    console.log('Customers: tharindu@test.com, ishara@test.com');

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