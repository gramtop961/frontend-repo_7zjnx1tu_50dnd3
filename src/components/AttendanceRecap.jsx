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

  const exportCSV = () => {
    const headers = ['Tanggal', 'Nama', 'Status', 'Catatan'];
    const rows = enriched.map((r) => [r.date, r.studentName, r.status, r.note || '']);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rekap-absensi${dateFilter ? '-' + dateFilter : ''}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const title = `Rekap Absensi ${dateFilter ? `(Tanggal ${dateFilter})` : ''}`;
    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Cantarell, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; padding: 24px; }
  h1 { font-size: 18px; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
  th { background: #f7f7f7; text-align: left; }
</style>
</head>
<body>
  <h1>${title}</h1>
  <table>
    <thead>
      <tr>
        <th>Tanggal</th>
        <th>Nama</th>
        <th>Status</th>
        <th>Catatan</th>
      </tr>
    </thead>
    <tbody>
      ${enriched
        .map(
          (r) => `<tr><td>${r.date}</td><td>${r.studentName}</td><td>${r.status}</td><td>${r.note || ''}</td></tr>`
        )
        .join('')}
    </tbody>
  </table>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
  };

  return (
    <section className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h3 className="font-medium text-slate-800">Rekap Absensi</h3>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          />
          <button
            onClick={exportCSV}
            className="rounded-md bg-emerald-600 text-white text-xs px-3 py-2 hover:bg-emerald-500"
          >
            Ekspor CSV (Excel)
          </button>
          <button
            onClick={exportPDF}
            className="rounded-md bg-indigo-600 text-white text-xs px-3 py-2 hover:bg-indigo-500"
          >
            Ekspor PDF
          </button>
        </div>
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
