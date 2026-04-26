import { BarChart3, FileSpreadsheet, NotebookPen, PlusSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { TagPill } from "@/components/TagPill";
import { formatDate } from "@/lib/helpers";
import { getStudentAnalysis, getStudentTrend, useAppStore } from "@/store/useAppStore";

function Info({ title, content }: { title: string; content?: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <div className="text-xs text-slate-400">{title}</div>
      <div className="mt-1 text-sm font-medium text-slate-800">{content || "未填写"}</div>
    </div>
  );
}

function Section({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <div className="mb-1 font-semibold text-slate-900">{title}</div>
      <div>{values.length ? values.join("；") : "暂无"}</div>
    </div>
  );
}

function MiniList({ title, items }: { title: string; items: Array<{ label: string; meta: string; href: string }> }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="mb-3 text-sm font-semibold text-slate-900">{title}</div>
      <div className="space-y-2">
        {items.map((item) => (
          <Link key={item.href} to={item.href} className="block rounded-xl bg-white px-3 py-2">
            <div className="text-sm font-medium text-slate-800">{item.label}</div>
            <div className="mt-1 text-xs text-slate-500">{item.meta}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function StudentDetailPage() {
  const { id } = useParams();
  const students = useAppStore((state) => state.students);
  const mistakes = useAppStore((state) => state.mistakes);
  const assignments = useAppStore((state) => state.assignments);
  const assessments = useAppStore((state) => state.assessments);
  const student = students.find((item) => item.id === id);

  if (!student) {
    return <EmptyState icon={BarChart3} title="未找到学生档案" description="该学生可能已被删除，或链接参数有误。" />;
  }

  const studentMistakes = mistakes.filter((item) => item.studentId === student.id).slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const studentAssignments = assignments.filter((item) => item.studentId === student.id).slice().sort((a, b) => b.date.localeCompare(a.date));
  const studentAssessments = assessments.filter((item) => item.studentId === student.id).slice().sort((a, b) => b.date.localeCompare(a.date));
  const analysis = getStudentAnalysis(student.id);
  const trend = getStudentTrend(student.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title={student.name}
        description="学生详情页汇总基本信息、成绩、薄弱点、最近错题、作业、评测和个性化学习建议。"
        actions={
          <>
            <Link to={`/mistakes/new?studentId=${student.id}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
              <PlusSquare size={16} className="mr-2 inline" />
              新增错题
            </Link>
            <Link to={`/assignments/new?studentId=${student.id}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
              <NotebookPen size={16} className="mr-2 inline" />
              生成作业
            </Link>
            <Link to={`/assessments/new?studentId=${student.id}`} className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-card">
              <FileSpreadsheet size={16} className="mr-2 inline" />
              生成评测
            </Link>
          </>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <h3 className="text-lg font-semibold text-slate-900">基本信息</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Info title="年级/班级" content={`${student.grade}${student.className ? ` · ${student.className}` : ""}`} />
              <Info title="学校" content={student.school} />
              <Info title="当前 / 目标成绩" content={`${student.currentScore ?? "-"} / ${student.targetScore ?? "-"}`} />
              <Info title="学习风格" content={student.learningStyle} />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {student.weakSubjects.map((item) => (
                <TagPill key={item} label={`薄弱学科 · ${item}`} className="bg-rose-50 text-rose-700 ring-rose-200" />
              ))}
              {student.strongSubjects.map((item) => (
                <TagPill key={item} label={`优势学科 · ${item}`} className="bg-emerald-50 text-emerald-700 ring-emerald-200" />
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <h3 className="text-lg font-semibold text-slate-900">各科水平</h3>
            <div className="mt-4 space-y-3">
              {student.subjectLevels.map((item) => (
                <div key={item.subject} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{item.subject}</span>
                    <span className="text-sm text-slate-500">
                      {item.score ?? "-"} · {item.level || "未评估"}
                    </span>
                  </div>
                  {item.comment ? <div className="mt-1 text-sm text-slate-500">{item.comment}</div> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <h3 className="text-lg font-semibold text-slate-900">最近错题 / 作业 / 评测</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <MiniList title="最近错题" items={studentMistakes.slice(0, 4).map((item) => ({ label: item.title, meta: item.subject, href: `/mistakes/${item.id}` }))} />
              <MiniList title="最近作业" items={studentAssignments.slice(0, 4).map((item) => ({ label: item.title, meta: item.status, href: `/assignments/${item.id}` }))} />
              <MiniList title="最近评测" items={studentAssessments.slice(0, 4).map((item) => ({ label: item.title, meta: `${item.actualScore ?? "-"} / ${item.totalScore ?? "-"}`, href: `/assessments/${item.id}` }))} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <h3 className="text-lg font-semibold text-slate-900">掌握趋势</h3>
            <div className="mt-4 space-y-3">
              {trend.map((point) => (
                <div key={point.date} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                  <span className="text-slate-600">{point.date}</span>
                  <span className="text-slate-800">错题 {point.mistakes} · 作业 {point.assignments} · 评测 {point.assessments}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <h3 className="text-lg font-semibold text-slate-900">个性化学习建议</h3>
            {analysis ? (
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
                <Section title="薄弱知识点排序" values={analysis.weakKnowledgePointRanking.map((item) => `${item.name}（${item.priority}，${item.count}次）`)} />
                <Section title="高频错误类型" values={analysis.frequentErrorTypes.map((item) => `${item.type}（${item.count}次）`)} />
                <Section title="推荐复习知识点" values={analysis.recommendedReviewPoints} />
                <Section title="每日作业建议" values={analysis.assignmentAdvice} />
                <Section title="评测建议" values={analysis.assessmentAdvice} />
                <Section title="个性化备注" values={analysis.personalizedNotes} />
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-slate-700">趋势判断：{analysis.trend.progress}</div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">当前数据不足，暂无分析结果。</p>
            )}
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <h3 className="text-lg font-semibold text-slate-900">档案备注</h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
              <div>关注备注：{student.attentionNotes || "未填写"}</div>
              <div>家长备注：{student.parentNotes || "未填写"}</div>
              <div>最后更新：{formatDate(student.updatedAt)}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
