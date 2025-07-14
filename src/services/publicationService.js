// src/services/publicationService.js
import apiClient from '../api/axios';

export const publicationService = {
  async addPublication(newPublication) {
    try {
      const response = await apiClient.post('/publikasi', newPublication);
      return response.data;
    } catch (error) {
      throw new Error('Gagal menambahkan data: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
    }
  },

  async getPublications() {
    try {
      const response = await apiClient.get('/publikasi');
      return response.data;
    } catch (error) {
      throw new Error('Gagal mengambil data: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
    }
  },

  async updatePublication(id, updatedData) {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('title', updatedData.title);
      formData.append('release_date', updatedData.release_date); // pakai snake_case
      formData.append('description', updatedData.description || '');
      formData.append('cover_url', updatedData.cover_url); // pakai snake_case

      const response = await apiClient.post(`/publikasi/${id}`, formData);
      return response.data;
    } catch (error) {
      console.log("DETAIL ERROR:", error.response?.data);
      throw new Error('Gagal memperbarui data: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
    }
  },

  async deletePublication(id) {
    try {
      await apiClient.delete(`/publikasi/${id}`);
      return { message: 'Publikasi berhasil dihapus' };
    } catch (error) {
      throw new Error('Gagal menghapus data: ' + (error.response?.data?.message || 'Terjadi kesalahan'));
    }
  },
};

export async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  if (!uploadPreset || !cloudName) {
    throw new Error('Cloudinary config missing');
  }
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Upload gagal');
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    throw new Error('Gagal upload ke Cloudinary: ' + error.message);
  }
}
