import { Copy, ImagePlus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { parseConversationToDraft } from "@/lib/parser";
import { copyText, DIFFICULTIES, ERROR_TYPES, SCENES, SOURCE_SCENE_LABELS, SUBJECTS } from "@/lib/helpers";
import { createEmptyMistakeForm, parseFlexibleList, useAppStore } from "@/store/useAppStore";
import type { MistakeFormValues, MistakeRecord } from "@/types/models";

function validate(values: MistakeFormValues) {
  const errors: Partial<Record<keyof MistakeFormValues, string>> = {};
  if (!values.studentId) errors.studentId = "请先选择学生";
  if (!values.title.trim()) errors.title = "请填写标题";
  if (!values.problemText.trim() && values.imageIds.length === 0 && !values.sourceConversation.trim()) {
    errors.problemText = "请至少提供题目内容、图片或对话文本";
  }
  return errors;
}

function buildDoubaoPrompt(studentName?: string, grade?: string, subject?: string) {
  return `请你帮我整理这道错题，并严格按下面固定格式输出，字段名不要改，没把握就留空，不要省略标题。

学生：${studentName || "未填写"}
年级：${grade || "未填写"}
学科：${subject || "未填写"}

请按这个格式回答：
题目：
错因：
正确思路：
答案：
知识点：
易错提醒：
举一反三：
错误类型：
难度：

要求：
1. 题目尽量还原原题
2. 错因要明确指出错在哪里
3. 正确思路尽量分步骤
4. 知识点尽量用逗号分隔
5. 易错提醒尽量简短
6. 举一反三写成适合继续练习的方向
7. 错误类型优先从这些里选：知识点不会、审题错误、计算错误、步骤不完整、概念混淆、方法不熟、粗心、其他
8. 难度只写：easy / medium / hard

现在这是题目或题目图片识别内容：`;
}

export function MistakeForm({ initialValues, record }: { initialValues?: MistakeFormValues; record?: MistakeRecord }) {
  const navigate = useNavigate();
  const { students, tags, knowledgePoints, images, saveImageFiles, saveMistakeRecord } = useAppStore(
    useShallow((state) => ({
      students: state.students,
      tags: state.tags,
      knowledgePoints: state.knowledgePoints,
      images: state.images,
      saveImageFiles: state.saveImageFiles,
      saveMistakeRecord: state.saveMistakeRecord,
    })),
  );
  const [values, setValues] = useState<MistakeFormValues>(initialValues || createEmptyMistakeForm());
  const [errors, setErrors] = useState<Partial<Record<keyof MistakeFormValues, string>>>({});
  const [busy, setBusy] = useState(false);
  const relatedImages = useMemo(() => images.filter((item) => values.imageIds.includes(item.id)), [images, values.imageIds]);
  const selectedStudent = useMemo(() => students.find((item) => item.id === values.studentId), [students, values.studentId]);
  const doubaoPrompt = useMemo(
    () => buildDoubaoPrompt(selectedStudent?.name, values.grade || selectedStudent?.grade, values.subject),
    [selectedStudent?.name, selectedStudent?.grade, values.grade, values.subject],
  );

  function patch<K extends keyof MistakeFormValues>(key: K, value: MistakeFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setBusy(true);
    try {
      const saved = await saveMistakeRecord(values);
      navigate(`/mistakes/${saved.id}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (!files.length) return;
    const uploaded = await saveImageFiles(files);
    patch("imageIds", [...values.imageIds, ...uploaded.map((item) => item.id)]);
    patch("sourceType", values.sourceConversation ? "mixed" : "image");
  }

  return (
    <form className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">学生</span>
              <select value={values.studentId} onChange={(e) => patch("studentId", e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300">
                <option value="">请选择学生</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} · {student.grade}
                  </option>
                ))}
              </select>
              {errors.studentId ? <span className="mt-2 block text-xs text-rose-600">{errors.studentId}</span> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">标题</span>
              <input value={values.title} onChange={(e) => patch("title", e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" placeholder="例如：三角形面积求解" />
              {errors.title ? <span className="mt-2 block text-xs text-rose-600">{errors.title}</span> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">学科</span>
              <select value={values.subject} onChange={(e) => patch("subject", e.target.value as MistakeFormValues["subject"])} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300">
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">年级</span>
              <input value={values.grade} onChange={(e) => patch("grade", e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" placeholder="例如：初二 / 高一" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">来源场景</span>
              <select value={values.sourceScene} onChange={(e) => patch("sourceScene", e.target.value as MistakeFormValues["sourceScene"])} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300">
                {SCENES.map((scene) => (
                  <option key={scene} value={scene}>
                    {SOURCE_SCENE_LABELS[scene]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">掌握状态</span>
              <select value={values.masteryStatus} onChange={(e) => patch("masteryStatus", e.target.value as MistakeFormValues["masteryStatus"])} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300">
                <option value="unmastered">未掌握</option>
                <option value="reviewing">复习中</option>
                <option value="mastered">已掌握</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">难度</span>
              <select value={values.difficulty} onChange={(e) => patch("difficulty", e.target.value as MistakeFormValues["difficulty"])} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300">
                <option value="">未设置</option>
                {DIFFICULTIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">失分</span>
              <input value={values.scoreLoss} onChange={(e) => patch("scoreLoss", e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" placeholder="例如：6" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">错误类型</span>
              <select value={values.errorType} onChange={(e) => patch("errorType", e.target.value as MistakeFormValues["errorType"])} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300">
                <option value="">未设置</option>
                {ERROR_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">考试名称</span>
              <input value={values.examName} onChange={(e) => patch("examName", e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" placeholder="例如：月考 / 周测" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">作业名称</span>
              <input value={values.homeworkName} onChange={(e) => patch("homeworkName", e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" placeholder="例如：周四晚练" />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">标签（逗号分隔）</span>
              <input value={values.tags.join("，")} list="tag-options" onChange={(e) => patch("tags", parseFlexibleList(e.target.value))} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" placeholder="例如：数学，几何，重点复习" />
              <datalist id="tag-options">
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.name} />
                ))}
              </datalist>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">知识点（逗号分隔）</span>
              <input value={values.knowledgePoints.join("，")} list="knowledge-options" onChange={(e) => patch("knowledgePoints", parseFlexibleList(e.target.value))} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" placeholder="例如：三角形面积公式，受力分析" />
              <datalist id="knowledge-options">
                {knowledgePoints.map((item) => (
                  <option key={item.id} value={item.name} />
                ))}
              </datalist>
            </label>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">发给豆包的预设提示词</h3>
              <p className="mt-1 text-sm text-slate-500">先把这段提示词发给豆包，再贴入题目图片或题干，让它按固定格式返回，便于这里自动解析。</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
              onClick={() => void copyText(doubaoPrompt)}
            >
              <Copy size={16} />
              复制提示词
            </button>
          </div>
          <textarea value={doubaoPrompt} readOnly rows={12} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600 outline-none" />
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">豆包对话文本</h3>
              <p className="mt-1 text-sm text-slate-500">粘贴对话后用规则提取题目内容、错因、思路和知识点。</p>
            </div>
            <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700" onClick={() => setValues((prev) => ({ ...prev, ...parseConversationToDraft(prev.sourceConversation, prev) }))}>
              <Sparkles size={16} />
              从对话中智能提取
            </button>
          </div>
          <textarea value={values.sourceConversation} onChange={(e) => patch("sourceConversation", e.target.value)} rows={10} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-brand-300" placeholder="把豆包检查错题后的完整对话粘贴到这里..." />
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
          <div className="grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">题目内容</span>
              <textarea value={values.problemText} onChange={(e) => patch("problemText", e.target.value)} rows={5} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-brand-300" placeholder="题目原文、条件、题干都可以写在这里" />
              {errors.problemText ? <span className="mt-2 block text-xs text-rose-600">{errors.problemText}</span> : null}
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">错因分析</span>
              <textarea value={values.wrongReason} onChange={(e) => patch("wrongReason", e.target.value)} rows={4} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-brand-300" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">正确答案 / 思路</span>
              <textarea value={values.correctMethod} onChange={(e) => patch("correctMethod", e.target.value)} rows={4} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-brand-300" />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">答案</span>
                <input value={values.answer} onChange={(e) => patch("answer", e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">易错提醒</span>
                <input value={values.tips} onChange={(e) => patch("tips", e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" />
              </label>
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">图片录入</h3>
              <p className="mt-1 text-sm text-slate-500">支持多图保存到本地浏览器。</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white">
              <ImagePlus size={16} />
              添加图片
              <input type="file" multiple accept="image/png,image/jpeg,image/webp" hidden onChange={(event) => void handleImageUpload(event)} />
            </label>
          </div>
          {relatedImages.length ? (
            <div className="mt-5 grid gap-3">
              {relatedImages.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-3xl border border-slate-200">
                  <img src={image.dataUrl} alt={image.name} className="h-44 w-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">当前还没有上传图片。</div>
          )}
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
          <h3 className="text-lg font-semibold text-slate-900">录入偏好</h3>
          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span>重点关注</span>
              <input type="checkbox" checked={values.isStarred} onChange={(e) => patch("isStarred", e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">来源类型</span>
              <select value={values.sourceType} onChange={(e) => patch("sourceType", e.target.value as MistakeFormValues["sourceType"])} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300">
                <option value="image">图片录入</option>
                <option value="conversation">对话录入</option>
                <option value="mixed">图片 + 对话</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
          <h3 className="text-lg font-semibold text-slate-900">提交</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">保存后会写入 IndexedDB，并保留与学生、作业、评测的关联关系。</p>
          <div className="mt-5 grid gap-3">
            <button type="submit" className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-card">
              {busy ? "保存中..." : record ? "保存修改" : "创建错题"}
            </button>
            <button type="button" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700" onClick={() => navigate(-1)}>
              返回上一页
            </button>
          </div>
        </section>
      </div>
    </form>
  );
}
