import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { LEARNING_STYLES } from "@/lib/helpers";
import { createEmptyStudentForm, hydrateStudentForm, parseFlexibleList, useAppStore } from "@/store/useAppStore";

function Field({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" />
    </label>
  );
}

function ListField({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input value={values.join("，")} onChange={(event) => onChange(parseFlexibleList(event.target.value))} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" />
    </label>
  );
}

export function StudentEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const students = useAppStore((state) => state.students);
  const saveStudentRecord = useAppStore((state) => state.saveStudentRecord);
  const current = students.find((item) => item.id === id);
  const [values, setValues] = useState(current ? hydrateStudentForm(current) : createEmptyStudentForm());

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const saved = await saveStudentRecord(values);
    navigate(`/students/${saved.id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title={current ? "编辑学生档案" : "新建学生档案"} description="首版支持基础信息、分数、学科水平、薄弱点、学习风格和家长备注。" />
      <form className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="姓名" value={values.name} onChange={(value) => setValues((prev) => ({ ...prev, name: value }))} required />
              <Field label="昵称" value={values.nickname} onChange={(value) => setValues((prev) => ({ ...prev, nickname: value }))} />
              <Field label="性别" value={values.gender} onChange={(value) => setValues((prev) => ({ ...prev, gender: value }))} />
              <Field label="年级" value={values.grade} onChange={(value) => setValues((prev) => ({ ...prev, grade: value }))} required />
              <Field label="学校" value={values.school} onChange={(value) => setValues((prev) => ({ ...prev, school: value }))} />
              <Field label="班级" value={values.className} onChange={(value) => setValues((prev) => ({ ...prev, className: value }))} />
              <Field label="当前成绩" value={values.currentScore} onChange={(value) => setValues((prev) => ({ ...prev, currentScore: value }))} />
              <Field label="目标成绩" value={values.targetScore} onChange={(value) => setValues((prev) => ({ ...prev, targetScore: value }))} />
            </div>
          </section>

          <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">各科水平（JSON）</span>
              <textarea value={values.subjectLevelsText} onChange={(event) => setValues((prev) => ({ ...prev, subjectLevelsText: event.target.value }))} rows={10} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 font-mono text-sm outline-none focus:border-brand-300" />
            </label>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <ListField label="薄弱学科" values={values.weakSubjects} onChange={(next) => setValues((prev) => ({ ...prev, weakSubjects: next }))} />
            <ListField label="优势学科" values={values.strongSubjects} onChange={(next) => setValues((prev) => ({ ...prev, strongSubjects: next }))} />
            <ListField label="薄弱知识点" values={values.weakKnowledgePoints} onChange={(next) => setValues((prev) => ({ ...prev, weakKnowledgePoints: next }))} />
            <ListField label="学习目标" values={values.learningGoals} onChange={(next) => setValues((prev) => ({ ...prev, learningGoals: next }))} />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">学习风格</span>
              <select value={values.learningStyle} onChange={(event) => setValues((prev) => ({ ...prev, learningStyle: event.target.value as typeof values.learningStyle }))} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300">
                <option value="">未设置</option>
                {LEARNING_STYLES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">关注备注</span>
              <textarea value={values.attentionNotes} onChange={(event) => setValues((prev) => ({ ...prev, attentionNotes: event.target.value }))} rows={5} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-brand-300" />
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">家长备注</span>
              <textarea value={values.parentNotes} onChange={(event) => setValues((prev) => ({ ...prev, parentNotes: event.target.value }))} rows={5} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-brand-300" />
            </label>
            <button type="submit" className="mt-5 w-full rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-card">
              {current ? "保存修改" : "创建学生"}
            </button>
          </section>
        </div>
      </form>
    </div>
  );
}
