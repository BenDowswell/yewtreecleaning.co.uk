import Badge from './Badge';

type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'completed';

interface StatusBadgeProps {
  status: BookingStatus;
}

const statusConfig: Record<
  BookingStatus,
  { variant: 'yellow' | 'green' | 'red' | 'gray' | 'blue'; label: string }
> = {
  pending: { variant: 'yellow', label: 'Pending' },
  confirmed: { variant: 'green', label: 'Confirmed' },
  rejected: { variant: 'red', label: 'Rejected' },
  cancelled: { variant: 'gray', label: 'Cancelled' },
  completed: { variant: 'blue', label: 'Completed' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
