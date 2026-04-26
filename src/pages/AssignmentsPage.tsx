import { ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { ASSIGNMENT_STATUS_LABELS } from "@/lib/helpers";
import { useAppStore, useFilteredAssignments } from "@/store/useAppStore";

export function AssignmentsPage() {
  const records = useFilteredAssignments();
  const students = useAppStore((state) => state.students);

  return (
    <div className="space-y-6">
      <PageHeader title="每日作业" description="支持按学生生成每日作业草稿，生成后可继续手动编辑。" actions={<Link to="/assignments/new" className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-card">生成作业</Link>} />
      {!records.length ? (
        <EmptyState icon={ClipboardList} title="还没有作业记录" description="可以从学生详情或当前页面直接生成每日作业草稿。" />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {records.map((item) => {
            const student = students.find((studentItem) => studentItem.id === item.studentId);
            return (
              <Link key={item.id} to={`/assignments/${item.id}`} className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
                <div className="text-xs text-slate-400">{student?.name || "未关联学生"}</div>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{item.title}</h3>
                <div className="mt-3 text-sm text-slate-500">
                  {item.subject} · {item.date}
                </div>
                <div className="mt-4 text-sm text-slate-600">{item.summary || "暂无作业说明"}</div>
                <div className="mt-4 text-sm font-medium text-brand-700">{ASSIGNMENT_STATUS_LABELS[item.status]}</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

