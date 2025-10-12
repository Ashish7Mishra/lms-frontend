 // src/components/LessonForm.tsx

import React, { useState, useEffect } from "react";
import type { Lesson } from "../types";
import FormInput from "./FormInput";
import Button from "./Button";

interface LessonFormProps {
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  initialData?: Lesson | null;
}

const LessonForm: React.FC<LessonFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  initialData,
}) => {
  const [details, setDetails] = useState({
    title: "",
    content: "",
    order: "1",
  });
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", details.title);
    formData.append("content", details.content);
    formData.append("order", details.order);
    if (videoFile) {
      formData.append("video", videoFile);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Lesson Title */}
      <FormInput
        label="Lesson Title"
        name="title"
        value={details.title}
        onChange={handleChange}
        required
      />

      {/* Lesson Content */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={details.content}
          onChange={handleChange}
          rows={4}
          required
          placeholder="Enter lesson content or summary..."
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition sm:text-sm"
        />
      </div>

      {/* Lesson Order */}
      <FormInput
        label="Order"
        name="order"
        type="number"
        value={details.order}
        onChange={handleChange}
        required
        min="1"
      />

      {/* Video Upload */}
      <div>
        <label
          htmlFor="video"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          {initialData ? "Upload New Video (Optional)" : "Lesson Video"}
        </label>
        <input
          id="video"
          type="file"
          onChange={handleFileChange}
          required={!initialData}
          accept="video/*"
          className="block w-full text-sm text-gray-600
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-gradient-to-r file:from-blue-100 file:to-indigo-100
            file:text-blue-700 hover:file:opacity-80 cursor-pointer transition"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
        >
          Cancel
        </button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Lesson" : "Save Lesson"}
        </Button>
      </div>
    </form>
  );
};

export default LessonForm;
