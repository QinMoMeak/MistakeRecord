import { CheckCheck, Eye, Pencil, Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { TagPill } from "@/components/TagPill";
import { MASTERY_LABELS, MASTERY_STYLES, SOURCE_SCENE_LABELS, SUBJECT_COLORS, formatDateTime } from "@/lib/helpers";
import { useAppStore } from "@/store/useAppStore";
import type { MistakeRecord } from "@/types/models";

export function MistakeCard({ record }: { record: MistakeRecord }) {
  const { students, toggleStar, markReviewed, removeMistakeRecords, images } = useAppStore(
    useShallow((state) => ({
      students: state.students,
      toggleStar: state.toggleStar,
      markReviewed: state.markReviewed,
      removeMistakeRecords: state.removeMistakeRecords,
      images: state.images,
    })),
  );
  const image = images.find((item) => item.id === record.imageIds[0]);
  const student = students.find((item) => item.id === record.studentId);

  return (
    <article className="flex h-full flex-col rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-card">
      {image ? <img src={image.dataUrl} alt={record.title} className="h-44 w-full rounded-2xl border border-slate-100 object-cover" /> : null}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400">{student?.name || "未关联学生"}</div>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">{record.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{record.problemText || "暂未填写题目内容"}</p>
        </div>
        <button type="button" className={`rounded-2xl p-2 ${record.isStarred ? "bg-amber-50 text-amber-500" : "bg-slate-100 text-slate-400"}`} onClick={() => void toggleStar(record.id)}>
          <Star size={18} fill={record.isStarred ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <TagPill label={record.subject} className={SUBJECT_COLORS[record.subject]} />
        <TagPill label={MASTERY_LABELS[record.masteryStatus]} className={MASTERY_STYLES[record.masteryStatus]} />
        <TagPill label={SOURCE_SCENE_LABELS[record.sourceScene]} className="bg-slate-100 text-slate-600 ring-slate-200" />
      </div>
      <div className="mt-4 text-xs text-slate-400">更新于 {formatDateTime(record.updatedAt)}</div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        <Link to={`/mistakes/${record.id}`} className="inline-flex items-center justify-center rounded-2xl bg-brand-50 px-3 py-2 text-brand-700">
          <Eye size={16} />
        </Link>
        <Link to={`/mistakes/${record.id}/edit`} className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-3 py-2 text-slate-700">
          <Pencil size={16} />
        </Link>
        <button type="button" className="rounded-2xl bg-emerald-50 px-3 py-2 text-emerald-700" onClick={() => void markReviewed(record.id)}>
          <CheckCheck size={16} />
        </button>
        <button type="button" className="rounded-2xl bg-rose-50 px-3 py-2 text-rose-700" onClick={() => void removeMistakeRecords([record.id])}>
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}

