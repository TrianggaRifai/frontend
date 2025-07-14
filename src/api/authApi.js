import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export async function login(email, password) {
  try {
    const response = await axios.post(`${API}/login`, { email, password });
    return response.data; // akan berisi token dan user
  } catch (error) {
    throw error.response?.data || { message: 'Login gagal' };
  }
}

export const logout = async (token) => {
  const res = await axios.post(`${API}/logout`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

