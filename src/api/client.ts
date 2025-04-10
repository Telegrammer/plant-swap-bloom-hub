
const API_BASE_URL = 'http://localhost:3001/api';

export async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка API');
    } catch (e) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
  }

  // Для запросов DELETE без содержимого
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Специализированные обертки для HTTP методов
export function get<T>(endpoint: string, options?: RequestInit) {
  return apiRequest<T>(endpoint, { ...options, method: 'GET' });
}

export function post<T>(endpoint: string, data?: any, options?: RequestInit) {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function put<T>(endpoint: string, data?: any, options?: RequestInit) {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function del<T>(endpoint: string, options?: RequestInit) {
  return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
}
