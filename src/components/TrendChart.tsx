import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTrendData } from "@/store/useAppStore";

export function TrendChart() {
  const data = useTrendData();

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">最近 7 天学习活动趋势</h3>
        <p className="mt-1 text-sm text-slate-500">统计每日新增错题、布置作业和评测安排。</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis allowDecimals={false} stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="mistakes" name="错题" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="assignments" name="作业" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="assessments" name="评测" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
