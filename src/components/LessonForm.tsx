// src/components/LessonForm.tsx

import React, { useState, useEffect } from 'react';
import type { Lesson } from '../types';
import Button from './Button';
import FormInput from './FormInput';
import { Link as LinkIcon, Upload } from 'lucide-react';

interface LessonFormProps {
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  initialData?: Lesson | null;
}

const LessonForm: React.FC<LessonFormProps> = ({ onSubmit, onCancel, isLoading, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    order: initialData?.order || 1,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState('');
  const [videoInputType, setVideoInputType] = useState<'upload' | 'link'>('upload');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        order: initialData.order,
      });
      // If editing and there's a video URL, check if it's a link or upload
      if (initialData.videoUrl && initialData.videoType === 'link') {
        setVideoInputType('link');
        setVideoLink(initialData.videoUrl);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'order' ? parseInt(value) : value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setVideoLink(''); // Clear link if file is selected
      if (errors.video) {
        setErrors(prev => ({ ...prev, video: '' }));
      }
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoLink(e.target.value);
    setVideoFile(null); // Clear file if link is entered
    if (errors.video) {
      setErrors(prev => ({ ...prev, video: '' }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (formData.order < 1) {
      newErrors.order = 'Order must be at least 1';
    }
    
    // Video validation: require either file or link for new lessons
    if (!initialData) {
      if (videoInputType === 'upload' && !videoFile) {
        newErrors.video = 'Please upload a video file';
      }
      if (videoInputType === 'link' && !videoLink.trim()) {
        newErrors.video = 'Please provide a video link';
      }
      if (videoInputType === 'link' && videoLink.trim() && !isValidUrl(videoLink)) {
        newErrors.video = 'Please provide a valid video URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('order', formData.order.toString());
    
    // Handle video based on input type
    if (videoInputType === 'upload' && videoFile) {
      data.append('video', videoFile);
      data.append('videoType', 'upload');
    } else if (videoInputType === 'link' && videoLink.trim()) {
      data.append('videoUrl', videoLink);
      data.append('videoType', 'link');
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormInput
        label="Lesson Title"
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g., Introduction to React"
        required
        error={errors.title}
      />

      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">
          Lesson Description
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Provide a brief description of this lesson..."
          required
          rows={4}
          className={`block w-full px-4 py-2 border rounded-lg shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.content && <p className="text-sm text-red-500 mt-1 font-medium">{errors.content}</p>}
      </div>

      <FormInput
        label="Lesson Order"
        type="number"
        name="order"
        value={formData.order}
        onChange={handleChange}
        min={1}
        required
        error={errors.order}
      />

      {/* Video Input Type Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Video Source {initialData && '(Optional - leave empty to keep current video)'}
        </label>
        
        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setVideoInputType('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              videoInputType === 'upload'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload className="h-4 w-4" />
            Upload Video
          </button>
          <button
            type="button"
            onClick={() => setVideoInputType('link')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              videoInputType === 'link'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            Video Link
          </button>
        </div>

        {/* Upload Input */}
        {videoInputType === 'upload' && (
          <div>
            <input
              type="file"
              id="video"
              name="video"
              accept="video/*"
              onChange={handleFileChange}
              className={`block w-full px-4 py-2 border rounded-lg shadow-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.video ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {videoFile && (
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                <span className="text-green-600">✓</span> Selected: {videoFile.name}
              </p>
            )}
          </div>
        )}

        {/* Link Input */}
        {videoInputType === 'link' && (
          <div>
            <input
              type="url"
              id="videoLink"
              name="videoLink"
              value={videoLink}
              onChange={handleLinkChange}
              placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
              className={`block w-full px-4 py-2 border rounded-lg shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${
                errors.video ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {videoLink && isValidUrl(videoLink) && (
              <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                <span>✓</span> Valid URL
              </p>
            )}
          </div>
        )}

        {errors.video && <p className="text-sm text-red-500 mt-2 font-medium">{errors.video}</p>}
        
        <p className="text-xs text-gray-500 mt-2">
          {videoInputType === 'upload' 
            ? 'Upload a video file from your computer (MP4, MOV, AVI, etc.)'
            : 'Provide a direct link to a video (supports YouTube, Vimeo, Cloudinary, etc.)'}
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition"
          disabled={isLoading}
        >
          Cancel
        </button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : initialData ? 'Update Lesson' : 'Create Lesson'}
        </Button>
      </div>
    </form>
  );
};

export default LessonForm;