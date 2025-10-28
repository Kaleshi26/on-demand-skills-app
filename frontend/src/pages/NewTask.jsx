// frontend/src/pages/NewTask.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/api';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import ImageUploader from '../components/ImageUploader';
import SectionHeading from '../components/SectionHeading';

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  category: z.string().min(1, 'Category is required'),
  locationText: z.string().min(3, 'Location must be at least 3 characters').max(200, 'Location must be less than 200 characters'),
  budgetType: z.enum(['fixed', 'hourly'], { required_error: 'Budget type is required' }),
  budget: z.number().min(1, 'Budget must be at least $1'),
  scheduledAt: z.string().optional()
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

export default function NewTask() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(taskSchema)
  });

  const budgetType = watch('budgetType');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const taskData = {
        ...data,
        budget: parseFloat(data.budget),
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString() : null
      };

      const formData = new FormData();
      Object.keys(taskData).forEach(key => {
        if (taskData[key] !== null && taskData[key] !== undefined) {
          formData.append(key, taskData[key]);
        }
      });

      // Add images
      images.forEach(image => {
        formData.append('photos', image);
      });

      await api.post('/tasks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Task posted successfully!');
      navigate('/tasks');
    } catch (error) {
      console.error('Create task error:', error);
      toast.error('Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-max py-10">
      <SectionHeading 
        title="Post a New Task" 
        subtitle="Describe what you need help with and find the right person for the job."
      />

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="e.g., Mount TV on living room wall"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Provide detailed information about what you need done..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              {...register('locationText')}
              type="text"
              placeholder="e.g., 123 Main St, New York, NY"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.locationText && (
              <p className="mt-1 text-sm text-red-600">{errors.locationText.message}</p>
            )}
          </div>

          {/* Budget Type and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Type *
              </label>
              <select
                {...register('budgetType')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
              {errors.budgetType && (
                <p className="mt-1 text-sm text-red-600">{errors.budgetType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Amount * ($)
              </label>
              <input
                {...register('budget', { valueAsNumber: true })}
                type="number"
                min="1"
                step="0.01"
                placeholder={budgetType === 'hourly' ? 'e.g., 25' : 'e.g., 150'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.budget && (
                <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
              )}
            </div>
          </div>

          {/* Scheduled Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date & Time (Optional)
            </label>
            <input
              {...register('scheduledAt')}
              type="datetime-local"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (Optional)
            </label>
            <ImageUploader
              images={images}
              onImagesChange={setImages}
              maxImages={5}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/tasks')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Posting...' : 'Post Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
