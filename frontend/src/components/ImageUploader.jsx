// frontend/src/components/ImageUploader.jsx
import { useState, useRef } from 'react';
import { FaUpload, FaTimes, FaImage } from 'react-icons/fa';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function ImageUploader({ 
  images = [], 
  onImagesChange, 
  maxImages = 5, 
  className = '' 
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (files) => {
    if (files.length === 0) return;

    const newFiles = Array.from(files).slice(0, maxImages - images.length);
    if (newFiles.length === 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      newFiles.forEach(file => {
        formData.append('images', file);
      });

      const { data } = await api.post('/uploads/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newImages = data.files.map(file => file.url);
      onImagesChange([...images, ...newImages]);
      toast.success(`${newImages.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Upload Area */}
        {images.length < maxImages && (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-600">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 5MB each
                </p>
              </div>
            )}
          </div>
        )}

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Image Count */}
        <p className="text-sm text-gray-500">
          {images.length} of {maxImages} images uploaded
        </p>
      </div>
    </div>
  );
}
