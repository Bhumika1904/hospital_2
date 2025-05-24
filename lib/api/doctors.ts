import api from './axios';
import { Doctor } from '@/context/data-context';

export const doctorsApi = {
  // The key issue is here - your backend returns an array directly, not { doctors: [...] }
  getDoctors: async (): Promise<Doctor[]> => {
    try {
      const response = await api.get('/doctors');
      console.log('API Response:', response.data);
      
      // Return the array directly since that's what your backend returns
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },
  
  getDoctorById: async (id: string): Promise<Doctor> => {
    const response = await api.get(`/doctors/${id}`);
    return response.data; // Assuming this returns the doctor object directly
  },
  
  createDoctor: async (doctorData: Omit<Doctor, "id">): Promise<Doctor> => {
    const response = await api.post('/doctors', doctorData);
    return response.data; // Assuming this returns the created doctor directly
  },
  
  updateDoctor: async (id: string, doctorData: Partial<Doctor>): Promise<Doctor> => {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data; // Assuming this returns the updated doctor directly
  },
  
  deleteDoctor: async (id: string) => {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  }
}; 