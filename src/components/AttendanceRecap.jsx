import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";

function monthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function AttendanceRecap({ students, records }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });

  const recap = useMemo(() => {
    const byStudent = {};
    for (const s of students) {
      byStudent[s.id] = { H: 0, I: 0, S: 0, A: 0 };
    }
    for (const r of records) {
      if (monthKey(r.date) !== selectedMonth) continue;
      if (!byStudent[r.studentId]) continue;
      byStudent[r.studentId][r.status] = (byStudent[r.studentId][r.status] || 0) + 1;
    }
    return byStudent;
  }, [records, selectedMonth, students]);

  const monthsAvailable = useMemo(() => {
    const set = new Set(records.map((r) => monthKey(r.date)));
    return Array.from(set).sort();
  }, [records]);

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-blue-600" size={20} />
          <h2 className="font-semibold">Rekap Kehadiran</h2>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Bulan</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-10 rounded-lg border px-3"
          >
            {monthsAvailable.length === 0 && (
              <option value={selectedMonth}>{selectedMonth}</option>
            )}
            {monthsAvailable.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left px-4 py-2">Siswa</th>
              <th className="text-center px-4 py-2">H</th>
              <th className="text-center px-4 py-2">I</th>
              <th className="text-center px-4 py-2">S</th>
              <th className="text-center px-4 py-2">A</th>
              <th className="text-center px-4 py-2">% Hadir</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const r = recap[s.id] || { H: 0, I: 0, S: 0, A: 0 };
              const total = r.H + r.I + r.S + r.A;
              const presentPct = total ? (r.H / total) * 100 : 0;
              return (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{s.name}</td>
                  <td className="px-4 py-2 text-center text-emerald-700">{r.H}</td>
                  <td className="px-4 py-2 text-center">{r.I}</td>
                  <td className="px-4 py-2 text-center">{r.S}</td>
                  <td className="px-4 py-2 text-center text-red-600">{r.A}</td>
                  <td className="px-4 py-2 text-center font-semibold">{presentPct.toFixed(0)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
