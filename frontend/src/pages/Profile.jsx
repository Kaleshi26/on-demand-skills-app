import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import clsx from 'clsx';

// FIXED: api (no extension), components/context (with .jsx extension)
import api from '../lib/api';
import { useAuth } from '../context/AuthContext.jsx';
import ImageUploader from '../components/ImageUploader.jsx';

// --- Icons ---
const Icons = {
  User: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Mail: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Badge: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  Save: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>,
  MapPin: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Clock: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Briefcase: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Camera: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Shield: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

// --- Schema & Data ---
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  address: z.string().max(200, 'Address must be less than 200 characters').optional(),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive').optional(),
  availabilityText: z.string().max(200, 'Availability text must be less than 200 characters').optional(),
  skills: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional()
});

const CATEGORIES_LIST = [
  'Furniture Assembly', 'Moving Help', 'Mounting & Installation', 'Cleaning', 
  'Yardwork', 'Handyman', 'Delivery', 'Pet Care', 'Photography', 'Tutoring'
];

const SKILLS_LIST = [
  'Professional', 'Reliable', 'Fast', 'Experienced', 'Friendly', 
  'Detail-oriented', 'Problem-solving', 'Communication', 'Time management', 'Customer service'
];

export default function Profile() {
  const { user, ready } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portfolioImages, setPortfolioImages] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '', email: '', bio: '', location: '', address: '',
      hourlyRate: 0, availabilityText: '', skills: [], categories: []
    }
  });

  const selectedSkills = watch('skills') || [];
  const selectedCategories = watch('categories') || [];

  // Load user data into form
  useEffect(() => {
    if (ready && user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
      setValue('bio', user.bio || '');
      setValue('location', user.location || '');
      setValue('address', user.address || '');
      setValue('hourlyRate', user.hourlyRate || 0);
      setValue('availabilityText', user.availabilityText || '');
      setValue('skills', user.skills || []);
      setValue('categories', user.categories || []);
      setPortfolioImages(user.portfolioImages || []);
      setLoading(false);
    }
  }, [user, ready, setValue]);

  const toggleSkill = (skill) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    setValue('skills', newSkills);
  };

  const toggleCategory = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setValue('categories', newCategories);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const updateData = { ...data, portfolioImages };
      await api.put('/auth/me', updateData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-48 bg-gray-200 rounded-2xl mb-8"></div>
          <div className="h-96 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-gray-500">Manage your profile, preferences, and provider details</p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Profile Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-10 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-28 w-28 rounded-full bg-white p-1 shadow-lg flex-shrink-0">
                <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || '?'}
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold">{user.name}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    <Icons.Badge />
                    <span className="capitalize">{user.role}</span>
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {user.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              
              {/* 1. Basic Information Section */}
              <section>
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Icons.User />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Icons.User />
                      </div>
                      <input
                        {...register('name')}
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Email Input (Read Only styling) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Icons.Mail />
                      </div>
                      <input
                        {...register('email')}
                        type="email"
                        readOnly
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-400">Email cannot be changed directly.</p>
                  </div>

                  {/* Bio Input */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Bio</label>
                    <textarea
                      {...register('bio')}
                      rows={3}
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Tell people a little about yourself..."
                    />
                    {errors.bio && <p className="text-xs text-red-600 mt-1">{errors.bio.message}</p>}
                  </div>
                </div>
              </section>

              {/* 2. Location Section */}
              <section>
                <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <Icons.MapPin />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Location</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">City / Area</label>
                    <input
                      {...register('location')}
                      type="text"
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g. New York, NY"
                    />
                    {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Full Address (Private)</label>
                    <input
                      {...register('address')}
                      type="text"
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g. 123 Main St"
                    />
                    {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address.message}</p>}
                  </div>
                </div>
              </section>

              {/* 3. Provider Specific Section */}
              {user.role === 'provider' && (
                <>
                  <section>
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <Icons.Briefcase />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Provider Details</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Hourly Rate ($)</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-bold">$</span>
                          <input
                            {...register('hourlyRate', { valueAsNumber: true })}
                            type="number"
                            min="0"
                            step="0.01"
                            className="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          />
                        </div>
                        {errors.hourlyRate && <p className="text-xs text-red-600 mt-1">{errors.hourlyRate.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Availability</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Icons.Clock />
                          </div>
                          <input
                            {...register('availabilityText')}
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g. Weekdays 9am-5pm"
                          />
                        </div>
                        {errors.availabilityText && <p className="text-xs text-red-600 mt-1">{errors.availabilityText.message}</p>}
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
                      <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                        <Icons.Shield />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Skills & Categories</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Professional Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {SKILLS_LIST.map(skill => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkill(skill)}
                              className={clsx(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                                selectedSkills.includes(skill)
                                  ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              )}
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Service Categories</label>
                        <div className="flex flex-wrap gap-2">
                          {CATEGORIES_LIST.map(category => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => toggleCategory(category)}
                              className={clsx(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                                selectedCategories.includes(category)
                                  ? "bg-green-600 text-white border-green-600 shadow-md transform scale-105"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                              )}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
                      <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                        <Icons.Camera />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Portfolio</h3>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 border-dashed">
                      <ImageUploader
                        images={portfolioImages}
                        onImagesChange={setPortfolioImages}
                        maxImages={10}
                      />
                    </div>
                  </section>
                </>
              )}

              {/* Action Buttons */}
              <div className="pt-8 border-t border-gray-100 flex items-center justify-end gap-4 sticky bottom-0 bg-white/90 backdrop-blur-sm py-4 -mx-8 px-8 border-t-2 border-t-gray-50">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => window.location.reload()} // Simple reset
                >
                  Cancel Changes
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl text-base font-bold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Icons.Save />
                      Save Changes
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </motion.div>

        {/* Security / Danger Zone */}
        <div className="mt-12 bg-white rounded-2xl border border-red-100 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-red-500 rounded-full"></span>
            Security Zone
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 bg-red-50/50 rounded-xl border border-red-50">
            <div>
              <h4 className="text-base font-bold text-gray-900">Delete Account</h4>
              <p className="text-sm text-gray-500 mt-1">
                Permanently remove your account and all of your content. This action cannot be undone.
              </p>
            </div>
            <button className="px-6 py-3 border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors whitespace-nowrap">
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}