
export type ExchangeStatus = 'pending' | 'completed' | 'canceled';
export type ExchangeDirection = 'received' | 'sent';

export interface ExchangePlant {
  id: string;
  name: string;
  imageUrl: string;
  direction?: ExchangeDirection; // Made optional for flexibility
}

export interface Exchange {
  id: string; // Updated to string to match Supabase UUID
  senderId: string; // Updated to string to match Supabase UUID
  senderName: string;
  receiverId: string; // Updated to string to match Supabase UUID
  receiverName: string;
  status: ExchangeStatus;
  startDate: string;
  endDate?: string | null;
  senderPlants: ExchangePlant[];
  receiverPlants: ExchangePlant[];
}
