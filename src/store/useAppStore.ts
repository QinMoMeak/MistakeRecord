import { create } from "zustand";
import { generateAssignmentDraft } from "@/utils/assignmentGenerator";
import { generateAssessmentDraft } from "@/utils/assessmentGenerator";
import { analyzeStudent } from "@/utils/studentAnalysis";
import { generateDerivedExercises } from "@/lib/exercise-generator";
import {
  bootstrapDatabase,
  deleteAssessments,
  deleteAssignments,
  deleteKnowledgePoint,
  deleteMistakes,
  deleteStudents,
  deleteTag,
  getAllData,
  getExportPayload,
  importPayload,
  saveAssessment,
  saveAssignment,
  saveImages,
  saveKnowledgePoint,
  saveMistake,
  saveStudent,
  saveTag,
} from "@/lib/repository";
import { lastNDays, parseJsonSafe, parseNumberInput, splitInputToList, uid } from "@/lib/helpers";
import type {
  AppExportPayload,
  Assessment,
  AssessmentFilterState,
  AssessmentFormValues,
  DailyAssignment,
  AssignmentFilterState,
  AssignmentFormValues,
  DerivedExercise,
  ImageAsset,
  KnowledgePoint,
  MistakeFilterState,
  MistakeFormValues,
  MistakeRecord,
  StudentAnalysisResult,
  StudentFormValues,
  StudentProfile,
  StudentTrendPoint,
  Tag,
} from "@/types/models";

const defaultMistakeFilters: MistakeFilterState = {
  keyword: "",
  studentId: "",
  subject: "全部",
  tag: "",
  knowledgePoint: "",
  masteryStatus: "all",
  sortBy: "createdAt-desc",
  starredOnly: false,
};

const defaultAssignmentFilters: AssignmentFilterState = {
  studentId: "",
  subject: "",
  status: "all",
  keyword: "",
};

const defaultAssessmentFilters: AssessmentFilterState = {
  studentId: "",
  subject: "",
  keyword: "",
};

interface AppState {
  initialized: boolean;
  loadingText: string;
  students: StudentProfile[];
  mistakes: MistakeRecord[];
  assignments: DailyAssignment[];
  assessments: Assessment[];
  tags: Tag[];
  knowledgePoints: KnowledgePoint[];
  images: ImageAsset[];
  mistakeFilters: MistakeFilterState;
  assignmentFilters: AssignmentFilterState;
  assessmentFilters: AssessmentFilterState;
  selectedMistakeIds: string[];
  init: () => Promise<void>;
  refresh: () => Promise<void>;
  setMistakeFilters: (patch: Partial<MistakeFilterState>) => void;
  resetMistakeFilters: () => void;
  setAssignmentFilters: (patch: Partial<AssignmentFilterState>) => void;
  setAssessmentFilters: (patch: Partial<AssessmentFilterState>) => void;
  toggleSelection: (id: string) => void;
  saveStudentRecord: (values: StudentFormValues) => Promise<StudentProfile>;
  removeStudents: (ids: string[]) => Promise<void>;
  saveMistakeRecord: (values: MistakeFormValues) => Promise<MistakeRecord>;
  removeMistakeRecords: (ids: string[]) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;
  markReviewed: (id: string) => Promise<void>;
  saveExercises: (mistakeId: string, exercises: DerivedExercise[]) => Promise<void>;
  regenerateExercises: (mistakeId: string) => Promise<DerivedExercise[]>;
  saveAssignmentRecord: (values: AssignmentFormValues) => Promise<DailyAssignment>;
  removeAssignmentRecords: (ids: string[]) => Promise<void>;
  saveAssessmentRecord: (values: AssessmentFormValues) => Promise<Assessment>;
  removeAssessmentRecords: (ids: string[]) => Promise<void>;
  convertQuestionToMistake: (assessmentId: string, questionId: string) => Promise<MistakeRecord | null>;
  saveTagByName: (name: string) => Promise<void>;
  saveKnowledgeByName: (name: string, subject?: KnowledgePoint["subject"]) => Promise<void>;
  removeTagById: (id: string) => Promise<void>;
  removeKnowledgeById: (id: string) => Promise<void>;
  saveImageFiles: (files: File[]) => Promise<ImageAsset[]>;
  exportJson: () => Promise<AppExportPayload>;
  importJson: (payload: AppExportPayload, mode: "merge" | "overwrite") => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  initialized: false,
  loadingText: "正在初始化学习档案数据...",
  students: [],
  mistakes: [],
  assignments: [],
  assessments: [],
  tags: [],
  knowledgePoints: [],
  images: [],
  mistakeFilters: defaultMistakeFilters,
  assignmentFilters: defaultAssignmentFilters,
  assessmentFilters: defaultAssessmentFilters,
  selectedMistakeIds: [],

  init: async () => {
    set({ loadingText: "正在写入示例学生与学习记录..." });
    await bootstrapDatabase();
    set({ loadingText: "正在读取本地档案..." });
    const snapshot = await getAllData();
    set({ ...snapshot, initialized: true, loadingText: "初始化完成" });
  },

  refresh: async () => {
    const snapshot = await getAllData();
    set({ ...snapshot });
  },

  setMistakeFilters: (patch) => set((state) => ({ mistakeFilters: { ...state.mistakeFilters, ...patch } })),
  resetMistakeFilters: () => set({ mistakeFilters: defaultMistakeFilters }),
  setAssignmentFilters: (patch) => set((state) => ({ assignmentFilters: { ...state.assignmentFilters, ...patch } })),
  setAssessmentFilters: (patch) => set((state) => ({ assessmentFilters: { ...state.assessmentFilters, ...patch } })),

  toggleSelection: (id) =>
    set((state) => ({
      selectedMistakeIds: state.selectedMistakeIds.includes(id)
        ? state.selectedMistakeIds.filter((item) => item !== id)
        : [...state.selectedMistakeIds, id],
    })),

  saveStudentRecord: async (values) => {
    const timestamp = new Date().toISOString();
    const existing = values.id ? get().students.find((item) => item.id === values.id) : undefined;
    const record: StudentProfile = {
      id: existing?.id ?? uid("student"),
      name: values.name.trim(),
      nickname: values.nickname || undefined,
      gender: values.gender || undefined,
      grade: values.grade.trim(),
      school: values.school || undefined,
      className: values.className || undefined,
      currentScore: parseNumberInput(values.currentScore),
      targetScore: parseNumberInput(values.targetScore),
      subjectLevels: parseJsonSafe(values.subjectLevelsText, []),
      weakSubjects: values.weakSubjects,
      strongSubjects: values.strongSubjects,
      weakKnowledgePoints: values.weakKnowledgePoints,
      learningGoals: values.learningGoals,
      learningStyle: values.learningStyle || undefined,
      attentionNotes: values.attentionNotes || undefined,
      parentNotes: values.parentNotes || undefined,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };
    await saveStudent(record);
    await get().refresh();
    return record;
  },

  removeStudents: async (ids) => {
    if (!window.confirm(ids.length > 1 ? `确认删除这 ${ids.length} 位学生及其关联数据吗？` : "确认删除该学生及其关联数据吗？")) return;
    await deleteStudents(ids);
    await get().refresh();
  },

  saveMistakeRecord: async (values) => {
    const timestamp = new Date().toISOString();
    const existing = values.id ? get().mistakes.find((item) => item.id === values.id) : undefined;
    const knownTags = new Set(get().tags.map((item) => item.name));
    const knownKnowledgePoints = new Set(get().knowledgePoints.map((item) => item.name));

    await Promise.all([
      ...values.tags.filter((tag) => !knownTags.has(tag)).map((tag) => saveTag({ id: uid("tag"), name: tag })),
      ...values.knowledgePoints
        .filter((item) => !knownKnowledgePoints.has(item))
        .map((item) => saveKnowledgePoint({ id: uid("kp"), name: item, subject: values.subject })),
    ]);

    const record: MistakeRecord = {
      id: existing?.id ?? uid("mistake"),
      studentId: values.studentId,
      title: values.title,
      subject: values.subject,
      grade: values.grade || undefined,
      tags: values.tags,
      knowledgePoints: values.knowledgePoints,
      problemText: values.problemText,
      wrongReason: values.wrongReason,
      correctMethod: values.correctMethod,
      answer: values.answer || undefined,
      tips: values.tips || undefined,
      sourceConversation: values.sourceConversation || undefined,
      imageIds: values.imageIds,
      masteryStatus: values.masteryStatus,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
      lastReviewedAt: existing?.lastReviewedAt,
      derivedExercises: existing?.derivedExercises ?? [],
      sourceType: values.sourceType,
      isStarred: values.isStarred,
      examName: values.examName || undefined,
      homeworkName: values.homeworkName || undefined,
      sourceScene: values.sourceScene,
      difficulty: values.difficulty || undefined,
      scoreLoss: parseNumberInput(values.scoreLoss),
      errorType: values.errorType || undefined,
    };

    await saveMistake(record);
    await get().refresh();
    return record;
  },

  removeMistakeRecords: async (ids) => {
    if (!window.confirm(ids.length > 1 ? `确认删除这 ${ids.length} 条错题吗？` : "确认删除这条错题吗？")) return;
    await deleteMistakes(ids);
    await get().refresh();
    set({ selectedMistakeIds: [] });
  },

  toggleStar: async (id) => {
    const record = get().mistakes.find((item) => item.id === id);
    if (!record) return;
    await saveMistake({ ...record, isStarred: !record.isStarred, updatedAt: new Date().toISOString() });
    await get().refresh();
  },

  markReviewed: async (id) => {
    const record = get().mistakes.find((item) => item.id === id);
    if (!record) return;
    await saveMistake({
      ...record,
      lastReviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      masteryStatus: record.masteryStatus === "unmastered" ? "reviewing" : record.masteryStatus,
    });
    await get().refresh();
  },

  saveExercises: async (mistakeId, exercises) => {
    const record = get().mistakes.find((item) => item.id === mistakeId);
    if (!record) return;
    await saveMistake({ ...record, derivedExercises: exercises, updatedAt: new Date().toISOString() });
    await get().refresh();
  },

  regenerateExercises: async (mistakeId) => {
    const mistake = get().mistakes.find((item) => item.id === mistakeId);
    if (!mistake) return [];
    const student = get().students.find((item) => item.id === mistake.studentId);
    const next = generateDerivedExercises(mistake, student);
    await get().saveExercises(mistakeId, next);
    return next;
  },

  saveAssignmentRecord: async (values) => {
    const timestamp = new Date().toISOString();
    const existing = values.id ? get().assignments.find((item) => item.id === values.id) : undefined;
    const record: DailyAssignment = {
      id: existing?.id ?? uid("assignment"),
      studentId: values.studentId,
      title: values.title,
      date: values.date,
      subject: values.subject,
      targetKnowledgePoints: values.targetKnowledgePoints,
      exercises: values.exercises,
      relatedMistakeIds: values.relatedMistakeIds,
      status: values.status,
      summary: values.summary || undefined,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };
    await saveAssignment(record);
    await get().refresh();
    return record;
  },

  removeAssignmentRecords: async (ids) => {
    if (!window.confirm(ids.length > 1 ? `确认删除这 ${ids.length} 份作业吗？` : "确认删除这份作业吗？")) return;
    await deleteAssignments(ids);
    await get().refresh();
  },

  saveAssessmentRecord: async (values) => {
    const timestamp = new Date().toISOString();
    const existing = values.id ? get().assessments.find((item) => item.id === values.id) : undefined;
    const record: Assessment = {
      id: existing?.id ?? uid("assessment"),
      studentId: values.studentId,
      title: values.title,
      date: values.date,
      subject: values.subject,
      totalScore: parseNumberInput(values.totalScore),
      actualScore: parseNumberInput(values.actualScore),
      questions: values.questions,
      relatedMistakeIds: values.relatedMistakeIds,
      analysisSummary: values.analysisSummary || undefined,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };
    await saveAssessment(record);
    await get().refresh();
    return record;
  },

  removeAssessmentRecords: async (ids) => {
    if (!window.confirm(ids.length > 1 ? `确认删除这 ${ids.length} 份评测吗？` : "确认删除这份评测吗？")) return;
    await deleteAssessments(ids);
    await get().refresh();
  },

  convertQuestionToMistake: async (assessmentId, questionId) => {
    const assessment = get().assessments.find((item) => item.id === assessmentId);
    if (!assessment) return null;
    const question = assessment.questions.find((item) => item.id === questionId);
    if (!question) return null;
    const student = get().students.find((item) => item.id === assessment.studentId);
    if (!student) return null;

    const mistake: MistakeRecord = {
      id: uid("mistake"),
      studentId: student.id,
      title: `${assessment.title} · 转入错题`,
      subject: assessment.subject as MistakeRecord["subject"],
      grade: student.grade,
      tags: [assessment.subject, "评测转入"],
      knowledgePoints: question.knowledgePoints,
      problemText: question.prompt,
      wrongReason: question.errorReason || "评测后转入，待补充错因分析。",
      correctMethod: question.answer || "待补充正确思路。",
      answer: question.answer,
      imageIds: [],
      masteryStatus: "unmastered",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      derivedExercises: [],
      sourceType: "conversation",
      isStarred: false,
      sourceScene: "exam",
      examName: assessment.title,
      difficulty: question.difficulty,
      errorType: "知识点不会",
      tips: "从评测错题转入，建议优先安排到下一份作业。",
    };

    await saveMistake(mistake);
    await saveAssessment({
      ...assessment,
      questions: assessment.questions.map((item) =>
        item.id === questionId ? { ...item, convertedMistakeId: mistake.id } : item,
      ),
      relatedMistakeIds: Array.from(new Set([...assessment.relatedMistakeIds, mistake.id])),
      updatedAt: new Date().toISOString(),
    });
    await get().refresh();
    return mistake;
  },

  saveTagByName: async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await saveTag({ id: uid("tag"), name: trimmed });
    await get().refresh();
  },

  saveKnowledgeByName: async (name, subject) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await saveKnowledgePoint({ id: uid("kp"), name: trimmed, subject });
    await get().refresh();
  },

  removeTagById: async (id) => {
    const tag = get().tags.find((item) => item.id === id);
    if (!tag) return;
    await deleteTag(id);
    await Promise.all(
      get().mistakes.map((mistake) =>
        mistake.tags.includes(tag.name)
          ? saveMistake({ ...mistake, tags: mistake.tags.filter((item) => item !== tag.name), updatedAt: new Date().toISOString() })
          : Promise.resolve(),
      ),
    );
    await get().refresh();
  },

  removeKnowledgeById: async (id) => {
    const target = get().knowledgePoints.find((item) => item.id === id);
    if (!target) return;
    await deleteKnowledgePoint(id);
    await Promise.all(
      get().mistakes.map((mistake) =>
        mistake.knowledgePoints.includes(target.name)
          ? saveMistake({
              ...mistake,
              knowledgePoints: mistake.knowledgePoints.filter((item) => item !== target.name),
              updatedAt: new Date().toISOString(),
            })
          : Promise.resolve(),
      ),
    );
    await get().refresh();
  },

  saveImageFiles: async (files) => {
    const images = await Promise.all(
      files.map(
        (file) =>
          new Promise<ImageAsset>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: uid("img"),
                name: file.name,
                mimeType: file.type,
                dataUrl: String(reader.result),
                createdAt: new Date().toISOString(),
              });
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          }),
      ),
    );
    await saveImages(images);
    await get().refresh();
    return images;
  },

  exportJson: async () => getExportPayload(),
  importJson: async (payload, mode) => {
    await importPayload(payload, mode);
    await get().refresh();
  },
}));

export function createEmptyStudentForm(): StudentFormValues {
  return {
    name: "",
    nickname: "",
    gender: "",
    grade: "",
    school: "",
    className: "",
    currentScore: "",
    targetScore: "",
    subjectLevelsText: "[]",
    weakSubjects: [],
    strongSubjects: [],
    weakKnowledgePoints: [],
    learningGoals: [],
    learningStyle: "",
    attentionNotes: "",
    parentNotes: "",
  };
}

export function hydrateStudentForm(record?: StudentProfile): StudentFormValues {
  if (!record) return createEmptyStudentForm();
  return {
    id: record.id,
    name: record.name,
    nickname: record.nickname || "",
    gender: record.gender || "",
    grade: record.grade,
    school: record.school || "",
    className: record.className || "",
    currentScore: record.currentScore?.toString() || "",
    targetScore: record.targetScore?.toString() || "",
    subjectLevelsText: JSON.stringify(record.subjectLevels, null, 2),
    weakSubjects: record.weakSubjects,
    strongSubjects: record.strongSubjects,
    weakKnowledgePoints: record.weakKnowledgePoints,
    learningGoals: record.learningGoals,
    learningStyle: record.learningStyle || "",
    attentionNotes: record.attentionNotes || "",
    parentNotes: record.parentNotes || "",
  };
}

export function createEmptyMistakeForm(studentId = ""): MistakeFormValues {
  return {
    studentId,
    title: "",
    subject: "数学",
    grade: "",
    tags: [],
    knowledgePoints: [],
    problemText: "",
    wrongReason: "",
    correctMethod: "",
    answer: "",
    tips: "",
    sourceConversation: "",
    imageIds: [],
    masteryStatus: "unmastered",
    sourceType: "image",
    isStarred: false,
    examName: "",
    homeworkName: "",
    sourceScene: "daily_homework",
    difficulty: "",
    scoreLoss: "",
    errorType: "",
  };
}

export function hydrateMistakeForm(record?: MistakeRecord): MistakeFormValues {
  if (!record) return createEmptyMistakeForm();
  return {
    id: record.id,
    studentId: record.studentId,
    title: record.title,
    subject: record.subject,
    grade: record.grade || "",
    tags: record.tags,
    knowledgePoints: record.knowledgePoints,
    problemText: record.problemText,
    wrongReason: record.wrongReason,
    correctMethod: record.correctMethod,
    answer: record.answer || "",
    tips: record.tips || "",
    sourceConversation: record.sourceConversation || "",
    imageIds: record.imageIds,
    masteryStatus: record.masteryStatus,
    sourceType: record.sourceType,
    isStarred: record.isStarred,
    examName: record.examName || "",
    homeworkName: record.homeworkName || "",
    sourceScene: record.sourceScene,
    difficulty: record.difficulty || "",
    scoreLoss: record.scoreLoss?.toString() || "",
    errorType: record.errorType || "",
  };
}

export function createEmptyAssignmentForm(studentId = ""): AssignmentFormValues {
  return {
    studentId,
    title: "",
    date: new Date().toISOString().slice(0, 10),
    subject: "数学",
    targetKnowledgePoints: [],
    exercises: [],
    relatedMistakeIds: [],
    status: "draft",
    summary: "",
  };
}

export function hydrateAssignmentForm(record?: DailyAssignment): AssignmentFormValues {
  if (!record) return createEmptyAssignmentForm();
  return {
    id: record.id,
    studentId: record.studentId,
    title: record.title,
    date: record.date,
    subject: record.subject,
    targetKnowledgePoints: record.targetKnowledgePoints,
    exercises: record.exercises,
    relatedMistakeIds: record.relatedMistakeIds,
    status: record.status,
    summary: record.summary || "",
  };
}

export function createEmptyAssessmentForm(studentId = ""): AssessmentFormValues {
  return {
    studentId,
    title: "",
    date: new Date().toISOString().slice(0, 10),
    subject: "数学",
    totalScore: "",
    actualScore: "",
    questions: [],
    relatedMistakeIds: [],
    analysisSummary: "",
  };
}

export function hydrateAssessmentForm(record?: Assessment): AssessmentFormValues {
  if (!record) return createEmptyAssessmentForm();
  return {
    id: record.id,
    studentId: record.studentId,
    title: record.title,
    date: record.date,
    subject: record.subject,
    totalScore: record.totalScore?.toString() || "",
    actualScore: record.actualScore?.toString() || "",
    questions: record.questions,
    relatedMistakeIds: record.relatedMistakeIds,
    analysisSummary: record.analysisSummary || "",
  };
}

export function parseFlexibleList(value: string) {
  return splitInputToList(value);
}

export function useFilteredMistakes() {
  const { mistakes, mistakeFilters } = useAppStore();
  const keyword = mistakeFilters.keyword.trim().toLowerCase();
  return [...mistakes]
    .filter((item) => (mistakeFilters.studentId ? item.studentId === mistakeFilters.studentId : true))
    .filter((item) => (mistakeFilters.subject === "全部" ? true : item.subject === mistakeFilters.subject))
    .filter((item) => (mistakeFilters.tag ? item.tags.includes(mistakeFilters.tag) : true))
    .filter((item) => (mistakeFilters.knowledgePoint ? item.knowledgePoints.includes(mistakeFilters.knowledgePoint) : true))
    .filter((item) => (mistakeFilters.masteryStatus === "all" ? true : item.masteryStatus === mistakeFilters.masteryStatus))
    .filter((item) => (mistakeFilters.starredOnly ? item.isStarred : true))
    .filter((item) => {
      if (!keyword) return true;
      return [item.title, item.problemText, item.tags.join(" "), item.knowledgePoints.join(" "), item.examName, item.homeworkName]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    })
    .sort((a, b) => {
      switch (mistakeFilters.sortBy) {
        case "createdAt-asc":
          return a.createdAt.localeCompare(b.createdAt);
        case "reviewed-desc":
          return (b.lastReviewedAt || "").localeCompare(a.lastReviewedAt || "");
        case "mastery":
          return a.masteryStatus.localeCompare(b.masteryStatus);
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });
}

export function useFilteredAssignments() {
  const { assignments, assignmentFilters } = useAppStore();
  const keyword = assignmentFilters.keyword.trim().toLowerCase();
  return [...assignments]
    .filter((item) => (assignmentFilters.studentId ? item.studentId === assignmentFilters.studentId : true))
    .filter((item) => (assignmentFilters.subject ? item.subject === assignmentFilters.subject : true))
    .filter((item) => (assignmentFilters.status === "all" ? true : item.status === assignmentFilters.status))
    .filter((item) => [item.title, item.summary].join(" ").toLowerCase().includes(keyword))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function useFilteredAssessments() {
  const { assessments, assessmentFilters } = useAppStore();
  const keyword = assessmentFilters.keyword.trim().toLowerCase();
  return [...assessments]
    .filter((item) => (assessmentFilters.studentId ? item.studentId === assessmentFilters.studentId : true))
    .filter((item) => (assessmentFilters.subject ? item.subject === assessmentFilters.subject : true))
    .filter((item) => [item.title, item.analysisSummary].join(" ").toLowerCase().includes(keyword))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function useDashboardStats() {
  const { students, mistakes, assignments, assessments } = useAppStore();
  const today = new Date().toISOString().slice(0, 10);
  const weakMap = new Map<string, number>();
  mistakes.forEach((mistake) => {
    mistake.knowledgePoints.forEach((point) => weakMap.set(point, (weakMap.get(point) || 0) + 1));
  });

  return {
    studentCount: students.length,
    todayMistakes: mistakes.filter((item) => item.createdAt.startsWith(today)).length,
    todayAssignments: assignments.filter((item) => item.date === today).length,
    pendingReviewMistakes: mistakes.filter((item) => item.masteryStatus !== "mastered").length,
    recentStudents: [...students].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5),
    recentMistakes: [...mistakes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    pendingAssignments: assignments.filter((item) => item.status !== "reviewed").slice(0, 5),
    recentAssessments: [...assessments].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    weakKnowledgePoints: [...weakMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6),
  };
}

export function useTrendData() {
  const { mistakes, assignments, assessments } = useAppStore();
  return lastNDays(7).map((date) => ({
    date: date.slice(5).replace("-", "/"),
    mistakes: mistakes.filter((item) => item.createdAt.startsWith(date)).length,
    assignments: assignments.filter((item) => item.date === date).length,
    assessments: assessments.filter((item) => item.date === date).length,
  }));
}

export function getStudentAnalysis(studentId: string): StudentAnalysisResult | null {
  const state = useAppStore.getState();
  const student = state.students.find((item) => item.id === studentId);
  if (!student) return null;
  return analyzeStudent(
    student,
    state.mistakes.filter((item) => item.studentId === studentId),
    state.assignments.filter((item) => item.studentId === studentId),
    state.assessments.filter((item) => item.studentId === studentId),
  );
}

export function getStudentTrend(studentId: string): StudentTrendPoint[] {
  const state = useAppStore.getState();
  return lastNDays(7).map((date) => ({
    date: date.slice(5).replace("-", "/"),
    mistakes: state.mistakes.filter((item) => item.studentId === studentId && item.createdAt.startsWith(date)).length,
    assignments: state.assignments.filter((item) => item.studentId === studentId && item.date === date).length,
    assessments: state.assessments.filter((item) => item.studentId === studentId && item.date === date).length,
  }));
}

export function createGeneratedAssignmentDraft(studentId: string, subject: string, exerciseCount = 6) {
  const state = useAppStore.getState();
  const student = state.students.find((item) => item.id === studentId);
  if (!student) return null;
  return generateAssignmentDraft({
    student,
    mistakes: state.mistakes.filter((item) => item.studentId === studentId),
    assessments: state.assessments.filter((item) => item.studentId === studentId),
    subject,
    date: new Date().toISOString().slice(0, 10),
    exerciseCount,
  });
}

export function createGeneratedAssessmentDraft(studentId: string, subject: string, questionCount = 5) {
  const state = useAppStore.getState();
  const student = state.students.find((item) => item.id === studentId);
  if (!student) return null;
  const analysis = getStudentAnalysis(studentId);
  return generateAssessmentDraft({
    student,
    mistakes: state.mistakes.filter((item) => item.studentId === studentId),
    subject,
    knowledgePoints: analysis?.recommendedReviewPoints || student.weakKnowledgePoints,
    questionCount,
  });
}
