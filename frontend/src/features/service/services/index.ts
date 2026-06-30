import { apiService } from '../../../shared/services/api';

export type ServiceType = 'garage' | 'fuel_station' | 'hotel';

export interface Service {
  id: string;
  type: ServiceType;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  maps_link?: string;
  image_url?: string;
  description?: string;
  is_active: boolean;
  distance_km?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceRequest {
  type: ServiceType;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  maps_link?: string;
  image_url?: string;
  description?: string;
}

export const serviceApi = {
  getAllServices: async (): Promise<{ services: Service[] }> => {
    const response = await apiService.get<{ success: boolean; message: string; data: { services: Service[] } }>('/services');
    if (!response?.data?.data) throw new Error('Invalid response');
    return response.data.data;
  },

  getAllServicesAdmin: async (): Promise<{ services: Service[] }> => {
    const response = await apiService.get<{ success: boolean; message: string; data: { services: Service[] } }>('/services/admin/all');
    if (!response?.data?.data) throw new Error('Invalid response');
    return response.data.data;
  },

  getNearbyServices: async (params: { latitude: number; longitude: number; radius_km?: number; type?: ServiceType }): Promise<{ services: Service[] }> => {
    const response = await apiService.get<{ success: boolean; message: string; data: { services: Service[] } }>('/services/nearby', params);
    if (!response?.data?.data) throw new Error('Invalid response');
    return response.data.data;
  },

  createService: async (data: CreateServiceRequest): Promise<{ service: Service }> => {
    const response = await apiService.post<{ success: boolean; message: string; data: { service: Service } }>('/services', data);
    if (!response?.data?.data) throw new Error('Invalid response');
    return response.data.data;
  },

  updateService: async (id: string, data: Partial<CreateServiceRequest> & { is_active?: boolean }): Promise<{ service: Service }> => {
    const response = await apiService.patch<{ success: boolean; message: string; data: { service: Service } }>(`/services/${id}`, data);
    if (!response?.data?.data) throw new Error('Invalid response');
    return response.data.data;
  },

  deleteService: async (id: string): Promise<void> => {
    await apiService.delete(`/services/${id}`);
  },
};
