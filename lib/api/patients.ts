import api from './axios';
import { Patient } from '@/context/data-context';

export const patientsApi = {
  // Fetch all patients
  getAllPatients: async (): Promise<Patient[]> => {
    try {
      const response = await api.get('/patients');
      console.log('API Response (Patients):', response.data);

      // Return array if valid
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  // Get a single patient by ID
  getPatientById: async (id: string): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data; // Assuming this returns the patient object
  },

  // Create a new patient
  createPatient: async (patientData: Omit<Patient, "id">): Promise<Patient> => {
    const response = await api.post('/patients', patientData);
    return response.data; // Assuming this returns the created patient
  },

  // Update an existing patient
  updatePatient: async (id: string, patientData: Partial<Patient>): Promise<Patient> => {
    const response = await api.put(`/patients/${id}`, patientData);
    return response.data; // Assuming this returns the updated patient
  },

  // Delete a patient
  deletePatient: async (id: string) => {
    const response = await api.delete(`/patients/${id}`);
    return response.data;
  }
};
