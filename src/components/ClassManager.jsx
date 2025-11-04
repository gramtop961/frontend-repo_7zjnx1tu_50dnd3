import React, { useMemo, useState } from 'react';

export default function ClassManager({
  classes,
  students,
  attendance = [],
  selectedClassId,
  onSelectClass,
  onAddClass,
  onDeleteClass,
  onAddStudent,
  onMoveStudent,
  onEditStudent,
  onDeleteStudent,
}) {
  const [newClassName, setNewClassName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [moveTargetClassId, setMoveTargetClassId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const selectedClass = useMemo(
    () => classes.find((c) => c.id === selectedClassId) || null,
    [classes, selectedClassId]
  );

  const studentsInClass = useMemo(
    () => students.filter((s) => s.classId === selectedClassId),
    [students, selectedClassId]
  );

  const handleAddClass = (e) => {
    e.preventDefault();
    const name = newClassName.trim();
    if (!name) return;
    onAddClass(name);
    setNewClassName('');
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const name = newStudentName.trim();
    if (!name || !selectedClassId) return;
    onAddStudent({ name, classId: selectedClassId });
    setNewStudentName('');
  };

  const confirmDeleteClass = (c) => {
    const classStudents = students.filter((s) => s.classId === c.id);
    const studentIds = classStudents.map((s) => s.id);
    const attCount = attendance.filter((a) => studentIds.includes(a.studentId)).length;
    const summary = `Anda akan menghapus kelas "${c.name}".\n\nRingkasan:\n- Jumlah siswa: ${classStudents.length}${classStudents.length ? ` (contoh: ${classStudents.slice(0,3).map(s=>s.name).join(', ')}${classStudents.length>3 ? ', ...' : ''})` : ''}\n- Data absensi terkait: ${attCount}\n\nTindakan ini tidak dapat dibatalkan. Lanjutkan?`;
    if (confirm(summary)) onDeleteClass(c.id);
  };

  const confirmDeleteStudent = (s) => {
    const attCount = attendance.filter((a) => a.studentId === s.id).length;
    const summary = `Hapus siswa \"${s.name}\"?\n\nRingkasan:\n- Kelas: ${selectedClass?.name || '-'}\n- Data absensi yang akan dihapus: ${attCount}\n\nTindakan ini tidak dapat dibatalkan. Lanjutkan?`;
    if (confirm(summary)) onDeleteStudent(s.id);
  };

  const startEdit = (s) => {
    setEditingId(s.id);
    setEditingName(s.name);
  };

  const saveEdit = () => {
    const name = editingName.trim();
    if (!name) return;
    onEditStudent(editingId, name);
    setEditingId(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-medium text-slate-800 mb-3">Kelola Kelas</h3>
          <form onSubmit={handleAddClass} className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200"
              placeholder="Nama kelas (misal: X IPA 1)"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-md bg-slate-800 text-white text-sm px-3 py-2 hover:bg-slate-700"
            >
              Tambah
            </button>
          </form>

          <div className="mt-4 space-y-2">
            {classes.length === 0 && (
              <p className="text-sm text-slate-500">Belum ada kelas.</p>
            )}
            {classes.map((c) => (
              <div
                key={c.id}
                className={`flex items-center justify-between rounded-md border px-3 py-2 ${
                  c.id === selectedClassId ? 'bg-slate-50 border-slate-300' : 'bg-white'
                }`}
              >
                <button
                  className="text-left text-sm text-slate-800 hover:underline"
                  onClick={() => onSelectClass(c.id)}
                >
                  {c.name}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => confirmDeleteClass(c)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h3 className="font-medium text-slate-800 mb-3">Kelola Siswa</h3>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <select
              value={selectedClassId || ''}
              onChange={(e) => onSelectClass(e.target.value || null)}
              className="rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Pilih kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="text-sm text-slate-500">
              {selectedClass ? `${studentsInClass.length} siswa dalam ${selectedClass.name}` : 'Belum memilih kelas'}
            </span>
          </div>

          <form onSubmit={handleAddStudent} className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-200"
              placeholder="Nama siswa"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              disabled={!selectedClassId}
            />
            <button
              type="submit"
              disabled={!selectedClassId}
              className="rounded-md bg-slate-800 text-white text-sm px-3 py-2 hover:bg-slate-700 disabled:opacity-50"
            >
              Tambah Siswa
            </button>
          </form>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600 border-b">
                  <th className="py-2 pr-2">Nama</th>
                  <th className="py-2 pr-2">Pindah ke</th>
                  <th className="py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {studentsInClass.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-slate-500">
                      {selectedClassId ? 'Belum ada siswa di kelas ini.' : 'Pilih kelas untuk melihat daftar siswa.'}
                    </td>
                  </tr>
                ) : (
                  studentsInClass.map((s) => (
                    <tr key={s.id} className="border-b last:border-b-0">
                      <td className="py-2 pr-2 text-slate-800">
                        {editingId === s.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              className="rounded-md border px-2 py-1"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                            />
                            <button
                              onClick={saveEdit}
                              className="text-xs rounded-md bg-green-600 hover:bg-green-500 text-white px-2 py-1"
                            >
                              Simpan
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-xs text-slate-600 hover:underline"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <span>{s.name}</span>
                        )}
                      </td>
                      <td className="py-2 pr-2">
                        <div className="flex items-center gap-2">
                          <select
                            className="rounded-md border px-2 py-1"
                            value={moveTargetClassId || ''}
                            onChange={(e) => setMoveTargetClassId(e.target.value)}
                          >
                            <option value="">Pilih kelas</option>
                            {classes
                              .filter((c) => c.id !== selectedClassId)
                              .map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                          </select>
                          <button
                            className="text-xs rounded-md bg-blue-600 hover:bg-blue-500 text-white px-2 py-1"
                            onClick={() => {
                              if (!moveTargetClassId) return;
                              if (confirm(`Pindahkan ${s.name} ke kelas lain?`)) {
                                onMoveStudent(s.id, moveTargetClassId);
                                setMoveTargetClassId('');
                              }
                            }}
                          >
                            Pindahkan
                          </button>
                        </div>
                      </td>
                      <td className="py-2">
                        {editingId !== s.id && (
                          <button
                            className="text-xs text-blue-600 hover:underline mr-3"
                            onClick={() => startEdit(s)}
                          >
                            Ubah Nama
                          </button>
                        )}
                        <button
                          className="text-xs text-red-600 hover:underline"
                          onClick={() => confirmDeleteStudent(s)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
