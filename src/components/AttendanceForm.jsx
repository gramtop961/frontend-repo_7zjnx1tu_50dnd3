import React, { useMemo, useState } from 'react';

const statusOptions = [
  { value: 'Hadir', label: 'Hadir' },
  { value: 'Izin', label: 'Izin' },
  { value: 'Sakit', label: 'Sakit' },
  { value: 'Alpha', label: 'Alpha' },
];

export default function AttendanceForm({ students, onSubmitAttendance }) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const initial = useMemo(
    () => Object.fromEntries(students.map((s) => [s.id, { status: 'Hadir', note: '' }])) ,
    [students]
  );
  const [entries, setEntries] = useState(initial);

  React.useEffect(() => {
    setEntries(initial);
  }, [initial]);

  const handleChange = (studentId, field, value) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const records = students.map((s) => ({
      studentId: s.id,
      date,
      status: entries[s.id]?.status || 'Hadir',
      note: entries[s.id]?.note || '',
    }));
    onSubmitAttendance(records);
  };

  return (
    <section className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-slate-800">Input Absensi</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>

      {students.length === 0 ? (
        <p className="text-sm text-slate-500">Tidak ada siswa di kelas ini.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {students.map((s) => (
            <div key={s.id} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
              <div className="sm:col-span-4 text-slate-800 text-sm">{s.name}</div>
              <div className="sm:col-span-3">
                <select
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={entries[s.id]?.status || 'Hadir'}
                  onChange={(e) => handleChange(s.id, 'status', e.target.value)}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-5">
                <input
                  type="text"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="Catatan (opsional)"
                  value={entries[s.id]?.note || ''}
                  onChange={(e) => handleChange(s.id, 'note', e.target.value)}
                />
              </div>
            </div>
          ))}

          <div className="pt-2">
            <button
              type="submit"
              className="rounded-md bg-slate-800 text-white text-sm px-4 py-2 hover:bg-slate-700"
            >
              Simpan Absensi
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
