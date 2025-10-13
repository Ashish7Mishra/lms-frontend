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
  const [isPreview, setIsPreview] = useState(false);

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

  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    let newText = '';
    let cursorOffset = 0;

    switch(syntax) {
      case 'bold':
        newText = `**${textToInsert}**`;
        cursorOffset = selectedText ? newText.length : 2;
        break;
      case 'italic':
        newText = `*${textToInsert}*`;
        cursorOffset = selectedText ? newText.length : 1;
        break;
      case 'heading':
        newText = `## ${textToInsert}`;
        cursorOffset = selectedText ? newText.length : 3;
        break;
      case 'link':
        newText = `[${textToInsert || 'link text'}](url)`;
        cursorOffset = selectedText ? newText.length - 4 : newText.length - 4;
        break;
      case 'list':
        newText = `\n- ${textToInsert || 'list item'}`;
        cursorOffset = selectedText ? newText.length : newText.length;
        break;
      case 'code':
        newText = `\`${textToInsert}\``;
        cursorOffset = selectedText ? newText.length : 1;
        break;
      case 'codeblock':
        newText = `\n\`\`\`\n${textToInsert || 'code here'}\n\`\`\`\n`;
        cursorOffset = selectedText ? newText.length : 5;
        break;
      default:
        return;
    }

    const newContent = 
      formData.content.substring(0, start) + 
      newText + 
      formData.content.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
    
    // Set cursor position after state update
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + cursorOffset;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
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

  // Simple markdown to HTML converter for preview
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank">$1</a>')
      .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-3 rounded mt-2 mb-2 overflow-x-auto"><code class="text-sm font-mono">$1</code></pre>')
      .replace(/^\- (.+)$/gim, '<li class="ml-4">$1</li>')
      .replace(/\n/g, '<br />');
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
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
            Lesson Description (Markdown supported)
          </label>
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {isPreview ? '📝 Edit' : '👁️ Preview'}
          </button>
        </div>

        {!isPreview && (
          <>
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border border-gray-200 rounded-t-lg">
              <button
                type="button"
                onClick={() => insertMarkdown('bold', 'bold text')}
                className="px-2 py-1 text-xs font-bold bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('italic', 'italic text')}
                className="px-2 py-1 text-xs italic bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('heading', 'Heading')}
                className="px-2 py-1 text-xs font-semibold bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Heading"
              >
                H
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('link')}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Link"
              >
                🔗
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('list', 'list item')}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Bullet List"
              >
                •
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('code', 'code')}
                className="px-2 py-1 text-xs font-mono bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Inline Code"
              >
                {'</>'}
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('codeblock')}
                className="px-2 py-1 text-xs font-mono bg-white border border-gray-300 rounded hover:bg-gray-100"
                title="Code Block"
              >
                {'{ }'}
              </button>
            </div>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Provide a description using Markdown formatting...&#10;&#10;Examples:&#10;**bold text**&#10;*italic text*&#10;## Heading&#10;- List item&#10;`code`"
              required
              rows={8}
              className={`block w-full px-4 py-2 border border-t-0 rounded-b-lg shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 font-mono text-sm ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </>
        )}

        {isPreview && (
          <div 
            className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white min-h-[200px]"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(formData.content) }}
          />
        )}

        {errors.content && <p className="text-sm text-red-500 mt-1 font-medium">{errors.content}</p>}
        
        <p className="text-xs text-gray-500 mt-1">
          Use Markdown syntax for formatting. Click buttons above or type manually.
        </p>
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