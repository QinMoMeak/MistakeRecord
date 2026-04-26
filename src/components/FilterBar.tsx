import { Funnel, RotateCcw, Search, Star } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { SUBJECTS } from "@/lib/helpers";
import { useAppStore } from "@/store/useAppStore";

export function FilterBar() {
  const { students, tags, knowledgePoints, filters, setFilters, resetFilters } = useAppStore(
    useShallow((state) => ({
      students: state.students,
      tags: state.tags,
      knowledgePoints: state.knowledgePoints,
      filters: state.mistakeFilters,
      setFilters: state.setMistakeFilters,
      resetFilters: state.resetMistakeFilters,
    })),
  );

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-card">
      <div className="grid gap-3 xl:grid-cols-[1.2fr_repeat(6,minmax(0,1fr))]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={filters.keyword}
            onChange={(event) => setFilters({ keyword: event.target.value })}
            placeholder="搜索标题、考试、作业名"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-brand-300 focus:bg-white"
          />
        </label>

        <select value={filters.studentId} onChange={(event) => setFilters({ studentId: event.target.value })} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-brand-300">
          <option value="">全部学生</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>

        <select value={filters.subject} onChange={(event) => setFilters({ subject: event.target.value as typeof filters.subject })} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-brand-300">
          <option value="全部">全部学科</option>
          {SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <select value={filters.tag} onChange={(event) => setFilters({ tag: event.target.value })} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-brand-300">
          <option value="">全部标签</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.name}>
              {tag.name}
            </option>
          ))}
        </select>

        <select value={filters.knowledgePoint} onChange={(event) => setFilters({ knowledgePoint: event.target.value })} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-brand-300">
          <option value="">全部知识点</option>
          {knowledgePoints.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <select value={filters.masteryStatus} onChange={(event) => setFilters({ masteryStatus: event.target.value as typeof filters.masteryStatus })} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-brand-300">
          <option value="all">全部掌握状态</option>
          <option value="unmastered">未掌握</option>
          <option value="reviewing">复习中</option>
          <option value="mastered">已掌握</option>
        </select>

        <select value={filters.sortBy} onChange={(event) => setFilters({ sortBy: event.target.value as typeof filters.sortBy })} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-brand-300">
          <option value="createdAt-desc">最近上传</option>
          <option value="createdAt-asc">最早上传</option>
          <option value="reviewed-desc">最近复习</option>
          <option value="mastery">按掌握状态</option>
        </select>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium ${filters.starredOnly ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" : "bg-slate-100 text-slate-600"}`} onClick={() => setFilters({ starredOnly: !filters.starredOnly })}>
          <Star size={16} />
          仅看重点关注
        </button>
        <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700" onClick={() => setFilters({ masteryStatus: "unmastered" })}>
          <Funnel size={16} />
          一键筛选未掌握
        </button>
        <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600" onClick={resetFilters}>
          <RotateCcw size={16} />
          重置筛选
        </button>
      </div>
    </div>
  );
}
