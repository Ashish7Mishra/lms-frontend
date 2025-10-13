// src/components/LessonForm.tsx

import React, { useState, useEffect } from 'react';
import type { Lesson } from '../types';
import Button from './Button';
import FormInput from './FormInput';

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        content: initialData.content,
        order: initialData.order,
      });
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
      if (errors.video) {
        setErrors(prev => ({ ...prev, video: '' }));
      }
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
    if (!initialData && !videoFile) {
      newErrors.video = 'Video file is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    
    if (videoFile) {
      data.append('video', videoFile);
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

      <div>
        <label htmlFor="video" className="block text-sm font-semibold text-gray-700 mb-1">
          Video File {initialData && '(Optional - leave empty to keep current video)'}
        </label>
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
        {errors.video && <p className="text-sm text-red-500 mt-1 font-medium">{errors.video}</p>}
        {videoFile && (
          <p className="text-sm text-gray-600 mt-1">Selected: {videoFile.name}</p>
        )}
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