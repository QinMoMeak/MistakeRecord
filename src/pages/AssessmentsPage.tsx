import { FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { useAppStore, useFilteredAssessments } from "@/store/useAppStore";

export function AssessmentsPage() {
  const records = useFilteredAssessments();
  const students = useAppStore((state) => state.students);

  return (
    <div className="space-y-6">
      <PageHeader title="评测考试" description="围绕学生薄弱点生成短评测，支持录入学生答案和把失分题转入错题本。" actions={<Link to="/assessments/new" className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-card">生成评测</Link>} />
      {!records.length ? (
        <EmptyState icon={FileSpreadsheet} title="还没有评测记录" description="可以从学生详情或当前页面直接生成评测草稿。" />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {records.map((item) => {
            const student = students.find((studentItem) => studentItem.id === item.studentId);
            return (
              <Link key={item.id} to={`/assessments/${item.id}`} className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
                <div className="text-xs text-slate-400">{student?.name || "未关联学生"}</div>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{item.title}</h3>
                <div className="mt-3 text-sm text-slate-500">
                  {item.subject} · {item.date}
                </div>
                <div className="mt-4 text-sm text-slate-600">{item.analysisSummary || "暂无评测分析"}</div>
                <div className="mt-4 text-sm font-medium text-brand-700">
                  得分 {item.actualScore ?? "-"} / {item.totalScore ?? "-"}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

