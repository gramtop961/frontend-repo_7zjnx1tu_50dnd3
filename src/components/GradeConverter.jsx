import { useMemo, useState } from "react";
import { NotebookPen, Calculator } from "lucide-react";

function getMonth(dateStr) {
  const d = new Date(dateStr);
  return d.getMonth(); // 0-11
}

function getSemester(dateStr) {
  const m = getMonth(dateStr);
  return m < 6 ? 1 : 2; // 1: Jan-Jun, 2: Jul-Dec
}

export default function GradeConverter({ students, onAddGrade, grades }) {
  const [form, setForm] = useState({
    studentId: students[0]?.id || "",
    date: new Date().toISOString().slice(0, 10),
    score: "",
  });
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [selectedSemester, setSelectedSemester] = useState(() => getMonth(new Date()) < 6 ? 1 : 2);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    const score = parseFloat(form.score);
    if (!form.studentId || !form.date || isNaN(score)) return;
    onAddGrade({ studentId: form.studentId, date: new Date(form.date).toISOString(), score });
    setForm((f) => ({ ...f, score: "" }));
  };

  const perStudent = useMemo(() => {
    const m = parseInt(selectedMonth.split("-")[1], 10) - 1;
    const s = selectedSemester;
    const map = {};
    for (const st of students) {
      map[st.id] = { monthly: [], semester: [] };
    }
    for (const g of grades) {
      if (!map[g.studentId]) continue;
      const mg = getMonth(g.date);
      if (mg === m) map[g.studentId].monthly.push(g.score);
      if (getSemester(g.date) === s) map[g.studentId].semester.push(g.score);
    }
    const computeAvg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
    const result = {};
    for (const st of students) {
      const mAvg = computeAvg(map[st.id].monthly);
      const sAvg = computeAvg(map[st.id].semester);
      result[st.id] = { monthlyAvg: mAvg, semesterAvg: sAvg };
    }
    return result;
  }, [grades, selectedMonth, selectedSemester, students]);

  const monthsAvailable = useMemo(() => {
    const set = new Set(grades.map((g) => new Date(g.date).toISOString().slice(0, 7)));
    return Array.from(set).sort();
  }, [grades]);

  return (
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <NotebookPen className="text-blue-600" size={20} />
        <h2 className="font-semibold">Nilai Harian → Bulanan & Semester</h2>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Siswa</label>
          <select name="studentId" value={form.studentId} onChange={handleChange} className="h-10 rounded-lg border px-3">
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Tanggal</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="h-10 rounded-lg border px-3" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Nilai (0-100)</label>
          <input type="number" min="0" max="100" step="0.1" name="score" value={form.score} onChange={handleChange} className="h-10 rounded-lg border px-3" />
        </div>
        <div className="md:col-span-2 flex items-end">
          <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition-colors">
            <Calculator size={18} /> Simpan Nilai Harian
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Bulan</label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="h-10 rounded-lg border px-3">
            {monthsAvailable.length === 0 && (
              <option value={selectedMonth}>{selectedMonth}</option>
            )}
            {monthsAvailable.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Semester</label>
          <select value={selectedSemester} onChange={(e) => setSelectedSemester(parseInt(e.target.value))} className="h-10 rounded-lg border px-3">
            <option value={1}>Semester 1 (Jan-Jun)</option>
            <option value={2}>Semester 2 (Jul-Des)</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left px-4 py-2">Siswa</th>
              <th className="text-center px-4 py-2">Rata-rata Bulanan</th>
              <th className="text-center px-4 py-2">Rata-rata Semester</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const v = perStudent[s.id] || { monthlyAvg: 0, semesterAvg: 0 };
              return (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{s.name}</td>
                  <td className="px-4 py-2 text-center">{v.monthlyAvg.toFixed(1)}</td>
                  <td className="px-4 py-2 text-center">{v.semesterAvg.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
