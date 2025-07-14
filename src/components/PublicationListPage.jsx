import React, { useState, useEffect } from 'react';
import { usePublications } from '../hooks/usePublication';
import { Link, useNavigate } from 'react-router-dom';

export default function PublicationListPage() {
  const { publications, deletePublication, loading, error } = usePublications();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);

  useEffect(() => {
    setFilteredPublications(publications);
  }, [publications]);

  const handleDelete = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus publikasi "${title}"?`)) {
      deletePublication(id).catch(err => {
        alert("Gagal menghapus: " + err.message);
      });
    }
  };

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === '') {
      setSuggestions([]);
      setFilteredPublications(publications);
      return;
    }

    const matched = publications.filter(pub =>
      pub.title.toLowerCase().includes(term.toLowerCase())
    );
    setSuggestions(matched.map(pub => pub.title));
  };

  const handleSuggestionClick = (title) => {
    setSearchTerm(title);
    setSuggestions([]);
    const selected = publications.filter(pub => pub.title === title);
    setFilteredPublications(selected);
  };

  if (loading) return <div className="text-center text-gray-500 mt-10">Memuat data publikasi...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Terjadi kesalahan: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-6 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Daftar Publikasi BPS Provinsi Jawa Tengah</h1>
        <p className="text-gray-500 mt-1">Sumber data publikasi terkini</p>
      </header>

      {/* Search Bar */}
      <div className="relative mb-6 max-w-lg">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Cari judul publikasi..."
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, idx) => (
              <li
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tabel Publikasi */}
      <div className="relative overflow-x-auto shadow-xl rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-white uppercase bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-center w-16">No</th>
              <th className="px-6 py-3 w-64 break-words">Judul</th>
              <th className="px-6 py-3 w-40 text-center">Tanggal Rilis</th>
              <th className="px-6 py-3 w-40 text-center">Sampul</th>
              <th className="px-6 py-3 w-40 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredPublications.map((pub, idx) => (
              <tr
                key={pub.id}
                onClick={() => navigate(`/publications/${pub.id}/detail`)}
                className="bg-white border-b hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
              >
                <td className="px-6 py-4 font-medium text-gray-900 text-center">{idx + 1}</td>
                <td className="px-6 py-4 font-semibold text-gray-800 w-64 break-words">
                  {pub.title}
                </td>
                <td className="px-6 py-4 text-gray-600 text-center w-40">
                  {new Date(pub.release_date).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4 w-40 text-center align-middle">
                  <div className="flex justify-center items-center h-full">
                    <img
                      src={pub.cover_url}
                      alt={`Sampul ${pub.title}`}
                      className="h-24 w-auto object-cover rounded shadow-md"
                    />
                  </div>
                </td>
                <td
                  className="px-6 py-4 text-center w-40"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-center gap-2">
                    <Link to={`/publications/edit/${pub.id}`} title="Edit">
                      <img
                        src="https://i.pinimg.com/474x/68/5c/7e/685c7ea6bdd60c7752efdb21f1d6bb6c.jpg"
                        alt="Edit"
                        className="h-6 w-6 hover:scale-110 transition-transform"
                      />
                    </Link>
                    <button onClick={() => handleDelete(pub.id, pub.title)} title="Delete">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/4442/4442016.png"
                        alt="Delete"
                        className="h-6 w-6 hover:scale-110 transition-transform"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPublications.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                  Tidak ada publikasi ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
