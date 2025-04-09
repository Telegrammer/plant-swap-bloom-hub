
export type ExchangeStatus = 'pending' | 'completed' | 'canceled';
export type ExchangeDirection = 'received' | 'sent';

export interface ExchangePlant {
  id: number;
  name: string;
  imageUrl: string;
  direction: ExchangeDirection;
}

export interface Exchange {
  id: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  status: ExchangeStatus;
  startDate: string;
  endDate: string | null;
  senderPlants: ExchangePlant[];
  receiverPlants: ExchangePlant[];
}
