export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface DayAvailability {
  date: string;
  dayOfWeek: string;
  slots: TimeSlot[];
  isFullyBooked: boolean;
}
