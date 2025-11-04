import { Users, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

export default function DashboardCards({ stats }) {
  const { totalStudents, presentToday, absentToday, avgMonthlyGrade } = stats;
  const Card = ({ icon: Icon, label, value, accent }) => (
    <div className={`flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm ${accent}`}>
      <div className="h-12 w-12 rounded-lg bg-gray-100 grid place-items-center text-gray-700">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card icon={Users} label="Total Siswa" value={totalStudents} />
      <Card icon={CheckCircle2} label="Hadir Hari Ini" value={presentToday} />
      <Card icon={XCircle} label="Tidak Hadir" value={absentToday} />
      <div className="flex items-center gap-4 rounded-xl border bg-gradient-to-br from-blue-600 to-indigo-600 p-4 text-white shadow-sm">
        <div className="h-12 w-12 rounded-lg bg-white/20 grid place-items-center">
          <TrendingUp size={22} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-white/80">Rata-rata Nilai Bulanan</p>
          <p className="text-2xl font-semibold">{avgMonthlyGrade.toFixed(1)}</p>
        </div>
      </div>
    </section>
  );
}
