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
    if (videoFile) formData.append("video", videoFile);
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-100 space-y-6"
    >
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
        {initialData ? "Edit Lesson" : "Add New Lesson"}
      </h2>

      {/* Title Input */}
      <FormInput
        label="Lesson Title"
        name="title"
        value={details.title}
        onChange={handleChange}
        required
      />

      {/* Content Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Content
        </label>
        <textarea
          name="content"
          value={details.content}
          onChange={handleChange}
          rows={4}
          required
          placeholder="Write a brief overview or description of this lesson..."
          className="mt-1 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow p-3 text-gray-800 placeholder-gray-400 resize-none"
        />
      </div>

      {/* Order Input */}
      <FormInput
        label="Lesson Order"
        name="order"
        type="number"
        value={details.order}
        onChange={handleChange}
        required
        min="1"
      />

      {/* File Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {initialData ? "Upload New Video (Optional)" : "Lesson Video"}
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          required={!initialData}
          accept="video/*"
          className="mt-2 block w-full text-sm text-gray-600
            file:mr-4 file:py-2.5 file:px-4 file:rounded-lg
            file:border-0 file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100 transition-all cursor-pointer"
        />

        {initialData && (
          <p className="text-xs text-gray-500 mt-2">
            Current video will remain unless you upload a new one.
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end items-center space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-lg shadow-sm transition-all"
        >
          Cancel
        </button>
        <Button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 rounded-lg"
        >
          {isLoading ? "Saving..." : initialData ? "Update Lesson" : "Save Lesson"}
        </Button>
      </div>
    </form>
  );
};

export default LessonForm;
