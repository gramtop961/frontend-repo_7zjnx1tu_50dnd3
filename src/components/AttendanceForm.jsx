import { useMemo, useState } from "react";
import { CalendarCheck2, Plus } from "lucide-react";

const STATUS = [
  { value: "H", label: "Hadir" },
  { value: "I", label: "Izin" },
  { value: "S", label: "Sakit" },
  { value: "A", label: "Alfa" },
];

export default function AttendanceForm({ students, onSubmit }) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [form, setForm] = useState({
    studentId: students[0]?.id || "",
    date: today,
    status: "H",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.studentId || !form.date || !form.status) return;
    onSubmit({ ...form, date: new Date(form.date).toISOString() });
    setForm((f) => ({ ...f, status: "H", note: "" }));
  };

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CalendarCheck2 className="text-blue-600" size={20} />
        <h2 className="font-semibold">Absensi Siswa</h2>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Siswa</label>
          <select
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            className="h-10 rounded-lg border px-3"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Tanggal</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="h-10 rounded-lg border px-3"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="h-10 rounded-lg border px-3"
          >
            {STATUS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-sm text-gray-600">Catatan</label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Opsional"
            className="h-10 rounded-lg border px-3"
          />
        </div>
        <div className="md:col-span-1 flex items-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Simpan Absensi
          </button>
        </div>
      </form>
    </section>
  );
}
