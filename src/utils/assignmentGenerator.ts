import { generateDerivedExercises } from "@/lib/exercise-generator";
import { uid } from "@/lib/helpers";
import type {
  Assessment,
  AssignmentExercise,
  DailyAssignment,
  Difficulty,
  MistakeRecord,
  StudentProfile,
} from "@/types/models";
import { analyzeStudent } from "@/utils/studentAnalysis";

export function generateAssignmentDraft(input: {
  student: StudentProfile;
  mistakes: MistakeRecord[];
  assessments: Assessment[];
  subject: string;
  date: string;
  exerciseCount: number;
  difficultyPreference?: Difficulty;
}): DailyAssignment {
  const { student, mistakes, assessments, subject, date, exerciseCount, difficultyPreference } = input;
  const subjectMistakes = mistakes.filter((item) => item.subject === subject);
  const prioritizedMistakes = subjectMistakes
    .filter((item) => item.masteryStatus === "unmastered")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const analysis = analyzeStudent(student, mistakes, [], assessments);
  const selectedMistakes = prioritizedMistakes.slice(0, Math.max(1, Math.ceil(exerciseCount / 2)));
  const exercises: AssignmentExercise[] = selectedMistakes.flatMap((mistake) => {
    const derived = generateDerivedExercises(mistake, student)[0];
    return [
      {
        id: uid("assign-ex"),
        type: "错题重练" as const,
        prompt: `请重新完成：${mistake.problemText || mistake.title}`,
        answer: mistake.answer,
        hint: mistake.tips,
        sourceMistakeId: mistake.id,
        difficulty: difficultyPreference || mistake.difficulty || analysis.recommendedDifficulty,
        knowledgePoints: mistake.knowledgePoints,
      },
      {
        id: uid("assign-ex"),
        type: "举一反三" as const,
        prompt: derived.prompt,
        answer: derived.answer,
        hint: derived.hint,
        sourceMistakeId: mistake.id,
        difficulty: derived.difficulty,
        knowledgePoints: derived.knowledgePoints,
      },
    ];
  });

  while (exercises.length < exerciseCount) {
    exercises.push({
      id: uid("assign-ex"),
      type: exercises.length % 2 === 0 ? "巩固基础" : "能力提升",
      prompt:
        exercises.length % 2 === 0
          ? `围绕 ${analysis.recommendedReviewPoints[0] || "本周重点知识点"} 完成一道基础巩固题。`
          : `围绕 ${analysis.recommendedReviewPoints[1] || "当前主线知识点"} 完成一道稍有变化的提升题。`,
      difficulty: difficultyPreference || analysis.recommendedDifficulty,
      knowledgePoints: analysis.recommendedReviewPoints.slice(0, 2),
      hint: "先回忆相关错题，再独立作答。",
    });
  }

  return {
    id: uid("assignment"),
    studentId: student.id,
    title: `${student.name} ${date} ${subject}每日作业`,
    date,
    subject,
    targetKnowledgePoints: analysis.recommendedReviewPoints,
    exercises: exercises.slice(0, exerciseCount),
    relatedMistakeIds: selectedMistakes.map((item) => item.id),
    status: "draft",
    summary: analysis.assignmentAdvice.join(" "),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
