import { BookmarkPlus, RotateCcw } from "lucide-react";
import { TagPill } from "@/components/TagPill";
import type { DerivedExercise } from "@/types/models";

const difficultyStyles: Record<DerivedExercise["difficulty"], string> = {
  easy: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  hard: "bg-rose-50 text-rose-700 ring-rose-200",
};

const difficultyLabel: Record<DerivedExercise["difficulty"], string> = {
  easy: "简单",
  medium: "中等",
  hard: "提升",
};

export function DerivedExerciseCard({ exercise, onSave }: { exercise: DerivedExercise; onSave?: (exercise: DerivedExercise) => void }) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{exercise.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <TagPill label={difficultyLabel[exercise.difficulty]} className={difficultyStyles[exercise.difficulty]} />
            {exercise.knowledgePoints.map((item) => (
              <TagPill key={item} label={item} className="bg-slate-100 text-slate-600 ring-slate-200" />
            ))}
          </div>
        </div>
        {onSave ? (
          <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700" onClick={() => onSave(exercise)}>
            <BookmarkPlus size={16} />
            收藏到当前错题
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <RotateCcw size={16} />
            已保存
          </div>
        )}
      </div>
      <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
        <div>
          <div className="mb-1 font-semibold text-slate-900">题干</div>
          <p>{exercise.prompt}</p>
        </div>
        <div>
          <div className="mb-1 font-semibold text-slate-900">解题提示</div>
          <p>{exercise.hint || "先回忆原题关键步骤，再比较变化条件。"}</p>
        </div>
        <div>
          <div className="mb-1 font-semibold text-slate-900">参考答案</div>
          <p>{exercise.answer || "先根据知识点梳理解题框架，再完成完整步骤。"}</p>
        </div>
      </div>
    </article>
  );
}

