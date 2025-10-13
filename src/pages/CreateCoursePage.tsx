 // src/pages/CreateCoursePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createCourse } from "../services/courseService";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { SpinnerIcon } from "../components/Spinner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lessons state
  const [lessons, setLessons] = useState<{ title: string; content: string; orderIndex: number }[]>([]);
  const [lesson, setLesson] = useState({ title: "", content: "", orderIndex: 1 });

  // Handle course field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseDetails(prev => ({ ...prev, [name]: value }));
  };

  // Handle lesson field changes
  const handleLessonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLesson(prev => ({ ...prev, [name]: name === "orderIndex" ? Number(value) : value }));
  };

  // Add lesson
  const addLesson = () => {
    if (!lesson.title || !lesson.content) return;
    setLessons(prev => [...prev, lesson]);
    setLesson({ title: "", content: "", orderIndex: lessons.length + 2 });
  };

  // Handle image file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !imageFile) {
      setError("Please fill all fields and select an image.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", courseDetails.title);
    formData.append("description", courseDetails.description);
    formData.append("category", courseDetails.category);
    formData.append("image", imageFile);
    formData.append("lessons", JSON.stringify(lessons));

    try {
      await createCourse(formData, token);
      navigate("/instructor/my-courses");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Create a{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            New Course
          </span>
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Course Title */}
          <FormInput
            label="Course Title"
            id="title"
            name="title"
            type="text"
            required
            value={courseDetails.title}
            onChange={handleChange}
          />

          {/* Course Description with Markdown */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Description (Markdown)
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              required
              value={courseDetails.description}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
              placeholder="Write your course description in Markdown..."
            />
            {/* Live preview */}
            {courseDetails.description && (
              <div className="mt-2 p-3 border rounded bg-gray-50 text-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {courseDetails.description}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Category */}
          <FormInput
            label="Category"
            id="category"
            name="category"
            type="text"
            required
            value={courseDetails.category}
            onChange={handleChange}
          />

          {/* Course Image */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">
              Course Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              required
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gradient-to-r file:from-blue-100 file:to-indigo-100
                file:text-blue-700 hover:file:opacity-80 cursor-pointer"
            />
          </div>

          {/* Lessons Section */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Lessons</h2>

            <input
              type="text"
              name="title"
              placeholder="Lesson Title"
              value={lesson.title}
              onChange={handleLessonChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <textarea
              name="content"
              placeholder="Lesson Content (Markdown)"
              value={lesson.content}
              onChange={handleLessonChange}
              className="w-full mb-2 p-2 border rounded h-24"
            />

            {/* Preview lesson content */}
            {lesson.content && (
              <div className="mb-2 p-2 border rounded bg-gray-50 text-gray-800 text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
              </div>
            )}

            <input
              type="number"
              name="orderIndex"
              placeholder="Order Index"
              value={lesson.orderIndex}
              onChange={handleLessonChange}
              className="w-full mb-2 p-2 border rounded"
            />

            <button
              type="button"
              onClick={addLesson}
              className="mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Add Lesson
            </button>

            {/* List of lessons */}
            {lessons.length > 0 && (
              <div className="space-y-2">
                {lessons
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((l, idx) => (
                    <div key={idx} className="p-2 border rounded bg-gray-50">
                      <p className="font-medium">{l.orderIndex}. {l.title}</p>
                      <div className="text-gray-700 text-sm">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{l.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <SpinnerIcon className="w-5 h-5" />
                  Creating Course...
                </span>
              ) : (
                "Create Course"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePage;
