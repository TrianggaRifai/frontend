import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublications } from '../hooks/usePublication';
import { uploadImageToCloudinary } from '../services/publicationService';


export default function AddPublicationPage() {
  const { addPublication } = usePublications();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null); // State untuk menampung object File
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  const newErrors = {};
  if (!title.trim()) newErrors.title = 'Judul tidak boleh kosong';
  if (!releaseDate) newErrors.releaseDate = 'Tanggal rilis tidak boleh kosong';
  if (!coverFile) newErrors.coverFile = 'Sampul harus dipilih';

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setIsSubmitting(true);

  try {
    // 🔥 1. Upload ke Cloudinary
    const coverUrl = await uploadImageToCloudinary(coverFile);

    // 🔥 2. Kirim data ke backend pakai cover_url
    await addPublication({
      title,
      release_date: releaseDate, // format sudah YYYY-MM-DD
      description,
      cover_url: coverUrl, // pakai URL hasil dari Cloudinary
    });

    alert('Publikasi berhasil ditambahkan!');
    navigate('/publications');
  } catch (error) {
    alert(`Gagal menambah publikasi: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Form Tambah Publikasi Baru</h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Judul */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Contoh: Statistik Indonesia 2025"
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
            placeholder="Deskripsi singkat mengenai isi publikasi."
            rows={4}
          />
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Sampul (Gambar)</label>
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
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 disabled:bg-blue-400"
          >
            {isSubmitting ? 'Menyimpan...' : 'Tambah'}
          </button>
        </div>
      </form>
    </div>
  );
}