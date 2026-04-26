import { FileSpreadsheet, GraduationCap, NotebookPen, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ImportExportPanel } from "@/components/ImportExportPanel";
import { useAppStore } from "@/store/useAppStore";

export function Topbar() {
  const navigate = useNavigate();
  const students = useAppStore((state) => state.students);

  return (
    <div className="hidden items-center justify-between gap-4 py-4 lg:flex">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-500">Student Archive Workspace</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-950">学生个人学习档案系统</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
          onClick={() => navigate("/mistakes?quick=unmastered")}
        >
          <Search size={16} />
          快速筛选未掌握
        </button>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700">
          <GraduationCap size={16} />
          学生数 {students.length}
        </div>
        <ImportExportPanel compact triggerClassName="inline-flex items-center gap-2 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-medium text-brand-700" />
        <button type="button" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700" onClick={() => navigate("/assignments/new")}>
          <NotebookPen size={16} />
          生成作业
        </button>
        <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-card" onClick={() => navigate("/assessments/new")}>
          <FileSpreadsheet size={16} />
          生成评测
        </button>
      </div>
    </div>
  );
}
