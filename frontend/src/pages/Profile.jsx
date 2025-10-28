// frontend/src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaUser, FaHome, FaClock, FaShieldAlt, FaCamera } from 'react-icons/fa';
import api from '../lib/api';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import ImageUploader from '../components/ImageUploader';
import { useAuth } from '../context/AuthContext';

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

const skills = [
  'Professional',
  'Reliable',
  'Fast',
  'Experienced',
  'Friendly',
  'Detail-oriented',
  'Problem-solving',
  'Communication',
  'Time management',
  'Customer service'
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
      name: '',
      email: '',
      bio: '',
      location: '',
      address: '',
      hourlyRate: 0,
      availabilityText: '',
      skills: [],
      categories: []
    }
  });

  const selectedSkills = watch('skills') || [];
  const selectedCategories = watch('categories') || [];

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
      const updateData = {
        ...data,
        portfolioImages
      };

      await api.put('/auth/me', updateData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-max py-10">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-max py-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container-max py-10">
      <div className="max-w-2xl mx-auto">
        <SectionHeading 
          title="Edit Profile" 
          subtitle="Update your personal information and preferences."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaUser className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                {...register('bio')}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Location</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City/Area
                </label>
                <input
                  {...register('location')}
                  type="text"
                  placeholder="e.g., New York, NY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address
                </label>
                <input
                  {...register('address')}
                  type="text"
                  placeholder="e.g., 123 Main St, New York, NY 10001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Provider Information */}
          {user.role === 'provider' && (
            <>
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaClock className="w-6 h-6 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Provider Settings</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate ($)
                    </label>
                    <input
                      {...register('hourlyRate', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g., 25"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.hourlyRate && (
                      <p className="mt-1 text-sm text-red-600">{errors.hourlyRate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability
                    </label>
                    <input
                      {...register('availabilityText')}
                      type="text"
                      placeholder="e.g., Weekdays 9AM-6PM"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.availabilityText && (
                      <p className="mt-1 text-sm text-red-600">{errors.availabilityText.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaShieldAlt className="w-6 h-6 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Skills & Categories</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedSkills.includes(skill)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Service Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => toggleCategory(category)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedCategories.includes(category)
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FaCamera className="w-6 h-6 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Portfolio Images</h2>
                </div>

                <ImageUploader
                  images={portfolioImages}
                  onImagesChange={setPortfolioImages}
                  maxImages={10}
                />
              </div>
            </>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
