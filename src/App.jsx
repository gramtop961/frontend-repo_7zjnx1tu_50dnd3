import { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import DashboardCards from "./components/DashboardCards";
import AttendanceForm from "./components/AttendanceForm";
import AttendanceRecap from "./components/AttendanceRecap";
import GradeConverter from "./components/GradeConverter";
import ClassManager from "./components/ClassManager";

function App() {
  // Kelas
  const [classes, setClasses] = useState([
    { id: "C01", name: "X IPA 1" },
    { id: "C02", name: "X IPA 2" },
  ]);

  // Siswa (bisa dihubungkan ke backend nanti)
  const [students, setStudents] = useState([
    { id: "S001", name: "Alya Prameswari", classId: "C01" },
    { id: "S002", name: "Bima Saputra", classId: "C01" },
    { id: "S003", name: "Citra Laksmi", classId: "C02" },
    { id: "S004", name: "Dimas Maulana", classId: "C02" },
  ]);

  const [selectedClassId, setSelectedClassId] = useState(null);

  // Data absensi & nilai (sementara in-memory untuk demo UI)
  const [attendance, setAttendance] = useState([
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

    // Stats mengikuti filter kelas jika ada
    const filteredStudents = selectedClassId
      ? students.filter((s) => s.classId === selectedClassId)
      : students;
    const filteredIds = new Set(filteredStudents.map((s) => s.id));

    const presentFiltered = todayRecords.filter(
      (a) => a.status === "H" && filteredIds.has(a.studentId)
    ).length;
    const absentFiltered = todayRecords.filter(
      (a) => a.status !== "H" && filteredIds.has(a.studentId)
    ).length;

    return {
      totalStudents: filteredStudents.length,
      presentToday: presentFiltered,
      absentToday: absentFiltered,
      avgMonthlyGrade,
    };
  }, [attendance, grades, students, todayKey, selectedClassId]);

  const addAttendance = (record) => {
    setAttendance((prev) => [...prev, record]);
  };

  const addGrade = (entry) => {
    setGrades((prev) => [...prev, entry]);
  };

  const addClass = (name) => {
    const id = `C${String(classes.length + 1).padStart(2, "0")}`;
    setClasses((prev) => [...prev, { id, name }]);
    // otomatis pilih kelas baru
    setSelectedClassId(id);
  };

  const addStudent = (name, classId) => {
    const id = `S${String(students.length + 1).padStart(3, "0")}`;
    setStudents((prev) => [...prev, { id, name, classId: classId || null }]);
  };

  const filteredStudents = selectedClassId
    ? students.filter((s) => s.classId === selectedClassId)
    : students;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <DashboardCards stats={stats} />

        <ClassManager
          classes={classes}
          students={students}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
          onAddClass={addClass}
          onAddStudent={addStudent}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AttendanceForm students={filteredStudents} onSubmit={addAttendance} />
            <AttendanceRecap students={filteredStudents} records={attendance} />
          </div>
          <div className="lg:col-span-1">
            <GradeConverter students={filteredStudents} grades={grades} onAddGrade={addGrade} />
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-xs text-gray-500">
        Dibuat untuk demo: Absensi, Rekap, Konversi Nilai, serta Manajemen Kelas & Siswa.
      </footer>
    </div>
  );
}

export default App;
