import { School, CalendarCheck, BarChart3, NotebookPen } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-600 text-white grid place-items-center">
            <School size={22} />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Sistem Absensi Siswa</h1>
            <p className="text-xs text-gray-500 -mt-0.5">Dashboard • Kehadiran • Nilai</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <span className="inline-flex items-center gap-2"><CalendarCheck size={16}/>Absensi</span>
          <span className="inline-flex items-center gap-2"><BarChart3 size={16}/>Rekap</span>
          <span className="inline-flex items-center gap-2"><NotebookPen size={16}/>Nilai</span>
        </nav>
      </div>
    </header>
  );
}
