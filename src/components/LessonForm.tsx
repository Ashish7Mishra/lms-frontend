// src/components/LessonForm.tsx

import React, { useState, useEffect } from 'react';
import type { Lesson } from '../types';
import FormInput from './FormInput';
import Button from './Button';

interface LessonFormProps {
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  initialData?: Lesson | null; // Pass existing data for editing
}

const LessonForm: React.FC<LessonFormProps> = ({ onSubmit, onCancel, isLoading, initialData }) => {
  const [details, setDetails] = useState({ title: '', content: '', order: '1' });
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setDetails({
        title: initialData.title,
        content: initialData.content,
        order: String(initialData.order),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', details.title);
    formData.append('content', details.content);
    formData.append('order', details.order);
    if (videoFile) {
      formData.append('video', videoFile);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput label="Lesson Title" name="title" value={details.title} onChange={handleChange} required />
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea name="content" value={details.content} onChange={handleChange} rows={3} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <FormInput label="Order" name="order" type="number" value={details.order} onChange={handleChange} required min="1" />
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {initialData ? 'Upload New Video (Optional)' : 'Lesson Video'}
        </label>
        <input type="file" onChange={handleFileChange} required={!initialData} accept="video/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-300">Cancel</button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Lesson'}
        </Button>
      </div>
    </form>
  );
};

export default LessonForm;