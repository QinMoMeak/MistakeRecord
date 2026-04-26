import { splitInputToList } from "@/lib/helpers";
import type { MistakeFormValues, Subject } from "@/types/models";

const subjectHints: Array<{ subject: Subject; keywords: string[] }> = [
  { subject: "数学", keywords: ["方程", "函数", "几何", "三角形", "圆", "代数"] },
  { subject: "英语", keywords: ["语法", "完形填空", "阅读理解", "时态", "从句", "翻译"] },
  { subject: "语文", keywords: ["文言文", "阅读理解", "作文", "诗词", "病句"] },
  { subject: "物理", keywords: ["受力", "电路", "速度", "功率", "压强", "机械"] },
  { subject: "化学", keywords: ["方程式", "溶液", "酸碱", "实验"] },
];

function extractSection(input: string, titles: string[]) {
  const rows = input.split("\n");
  for (let index = 0; index < rows.length; index += 1) {
    const line = rows[index].trim();
    if (titles.some((title) => line.includes(title))) {
      const inline = line.split(/[:：]/).slice(1).join("：").trim();
      if (inline) return inline;
      const next: string[] = [];
      for (let cursor = index + 1; cursor < rows.length; cursor += 1) {
        const candidate = rows[cursor].trim();
        if (!candidate) continue;
        if (/^(题目|原题|错因|原因|解析|正确|思路|答案|知识点|易错|提醒|举一反三|类题|训练)/.test(candidate)) break;
        next.push(candidate);
      }
      if (next.length) return next.join("\n");
    }
  }
  return "";
}

function inferSubject(text: string): Subject {
  return subjectHints.find((item) => item.keywords.some((keyword) => text.includes(keyword)))?.subject || "其他";
}

export function parseConversationToDraft(conversation: string, current: MistakeFormValues): Partial<MistakeFormValues> {
  const normalized = conversation.trim();
  if (!normalized) return {};

  const problemText =
    extractSection(normalized, ["原题", "题目", "题干", "题目内容"]) || normalized.split("\n").slice(0, 6).join("\n");
  const wrongReason = extractSection(normalized, ["错因", "错误原因", "原因分析", "为什么错"]);
  const correctMethod = extractSection(normalized, ["正确思路", "正确解法", "解析", "解题思路"]);
  const answer = extractSection(normalized, ["答案", "正确答案"]);
  const tips = extractSection(normalized, ["易错点", "易错提醒", "提醒"]);
  const knowledgeText = extractSection(normalized, ["知识点", "考点", "涉及知识"]);
  const knowledgePoints = knowledgeText ? splitInputToList(knowledgeText) : current.knowledgePoints;
  const tags = Array.from(new Set([...current.tags, ...knowledgePoints.slice(0, 2)]));

  return {
    title: current.title || problemText.split("\n")[0]?.slice(0, 24) || "新错题",
    subject: current.subject === "其他" ? inferSubject(normalized) : current.subject,
    problemText,
    wrongReason,
    correctMethod,
    answer,
    tips,
    sourceConversation: normalized,
    knowledgePoints,
    tags,
    sourceType: current.imageIds.length > 0 ? "mixed" : "conversation",
  };
}
