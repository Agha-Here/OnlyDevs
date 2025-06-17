import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image, Video, FileText, Loader } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useForm } from 'react-hook-form';
import { createContent } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface ContentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ContentFormData {
  title: string;
  description: string;
  category: string;
  required_tier: string;
  duration: string;
}

const contentCategories = [
  { id: 'coding-in-bed', name: 'Coding in Bed', emoji: '🛏️' },
  { id: 'strip-the-bug', name: 'Strip the Bug', emoji: '🐛' },
  { id: 'dirty-algorithms', name: 'Dirty Algorithms', emoji: '💋' },
  { id: 'private-sessions', name: 'Private Sessions', emoji: '🔐' },
  { id: 'hot-takes', name: 'Hot Takes', emoji: '🔥' }
];

const subscriptionTiers = [
  { name: 'Free Tier', price: 0 },
  { name: 'Simp Tier', price: 9 },
  { name: 'Sugar Daddy Tier', price: 25 },
  { name: 'Whale Tier', price: 60 }
];

export const ContentUploadModal: React.FC<ContentUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContentFormData>();
  const { user } = useAuth();

  const onSubmit = async (data: ContentFormData) => {
    if (!user) {
      toast.error('Please login to upload content');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create content in database
      await createContent({
        creator_id: user.id,
        title: data.title,
        description: data.description,
        category: data.category,
        required_tier: data.required_tier,
        duration: data.duration,
        thumbnail_url: `https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400`
      });

      setUploadProgress(100);
      
      setTimeout(() => {
        toast.success('Content uploaded successfully! 🎉');
        reset();
        setSelectedFile(null);
        setUploadProgress(0);
        onSuccess?.();
        onClose();
      }, 500);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload content');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      reset();
      setSelectedFile(null);
      setUploadProgress(0);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Upload New Content</h2>
        <p className="text-gray-400">Share your expertise and make it rain 💰</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload File
          </label>
          <div className="border-2 border-dashed border-primary-500/30 rounded-xl p-6 text-center hover:border-secondary-500/50 transition-colors">
            <input
              type="file"
              accept="video/*,image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {selectedFile ? (
                <div className="flex items-center justify-center space-x-2">
                  {selectedFile.type.startsWith('video/') ? (
                    <Video size={24} className="text-secondary-500" />
                  ) : (
                    <Image size={24} className="text-secondary-500" />
                  )}
                  <span className="text-white">{selectedFile.name}</span>
                </div>
              ) : (
                <div>
                  <Upload size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Click to upload or drag and drop</p>
                  <p className="text-gray-500 text-sm">Video or Image files</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Uploading...</span>
              <span className="text-sm text-gray-300">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-dark-900 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-secondary-500 to-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title (make it irresistible 😈)
          </label>
          <input
            {...register('title', { 
              required: 'Title is required',
              minLength: { value: 5, message: 'Title must be at least 5 characters' }
            })}
            className="w-full px-4 py-3 bg-dark-900 border border-primary-500/30 rounded-xl text-white placeholder-gray-500 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 outline-none transition-all"
            placeholder="Debugging in My Pajamas 🛏️"
            disabled={isUploading}
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            {...register('description', { 
              required: 'Description is required',
              minLength: { value: 10, message: 'Description must be at least 10 characters' }
            })}
            rows={3}
            className="w-full px-4 py-3 bg-dark-900 border border-primary-500/30 rounded-xl text-white placeholder-gray-500 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 outline-none transition-all resize-none"
            placeholder="Describe what makes this content special..."
            disabled={isUploading}
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full px-4 py-3 bg-dark-900 border border-primary-500/30 rounded-xl text-white focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 outline-none transition-all"
            disabled={isUploading}
          >
            <option value="">Select a category</option>
            {contentCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.emoji} {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        {/* Required Tier */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Required Subscription Tier
          </label>
          <select
            {...register('required_tier', { required: 'Subscription tier is required' })}
            className="w-full px-4 py-3 bg-dark-900 border border-primary-500/30 rounded-xl text-white focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 outline-none transition-all"
            disabled={isUploading}
          >
            <option value="">Select minimum tier</option>
            {subscriptionTiers.map(tier => (
              <option key={tier.name} value={tier.name}>
                {tier.name} {tier.price > 0 && `($${tier.price}/month)`}
              </option>
            ))}
          </select>
          {errors.required_tier && (
            <p className="text-red-400 text-sm mt-1">{errors.required_tier.message}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duration (mm:ss)
          </label>
          <input
            {...register('duration', { 
              required: 'Duration is required',
              pattern: { value: /^\d{1,2}:\d{2}$/, message: 'Duration must be in mm:ss format' }
            })}
            className="w-full px-4 py-3 bg-dark-900 border border-primary-500/30 rounded-xl text-white placeholder-gray-500 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 outline-none transition-all"
            placeholder="15:30"
            disabled={isUploading}
          />
          {errors.duration && (
            <p className="text-red-400 text-sm mt-1">{errors.duration.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose} 
            className="flex-1"
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Upload Content
              </>
            )}
          </Button>
        </div>
      </form>

      <p className="text-center text-gray-400 text-xs mt-4">
        🔒 Your content is protected by our advanced DRM system
      </p>
    </Modal>
  );
};