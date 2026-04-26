import { ImageUp, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

export function UploadDropzone() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const saveImageFiles = useAppStore((state) => state.saveImageFiles);
  const students = useAppStore((state) => state.students);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setBusy(true);
    try {
      const images = await saveImageFiles(Array.from(fileList).filter((file) => /image\/(jpeg|png|webp)/.test(file.type)));
      const params = new URLSearchParams();
      params.set("images", images.map((item) => item.id).join(","));
      if (students.length === 1) params.set("studentId", students[0].id);
      navigate(`/mistakes/new?${params.toString()}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-brand-100 bg-white/90 p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">上传错题</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">支持拖拽或点击上传 JPG / PNG / WebP。进入新建页面后必须先选择学生才能保存。</p>
        </div>
        <div className="rounded-2xl bg-brand-50 p-3 text-brand-600">
          <ImageUp size={20} />
        </div>
      </div>

      <div
        className={`mt-5 rounded-[24px] border-2 border-dashed p-8 text-center transition ${dragging ? "border-brand-400 bg-brand-50/80" : "border-slate-200 bg-slate-50/80"}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-brand-600 shadow-sm">
          <UploadCloud size={28} />
        </div>
        <p className="mt-5 text-base font-semibold text-slate-900">{busy ? "正在处理图片..." : "点击或拖拽图片到此处上传"}</p>
        <p className="mt-2 text-sm text-slate-500">单张建议控制在 10MB 内，多图也会一起保存到浏览器本地。</p>
        <button type="button" className="mt-6 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-card" onClick={() => inputRef.current?.click()}>
          选择图片
        </button>
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple hidden onChange={(event) => void handleFiles(event.target.files)} />
      </div>
    </section>
  );
}
