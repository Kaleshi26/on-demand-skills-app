import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
              >
                <span className="block xl:inline">Find the perfect</span>{' '}
                <span className="block text-blue-600 xl:inline">professional for you</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
              >
                Connect with skilled freelancers and local experts to get your job done. From home repairs to web development, we have you covered.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
              >
                <div className="rounded-md shadow">
                  <Link
                    to="/browse"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg transition-all hover:scale-105"
                  >
                    Find Services
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/become-a-provider"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg transition-all hover:scale-105"
                  >
                    Become a Provider
                  </Link>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
      
      {/* Abstract Background Graphic */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50 flex items-center justify-center">
         <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-64 sm:h-72 md:h-96 lg:h-full"
         >
            <svg className="absolute inset-0 w-full h-full text-blue-50" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 0 L100 0 L100 100 L0 80 Z" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                 {/* Simple Placeholder Illustration using Icons */}
                 <div className="grid grid-cols-2 gap-4 opacity-20">
                    <div className="w-24 h-24 bg-blue-400 rounded-2xl transform rotate-12"></div>
                    <div className="w-24 h-24 bg-blue-600 rounded-full transform -rotate-6"></div>
                    <div className="w-24 h-24 bg-indigo-500 rounded-full transform -rotate-12"></div>
                    <div className="w-24 h-24 bg-blue-300 rounded-2xl transform rotate-6"></div>
                 </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
}