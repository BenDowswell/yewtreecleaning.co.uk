'use client';

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { BookingFrequency } from '@/domain/booking/types';

interface BookingState {
  currentStep: number;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  frequency: BookingFrequency;
  estimatedHours: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  notes: string;
  ecoProducts: boolean;
  isSubmitted: boolean;
  isSubmitting: boolean;
}

type BookingAction =
  | { type: 'SET_SERVICE'; payload: { serviceId: string } }
  | { type: 'SET_DATETIME'; payload: { preferredDate: string; preferredTime: string; frequency: BookingFrequency; estimatedHours: number } }
  | { type: 'SET_DETAILS'; payload: { customerName: string; email: string; phone: string; address: string; postcode: string; notes: string; ecoProducts: boolean } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_SUBMITTED' }
  | { type: 'RESET' };

const initialState: BookingState = {
  currentStep: 0,
  serviceId: '',
  preferredDate: '',
  preferredTime: '',
  frequency: 'one-off',
  estimatedHours: 2,
  customerName: '',
  email: '',
  phone: '',
  address: '',
  postcode: '',
  notes: '',
  ecoProducts: false,
  isSubmitted: false,
  isSubmitting: false,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_SERVICE':
      return { ...state, serviceId: action.payload.serviceId };
    case 'SET_DATETIME':
      return { ...state, ...action.payload };
    case 'SET_DETAILS':
      return { ...state, ...action.payload };
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 4) };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_SUBMITTED':
      return { ...state, isSubmitted: true, isSubmitting: false };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface BookingContextValue {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
