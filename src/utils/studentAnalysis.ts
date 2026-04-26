import { lastNDays } from "@/lib/helpers";
import type {
  Assessment,
  DailyAssignment,
  ErrorType,
  MistakeRecord,
  StudentAnalysisResult,
  StudentProfile,
} from "@/types/models";

function priorityByCount(count: number): "高优先" | "中优先" | "关注" {
  if (count >= 3) return "高优先";
  if (count >= 2) return "中优先";
  return "关注";
}

export function analyzeStudent(
  student: StudentProfile,
  mistakes: MistakeRecord[],
  assignments: DailyAssignment[],
  assessments: Assessment[],
): StudentAnalysisResult {
  const recent7 = new Set(lastNDays(7));

  const weakPointMap = new Map<string, number>();
  const errorTypeMap = new Map<ErrorType, number>();

  mistakes.forEach((mistake) => {
    mistake.knowledgePoints.forEach((point) => {
      const extraWeight = recent7.has(mistake.createdAt.slice(0, 10)) ? 1 : 0;
      weakPointMap.set(point, (weakPointMap.get(point) || 0) + 1 + extraWeight);
    });

    if (mistake.errorType) {
      errorTypeMap.set(mistake.errorType, (errorTypeMap.get(mistake.errorType) || 0) + 1);
    }
  });

  const weakKnowledgePointRanking = [...weakPointMap.entries()]
    .map(([name, count]) => ({ name, count, priority: priorityByCount(count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const frequentErrorTypes = [...errorTypeMap.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const recentAssessments = assessments.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);
  const scoreGap = (student.targetScore || 0) - (student.currentScore || 0);

  let progress = "最近整体表现平稳。";
  let direction: "up" | "down" | "flat" = "flat";

  if (recentAssessments.length >= 2 && (recentAssessments[0].actualScore || 0) > (recentAssessments[1].actualScore || 0)) {
    progress = "最近两次评测分数有回升，说明练习在起作用。";
    direction = "up";
  } else if (recentAssessments.length >= 2 && (recentAssessments[0].actualScore || 0) < (recentAssessments[1].actualScore || 0)) {
    progress = "最近评测有波动，建议先回到薄弱知识点做短练。";
    direction = "down";
  }

  const recommendedDifficulty = scoreGap >= 15 ? "easy" : scoreGap >= 6 ? "medium" : "hard";
  const reviewPoints = weakKnowledgePointRanking.map((item) => item.name).slice(0, 4);

  const personalizedNotes = [
    student.learningStyle ? `学习风格判断为${student.learningStyle}，作业节奏应与此匹配。` : "建议继续观察学生的稳定出错模式。",
    ...(frequentErrorTypes.some((item) => ["审题错误", "粗心", "计算错误"].includes(item.type))
      ? ["高频出现审题/粗心/计算类错误，建议每次作业增加“检查清单”。"]
      : []),
  ];

  return {
    weakKnowledgePointRanking,
    frequentErrorTypes,
    trend: { progress, direction },
    recommendedReviewPoints: reviewPoints,
    recommendedDifficulty,
    assignmentAdvice: [
      scoreGap >= 15 ? "每日作业以基础巩固和错题重练为主，控制提升题比例。" : "可适度加入举一反三和能力提升题。",
      `优先覆盖：${reviewPoints.join("、") || "当前薄弱知识点"}`,
      assignments.some((item) => item.status === "draft") ? "当前有未完成的作业草稿，建议先完善再新增。" : "可按 20-30 分钟一组任务安排。",
    ],
    assessmentAdvice: [
      "评测题目优先覆盖最近 7 天反复出错的知识点。",
      recommendedDifficulty === "easy" ? "基础题比例建议提升到 50% 以上。" : "可以加入更多中档和提升题做区分度。",
      "评测后把失分题一键转入错题本，避免二次录入。",
    ],
    personalizedNotes,
  };
}

