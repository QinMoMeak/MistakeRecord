import { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { DIFFICULTIES, SUBJECTS } from "@/lib/helpers";
import {
  createEmptyAssessmentForm,
  createGeneratedAssessmentDraft,
  hydrateAssessmentForm,
  parseFlexibleList,
  useAppStore,
} from "@/store/useAppStore";

export function AssessmentEditorPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const assessments = useAppStore((state) => state.assessments);
  const students = useAppStore((state) => state.students);
  const saveAssessmentRecord = useAppStore((state) => state.saveAssessmentRecord);
  const removeAssessmentRecords = useAppStore((state) => state.removeAssessmentRecords);
  const convertQuestionToMistake = useAppStore((state) => state.convertQuestionToMistake);
  const record = assessments.find((item) => item.id === id);

  const initialValues = useMemo(() => {
    if (record) return hydrateAssessmentForm(record);
    const studentId = searchParams.get("studentId") || "";
    const subject = searchParams.get("subject") || "数学";
    const generated = studentId ? createGeneratedAssessmentDraft(studentId, subject) : null;
    return generated ? hydrateAssessmentForm(generated) : createEmptyAssessmentForm(studentId);
  }, [record, searchParams]);

  const [values, setValues] = useState(initialValues);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const saved = await saveAssessmentRecord(values);
    navigate(`/assessments/${saved.id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title={record ? "评测详情 / 编辑" : "生成评测考试"} description="围绕学生薄弱知识点出题，支持录入学生答案和一键转入错题本。" />
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
                <span className="mb-2 block text-sm font-medium text-slate-700">总分 / 实得分</span>
                <div className="grid grid-cols-2 gap-3">
                  <input value={values.totalScore} onChange={(e) => setValues((prev) => ({ ...prev, totalScore: e.target.value }))} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" />
                  <input value={values.actualScore} onChange={(e) => setValues((prev) => ({ ...prev, actualScore: e.target.value }))} className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" />
                </div>
              </label>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <h3 className="text-lg font-semibold text-slate-900">题目列表</h3>
            <div className="mt-4 space-y-4">
              {values.questions.map((question, index) => (
                <div key={question.id} className="rounded-3xl bg-slate-50 p-4">
                  <textarea value={question.prompt} onChange={(e) => setValues((prev) => ({ ...prev, questions: prev.questions.map((item, itemIndex) => itemIndex === index ? { ...item, prompt: e.target.value } : item) }))} rows={3} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 outline-none focus:border-brand-300" />
                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    <input value={question.knowledgePoints.join("，")} onChange={(e) => setValues((prev) => ({ ...prev, questions: prev.questions.map((item, itemIndex) => itemIndex === index ? { ...item, knowledgePoints: parseFlexibleList(e.target.value) } : item) }))} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-brand-300" />
                    <select value={question.difficulty} onChange={(e) => setValues((prev) => ({ ...prev, questions: prev.questions.map((item, itemIndex) => itemIndex === index ? { ...item, difficulty: e.target.value as typeof item.difficulty } : item) }))} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-brand-300">
                      {DIFFICULTIES.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                      ))}
                    </select>
                    <input value={question.score || ""} onChange={(e) => setValues((prev) => ({ ...prev, questions: prev.questions.map((item, itemIndex) => itemIndex === index ? { ...item, score: Number(e.target.value) || undefined } : item) }))} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 outline-none focus:border-brand-300" placeholder="分值" />
                  </div>
                  {record ? (
                    <button type="button" className="mt-3 rounded-2xl bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700" onClick={() => void convertQuestionToMistake(record.id, question.id)}>
                      将此题转入错题本
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">评测分析</span>
              <textarea value={values.analysisSummary} onChange={(e) => setValues((prev) => ({ ...prev, analysisSummary: e.target.value }))} rows={8} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-brand-300" />
            </label>
            <button type="submit" className="mt-5 w-full rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-card">
              保存评测
            </button>
            {record ? (
              <button type="button" className="mt-3 w-full rounded-2xl bg-rose-50 px-5 py-3 text-sm font-medium text-rose-700" onClick={async () => { await removeAssessmentRecords([record.id]); navigate("/assessments"); }}>
                删除评测
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
