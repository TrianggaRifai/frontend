import apiClient from '../api/axios';

// Helper: Format tanggal ke YYYY-MM-DD
function formatToYMD(date) {
  if (!date) return '';
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

// Helper: Tangani error dari Laravel atau lainnya
function handleApiError(error, defaultMessage = 'Terjadi kesalahan') {
  if (error.response && error.response.status === 422) {
    const responseData = error.response.data;
    if (responseData && responseData.errors) {
      const firstError = Object.values(responseData.errors)[0][0];
      throw new Error(`Validasi Gagal: ${firstError}`);
    }
    throw new Error(responseData.message || 'Data yang dikirim tidak valid.');
  }
  throw new Error(error.response?.data?.message || defaultMessage);
}

export const publicationService = {
  /**
   * Tambah publikasi baru
   */
async addPublication(newPublication) {
  try {
    const response = await apiClient.post('/api/publikasi', newPublication);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Gagal menambahkan data');
  }
},

  /**
   * Ambil semua data publikasi
   */
  async getPublications() {
    try {
      const response = await apiClient.get('/api/publikasi');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Gagal mengambil data');
    }
  },

  /**
   * Ambil satu publikasi berdasarkan ID
   */
  async getPublicationById(id) {
    try {
      const response = await apiClient.get(`/api/publikasi/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Gagal mengambil detail data');
    }
  },

  /**
   * Update publikasi berdasarkan ID
   */
  async updatePublication(id, updatedData) {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('title', updatedData.title);
    formData.append('release_date', formatToYMD(updatedData.release_date));
    formData.append('description', updatedData.description || '');

    if (updatedData.coverFile instanceof File) {
      formData.append('cover', updatedData.coverFile);
    } else if (updatedData.cover_url) {
      formData.append('cover_url', updatedData.cover_url);
    }

    try {
      const response = await apiClient.post(`/api/publikasi/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error, 'Gagal memperbarui data');
    }
  },

  /**
   * Hapus publikasi
   */
  async deletePublication(id) {
    try {
      await apiClient.delete(`/api/publikasi/${id}`);
      return { message: 'Publikasi berhasil dihapus' };
    } catch (error) {
      handleApiError(error, 'Gagal menghapus data');
    }
  },
};

/**
 * Upload gambar ke Cloudinary
 */
export async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    throw new Error('Gagal mengunggah gambar ke Cloudinary');
  }
}
