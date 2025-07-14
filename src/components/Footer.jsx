// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#003049] text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row justify-between items-center gap-8 lg:items-start">
        {/* Kiri: Logo dan Kontak */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center mb-4">
            <img
              src="https://ppid.bps.go.id/upload/img/logo_(1)_1643969039217.png"
              alt="Logo Footer"
              className="h-12 mr-3"
            />
            <div className="text-lg font-bold uppercase tracking-wide">Badan Pusat Statistik</div>
          </div>
          <div className="text-sm space-y-1">
            <p>Badan Pusat Statistik Provinsi Jawa Tengah</p>
            <p>Jl. Pahlawan No.6, Kota Semarang</p>
            <p>Telp. 024 - 8412802 | Fax. 024 - 8311195</p>
            <p>Email: <a href="mailto:jateng@bps.go.id" className="underline">jateng@bps.go.id</a></p>
          </div>
        </div>

        {/* Sosmed */}
            <div className="flex space-x-4">
            <a
                href="https://www.facebook.com/bpsprovjateng?mibextid=LQQJ4d"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1877f2] hover:scale-110 transition-transform rounded-full w-10 h-10 flex items-center justify-center text-white text-lg"
            >
                <i className="fab fa-facebook-f" />
            </a>
            <a
                href="https://www.instagram.com/bpsprovjateng/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#e1306c] hover:scale-110 transition-transform rounded-full w-10 h-10 flex items-center justify-center text-white text-lg"
            >
                <i className="fab fa-instagram" />
            </a>
            <a
                href="https://x.com/bpsprovjateng?s=21&t=go8qouPhqa_7RhOsim_atQ"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:scale-110 transition-transform rounded-full w-10 h-10 flex items-center justify-center text-white text-lg"
            >
                <i className="fab fa-x-twitter" />
            </a>
            <a
                href="https://www.youtube.com/BPSProvinsiJawaTengah"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ff0000] hover:scale-110 transition-transform rounded-full w-10 h-10 flex items-center justify-center text-white text-lg"
            >
                <i className="fab fa-youtube" />
            </a>
            </div>
      </div>

      <hr className="border-gray-400 my-6 mx-8" />
      
      <div className="text-center text-sm text-gray-300">
        <p>&copy; 2025 BPS Provinsi Jawa Tengah</p>
        <p>Created by Triangga Hafid Rifa'i</p>
      </div>
    </footer>
  );
}
