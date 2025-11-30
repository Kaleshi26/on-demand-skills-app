import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import Hero from '../components/Hero.jsx';
import ServiceCard from '../components/ServiceCard';

// --- Assets & Data ---

const CATEGORIES = [
  { 
    id: 'furniture',
    name: 'Furniture Assembly', 
    desc: 'Desks, beds, & cabinets',
    image: 'https://images.unsplash.com/photo-1581539250439-c923cd277c80?q=80&w=1200&auto=format&fit=crop' 
  },
  { 
    id: 'moving',
    name: 'Moving Help', 
    desc: 'Packing & heavy lifting',
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200&auto=format&fit=crop' 
  },
  { 
    id: 'mounting',
    name: 'Mounting', 
    desc: 'TVs, shelves, & art',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop' 
  },
  { 
    id: 'cleaning',
    name: 'Home Cleaning', 
    desc: 'Deep clean & organization',
    image: 'https://images.unsplash.com/photo-1581578731117-104f2a863ecc?q=80&w=1200&auto=format&fit=crop' 
  },
  { 
    id: 'plumbing',
    name: 'Plumbing Help', 
    desc: 'Leaks, toilets, & sinks',
    image: 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=1200&auto=format&fit=crop' 
  },
  { 
    id: 'electrical',
    name: 'Electrical', 
    desc: 'Lighting & appliances',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop' 
  },
];

// Inline Icons for Stability (No extra dependencies needed)
const Icons = {
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
  CheckUser: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Shield: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Clock: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Step1: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  Step2: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Step3: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

const FEATURES = [
  {
    title: "Vetted Professionals",
    desc: "Every Tasker is background checked and reviewed by the community.",
    icon: <Icons.CheckUser />
  },
  {
    title: "Secure Payments",
    desc: "Pay securely through the app only when the task is completed.",
    icon: <Icons.Shield />
  },
  {
    title: "Same-Day Availability",
    desc: "Find help in minutes for tasks that need doing today.",
    icon: <Icons.Clock />
  }
];

// --- Main Component ---

export default function Home() {
  const nav = useNavigate();
  const [query, setQuery] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data
  useEffect(() => {
    async function fetchPopular() {
      try {
        const { data } = await api.get('/services');
        // Sort by rating or just take first 6
        setServices(data.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPopular();
  }, []);

  // 2. Handlers
  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    nav(`/browse?q=${encodeURIComponent(query)}`);
  }

  // 3. Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-white">
      
      {/* --- HERO SECTION --- */}
      <Hero />

      {/* --- SEARCH OVERLAP SECTION --- */}
      <div className="relative -mt-8 z-20 max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100"
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Icons.Search />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
                placeholder="What do you need help with? (e.g. 'Clean my apartment')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-colors duration-200 shadow-lg shadow-blue-600/30"
            >
              Search
            </button>
          </form>
          
          {/* Quick Search Tags */}
          <div className="mt-4 flex flex-wrap gap-2 items-center text-sm text-gray-500">
            <span className="font-medium">Popular:</span>
            {['Moving', 'Cleaning', 'Plumbing', 'Mounting'].map(tag => (
              <button
                key={tag}
                onClick={() => nav(`/browse?q=${tag}`)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* --- CATEGORIES GRID --- */}
      <section className="py-16 sm:py-24 bg-gray-50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Discover</h2>
            <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Browse by Category
            </h3>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Select a category to find expert professionals in your area.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-64"
                onClick={() => nav(`/browse?category=${cat.name}`)}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h4 className="text-xl font-bold">{cat.name}</h4>
                  <p className="text-gray-200 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {cat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/browse" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
              View all categories 
              <span className="ml-2"><Icons.ArrowRight /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                The modern way to get tasks done.
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Forget the hassle of classifieds and cash payments. On-Demand Skills brings trust, speed, and quality to your doorstep.
              </p>
              
              <div className="mt-8 space-y-6">
                {FEATURES.map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{feature.title}</h4>
                      <p className="mt-1 text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Visual Side */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-3xl transform rotate-3 opacity-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop" 
                alt="Team working" 
                className="relative rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
              />
              
              {/* Floating Badge */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3"
              >
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                   <Icons.Shield />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Trust Score</p>
                  <p className="text-lg font-bold text-gray-900">100% Verified</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (3 Steps) --- */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900">How it works</h2>
              <p className="mt-4 text-lg text-gray-500">Get your tasks done in three simple steps.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
             <div className="text-center">
               <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-6">
                 <Icons.Step1 />
               </div>
               <h3 className="text-xl font-bold mb-2">1. Post a Task</h3>
               <p className="text-gray-500">Tell us what you need done, when you need it, and where.</p>
             </div>
             <div className="text-center">
               <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-6">
                 <Icons.Step2 />
               </div>
               <h3 className="text-xl font-bold mb-2">2. Choose a Tasker</h3>
               <p className="text-gray-500">Browse profiles, ratings, and reviews to find the perfect match.</p>
             </div>
             <div className="text-center">
               <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-6">
                 <Icons.Step3 />
               </div>
               <h3 className="text-xl font-bold mb-2">3. Get it Done</h3>
               <p className="text-gray-500">Your Tasker arrives and gets the job done. Pay securely when finished.</p>
             </div>
           </div>
        </div>
      </section>

      {/* --- POPULAR SERVICES (Fetching Data) --- */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Trending Services</h2>
              <p className="mt-2 text-gray-600">Highly rated services booked by people near you.</p>
            </div>
            <Link to="/browse" className="hidden sm:block text-blue-600 font-semibold hover:text-blue-700">
              See all
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-xl shadow-sm h-80 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service) => (
                <motion.div key={service._id} variants={itemVariants}>
                  <ServiceCard s={service} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No services found. Be the first to post one!</p>
              <Link to="/new-service" className="mt-4 inline-block text-blue-600 font-bold">
                Create Service
              </Link>
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/browse" className="text-blue-600 font-semibold">See all services</Link>
          </div>
        </div>
      </section>

      {/* --- PROVIDER CTA (Parallax Style) --- */}
      <section className="relative py-24 bg-blue-900 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop"
            alt="Provider Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-900/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Earn money your way.
            </h2>
            <p className="mt-4 text-xl text-blue-100 max-w-2xl">
              Join thousands of skilled professionals who are growing their business with SkillsApp. Set your own prices, choose your schedule, and get paid fast.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/become-a-provider"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-lg text-blue-900 bg-white hover:bg-blue-50 md:text-lg transition-transform hover:scale-105"
              >
                Become a Tasker
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-bold rounded-lg text-white hover:bg-white/10 md:text-lg"
              >
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS & TRUST --- */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {[
              { label: 'Happy Customers', value: '50k+' },
              { label: 'Jobs Completed', value: '120k+' },
              { label: 'Average Rating', value: '4.8/5' },
              { label: 'Cities Covered', value: '100+' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-extrabold text-gray-900">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}