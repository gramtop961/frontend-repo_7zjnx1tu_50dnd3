import React, { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import ClassManager from './components/ClassManager';
import AttendanceForm from './components/AttendanceForm';
import AttendanceRecap from './components/AttendanceRecap';
import GradeConverter from './components/GradeConverter';

// Simple id generator for demo purposes
const uid = () => Math.random().toString(36).slice(2, 10);

export default function App() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]); // {id, name, classId}
  const [attendance, setAttendance] = useState([]); // {studentId, date, status, note}
  const [grades, setGrades] = useState([]); // {studentId, date, score}
  const [selectedClassId, setSelectedClassId] = useState(null);

  const selectedClassName = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId)?.name || '';
  }, [classes, selectedClassId]);

  const studentsInSelected = useMemo(
    () => students.filter((s) => s.classId === selectedClassId),
    [students, selectedClassId]
  );

  const attendanceInSelected = useMemo(
    () => attendance.filter((a) => studentsInSelected.some((s) => s.id === a.studentId)),
    [attendance, studentsInSelected]
  );

  const gradesInSelected = useMemo(
    () => grades.filter((g) => studentsInSelected.some((s) => s.id === g.studentId)),
    [grades, studentsInSelected]
  );

  // Class actions
  const handleAddClass = (name) => {
    const id = uid();
    const newClass = { id, name };
    setClasses((prev) => [...prev, newClass]);
    setSelectedClassId(id);
  };

  const handleDeleteClass = (classId) => {
    // Remove class, its students, and related attendance and grades
    const studentIds = students.filter((s) => s.classId === classId).map((s) => s.id);
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    setStudents((prev) => prev.filter((s) => s.classId !== classId));
    setAttendance((prev) => prev.filter((a) => !studentIds.includes(a.studentId)));
    setGrades((prev) => prev.filter((g) => !studentIds.includes(g.studentId)));
    if (selectedClassId === classId) setSelectedClassId(null);
  };

  // Student actions
  const handleAddStudent = ({ name, classId }) => {
    setStudents((prev) => [...prev, { id: uid(), name, classId }]);
  };

  const handleMoveStudent = (studentId, targetClassId) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, classId: targetClassId } : s)));
  };

  const handleEditStudent = (studentId, newName) => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, name: newName } : s)));
  };

  const handleDeleteStudent = (studentId) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setAttendance((prev) => prev.filter((a) => a.studentId !== studentId));
    setGrades((prev) => prev.filter((g) => g.studentId !== studentId));
  };

  // Attendance actions
  const handleSubmitAttendance = (records) => {
    // Replace existing records for same studentId+date
    setAttendance((prev) => {
      const key = (r) => `${r.studentId}|${r.date}`;
      const existing = new Map(prev.map((r) => [key(r), r]));
      records.forEach((r) => existing.set(key(r), r));
      return Array.from(existing.values());
    });
  };

  // Grade actions
  const handleAddGrade = ({ studentId, date, score }) => {
    setGrades((prev) => [...prev, { studentId, date, score: Number(score) }]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar selectedClassName={selectedClassName} />

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        <ClassManager
          classes={classes}
          students={students}
          attendance={attendance}
          selectedClassId={selectedClassId}
          onSelectClass={setSelectedClassId}
          onAddClass={handleAddClass}
          onDeleteClass={handleDeleteClass}
          onAddStudent={handleAddStudent}
          onMoveStudent={handleMoveStudent}
          onEditStudent={handleEditStudent}
          onDeleteStudent={handleDeleteStudent}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AttendanceForm
            students={studentsInSelected}
            onSubmitAttendance={handleSubmitAttendance}
          />

          <AttendanceRecap
            students={studentsInSelected}
            attendance={attendanceInSelected}
          />
        </div>

        <GradeConverter
          students={studentsInSelected}
          grades={gradesInSelected}
          onAddGrade={handleAddGrade}
        />
      </main>

      <footer className="py-6 text-center text-xs text-slate-500">
        Dibuat untuk pengelolaan absensi, manajemen kelas, dan nilai harian.
      </footer>
    </div>
  );
}
