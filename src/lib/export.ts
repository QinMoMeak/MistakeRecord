import { downloadTextFile, formatDateTime } from "@/lib/helpers";
import type { AppExportPayload, MistakeRecord, StudentProfile } from "@/types/models";

export function exportDatabaseAsJson(payload: AppExportPayload) {
  const filename = `learning-archive-${new Date().toISOString().slice(0, 10)}.json`;
  downloadTextFile(filename, JSON.stringify(payload, null, 2));
}

export function buildReviewNote(mistake: MistakeRecord, student?: StudentProfile) {
  return [
    `学生：${student?.name || "未关联"}`,
    `标题：${mistake.title}`,
    `学科：${mistake.subject}`,
    `场景：${mistake.sourceScene}`,
    `标签：${mistake.tags.join("、") || "无"}`,
    `知识点：${mistake.knowledgePoints.join("、") || "无"}`,
    "",
    "题目内容：",
    mistake.problemText || "未填写",
    "",
    "错因分析：",
    mistake.wrongReason || "未填写",
    "",
    "正确思路：",
    mistake.correctMethod || "未填写",
    "",
    "易错提醒：",
    mistake.tips || "未填写",
    "",
    `更新时间：${formatDateTime(mistake.updatedAt)}`,
  ].join("\n");
}

export function printMistakeCard(mistake: MistakeRecord, imageUrls: string[], student?: StudentProfile) {
  const popup = window.open("", "_blank", "width=900,height=700");
  if (!popup) return;

  const imagesMarkup = imageUrls
    .map((url) => `<img src="${url}" alt="错题图片" style="width:100%;border-radius:16px;margin-top:12px;border:1px solid #dbeafe;" />`)
    .join("");

  popup.document.write(`
    <html lang="zh-CN">
      <head>
        <title>${mistake.title}</title>
        <style>
          body { font-family: "MiSans","PingFang SC","Noto Sans SC",sans-serif; padding: 32px; color: #0f172a; background: #f8fbff; }
          .card { max-width: 820px; margin: 0 auto; background: white; border-radius: 24px; padding: 28px; box-shadow: 0 12px 36px rgba(37, 99, 235, 0.12); }
          .badge { display:inline-block; padding:6px 12px; background:#eff6ff; border-radius:999px; margin-right:8px; margin-bottom:8px; color:#1d4ed8; }
          h1 { margin: 0 0 10px; }
          h2 { font-size: 18px; margin: 24px 0 8px; }
          p, pre { white-space: pre-wrap; line-height: 1.7; }
          .meta { color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="meta">打印卡片 · ${formatDateTime(mistake.updatedAt)}</div>
          <h1>${mistake.title}</h1>
          <div class="meta">学生：${student?.name || "未关联"} · 学科：${mistake.subject}</div>
          <div style="margin-top:10px;">
            ${mistake.tags.map((tag) => `<span class="badge">${tag}</span>`).join("")}
          </div>
          <h2>题目内容</h2>
          <pre>${mistake.problemText || "未填写"}</pre>
          <h2>错因分析</h2>
          <pre>${mistake.wrongReason || "未填写"}</pre>
          <h2>正确思路</h2>
          <pre>${mistake.correctMethod || "未填写"}</pre>
          <h2>知识点</h2>
          <p>${mistake.knowledgePoints.join("、") || "无"}</p>
          <h2>易错提醒</h2>
          <p>${mistake.tips || "未填写"}</p>
          ${imagesMarkup}
        </div>
        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `);
  popup.document.close();
}
