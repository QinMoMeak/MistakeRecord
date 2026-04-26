import { generateDerivedExercises } from "@/lib/exercise-generator";
import { uid } from "@/lib/helpers";
import type {
  Assessment,
  AssessmentQuestion,
  Difficulty,
  MistakeRecord,
  StudentProfile,
} from "@/types/models";
import { analyzeStudent } from "@/utils/studentAnalysis";

export function generateAssessmentDraft(input: {
  student: StudentProfile;
  mistakes: MistakeRecord[];
  subject: string;
  knowledgePoints: string[];
  questionCount: number;
  difficultyDistribution?: Partial<Record<Difficulty, number>>;
}): Assessment {
  const { student, mistakes, subject, knowledgePoints, questionCount, difficultyDistribution } = input;
  const analysis = analyzeStudent(student, mistakes, [], []);
  const filteredMistakes = mistakes.filter(
    (item) => item.subject === subject && item.knowledgePoints.some((point) => knowledgePoints.includes(point)),
  );

  const questionDifficulties: Difficulty[] = [
    ...Array(difficultyDistribution?.easy || Math.ceil(questionCount * 0.4)).fill("easy"),
    ...Array(difficultyDistribution?.medium || Math.ceil(questionCount * 0.4)).fill("medium"),
    ...Array(difficultyDistribution?.hard || Math.max(1, questionCount - Math.ceil(questionCount * 0.8))).fill("hard"),
  ].slice(0, questionCount) as Difficulty[];

  const questions: AssessmentQuestion[] = questionDifficulties.map((difficulty, index) => {
    const sourceMistake = filteredMistakes[index % Math.max(filteredMistakes.length, 1)];
    const derived = sourceMistake ? generateDerivedExercises(sourceMistake, student)[0] : undefined;
    return {
      id: uid("question"),
      prompt:
        derived?.prompt ||
        `围绕 ${knowledgePoints[index % Math.max(knowledgePoints.length, 1)] || analysis.recommendedReviewPoints[0] || "当前薄弱知识点"} 生成一道${difficulty === "easy" ? "基础" : difficulty === "medium" ? "中档" : "提升"}题。`,
      knowledgePoints:
        sourceMistake?.knowledgePoints ||
        [knowledgePoints[index % Math.max(knowledgePoints.length, 1)] || analysis.recommendedReviewPoints[0] || "当前薄弱知识点"],
      difficulty,
      score: difficulty === "easy" ? 8 : difficulty === "medium" ? 10 : 12,
      answer: derived?.answer || sourceMistake?.answer,
    };
  });

  const totalScore = questions.reduce((sum, item) => sum + (item.score || 0), 0);

  return {
    id: uid("assessment"),
    studentId: student.id,
    title: `${student.name} ${subject}薄弱点评测`,
    date: new Date().toISOString().slice(0, 10),
    subject,
    totalScore,
    questions,
    relatedMistakeIds: filteredMistakes.slice(0, questionCount).map((item) => item.id),
    analysisSummary: analysis.assessmentAdvice.join(" "),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
