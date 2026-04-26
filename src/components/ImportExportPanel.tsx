import { Download, Upload } from "lucide-react";
import { useRef } from "react";
import { exportDatabaseAsJson } from "@/lib/export";
import { useAppStore } from "@/store/useAppStore";
import type { AppExportPayload } from "@/types/models";

export function ImportExportPanel({ compact = false, triggerClassName }: { compact?: boolean; triggerClassName?: string }) {
  const exportJson = useAppStore((state) => state.exportJson);
  const importJson = useAppStore((state) => state.importJson);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function onExport() {
    const payload = await exportJson();
    exportDatabaseAsJson(payload);
  }

  async function onImport(mode: "merge" | "overwrite", file?: File) {
    if (!file) return;
    const content = await file.text();
    const payload = JSON.parse(content) as AppExportPayload;
    await importJson(payload, mode);
  }

  if (compact) {
    return (
      <>
        <button type="button" className={triggerClassName} onClick={() => void onExport()}>
          <Download size={16} />
          导出数据
        </button>
        <button type="button" className={triggerClassName} onClick={() => { inputRef.current?.setAttribute("data-mode", "merge"); inputRef.current?.click(); }}>
          <Upload size={16} />
          导入数据
        </button>
        <input ref={inputRef} type="file" accept="application/json" hidden onChange={async (event) => { const file = event.target.files?.[0]; const mode = (event.currentTarget.getAttribute("data-mode") as "merge" | "overwrite" | null) || "merge"; await onImport(mode, file); event.currentTarget.value = ""; }} />
      </>
    );
  }

  return (
    <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-card">
      <h3 className="text-lg font-semibold text-slate-900">导入与备份</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">导出时会包含学生、错题、作业、评测、标签、知识点和图片，并保留全部关联关系。</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white" onClick={() => void onExport()}>
          <Download size={16} className="mr-2 inline" />
          导出 JSON
        </button>
        <button type="button" className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700" onClick={() => { inputRef.current?.setAttribute("data-mode", "merge"); inputRef.current?.click(); }}>
          <Upload size={16} className="mr-2 inline" />
          导入并合并
        </button>
        <button type="button" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700" onClick={() => { inputRef.current?.setAttribute("data-mode", "overwrite"); inputRef.current?.click(); }}>
          覆盖导入
        </button>
      </div>
      <input ref={inputRef} type="file" accept="application/json" hidden onChange={async (event) => { const file = event.target.files?.[0]; const mode = (event.currentTarget.getAttribute("data-mode") as "merge" | "overwrite" | null) || "merge"; await onImport(mode, file); event.currentTarget.value = ""; }} />
    </div>
  );
}

