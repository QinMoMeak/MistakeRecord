import { uid } from "@/lib/helpers";
import type {
  Assessment,
  AssignmentExercise,
  DailyAssignment,
  ImageAsset,
  KnowledgePoint,
  MistakeRecord,
  StudentProfile,
  Tag,
} from "@/types/models";

const now = new Date();

function daysAgo(days: number, hour = 10) {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(hour, 20, 0, 0);
  return date.toISOString();
}

export const studentAId = "student-lin";
export const studentBId = "student-wen";

export const sampleStudents: StudentProfile[] = [
  {
    id: studentAId,
    name: "林知远",
    nickname: "小林",
    gender: "男",
    grade: "初二",
    school: "启明中学",
    className: "2班",
    currentScore: 86,
    targetScore: 100,
    subjectLevels: [
      { subject: "数学", score: 82, level: "一般", comment: "几何与方程需要持续回练" },
      { subject: "英语", score: 91, level: "良好", comment: "语法时态稳定，阅读细节题偶有丢分" },
    ],
    weakSubjects: ["数学"],
    strongSubjects: ["英语"],
    weakKnowledgePoints: ["三角形面积公式", "一次函数图像"],
    learningGoals: ["稳住数学计算准确率", "把月考总分提升到 100+"],
    learningStyle: "粗心马虎型",
    attentionNotes: "几何题经常漏写中间步骤，审题后需要先画图。",
    parentNotes: "晚间作业时间固定，适合 20 分钟一轮的短任务。",
    createdAt: daysAgo(40),
    updatedAt: daysAgo(1),
  },
  {
    id: studentBId,
    name: "温若溪",
    nickname: "若溪",
    gender: "女",
    grade: "高一",
    school: "星海高中",
    className: "7班",
    currentScore: 112,
    targetScore: 126,
    subjectLevels: [
      { subject: "英语", score: 118, level: "良好", comment: "阅读理解稳定，但长难句拆分偏慢" },
      { subject: "物理", score: 103, level: "一般", comment: "受力分析时容易条件漏看" },
    ],
    weakSubjects: ["物理"],
    strongSubjects: ["英语"],
    weakKnowledgePoints: ["牛顿第二定律", "受力分析"],
    learningGoals: ["提升物理中档题得分", "冲刺期中班级前十"],
    learningStyle: "思维提升型",
    attentionNotes: "适合先做基础判断题再做综合题。",
    parentNotes: "周末可安排一套短评测。",
    createdAt: daysAgo(25),
    updatedAt: daysAgo(2),
  },
];

export const sampleImages: ImageAsset[] = [
  {
    id: "img-sample-1",
    name: "triangle-demo.png",
    mimeType: "image/svg+xml",
    dataUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='480' viewBox='0 0 800 480'><rect width='800' height='480' fill='%23f8fafc'/><rect x='40' y='40' width='720' height='400' rx='28' fill='white' stroke='%23bfdbfe'/><path d='M210 340L400 120L590 340Z' fill='none' stroke='%233b82f6' stroke-width='8'/><path d='M320 235L400 340' stroke='%231d4ed8' stroke-width='6'/><text x='120' y='120' font-size='34' fill='%230f172a'>几何辅助线示意图</text><text x='140' y='390' font-size='28' fill='%2364758b'>已知两边与夹角，求面积</text></svg>",
    createdAt: daysAgo(0),
  },
  {
    id: "img-sample-2",
    name: "physics-demo.png",
    mimeType: "image/svg+xml",
    dataUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='480' viewBox='0 0 800 480'><rect width='800' height='480' fill='%23f8fafc'/><rect x='40' y='40' width='720' height='400' rx='28' fill='white' stroke='%23bae6fd'/><text x='90' y='110' font-size='34' fill='%230f172a'>Physics Force Analysis</text><text x='90' y='180' font-size='24' fill='%23475569'>A block is moving on a rough slope...</text><text x='90' y='240' font-size='24' fill='%23475569'>Find the acceleration and friction.</text><text x='90' y='320' font-size='24' fill='%23089681'>考点：受力分析 / 牛顿第二定律</text></svg>",
    createdAt: daysAgo(3),
  },
];

export const sampleTags: Tag[] = [
  { id: "tag-math", name: "数学", color: "#3b82f6" },
  { id: "tag-geometry", name: "几何", color: "#06b6d4" },
  { id: "tag-physics", name: "物理", color: "#14b8a6" },
  { id: "tag-review", name: "重点复习", color: "#ef4444" },
];

export const sampleKnowledgePoints: KnowledgePoint[] = [
  { id: "kp-triangle", name: "三角形面积公式", subject: "数学" },
  { id: "kp-function", name: "一次函数图像", subject: "数学" },
  { id: "kp-force", name: "受力分析", subject: "物理" },
  { id: "kp-newton", name: "牛顿第二定律", subject: "物理" },
];

export const sampleMistakes: MistakeRecord[] = [
  {
    id: uid("mistake"),
    studentId: studentAId,
    title: "三角形面积求解",
    subject: "数学",
    grade: "初二",
    tags: ["数学", "几何", "重点复习"],
    knowledgePoints: ["三角形面积公式"],
    problemText: "已知三角形两边长度分别为 6 和 8，夹角为 30°，求三角形面积。",
    wrongReason: "把面积公式误写成底乘高的一半，没有先判断题目给出的信息类型。",
    correctMethod: "使用 S = 1/2ab sinC，代入 6、8、30° 得 12。",
    answer: "12",
    tips: "先判断是底高型还是两边夹角型。",
    sourceConversation:
      "题目：已知三角形两边长度分别为6和8，夹角为30°，求面积。\n错因：忽略了 sinC。\n正确思路：使用 S = 1/2ab sinC。\n知识点：三角形面积公式。\n举一反三：改变夹角或改求第三边。",
    imageIds: ["img-sample-1"],
    masteryStatus: "reviewing",
    createdAt: daysAgo(0, 9),
    updatedAt: daysAgo(0, 11),
    lastReviewedAt: daysAgo(0, 18),
    derivedExercises: [],
    sourceType: "mixed",
    isStarred: true,
    homeworkName: "周四晚练",
    sourceScene: "daily_homework",
    difficulty: "medium",
    scoreLoss: 6,
    errorType: "知识点不会",
  },
  {
    id: uid("mistake"),
    studentId: studentAId,
    title: "一次函数图像判断",
    subject: "数学",
    grade: "初二",
    tags: ["数学"],
    knowledgePoints: ["一次函数图像"],
    problemText: "根据函数 y=2x-3 的图像判断与 x 轴交点坐标。",
    wrongReason: "计算交点时把 y=0 代入后移项符号看错。",
    correctMethod: "令 y=0，得 0=2x-3，解得 x=1.5，交点为 (1.5,0)。",
    answer: "(1.5, 0)",
    tips: "画图前先列方程，不要只凭直觉判断。",
    sourceConversation: "",
    imageIds: [],
    masteryStatus: "unmastered",
    createdAt: daysAgo(5, 15),
    updatedAt: daysAgo(2, 9),
    lastReviewedAt: daysAgo(2, 20),
    derivedExercises: [],
    sourceType: "conversation",
    isStarred: false,
    examName: "单元测验一",
    sourceScene: "quiz",
    difficulty: "easy",
    scoreLoss: 4,
    errorType: "计算错误",
  },
  {
    id: uid("mistake"),
    studentId: studentBId,
    title: "斜面受力分析",
    subject: "物理",
    grade: "高一",
    tags: ["物理", "重点复习"],
    knowledgePoints: ["受力分析", "牛顿第二定律"],
    problemText: "质量为 m 的物块沿粗糙斜面下滑，求加速度与摩擦力方向。",
    wrongReason: "漏掉支持力分解后的切向分量，且摩擦力方向判断依赖结论而不是运动趋势。",
    correctMethod: "先画受力图，再沿斜面和垂直斜面分解，用牛顿第二定律列式。",
    answer: "a=g(sinθ-μcosθ)",
    tips: "受力分析必须先定坐标轴，再分解。",
    sourceConversation:
      "原题：质量为m的物块沿粗糙斜面下滑，求加速度。\n错误原因：受力图不完整。\n正确解法：先列重力、支持力、摩擦力，再分解。\n知识点：受力分析、牛顿第二定律。",
    imageIds: ["img-sample-2"],
    masteryStatus: "unmastered",
    createdAt: daysAgo(3, 11),
    updatedAt: daysAgo(1, 13),
    lastReviewedAt: daysAgo(1, 20),
    derivedExercises: [],
    sourceType: "mixed",
    isStarred: true,
    examName: "周测物理",
    sourceScene: "exam",
    difficulty: "hard",
    scoreLoss: 8,
    errorType: "审题错误",
  },
];

export const sampleAssignments: DailyAssignment[] = [
  {
    id: uid("assignment"),
    studentId: studentAId,
    title: "林知远 4 月 24 日数学作业",
    date: now.toISOString().slice(0, 10),
    subject: "数学",
    targetKnowledgePoints: ["三角形面积公式", "一次函数图像"],
    exercises: [
      {
        id: uid("assign-ex"),
        type: "错题重练",
        prompt: "重新完成三角形面积题，并说明为什么要使用两边夹角公式。",
        answer: "因为题目直接给出了两边与夹角，适用 S = 1/2ab sinC。",
        hint: "先写公式，再代数值。",
        difficulty: "medium",
        knowledgePoints: ["三角形面积公式"],
      },
      {
        id: uid("assign-ex"),
        type: "巩固基础",
        prompt: "求函数 y=2x-3 与坐标轴交点，并判断增减性。",
        difficulty: "easy",
        knowledgePoints: ["一次函数图像"],
      },
    ] satisfies AssignmentExercise[],
    relatedMistakeIds: [],
    status: "assigned",
    summary: "先稳住基础，再补一次函数的计算准确率。",
    createdAt: daysAgo(0, 7),
    updatedAt: daysAgo(0, 8),
  },
];

export const sampleAssessments: Assessment[] = [
  {
    id: uid("assessment"),
    studentId: studentBId,
    title: "温若溪 物理薄弱点短评测",
    date: daysAgo(0, 19).slice(0, 10),
    subject: "物理",
    totalScore: 30,
    actualScore: 22,
    questions: [
      {
        id: uid("question"),
        prompt: "画出斜面下滑物块的受力图，并说明摩擦力方向。",
        knowledgePoints: ["受力分析"],
        difficulty: "medium",
        score: 10,
        studentScore: 6,
        answer: "重力、支持力、摩擦力，摩擦力沿斜面向上。",
        studentAnswer: "漏写支持力方向说明。",
        errorReason: "图像标注不完整。",
      },
      {
        id: uid("question"),
        prompt: "根据受力分解列出沿斜面的动力学方程。",
        knowledgePoints: ["牛顿第二定律"],
        difficulty: "hard",
        score: 20,
        studentScore: 16,
        answer: "mgsinθ-f=ma",
        studentAnswer: "mgsinθ+f=ma",
        errorReason: "摩擦力方向判断错误。",
      },
    ],
    relatedMistakeIds: [],
    analysisSummary: "受力图整体意识在进步，但对摩擦力方向仍不稳定。",
    createdAt: daysAgo(1, 18),
    updatedAt: daysAgo(1, 21),
  },
];
