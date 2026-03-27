export interface Message {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  body: string;
  direction: 'inbound' | 'outbound';
  read: boolean;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}
