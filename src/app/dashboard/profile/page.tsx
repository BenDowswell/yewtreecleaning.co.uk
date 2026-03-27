'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api-client';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^[0-9+\s()-]+$/, 'Please enter a valid phone number'),
  address: z.string().optional(),
  postcode: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      address: '',
      postcode: '',
      preferredContact: 'email',
    },
  });

  async function onSubmit(data: ProfileFormData) {
    if (!user) return;
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const updated = await api.customers.update(user.id, {
        name: data.name,
      });
      updateUser({
        ...user,
        name: data.name,
        phone: data.phone,
      });
      setSuccessMessage('Your profile has been updated successfully.');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to update profile. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <Card className="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Full Name"
            name="name"
            required
            register={register('name')}
            error={errors.name?.message}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={user?.email ?? ''}
            readOnly
            className="opacity-60"
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            required
            register={register('phone')}
            error={errors.phone?.message}
          />

          <Input
            label="Address"
            name="address"
            register={register('address')}
            error={errors.address?.message}
          />

          <Input
            label="Postcode"
            name="postcode"
            register={register('postcode')}
            error={errors.postcode?.message}
          />

          <Select
            label="Preferred Contact Method"
            name="preferredContact"
            options={[
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone' },
              { value: 'whatsapp', label: 'WhatsApp' },
            ]}
            register={register('preferredContact')}
            error={errors.preferredContact?.message}
          />

          {successMessage && (
            <div className="rounded-xl bg-brand-green-50 border border-brand-green-200 p-3 text-brand-green-700 text-sm">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-red-700 text-sm" role="alert">
              {errorMessage}
            </div>
          )}

          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
