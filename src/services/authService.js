// src/services/authService.js

import apiClient from '../api/axios';

export const authService = {
  async login(email, password) {
    try {
      // FIX: Panggil endpoint ini SEBELUM mencoba login. Ini WAJIB.
      await apiClient.get('/sanctum/csrf-cookie');
      
      const response = await apiClient.post('/api/login', { email, password });
      return response.data; // Kembalikan semua data dari backend
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Gagal login. Silakan coba lagi.'
      );
    }
  },

  async logout() {
    try {
      await apiClient.post('/api/logout');
    } catch (error) {
      throw new Error('Gagal logout: ' + (error.response?.data?.message || 'Error tidak diketahui'));
    }
  },
};