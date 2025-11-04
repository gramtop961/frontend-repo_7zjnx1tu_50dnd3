import React, { useMemo, useState } from 'react';

export default function AttendanceRecap({ students, attendance }) {
  const [dateFilter, setDateFilter] = useState('');

  const enriched = useMemo(() => {
    const mapStudents = Object.fromEntries(students.map((s) => [s.id, s.name]));
    return attendance
      .filter((a) => (dateFilter ? a.date === dateFilter : true))
      .map((a) => ({
        ...a,
        studentName: mapStudents[a.studentId] || 'Tidak diketahui',
      }));
  }, [attendance, students, dateFilter]);

  return (
    <section className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-slate-800">Rekap Absensi</h3>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600 border-b">
              <th className="py-2 pr-2">Tanggal</th>
              <th className="py-2 pr-2">Nama</th>
              <th className="py-2 pr-2">Status</th>
              <th className="py-2">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {enriched.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-slate-500">Belum ada data.</td>
              </tr>
            ) : (
              enriched.map((r, idx) => (
                <tr key={idx} className="border-b last:border-b-0">
                  <td className="py-2 pr-2">{r.date}</td>
                  <td className="py-2 pr-2">{r.studentName}</td>
                  <td className="py-2 pr-2">{r.status}</td>
                  <td className="py-2">{r.note}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
