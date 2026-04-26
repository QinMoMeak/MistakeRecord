import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  AssignmentExerciseType,
  AssignmentStatus,
  Difficulty,
  ErrorType,
  LearningStyle,
  MasteryStatus,
  SourceScene,
  Subject,
  SubjectLevel,
} from "@/types/models";

export function cn(...inputs: Array<string | undefined | null | false>) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "id") {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function formatDateTime(value?: string) {
  if (!value) return "未记录";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDate(value?: string) {
  if (!value) return "未记录";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

export function isToday(value?: string) {
  if (!value) return false;
  return new Date(value).toDateString() === new Date().toDateString();
}

export function lastNDays(days: number) {
  const result: string[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push(date.toISOString().slice(0, 10));
  }
  return result;
}

export function splitInputToList(value: string) {
  return value
    .split(/[，,、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseNumberInput(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseJsonSafe<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export const SUBJECTS: Subject[] = ["数学", "语文", "英语", "物理", "化学", "生物", "历史", "地理", "政治", "其他"];
export const LEARNING_STYLES: LearningStyle[] = ["基础薄弱型", "粗心马虎型", "思维提升型", "应试冲刺型", "稳定巩固型"];
export const SUBJECT_LEVELS: SubjectLevel[] = ["薄弱", "一般", "良好", "优秀"];
export const SCENES: SourceScene[] = ["daily_homework", "quiz", "exam", "practice", "other"];
export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
export const ERROR_TYPES: ErrorType[] = ["知识点不会", "审题错误", "计算错误", "步骤不完整", "概念混淆", "方法不熟", "粗心", "其他"];
export const ASSIGNMENT_STATUSES: AssignmentStatus[] = ["draft", "assigned", "completed", "reviewed"];
export const ASSIGNMENT_TYPES: AssignmentExerciseType[] = ["巩固基础", "错题重练", "举一反三", "能力提升"];

export const MASTERY_LABELS: Record<MasteryStatus, string> = {
  unmastered: "未掌握",
  reviewing: "复习中",
  mastered: "已掌握",
};

export const MASTERY_STYLES: Record<MasteryStatus, string> = {
  unmastered: "bg-rose-50 text-rose-600 ring-rose-200",
  reviewing: "bg-amber-50 text-amber-600 ring-amber-200",
  mastered: "bg-emerald-50 text-emerald-600 ring-emerald-200",
};

export const SUBJECT_COLORS: Record<Subject, string> = {
  数学: "bg-sky-50 text-sky-700 ring-sky-200",
  语文: "bg-violet-50 text-violet-700 ring-violet-200",
  英语: "bg-amber-50 text-amber-700 ring-amber-200",
  物理: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  化学: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  生物: "bg-lime-50 text-lime-700 ring-lime-200",
  历史: "bg-orange-50 text-orange-700 ring-orange-200",
  地理: "bg-teal-50 text-teal-700 ring-teal-200",
  政治: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200",
  其他: "bg-slate-100 text-slate-700 ring-slate-200",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "基础",
  medium: "中档",
  hard: "提升",
};

export const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, string> = {
  draft: "草稿",
  assigned: "已布置",
  completed: "已完成",
  reviewed: "已批注",
};

export const SOURCE_SCENE_LABELS: Record<SourceScene, string> = {
  daily_homework: "日常作业",
  quiz: "小测",
  exam: "考试",
  practice: "练习",
  other: "其他",
};

export function downloadTextFile(filename: string, content: string, mimeType = "application/json") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function copyText(text: string) {
  return navigator.clipboard.writeText(text);
}
