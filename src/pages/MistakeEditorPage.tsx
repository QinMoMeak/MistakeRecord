import { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { MistakeForm } from "@/components/MistakeForm";
import { PageHeader } from "@/components/PageHeader";
import { createEmptyMistakeForm, hydrateMistakeForm, useAppStore } from "@/store/useAppStore";

export function MistakeEditorPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mistakes = useAppStore((state) => state.mistakes);
  const record = mistakes.find((item) => item.id === id);

  const initialValues = useMemo(() => {
    if (record) return hydrateMistakeForm(record);
    const empty = createEmptyMistakeForm(searchParams.get("studentId") || "");
    const imageIds = searchParams.get("images");
    if (imageIds) {
      empty.imageIds = imageIds.split(",").filter(Boolean);
      empty.sourceType = "image";
    }
    return empty;
  }, [record, searchParams]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={record ? "编辑错题" : "新建错题"}
        description="新增错题时必须先选择学生。作业名、考试名、来源场景、失分和错误类型都可以一起记录。"
      />
      <MistakeForm initialValues={initialValues} record={record} />
    </div>
  );
}

