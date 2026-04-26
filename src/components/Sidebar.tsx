import {
  BookOpenCheck,
  DatabaseBackup,
  FileSpreadsheet,
  FolderKanban,
  GraduationCap,
  House,
  NotebookPen,
  Tags,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/helpers";

const navItems = [
  { to: "/", label: "首页", icon: House },
  { to: "/students", label: "学生档案", icon: GraduationCap },
  { to: "/mistakes", label: "错题本", icon: FolderKanban },
  { to: "/assignments", label: "每日作业", icon: NotebookPen },
  { to: "/assessments", label: "评测考试", icon: FileSpreadsheet },
  { to: "/taxonomy", label: "知识点/标签", icon: Tags },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 rounded-3xl bg-brand-600 px-4 py-4 text-white shadow-card">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
          <BookOpenCheck size={24} />
        </div>
        <div>
          <p className="text-lg font-bold">学习管理台</p>
          <p className="text-sm text-brand-100">学生档案 + 错题 + 作业 + 评测</p>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive ? "bg-brand-50 text-brand-700 shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <NavLink
        to="/taxonomy"
        onClick={onNavigate}
        className="mt-3 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        <DatabaseBackup size={18} />
        数据备份
      </NavLink>

      <div className="mt-auto rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-4">
        <p className="text-sm font-semibold text-brand-700">MVP 使用建议</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          先建学生档案，再录错题；后续生成的作业和评测都会自动围绕该学生的薄弱点组织。
        </p>
      </div>
    </div>
  );
}

