import { BookOpenCheck, CalendarCheck2, FileSpreadsheet, GraduationCap, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ImportExportPanel } from "@/components/ImportExportPanel";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { TagPill } from "@/components/TagPill";
import { TrendChart } from "@/components/TrendChart";
import { UploadDropzone } from "@/components/UploadDropzone";
import { formatDate, MASTERY_STYLES } from "@/lib/helpers";
import { useAppStore, useDashboardStats } from "@/store/useAppStore";

export function DashboardPage() {
  const stats = useDashboardStats();
  const navigate = useNavigate();
  const students = useAppStore((state) => state.students);

  return (
    <div className="space-y-6">
      <PageHeader
        title="学习管理总览"
        description="围绕学生档案统一管理错题、每日作业与评测考试。首页重点展示待处理事项和高频薄弱知识点。"
        actions={
          <>
            <button type="button" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700" onClick={() => navigate("/students/new")}>
              <Plus size={16} className="mr-2 inline" />
              新建学生
            </button>
            <ImportExportPanel compact triggerClassName="inline-flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700" />
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="学生数量" value={stats.studentCount} hint="当前在管学生" icon={GraduationCap} tone="bg-brand-50 text-brand-600" />
        <StatCard label="今日新增错题" value={stats.todayMistakes} hint="当天录入" icon={BookOpenCheck} tone="bg-violet-50 text-violet-600" />
        <StatCard label="今日作业" value={stats.todayAssignments} hint="当天安排" icon={CalendarCheck2} tone="bg-emerald-50 text-emerald-600" />
        <StatCard label="待复习错题" value={stats.pendingReviewMistakes} hint="未掌握与复习中" icon={FileSpreadsheet} tone="bg-amber-50 text-amber-600" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <UploadDropzone />
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">最近学生</h3>
              <Link to="/students" className="text-sm font-medium text-brand-600">
                查看全部
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {stats.recentStudents.map((student) => (
                <Link key={student.id} to={`/students/${student.id}`} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <div className="font-medium text-slate-800">{student.name}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {student.grade} {student.className ? `· ${student.className}` : ""}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(student.updatedAt)}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">高频薄弱知识点</h3>
              <Link to="/taxonomy" className="text-sm font-medium text-brand-600">
                管理
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {stats.weakKnowledgePoints.map(([point, count]) => (
                <TagPill key={point} label={`${point} ${count}`} className="bg-rose-50 text-rose-700 ring-rose-200" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">最近错题</h3>
            <Link to="/mistakes" className="text-sm font-medium text-brand-600">
              查看全部
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {stats.recentMistakes.map((item) => {
              const student = students.find((studentItem) => studentItem.id === item.studentId);
              return (
                <Link key={item.id} to={`/mistakes/${item.id}`} className="block rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-slate-800">{item.title}</span>
                    <span className={`rounded-full px-3 py-1 text-xs ring-1 ring-inset ${MASTERY_STYLES[item.masteryStatus]}`}>{item.subject}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{student?.name || "未关联学生"}</div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">待完成作业</h3>
            <Link to="/assignments" className="text-sm font-medium text-brand-600">
              查看全部
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {stats.pendingAssignments.map((item) => {
              const student = students.find((studentItem) => studentItem.id === item.studentId);
              return (
                <Link key={item.id} to={`/assignments/${item.id}`} className="block rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="font-medium text-slate-800">{item.title}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {student?.name || "未关联学生"} · {item.status}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">最近评测</h3>
            <Link to="/assessments" className="text-sm font-medium text-brand-600">
              查看全部
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {stats.recentAssessments.map((item) => {
              const student = students.find((studentItem) => studentItem.id === item.studentId);
              return (
                <Link key={item.id} to={`/assessments/${item.id}`} className="block rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="font-medium text-slate-800">{item.title}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {student?.name || "未关联学生"} · {item.actualScore ?? "-"} / {item.totalScore ?? "-"}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <TrendChart />
    </div>
  );
}
