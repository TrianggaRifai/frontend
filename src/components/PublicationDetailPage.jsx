import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

export default function PublicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        // FIX: Tambahkan awalan /api/ pada URL di bawah ini
        const response = await apiClient.get(`/api/publikasi/${id}`);
        setPublication(response.data);
      } catch (err) {
        setError('Gagal mengambil data publikasi.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublication();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Memuat data publikasi...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!publication) {
    return <div className="text-center mt-10 text-gray-500">Publikasi tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{publication.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Tanggal Rilis: {new Date(publication.release_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {publication.cover_url && (
        <img
            src={publication.cover_url}
            alt={`Sampul ${publication.title}`}
            className="w-full max-w-md mx-auto rounded shadow-md mb-8"
        />
      )}

      <h2 className="text-xl font-semibold text-gray-800 mb-2">Deskripsi</h2>
      <p className="text-gray-700 text-justify leading-relaxed whitespace-pre-line mb-8">
        {publication.description || 'Tidak ada deskripsi tersedia.'}
      </p>

      <div className="flex justify-start border-t pt-6 mt-6">
        <button
          onClick={() => navigate('/publications')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded transition-colors"
        >
          &larr; Kembali ke Daftar
        </button>
      </div>
    </div>
  );
}