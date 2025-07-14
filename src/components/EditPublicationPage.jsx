import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePublications } from '../hooks/usePublication';
import { uploadImageToCloudinary } from '../services/publicationService';

export default function EditPublicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { publications, editPublication, loading: contextLoading } = usePublications();

  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const publicationToEdit = publications.find(p => p.id == id);
    if (publicationToEdit) {
      setTitle(publicationToEdit.title);
      setReleaseDate(publicationToEdit.release_date);
      setDescription(publicationToEdit.description || '');
      setCoverPreview(publicationToEdit.cover_url);
    }
  }, [id, publications]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file);
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi form
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Judul tidak boleh kosong';
    if (!releaseDate.trim()) newErrors.releaseDate = 'Tanggal rilis tidak boleh kosong';
    if (!description.trim()) newErrors.description = 'Deskripsi tidak boleh kosong';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      let finalCoverUrl = coverPreview;
      if (coverFile) {
        finalCoverUrl = await uploadImageToCloudinary(coverFile);
      }

      const updatedData = {
        id: parseInt(id),
        title,
        release_date: releaseDate,
        description,
        cover_url: finalCoverUrl,
      };

      await editPublication(updatedData);
      navigate('/publications');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Gagal memperbarui publikasi: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (contextLoading) {
    return <div className="text-center mt-10">Memuat data publikasi...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Publikasi</h2>
      <form onSubmit={handleSubmit}>
        {/* Judul */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Judul</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Tanggal Rilis */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tanggal Rilis</label>
          <input
            type="date"
            className="w-full border rounded-md px-3 py-2"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
          {errors.releaseDate && <p className="text-red-600 text-sm mt-1">{errors.releaseDate}</p>}
        </div>

        {/* Deskripsi */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi</label>
          <textarea
            className="w-full border rounded-md px-3 py-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Sampul */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Sampul (Gambar)</label>
          <div className="flex items-center gap-4">
            <label
              htmlFor="cover"
              className="inline-block bg-sky-700 hover:bg-sky-800 text-white text-sm font-medium px-3 py-1.5 rounded cursor-pointer transition-colors"
            >
              Pilih File Gambar
            </label>
            <span className="text-sm text-gray-600">
              {coverFile?.name || 'Belum ada file dipilih'}
            </span>
          </div>
          <input
            id="cover"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {coverPreview && (
            <div className="mt-4">
              <img
                src={coverPreview}
                alt="Preview Sampul"
                className="h-40 object-cover rounded shadow"
              />
            </div>
          )}
        </div>

        {/* Tombol */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/publications')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
}
