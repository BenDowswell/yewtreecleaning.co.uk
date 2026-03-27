'use client';

import { useEffect, useState, useMemo } from 'react';
import type { DayAvailability } from '@/domain/availability/types';
import { api } from '@/lib/api-client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function generateNext30Days(): { date: string; dayOfWeek: string; dayNum: number; monthLabel: string }[] {
  const days: { date: string; dayOfWeek: string; dayNum: number; monthLabel: string }[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    const dayIndex = d.getDay();
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex];
    const dayNum = d.getDate();
    const monthLabel = d.toLocaleDateString('en-GB', { month: 'short' });
    days.push({ date: iso, dayOfWeek, dayNum, monthLabel });
  }

  return days;
}

function isWeekend(dayOfWeek: string): boolean {
  return dayOfWeek === 'Sat' || dayOfWeek === 'Sun';
}

type AvailabilityStatus = 'available' | 'unavailable' | 'partial';

export default function AdminAvailabilityPage() {
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const next30Days = useMemo(() => generateNext30Days(), []);

  useEffect(() => {
    async function fetchAvailability() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.availability.get();
        setAvailability(data);

        // Build initial overrides from fetched data
        const map: Record<string, boolean> = {};
        data.forEach((day) => {
          const hasAvailable = day.slots.some((s) => s.available);
          map[day.date] = hasAvailable;
        });
        setOverrides(map);
      } catch (err) {
        // If no data yet, default to weekday=available
        setOverrides({});
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, []);

  function getDayStatus(date: string, dayOfWeek: string): AvailabilityStatus {
    if (date in overrides) {
      return overrides[date] ? 'available' : 'unavailable';
    }
    // Default: weekdays available, weekends unavailable
    return isWeekend(dayOfWeek) ? 'unavailable' : 'available';
  }

  function toggleDay(date: string, dayOfWeek: string) {
    setOverrides((prev) => {
      const currentStatus = getDayStatus(date, dayOfWeek);
      return { ...prev, [date]: currentStatus !== 'available' };
    });
    setSuccessMsg(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const data: DayAvailability[] = next30Days.map((day) => {
        const isAvail = getDayStatus(day.date, day.dayOfWeek) === 'available';
        return {
          date: day.date,
          dayOfWeek: day.dayOfWeek,
          slots: isAvail
            ? [{ start: '08:00', end: '18:00', available: true }]
            : [{ start: '08:00', end: '18:00', available: false }],
          isFullyBooked: false,
        };
      });

      await api.availability.update(data);
      setSuccessMsg('Availability saved successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save availability.');
    } finally {
      setSaving(false);
    }
  }

  const statusColours: Record<AvailabilityStatus, string> = {
    available: 'bg-brand-green-100 text-brand-green-800 border-brand-green-300 hover:bg-brand-green-200',
    unavailable: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
    partial: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Availability</h1>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-brand-green-100 border border-brand-green-300" />
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-red-50 border border-red-200" />
          <span className="text-gray-600">Unavailable</span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm mb-4">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl bg-brand-green-50 border border-brand-green-200 p-3 text-brand-green-700 text-sm mb-4">
          {successMsg}
        </div>
      )}

      <Card>
        {/* Day of week headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAY_NAMES.map((name) => (
            <div key={name} className="text-center text-xs font-medium text-gray-500 py-1">
              {name}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Add offset for the first day's position */}
          {(() => {
            const firstDay = new Date(next30Days[0].date);
            const dayIndex = firstDay.getDay();
            // Convert Sunday=0 to Monday-based: Mon=0, Tue=1, ..., Sun=6
            const offset = dayIndex === 0 ? 6 : dayIndex - 1;
            const blanks = Array.from({ length: offset }, (_, i) => (
              <div key={`blank-${i}`} />
            ));

            const dayCells = next30Days.map((day) => {
              const status = getDayStatus(day.date, day.dayOfWeek);
              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => toggleDay(day.date, day.dayOfWeek)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2 min-h-[4rem] transition-colors duration-200 cursor-pointer ${statusColours[status]}`}
                  title={`${day.date} - ${status}`}
                >
                  <span className="text-[0.625rem] font-medium opacity-70">{day.monthLabel}</span>
                  <span className="text-lg font-bold">{day.dayNum}</span>
                </button>
              );
            });

            return [...blanks, ...dayCells];
          })()}
        </div>
      </Card>

      <p className="mt-4 text-xs text-gray-400">
        Click a day to toggle between available and unavailable. Default: Monday to Friday available, weekends unavailable.
      </p>
    </div>
  );
}
