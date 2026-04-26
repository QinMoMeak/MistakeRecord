import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { ASSIGNMENT_STATUSES, DIFFICULTIES, SUBJECTS } from "@/lib/helpers";
import {
  createEmptyAssignmentForm,
  createGeneratedAssignmentDraft,
  hydrateAssignmentForm,
  parseFlexibleList,
  useAppStore,
} from "@/store/useAppStore";

export function AssignmentEditorPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const assignments = useAppStore((state) => state.assignments);
  const students = useAppStore((state) => state.students);
  const saveAssignmentRecord = useAppStore((state) => state.saveAssignmentRecord);
  const removeAssignmentRecords = useAppStore((state) => state.removeAssignmentRecords);
  const record = assignments.find((item) => item.id === id);

  const initialValues = useMemo(() => {
    if (record) return hydrateAssignmentForm(record);
    const studentId = searchParams.get("studentId") || "";
    const subject = searchParams.get("subject") || "数学";
    const generated = studentId ? createGeneratedAssignmentDraft(studentId, subject) : null;
    return generated ? hydrateAssignmentForm(generated) : createEmptyAssignmentForm(studentId);
  }, [record, searchParams]);

  const [values, setValues] = useState(initialValues);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const saved = await saveAssignmentRecord(values);
    navigate(`/assignments/${saved.id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title={record ? "作业详情 / 编辑" : "生成每日作业"} description="支持基于学生薄弱点自动生成草稿，随后手动补充和修改。" />
      <form className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">学生</span>
                <select value={values.studentId} onChange={(e) => setValues((prev) => ({ ...prev, studentId: e.target.value }))} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300">
                  <option value="">请选择学生</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">学科</span>
                <select value={values.subject} onChange={(e) => setValues((prev) => ({ ...prev, subject: e.target.value }))} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300">
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">标题</span>
                <input value={values.title} onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">日期</span>
                <input type="date" value={values.date} onChange={(e) => setValues((prev) => ({ ...prev, date: e.target.value }))} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">状态</span>
                <select value={values.status} onChange={(e) => setValues((prev) => ({ ...prev, status: e.target.value as typeof values.status }))} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300">
                  {ASSIGNMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">目标知识点</span>
                <input value={values.targetKnowledgePoints.join("，")} onChange={(e) => setValues((prev) => ({ ...prev, targetKnowledgePoints: parseFlexibleList(e.target.value) }))} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" />
              </label>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <h3 className="text-lg font-semibold text-slate-900">练习内容</h3>
            <div className="mt-4 space-y-4">
              {values.exercises.map((exercise, index) => (
                <div key={exercise.id} className="rounded-3xl bg-slate-50 p-4">
                  <div className="grid gap-3">
                    <input value={exercise.type} onChange={(e) => setValues((prev) => ({ ...prev, exercises: prev.exercises.map((item, itemIndex) => itemIndex === index ? { ...item, type: e.target.value as typeof item.type } : item) }))} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-brand-300" />
                    <textarea value={exercise.prompt} onChange={(e) => setValues((prev) => ({ ...prev, exercises: prev.exercises.map((item, itemIndex) => itemIndex === index ? { ...item, prompt: e.target.value } : item) }))} rows={3} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 outline-none focus:border-brand-300" />
                    <div className="grid gap-3 md:grid-cols-2">
                      <select value={exercise.difficulty} onChange={(e) => setValues((prev) => ({ ...prev, exercises: prev.exercises.map((item, itemIndex) => itemIndex === index ? { ...item, difficulty: e.target.value as typeof item.difficulty } : item) }))} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-brand-300">
                        {DIFFICULTIES.map((difficulty) => (
                          <option key={difficulty} value={difficulty}>
                            {difficulty}
                          </option>
                        ))}
                      </select>
                      <input value={exercise.knowledgePoints.join("，")} onChange={(e) => setValues((prev) => ({ ...prev, exercises: prev.exercises.map((item, itemIndex) => itemIndex === index ? { ...item, knowledgePoints: parseFlexibleList(e.target.value) } : item) }))} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-brand-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">作业说明</span>
              <textarea value={values.summary} onChange={(e) => setValues((prev) => ({ ...prev, summary: e.target.value }))} rows={8} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-brand-300" />
            </label>
            <button type="submit" className="mt-5 w-full rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-card">
              保存作业
            </button>
            {record ? (
              <button type="button" className="mt-3 w-full rounded-2xl bg-rose-50 px-5 py-3 text-sm font-medium text-rose-700" onClick={async () => { await removeAssignmentRecords([record.id]); navigate("/assignments"); }}>
                删除作业
              </button>
            ) : null}
            {values.studentId ? (
              <Link to={`/students/${values.studentId}`} className="mt-3 block rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-medium text-slate-700">
                返回学生详情
              </Link>
            ) : null}
          </section>
        </div>
      </form>
    </div>
  );
}
