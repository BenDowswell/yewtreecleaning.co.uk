'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from '@/domain/auth/validation';

const inputClassName =
  'w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-green-400 focus:border-brand-green-400';
const labelClassName = 'block text-sm font-medium text-gray-700 mb-1';
const errorClassName = 'text-sm text-red-500 mt-1';

type Tab = 'login' | 'register';

export default function LoginContent() {
  const [activeTab, setActiveTab] = useState<Tab>('login');

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          {activeTab === 'login' ? 'Log In' : 'Create Account'}
        </h1>

        {/* Tabs */}
        <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
              activeTab === 'login'
                ? 'bg-white text-brand-green-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
              activeTab === 'register'
                ? 'bg-white text-brand-green-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create Account
          </button>
        </div>

        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setError('');

    try {
      await login(data);
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="login-email" className={labelClassName}>
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          className={inputClassName}
          {...register('email')}
        />
        {errors.email && <p className={errorClassName}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="login-password" className={labelClassName}>
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          className={inputClassName}
          {...register('password')}
        />
        {errors.password && (
          <p className={errorClassName}>{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-brand-green-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Logging in...' : 'Log In'}
      </button>

      <p className="text-center text-sm text-gray-500">
        <button
          type="button"
          className="cursor-default text-gray-400"
          title="Coming soon"
        >
          Forgot password?{' '}
          <span className="text-xs text-gray-400">(Coming soon)</span>
        </button>
      </p>
    </form>
  );
}

function RegisterForm() {
  const { register: authRegister } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const extendedSchema = registerSchema.extend({
    confirmPassword: registerSchema.shape.password,
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

  type ExtendedRegisterInput = RegisterInput & { confirmPassword: string };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExtendedRegisterInput>({
    resolver: zodResolver(extendedSchema),
  });

  const onSubmit = async (data: ExtendedRegisterInput) => {
    setLoading(true);
    setError('');

    try {
      await authRegister({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="register-name" className={labelClassName}>
          Name
        </label>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          className={inputClassName}
          {...register('name')}
        />
        {errors.name && <p className={errorClassName}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="register-email" className={labelClassName}>
          Email
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          className={inputClassName}
          {...register('email')}
        />
        {errors.email && <p className={errorClassName}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="register-phone" className={labelClassName}>
          Phone
        </label>
        <input
          id="register-phone"
          type="tel"
          autoComplete="tel"
          className={inputClassName}
          {...register('phone')}
        />
        {errors.phone && <p className={errorClassName}>{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="register-password" className={labelClassName}>
          Password
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          className={inputClassName}
          {...register('password')}
        />
        {errors.password && (
          <p className={errorClassName}>{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="register-confirm" className={labelClassName}>
          Confirm Password
        </label>
        <input
          id="register-confirm"
          type="password"
          autoComplete="new-password"
          className={inputClassName}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className={errorClassName}>{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-brand-green-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
