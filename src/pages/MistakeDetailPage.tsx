import { CheckCheck, Copy, FileDown, Pencil, Sparkles, Star, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DerivedExerciseCard } from "@/components/DerivedExerciseCard";
import { EmptyState } from "@/components/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { TagPill } from "@/components/TagPill";
import { buildReviewNote, printMistakeCard } from "@/lib/export";
import {
  copyText,
  DIFFICULTY_LABELS,
  formatDateTime,
  MASTERY_LABELS,
  MASTERY_STYLES,
  SOURCE_SCENE_LABELS,
  SUBJECT_COLORS,
} from "@/lib/helpers";
import { useAppStore } from "@/store/useAppStore";

function InfoBlock({ title, content }: { title: string; content?: string }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4">
      <div className="mb-2 text-sm font-semibold text-slate-900">{title}</div>
      <div className="whitespace-pre-wrap text-sm leading-7 text-slate-600">{content || "未填写"}</div>
    </div>
  );
}

export function MistakeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mistakes = useAppStore((state) => state.mistakes);
  const images = useAppStore((state) => state.images);
  const students = useAppStore((state) => state.students);
  const toggleStar = useAppStore((state) => state.toggleStar);
  const markReviewed = useAppStore((state) => state.markReviewed);
  const removeMistakeRecords = useAppStore((state) => state.removeMistakeRecords);
  const regenerateExercises = useAppStore((state) => state.regenerateExercises);
  const record = mistakes.find((item) => item.id === id);

  if (!record) {
    return <EmptyState icon={Trash2} title="未找到这条错题" description="这条记录可能已经被删除，或者页面参数有误。" />;
  }

  const student = students.find((item) => item.id === record.studentId);
  const relatedImages = images.filter((image) => record.imageIds.includes(image.id));

  return (
    <div className="space-y-6">
      <PageHeader
        title={record.title}
        description="展示题目、错因、正确思路、学生关联信息和举一反三练习。"
        actions={
          <>
            <button type="button" className="rounded-2xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700" onClick={() => void toggleStar(record.id)}>
              <Star size={16} className="mr-2 inline" fill={record.isStarred ? "currentColor" : "none"} />
              {record.isStarred ? "取消关注" : "重点关注"}
            </button>
            <button type="button" className="rounded-2xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700" onClick={() => void markReviewed(record.id)}>
              <CheckCheck size={16} className="mr-2 inline" />
              一键标记已复习
            </button>
            <Link to={`/mistakes/${record.id}/edit`} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
              <Pencil size={16} className="mr-2 inline" />
              编辑
            </Link>
          </>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <div className="flex flex-wrap gap-2">
              <TagPill label={record.subject} className={SUBJECT_COLORS[record.subject]} />
              <TagPill label={MASTERY_LABELS[record.masteryStatus]} className={MASTERY_STYLES[record.masteryStatus]} />
              <TagPill label={SOURCE_SCENE_LABELS[record.sourceScene]} className="bg-slate-100 text-slate-600 ring-slate-200" />
              {record.difficulty ? <TagPill label={DIFFICULTY_LABELS[record.difficulty]} className="bg-violet-50 text-violet-700 ring-violet-200" /> : null}
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <InfoBlock title="学生信息" content={student ? `${student.name} · ${student.grade}` : "未关联学生"} />
              <InfoBlock title="考试 / 作业" content={[record.examName, record.homeworkName].filter(Boolean).join(" / ")} />
              <InfoBlock title="题目内容" content={record.problemText} />
              <InfoBlock title="错因分析" content={record.wrongReason} />
              <InfoBlock title="正确思路" content={record.correctMethod} />
              <InfoBlock title="知识点" content={record.knowledgePoints.join("、")} />
              <InfoBlock title="错误类型" content={record.errorType} />
              <InfoBlock title="易错提醒" content={record.tips} />
            </div>

            <div className="mt-6 grid gap-4 rounded-3xl bg-slate-50 p-4 text-sm text-slate-500 md:grid-cols-3">
              <div>创建时间：{formatDateTime(record.createdAt)}</div>
              <div>更新时间：{formatDateTime(record.updatedAt)}</div>
              <div>最近复习：{formatDateTime(record.lastReviewedAt)}</div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <h3 className="text-lg font-semibold text-slate-900">豆包对话原文</h3>
            <pre className="mt-4 whitespace-pre-wrap rounded-3xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">{record.sourceConversation || "未录入对话原文"}</pre>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <div className="flex flex-wrap gap-3">
              <button type="button" className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white" onClick={() => void regenerateExercises(record.id)}>
                <Sparkles size={16} className="mr-2 inline" />
                结合学生信息生成举一反三
              </button>
              <Link to={`/mistakes/${record.id}/exercises`} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
                查看练习页
              </Link>
              <button type="button" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700" onClick={() => void copyText(buildReviewNote(record, student))}>
                <Copy size={16} className="mr-2 inline" />
                复制为复习笔记
              </button>
              <button type="button" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700" onClick={() => printMistakeCard(record, relatedImages.map((item) => item.dataUrl), student)}>
                <FileDown size={16} className="mr-2 inline" />
                导出打印卡片
              </button>
              {student ? (
                <Link to={`/students/${student.id}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
                  返回学生档案
                </Link>
              ) : null}
              <button
                type="button"
                className="rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700"
                onClick={async () => {
                  await removeMistakeRecords([record.id]);
                  navigate("/mistakes");
                }}
              >
                <Trash2 size={16} className="mr-2 inline" />
                删除错题
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <h3 className="text-lg font-semibold text-slate-900">原始图片</h3>
            {relatedImages.length ? (
              <div className="mt-4 space-y-3">
                {relatedImages.map((image) => (
                  <img key={image.id} src={image.dataUrl} alt={image.name} className="w-full rounded-3xl border border-slate-100 object-cover" />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">未上传图片。</p>
            )}
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">举一反三练习</h3>
              <Link to={`/mistakes/${record.id}/exercises`} className="text-sm font-medium text-brand-600">
                进入练习页
              </Link>
            </div>
            <div className="mt-4 space-y-4">
              {record.derivedExercises.length ? record.derivedExercises.slice(0, 2).map((exercise) => <DerivedExerciseCard key={exercise.id} exercise={exercise} />) : <EmptyState icon={Sparkles} title="还没有生成练习" description="点击上方按钮即可基于当前错题生成变式题。" />}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

