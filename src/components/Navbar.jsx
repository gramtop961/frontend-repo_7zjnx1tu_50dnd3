import React from 'react';

export default function Navbar({ selectedClassName }) {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-800">
          ABSENSI SISWA MAS AL-WASHLIYAH NAGUR
        </h1>
        {selectedClassName ? (
          <span className="text-sm text-slate-600 bg-slate-100 rounded-full px-3 py-1">
            Kelas: {selectedClassName}
          </span>
        ) : (
          <span className="text-sm text-slate-500">Pilih kelas</span>
        )}
      </div>
    </header>
  );
}
