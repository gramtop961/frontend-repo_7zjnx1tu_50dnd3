import { useState } from "react";
import { Users, Plus, School } from "lucide-react";

/**
 * Manage classes and students assignment
 * Props:
 * - classes: Array<{ id: string, name: string }>
 * - students: Array<{ id: string, name: string, classId?: string }>
 * - selectedClassId: string | null
 * - onSelectClass: (id: string | null) => void
 * - onAddClass: (name: string) => void
 * - onAddStudent: (name: string, classId: string | null) => void
 */
export default function ClassManager({
  classes,
  students,
  selectedClassId,
  onSelectClass,
  onAddClass,
  onAddStudent,
}) {
  const [className, setClassName] = useState("");
  const [studentName, setStudentName] = useState("");

  const studentsInClass = selectedClassId
    ? students.filter((s) => s.classId === selectedClassId)
    : students;

  const handleAddClass = (e) => {
    e.preventDefault();
    const name = className.trim();
    if (!name) return;
    onAddClass(name);
    setClassName("");
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const name = studentName.trim();
    if (!name) return;
    onAddStudent(name, selectedClassId || null);
    setStudentName("");
  };

  return (
    <section className="rounded-xl border bg-white p-4 lg:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-violet-600 text-white grid place-items-center">
            <Users size={18} />
          </div>
          <div>
            <h2 className="font-semibold">Kelola Kelas & Siswa</h2>
            <p className="text-xs text-gray-500">Tambah kelas dan masukkan siswa ke kelas.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Kiri: Pilih Kelas & Tambah Kelas */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-600">Pilih Kelas</label>
          <select
            className="w-full rounded-md border-gray-300 focus:border-violet-500 focus:ring-violet-500"
            value={selectedClassId || ""}
            onChange={(e) => onSelectClass(e.target.value || null)}
          >
            <option value="">Semua Kelas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <form onSubmit={handleAddClass} className="flex gap-2 pt-2">
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Nama kelas (mis. X IPA 1)"
              className="flex-1 rounded-md border-gray-300 focus:border-violet-500 focus:ring-violet-500"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-md bg-violet-600 px-3 py-2 text-white hover:bg-violet-700"
            >
              <Plus size={16} /> Kelas
            </button>
          </form>
        </div>

        {/* Tengah: Tambah Siswa */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-gray-600">Tambah Siswa</label>
          <form onSubmit={handleAddStudent} className="flex gap-2">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nama siswa"
              className="flex-1 rounded-md border-gray-300 focus:border-violet-500 focus:ring-violet-500"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
              title={selectedClassId ? "Tambah ke kelas terpilih" : "Tambah tanpa kelas"}
            >
              <Plus size={16} /> Siswa
            </button>
          </form>
          <p className="text-xs text-gray-500">
            {selectedClassId ? "Siswa baru akan dimasukkan ke kelas terpilih." : "Tidak ada kelas terpilih — siswa ditambahkan tanpa kelas."}
          </p>
        </div>

        {/* Kanan: Ringkasan */}
        <div className="space-y-3">
          <div className="rounded-lg border p-3 bg-slate-50">
            <div className="flex items-center gap-2 mb-2 text-slate-700">
              <School size={16} />
              <span className="text-sm font-medium">Ringkasan</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>Total kelas: <span className="font-semibold text-slate-800">{classes.length}</span></li>
              <li>Total siswa: <span className="font-semibold text-slate-800">{students.length}</span></li>
              <li>
                Siswa di {selectedClassId ? (classes.find(c => c.id === selectedClassId)?.name || "-") : "semua kelas"}: 
                <span className="font-semibold text-slate-800"> {studentsInClass.length}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Daftar Siswa di Kelas */}
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Daftar Siswa {selectedClassId ? `- ${classes.find(c => c.id === selectedClassId)?.name || ""}` : "(semua)"}</h3>
        <div className="rounded-lg border bg-white overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {studentsInClass.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-sm text-gray-500">Belum ada siswa.</td>
                </tr>
              ) : (
                studentsInClass.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{s.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{s.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {s.classId ? (classes.find(c => c.id === s.classId)?.name || "-") : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
