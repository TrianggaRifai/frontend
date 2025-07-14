import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};

    if (!name.trim()) errors.name = 'Nama wajib diisi.';
    if (!email.trim()) {
      errors.email = 'Email wajib diisi.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Format email tidak valid.';
    }
    if (!password) {
      errors.password = 'Password wajib diisi.';
    } else if (password.length < 6) {
      errors.password = 'Password minimal 6 karakter.';
    }

    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    try {
      await apiClient.post('/register', {
        name,
        email,
        password,
      });

      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const combinedErrors = Object.values(errors).flat().join(' ');
        setError(combinedErrors);
      } else {
        const message = err.response?.data?.message || 'Terjadi kesalahan saat registrasi.';
        setError(message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img
            src="https://www.bps.go.id/_next/image?url=%2Fassets%2Flogo-bps.png&w=3840&q=75"
            alt="Logo BPS"
            className="h-12"
          />
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Register</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 border ${
                fieldErrors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
            />
            {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border ${
                fieldErrors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md`}
            />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center px-2"
              >
                <img
                  src={
                    showPassword
                      ? 'https://icons.veryicon.com/png/o/miscellaneous/computer-room-integration/hide-password.png'
                      : 'https://static.thenounproject.com/png/2540381-200.png'
                  }
                  alt={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  className="w-6 h-6"
                />
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow"
          >
            Daftar
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Sudah punya akun?{' '}
          <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
