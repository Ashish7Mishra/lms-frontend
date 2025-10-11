// src/pages/CreateCoursePage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createCourse } from '../services/courseService';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [courseDetails, setCourseDetails] = useState({
    title: '',
    description: '',
    category: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !imageFile) {
      setError("Please fill all fields and select an image.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', courseDetails.title);
    formData.append('description', courseDetails.description);
    formData.append('category', courseDetails.category);
    formData.append('image', imageFile);

    try {
      await createCourse(formData, token);
      navigate('/instructor/my-courses');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create a New Course</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <span>{error}</span>
            </div>
          )}

          <FormInput
            label="Course Title" id="title" name="title" type="text"
            required value={courseDetails.title} onChange={handleChange}
          />
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description" name="description" rows={4} required
              value={courseDetails.description} onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <FormInput
            label="Category" id="category" name="category" type="text"
            required value={courseDetails.category} onChange={handleChange}
          />

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Course Image
            </label>
            <input
              id="image" name="image" type="file" required
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          <div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Course...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePage;