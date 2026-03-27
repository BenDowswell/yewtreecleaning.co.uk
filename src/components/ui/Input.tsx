'use client';

import { type InputHTMLAttributes } from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  label: string;
  name: string;
  error?: string;
  register?: UseFormRegisterReturn;
}

export default function Input({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  required,
  register,
  className = '',
  ...rest
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-xl border px-4 py-2.5 text-gray-900 placeholder:text-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400 ${
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
