'use client';

import { type TextareaHTMLAttributes } from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {
  label: string;
  name: string;
  error?: string;
  register?: UseFormRegisterReturn;
}

export default function Textarea({
  label,
  name,
  placeholder,
  error,
  required,
  rows = 4,
  register,
  className = '',
  ...rest
}: TextareaProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-xl border px-4 py-2.5 text-gray-900 placeholder:text-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400 resize-y ${
          error
            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
            : 'border-gray-200'
        }`}
        {...register}
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
