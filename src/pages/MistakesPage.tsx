import { Grid2x2, List, NotebookPen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { FilterBar } from "@/components/FilterBar";
import { MistakeCard } from "@/components/MistakeCard";
import { MistakeTable } from "@/components/MistakeTable";
import { PageHeader } from "@/components/PageHeader";
import { useAppStore, useFilteredMistakes } from "@/store/useAppStore";

export function MistakesPage() {
  const [mode, setMode] = useState<"grid" | "list">("list");
  const records = useFilteredMistakes();
  const [searchParams] = useSearchParams();
  const selectedMistakeIds = useAppStore((state) => state.selectedMistakeIds);
  const removeMistakeRecords = useAppStore((state) => state.removeMistakeRecords);
  const setMistakeFilters = useAppStore((state) => state.setMistakeFilters);

  useEffect(() => {
    if (searchParams.get("quick") === "unmastered") {
      setMistakeFilters({ masteryStatus: "unmastered" });
    }
    if (searchParams.get("studentId")) {
      setMistakeFilters({ studentId: searchParams.get("studentId") || "" });
    }
  }, [searchParams, setMistakeFilters]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="错题本"
        description="所有错题都必须关联学生，可按学生、学科、标签、知识点和掌握状态筛选。"
        actions={
          <>
            <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1">
              <button type="button" className={`rounded-xl px-3 py-2 ${mode === "list" ? "bg-brand-50 text-brand-700" : "text-slate-500"}`} onClick={() => setMode("list")}>
                <List size={18} />
              </button>
              <button type="button" className={`rounded-xl px-3 py-2 ${mode === "grid" ? "bg-brand-50 text-brand-700" : "text-slate-500"}`} onClick={() => setMode("grid")}>
                <Grid2x2 size={18} />
              </button>
            </div>
            {selectedMistakeIds.length ? (
              <button type="button" className="rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700" onClick={() => void removeMistakeRecords(selectedMistakeIds)}>
                <Trash2 size={16} className="mr-2 inline" />
                批量删除 {selectedMistakeIds.length}
              </button>
            ) : null}
            <Link to="/mistakes/new" className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-card">
              <NotebookPen size={16} className="mr-2 inline" />
              新建错题
            </Link>
          </>
        }
      />

      <FilterBar />

      {records.length === 0 ? (
        <EmptyState icon={NotebookPen} title="还没有符合条件的错题" description="先创建学生，再上传题图或粘贴对话录入错题。" />
      ) : mode === "list" ? (
        <MistakeTable records={records} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {records.map((record) => (
            <MistakeCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
}

