
import { get, post, put } from './client';

export interface User {
  id: number;
  name: string;
  email: string;
  location: string;
  bio: string;
  dateCreated: string;
  profileImageUrl: string;
}

export function getUsers() {
  return get<User[]>('/users');
}

export function getUserById(id: number) {
  return get<User>(`/users/${id}`);
}

export function getCurrentUser() {
  return get<User>('/users/me');
}

export function updateUser(id: number, userData: Partial<User>) {
  return put<User>(`/users/${id}`, userData);
}
