import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { ImportExportPanel } from "@/components/ImportExportPanel";
import { PageHeader } from "@/components/PageHeader";
import { TagPill } from "@/components/TagPill";
import { useAppStore } from "@/store/useAppStore";

export function TaxonomyPage() {
  const { tags, knowledgePoints, mistakes, saveTagByName, saveKnowledgeByName, removeTagById, removeKnowledgeById } = useAppStore(
    useShallow((state) => ({
      tags: state.tags,
      knowledgePoints: state.knowledgePoints,
      mistakes: state.mistakes,
      saveTagByName: state.saveTagByName,
      saveKnowledgeByName: state.saveKnowledgeByName,
      removeTagById: state.removeTagById,
      removeKnowledgeById: state.removeKnowledgeById,
    })),
  );
  const [tagInput, setTagInput] = useState("");
  const [knowledgeInput, setKnowledgeInput] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader title="知识点 / 标签管理" description="可查看每个标签和知识点关联的错题数量，支持新增与删除。" actions={<ImportExportPanel />} />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">标签管理</h3>
            <TagPill label={`${tags.length} 个标签`} className="bg-brand-50 text-brand-700 ring-brand-200" />
          </div>
          <div className="mt-5 flex gap-3">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="新标签名称" className="h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" />
            <button type="button" className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white" onClick={async () => { await saveTagByName(tagInput); setTagInput(""); }}>
              <Plus size={16} className="mr-2 inline" />
              添加
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {tags.map((tag) => {
              const count = mistakes.filter((item) => item.tags.includes(tag.name)).length;
              return (
                <div key={tag.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <div className="font-medium text-slate-800">{tag.name}</div>
                    <div className="mt-1 text-xs text-slate-500">关联错题 {count} 条</div>
                  </div>
                  <button type="button" className="rounded-xl bg-rose-50 p-2 text-rose-700" onClick={() => void removeTagById(tag.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">知识点管理</h3>
            <TagPill label={`${knowledgePoints.length} 个知识点`} className="bg-emerald-50 text-emerald-700 ring-emerald-200" />
          </div>
          <div className="mt-5 flex gap-3">
            <input value={knowledgeInput} onChange={(e) => setKnowledgeInput(e.target.value)} placeholder="新知识点名称" className="h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-brand-300" />
            <button type="button" className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white" onClick={async () => { await saveKnowledgeByName(knowledgeInput); setKnowledgeInput(""); }}>
              <Plus size={16} className="mr-2 inline" />
              添加
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {knowledgePoints.map((item) => {
              const count = mistakes.filter((mistake) => mistake.knowledgePoints.includes(item.name)).length;
              return (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <div className="font-medium text-slate-800">{item.name}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      关联错题 {count} 条 {item.subject ? `· ${item.subject}` : ""}
                    </div>
                  </div>
                  <button type="button" className="rounded-xl bg-rose-50 p-2 text-rose-700" onClick={() => void removeKnowledgeById(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

