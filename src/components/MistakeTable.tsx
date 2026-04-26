import { CheckCheck, Eye, Pencil, Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { TagPill } from "@/components/TagPill";
import { MASTERY_LABELS, MASTERY_STYLES, SOURCE_SCENE_LABELS, SUBJECT_COLORS, formatDateTime } from "@/lib/helpers";
import { useAppStore } from "@/store/useAppStore";
import type { MistakeRecord } from "@/types/models";

export function MistakeTable({ records }: { records: MistakeRecord[] }) {
  const { students, selectedMistakeIds, toggleSelection, toggleStar, markReviewed, removeMistakeRecords } = useAppStore(
    useShallow((state) => ({
      students: state.students,
      selectedMistakeIds: state.selectedMistakeIds,
      toggleSelection: state.toggleSelection,
      toggleStar: state.toggleStar,
      markReviewed: state.markReviewed,
      removeMistakeRecords: state.removeMistakeRecords,
    })),
  );

  return (
    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-4">选择</th>
              <th className="px-4 py-4">标题</th>
              <th className="px-4 py-4">学生</th>
              <th className="px-4 py-4">学科</th>
              <th className="px-4 py-4">来源</th>
              <th className="px-4 py-4">状态</th>
              <th className="px-4 py-4">更新时间</th>
              <th className="px-4 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              const student = students.find((item) => item.id === record.studentId);
              return (
                <tr key={record.id} className="border-t border-slate-100">
                  <td className="px-4 py-4">
                    <input type="checkbox" checked={selectedMistakeIds.includes(record.id)} onChange={() => toggleSelection(record.id)} className="h-4 w-4 rounded border-slate-300" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <button type="button" className={record.isStarred ? "text-amber-500" : "text-slate-300"} onClick={() => void toggleStar(record.id)}>
                        <Star size={16} fill={record.isStarred ? "currentColor" : "none"} />
                      </button>
                      <div>
                        <Link to={`/mistakes/${record.id}`} className="font-semibold text-slate-900">
                          {record.title}
                        </Link>
                        <p className="mt-1 max-w-md truncate text-xs text-slate-500">{record.problemText}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{student?.name || "未关联"}</td>
                  <td className="px-4 py-4">
                    <TagPill label={record.subject} className={SUBJECT_COLORS[record.subject]} />
                  </td>
                  <td className="px-4 py-4">
                    <TagPill label={SOURCE_SCENE_LABELS[record.sourceScene]} className="bg-slate-100 text-slate-600 ring-slate-200" />
                  </td>
                  <td className="px-4 py-4">
                    <TagPill label={MASTERY_LABELS[record.masteryStatus]} className={MASTERY_STYLES[record.masteryStatus]} />
                  </td>
                  <td className="px-4 py-4 text-slate-500">{formatDateTime(record.updatedAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" className="rounded-xl bg-emerald-50 p-2 text-emerald-700" onClick={() => void markReviewed(record.id)}>
                        <CheckCheck size={16} />
                      </button>
                      <Link to={`/mistakes/${record.id}`} className="rounded-xl bg-brand-50 p-2 text-brand-700">
                        <Eye size={16} />
                      </Link>
                      <Link to={`/mistakes/${record.id}/edit`} className="rounded-xl bg-slate-100 p-2 text-slate-700">
                        <Pencil size={16} />
                      </Link>
                      <button type="button" className="rounded-xl bg-rose-50 p-2 text-rose-700" onClick={() => void removeMistakeRecords([record.id])}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
