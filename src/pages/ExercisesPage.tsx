import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DerivedExerciseCard } from "@/components/DerivedExerciseCard";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { generateDerivedExercises } from "@/lib/exercise-generator";
import { useAppStore } from "@/store/useAppStore";
import type { DerivedExercise } from "@/types/models";

export function ExercisesPage() {
  const { id } = useParams();
  const mistakes = useAppStore((state) => state.mistakes);
  const students = useAppStore((state) => state.students);
  const saveExercises = useAppStore((state) => state.saveExercises);
  const record = mistakes.find((item) => item.id === id);
  const student = students.find((item) => item.id === record?.studentId);
  const [draftExercises, setDraftExercises] = useState<DerivedExercise[]>([]);

  useEffect(() => {
    if (!record) return;
    setDraftExercises(record.derivedExercises.length ? record.derivedExercises : generateDerivedExercises(record, student));
  }, [record, student]);

  if (!record) {
    return <EmptyState icon={Sparkles} title="无法生成练习" description="没有找到对应的错题记录。" />;
  }

  const safeRecord = record;

  async function saveExercise(exercise: DerivedExercise) {
    const next = safeRecord.derivedExercises.some((item) => item.id === exercise.id)
      ? safeRecord.derivedExercises
      : [...safeRecord.derivedExercises, { ...exercise, saved: true }];
    await saveExercises(safeRecord.id, next);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="举一反三"
        description={`当前会结合 ${student?.name || "该学生"} 的年级、错题主题和薄弱知识点生成变式练习。`}
        actions={
          <>
            <button type="button" className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white" onClick={() => setDraftExercises(generateDerivedExercises(safeRecord, student))}>
              <Sparkles size={16} className="mr-2 inline" />
              重新生成
            </button>
            <Link to={`/mistakes/${safeRecord.id}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
              返回详情
            </Link>
          </>
        }
      />
      {draftExercises.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {draftExercises.map((exercise) => (
            <DerivedExerciseCard key={exercise.id} exercise={exercise} onSave={(item) => void saveExercise(item)} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Sparkles} title="当前还没有生成结果" description="可以返回详情页或点击上方重新生成。" />
      )}
    </div>
  );
}
