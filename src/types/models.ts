export type Subject =
  | "数学"
  | "语文"
  | "英语"
  | "物理"
  | "化学"
  | "生物"
  | "历史"
  | "地理"
  | "政治"
  | "其他";

export type MasteryStatus = "unmastered" | "reviewing" | "mastered";
export type SourceType = "image" | "conversation" | "mixed";
export type Difficulty = "easy" | "medium" | "hard";
export type SourceScene = "daily_homework" | "quiz" | "exam" | "practice" | "other";
export type ErrorType = "知识点不会" | "审题错误" | "计算错误" | "步骤不完整" | "概念混淆" | "方法不熟" | "粗心" | "其他";
export type LearningStyle = "基础薄弱型" | "粗心马虎型" | "思维提升型" | "应试冲刺型" | "稳定巩固型";
export type SubjectLevel = "薄弱" | "一般" | "良好" | "优秀";
export type AssignmentStatus = "draft" | "assigned" | "completed" | "reviewed";
export type AssignmentExerciseType = "巩固基础" | "错题重练" | "举一反三" | "能力提升";

export interface DerivedExercise {
  id: string;
  mistakeId: string;
  title: string;
  prompt: string;
  knowledgePoints: string[];
  difficulty: Difficulty;
  hint?: string;
  answer?: string;
  createdAt: string;
  saved?: boolean;
}

export interface StudentSubjectLevel {
  subject: string;
  score?: number;
  level?: SubjectLevel;
  comment?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  nickname?: string;
  gender?: string;
  grade: string;
  school?: string;
  className?: string;
  currentScore?: number;
  targetScore?: number;
  subjectLevels: StudentSubjectLevel[];
  weakSubjects: string[];
  strongSubjects: string[];
  weakKnowledgePoints: string[];
  learningGoals: string[];
  learningStyle?: LearningStyle;
  attentionNotes?: string;
  parentNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MistakeRecord {
  id: string;
  studentId: string;
  title: string;
  subject: Subject;
  grade?: string;
  tags: string[];
  knowledgePoints: string[];
  problemText: string;
  wrongReason: string;
  correctMethod: string;
  answer?: string;
  tips?: string;
  sourceConversation?: string;
  imageIds: string[];
  masteryStatus: MasteryStatus;
  createdAt: string;
  updatedAt: string;
  lastReviewedAt?: string;
  derivedExercises: DerivedExercise[];
  sourceType: SourceType;
  isStarred: boolean;
  examName?: string;
  homeworkName?: string;
  sourceScene: SourceScene;
  difficulty?: Difficulty;
  scoreLoss?: number;
  errorType?: ErrorType;
}

export interface AssignmentExercise {
  id: string;
  type: AssignmentExerciseType;
  prompt: string;
  answer?: string;
  hint?: string;
  sourceMistakeId?: string;
  difficulty: Difficulty;
  knowledgePoints: string[];
  studentAnswer?: string;
  isCorrect?: boolean;
  reviewNote?: string;
}

export interface DailyAssignment {
  id: string;
  studentId: string;
  title: string;
  date: string;
  subject: string;
  targetKnowledgePoints: string[];
  exercises: AssignmentExercise[];
  relatedMistakeIds: string[];
  status: AssignmentStatus;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  knowledgePoints: string[];
  difficulty: Difficulty;
  score?: number;
  studentScore?: number;
  answer?: string;
  studentAnswer?: string;
  errorReason?: string;
  convertedMistakeId?: string;
}

export interface Assessment {
  id: string;
  studentId: string;
  title: string;
  date: string;
  subject: string;
  totalScore?: number;
  actualScore?: number;
  questions: AssessmentQuestion[];
  relatedMistakeIds: string[];
  analysisSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface KnowledgePoint {
  id: string;
  name: string;
  subject?: Subject;
}

export interface ImageAsset {
  id: string;
  name: string;
  mimeType: string;
  dataUrl: string;
  createdAt: string;
}

export interface StudyTrendPoint {
  date: string;
  uploaded: number;
  reviewed: number;
}

export interface StudentTrendPoint {
  date: string;
  mistakes: number;
  assignments: number;
  assessments: number;
}

export interface StudentAnalysisResult {
  weakKnowledgePointRanking: Array<{ name: string; count: number; priority: "高优先" | "中优先" | "关注" }>;
  frequentErrorTypes: Array<{ type: ErrorType; count: number }>;
  trend: {
    progress: string;
    direction: "up" | "down" | "flat";
  };
  recommendedReviewPoints: string[];
  recommendedDifficulty: Difficulty;
  assignmentAdvice: string[];
  assessmentAdvice: string[];
  personalizedNotes: string[];
}

export interface AppExportPayload {
  version: number;
  exportedAt: string;
  students: StudentProfile[];
  mistakes: MistakeRecord[];
  assignments: DailyAssignment[];
  assessments: Assessment[];
  tags: Tag[];
  knowledgePoints: KnowledgePoint[];
  images: ImageAsset[];
}

export interface MistakeFormValues {
  id?: string;
  studentId: string;
  title: string;
  subject: Subject;
  grade: string;
  tags: string[];
  knowledgePoints: string[];
  problemText: string;
  wrongReason: string;
  correctMethod: string;
  answer: string;
  tips: string;
  sourceConversation: string;
  imageIds: string[];
  masteryStatus: MasteryStatus;
  sourceType: SourceType;
  isStarred: boolean;
  examName: string;
  homeworkName: string;
  sourceScene: SourceScene;
  difficulty: "" | Difficulty;
  scoreLoss: string;
  errorType: "" | ErrorType;
}

export interface StudentFormValues {
  id?: string;
  name: string;
  nickname: string;
  gender: string;
  grade: string;
  school: string;
  className: string;
  currentScore: string;
  targetScore: string;
  subjectLevelsText: string;
  weakSubjects: string[];
  strongSubjects: string[];
  weakKnowledgePoints: string[];
  learningGoals: string[];
  learningStyle: "" | LearningStyle;
  attentionNotes: string;
  parentNotes: string;
}

export interface AssignmentFormValues {
  id?: string;
  studentId: string;
  title: string;
  date: string;
  subject: string;
  targetKnowledgePoints: string[];
  exercises: AssignmentExercise[];
  relatedMistakeIds: string[];
  status: AssignmentStatus;
  summary: string;
}

export interface AssessmentFormValues {
  id?: string;
  studentId: string;
  title: string;
  date: string;
  subject: string;
  totalScore: string;
  actualScore: string;
  questions: AssessmentQuestion[];
  relatedMistakeIds: string[];
  analysisSummary: string;
}

export interface MistakeFilterState {
  keyword: string;
  studentId: string;
  subject: "全部" | Subject;
  tag: string;
  knowledgePoint: string;
  masteryStatus: "all" | MasteryStatus;
  sortBy: "createdAt-desc" | "createdAt-asc" | "reviewed-desc" | "mastery";
  starredOnly: boolean;
}

export interface AssignmentFilterState {
  studentId: string;
  subject: string;
  status: "all" | AssignmentStatus;
  keyword: string;
}

export interface AssessmentFilterState {
  studentId: string;
  subject: string;
  keyword: string;
}
