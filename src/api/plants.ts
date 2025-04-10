
import { get, post, put, del } from './client';

export interface Plant {
  id: number;
  name: string;
  description?: string;
  imageUrl: string;
  waterDemand: string;
  sunDemand: string;
  size: string;
  isIndoor: boolean;
  types?: string[];
  owner: string;
}

export function getPlants() {
  return get<Plant[]>('/plants');
}

export function getPlantById(id: number) {
  return get<Plant>(`/plants/${id}`);
}

export function getUserPlants(userId: number) {
  return get<Plant[]>(`/users/${userId}/plants`);
}

export function createPlant(plantData: Omit<Plant, 'id'>) {
  return post<Plant>('/plants', plantData);
}

export function updatePlant(id: number, plantData: Partial<Plant>) {
  return put<Plant>(`/plants/${id}`, plantData);
}

export function deletePlant(id: number) {
  return del<void>(`/plants/${id}`);
}
