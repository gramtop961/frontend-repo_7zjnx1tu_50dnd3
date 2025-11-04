import { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import DashboardCards from "./components/DashboardCards";
import AttendanceForm from "./components/AttendanceForm";
import AttendanceRecap from "./components/AttendanceRecap";
import GradeConverter from "./components/GradeConverter";

function App() {
  // Sample siswa (bisa dihubungkan ke backend nanti)
  const [students] = useState([
    { id: "S001", name: "Alya Prameswari" },
    { id: "S002", name: "Bima Saputra" },
    { id: "S003", name: "Citra Laksmi" },
    { id: "S004", name: "Dimas Maulana" },
  ]);

  // Data absensi & nilai (sementara in-memory untuk demo UI)
  const [attendance, setAttendance] = useState([
    // Contoh data awal: hari ini dan beberapa hari lalu
    { studentId: "S001", date: new Date().toISOString(), status: "H", note: "" },
    { studentId: "S002", date: new Date().toISOString(), status: "I", note: "Keperluan" },
    { studentId: "S003", date: new Date().toISOString(), status: "H", note: "" },
  ]);

  const [grades, setGrades] = useState([
    { studentId: "S001", date: new Date().toISOString(), score: 86 },
    { studentId: "S002", date: new Date().toISOString(), score: 78 },
    { studentId: "S003", date: new Date().toISOString(), score: 92 },
  ]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const stats = useMemo(() => {
    const todayRecords = attendance.filter((a) => a.date.slice(0, 10) === todayKey);
    const presentToday = todayRecords.filter((a) => a.status === "H").length;
    const absentToday = todayRecords.filter((a) => a.status !== "H").length;

    // Rata-rata nilai bulanan (bulan berjalan)
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthly = grades.filter((g) => g.date.slice(0, 7) === currentMonth);
    const avgMonthlyGrade = monthly.length
      ? monthly.reduce((sum, g) => sum + g.score, 0) / monthly.length
      : 0;

    return {
      totalStudents: students.length,
      presentToday,
      absentToday,
      avgMonthlyGrade,
    };
  }, [attendance, grades, students.length, todayKey]);

  const addAttendance = (record) => {
    setAttendance((prev) => [...prev, record]);
  };

  const addGrade = (entry) => {
    setGrades((prev) => [...prev, entry]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <DashboardCards stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AttendanceForm students={students} onSubmit={addAttendance} />
            <AttendanceRecap students={students} records={attendance} />
          </div>
          <div className="lg:col-span-1">
            <GradeConverter students={students} grades={grades} onAddGrade={addGrade} />
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-xs text-gray-500">
        Dibuat untuk demo: Absensi, Rekap, dan Konversi Nilai.
      </footer>
    </div>
  );
}

export default App;
