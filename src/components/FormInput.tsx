 import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  helperText,
  error,
  id,
  name,
  className = "",
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={inputId}
        name={name}
        {...props}
        className={`block w-full px-3 py-2.5 text-sm border rounded-lg shadow-sm focus:outline-none transition-all duration-200 ${
          error
            ? "border-red-400 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        } bg-white placeholder-gray-400 ${className}`}
      />

      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default FormInput;
