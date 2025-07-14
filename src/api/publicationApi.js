import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API,
});

export default api;

export const login = async (email, password) => {
  const res = await axios.post(`${API}/login`, { email, password });
  return res.data;
};

export const getPublications = async (token) => {
  const res = await axios.get(`${API}/publikasi`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addPublication = async (data, token) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('releaseDate', data.releaseDate);
  formData.append('description', data.description || '');
  if (data.coverFile) {
    formData.append('cover', data.coverFile); // dikirim sebagai file
  }

  const res = await axios.post(`${API}/publikasi`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const updatePublication = async (id, data, token) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('releaseDate', data.releaseDate);
  formData.append('description', data.description || '');
  if (data.coverFile) {
    formData.append('cover', data.coverFile);
  }

  const res = await axios.post(`${API}/publikasi/${id}?_method=PUT`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

export const deletePublication = async (id, token) => {
  const res = await axios.delete(`${API}/publikasi/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const logout = async (token) => {
  const res = await axios.post(`${API}/logout`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};