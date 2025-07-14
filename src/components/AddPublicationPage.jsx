import React, { useState } from 'react';
import { usePublications } from '../hooks/usePublication';
import { useNavigate } from 'react-router-dom';
import { uploadImageToCloudinary } from '../services/publicationService';

export default function AddPublicationPage() {
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const { addPublication } = usePublications();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Judul tidak boleh kosong';
    if (!description.trim()) newErrors.description = 'Deskripsi tidak boleh kosong';
    if (!releaseDate.trim()) newErrors.releaseDate = 'Tanggal rilis tidak boleh kosong';
    if (!coverFile) newErrors.coverFile = 'Sampul harus dipilih';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    let coverUrl = '';
    try {
      coverUrl = await uploadImageToCloudinary(coverFile);
    } catch (err) {
      alert('Gagal upload gambar: ' + err.message);
      return;
    }

    const newPublication = {
      title,
      release_date: releaseDate,
      description,
      cover_url: coverUrl,
    };

    try {
      await addPublication(newPublication);
      navigate('/publications');
    } catch (err) {
      alert('Gagal menambah publikasi: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Form Tambah Publikasi Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Judul */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Contoh: Indikator Ekonomi Bengkulu 2025"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Deskripsi */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Contoh: Publikasi ini membahas indikator ekonomi Bengkulu 2025 secara mendalam."
            rows={4}
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Tanggal Rilis */}
        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Rilis</label>
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.releaseDate && <p className="text-red-600 text-sm mt-1">{errors.releaseDate}</p>}
        </div>

        {/* Sampul */}
        <div>
          <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">Sampul (Gambar)</label>

          <label
            htmlFor="cover"
            className="inline-block bg-sky-700 hover:bg-sky-800 text-white text-sm font-medium px-3 py-1.5 rounded cursor-pointer transition-colors"
          >
            Pilih File Gambar
          </label>

          <input
            type="file"
            id="cover"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="hidden"
          />

          {coverFile && (
            <p className="text-sm text-gray-600 mt-2">File dipilih: {coverFile.name}</p>
          )}
          {errors.coverFile && (
            <p className="text-red-600 text-sm mt-1">{errors.coverFile}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
            Tambah
          </button>
        </div>
      </form>
    </div>
  );
}
