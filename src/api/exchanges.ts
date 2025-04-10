
import { get, post, put, del } from './client';
import { Exchange } from '@/types/exchange';

export function getExchanges() {
  return get<Exchange[]>('/exchanges');
}

export function getExchangeById(id: number) {
  return get<Exchange>(`/exchanges/${id}`);
}

export function createExchange(exchangeData: Omit<Exchange, 'id'>) {
  return post<Exchange>('/exchanges', exchangeData);
}

export function updateExchange(id: number, exchangeData: Partial<Exchange>) {
  return put<Exchange>(`/exchanges/${id}`, exchangeData);
}

export function deleteExchange(id: number) {
  return del(`/exchanges/${id}`);
}

export function updateExchangeStatus(id: number, status: 'pending' | 'completed' | 'canceled') {
  return put<Exchange>(`/exchanges/${id}/status`, { status });
}
