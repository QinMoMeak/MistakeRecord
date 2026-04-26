import { GraduationCap, Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { formatDate } from "@/lib/helpers";
import { useAppStore } from "@/store/useAppStore";

export function StudentsPage() {
  const students = useAppStore((state) => state.students);
  const mistakes = useAppStore((state) => state.mistakes);
  const assignments = useAppStore((state) => state.assignments);
  const assessments = useAppStore((state) => state.assessments);
  const removeStudents = useAppStore((state) => state.removeStudents);

  if (!students.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="学生档案" description="先建立学生档案，后续所有错题、作业、评测都会围绕学生进行关联。" />
        <EmptyState icon={GraduationCap} title="还没有学生档案" description="点击右上角新建学生，开始按学生管理学习记录。" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="学生档案"
        description="支持新建、编辑、删除学生档案，并从学生详情直达错题、作业和评测。"
        actions={
          <Link to="/students/new" className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-card">
            <Plus size={16} className="mr-2 inline" />
            新建学生
          </Link>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {students.map((student) => (
          <article key={student.id} className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400">{student.grade}</div>
                <h3 className="mt-1 text-xl font-semibold text-slate-950">{student.name}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {student.school || "未填写学校"} {student.className ? `· ${student.className}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Link to={`/students/${student.id}/edit`} className="rounded-xl bg-slate-100 p-2 text-slate-700">
                  <Pencil size={16} />
                </Link>
                <button type="button" className="rounded-xl bg-rose-50 p-2 text-rose-700" onClick={() => void removeStudents([student.id])}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <div className="text-xs text-slate-400">错题</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{mistakes.filter((item) => item.studentId === student.id).length}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <div className="text-xs text-slate-400">作业</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{assignments.filter((item) => item.studentId === student.id).length}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <div className="text-xs text-slate-400">评测</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{assessments.filter((item) => item.studentId === student.id).length}</div>
              </div>
            </div>

            <div className="mt-5 text-sm text-slate-600">
              当前分数 {student.currentScore ?? "-"} / 目标分数 {student.targetScore ?? "-"}
            </div>
            <div className="mt-2 text-xs text-slate-400">最近更新 {formatDate(student.updatedAt)}</div>

            <div className="mt-5 flex gap-3">
              <Link to={`/students/${student.id}`} className="flex-1 rounded-2xl bg-brand-50 px-4 py-2.5 text-center text-sm font-medium text-brand-700">
                查看详情
              </Link>
              <Link to={`/mistakes/new?studentId=${student.id}`} className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-700">
                新增错题
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
