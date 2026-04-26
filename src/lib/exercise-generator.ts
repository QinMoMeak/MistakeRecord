import { uid } from "@/lib/helpers";
import type { DerivedExercise, MistakeRecord, StudentProfile } from "@/types/models";

function makeExercise(
  mistake: MistakeRecord,
  title: string,
  prompt: string,
  difficulty: DerivedExercise["difficulty"],
  hint: string,
  answer: string,
): DerivedExercise {
  return {
    id: uid("exercise"),
    mistakeId: mistake.id,
    title,
    prompt,
    knowledgePoints: mistake.knowledgePoints,
    difficulty,
    hint,
    answer,
    createdAt: new Date().toISOString(),
    saved: false,
  };
}

export function generateDerivedExercises(mistake: MistakeRecord, student?: StudentProfile) {
  const knowledge = mistake.knowledgePoints[0] || "当前知识点";
  const studentHint = student ? `${student.grade}${student.name}` : "当前学生";

  if (mistake.subject === "数学") {
    return [
      makeExercise(
        mistake,
        "同类变式 1 · 条件替换",
        `面向${studentHint}，围绕“${mistake.title}”重新生成一道数字条件替换题，继续考察 ${knowledge}。`,
        "easy",
        "先回忆原题的核心公式，再逐项代入新条件。",
        `参考答案：仍然围绕 ${knowledge} 的基本公式，按步骤列式并验算。`,
      ),
      makeExercise(
        mistake,
        "同类变式 2 · 目标变化",
        `保留原题结构，但把求解目标替换成另一个相关量，让${studentHint}比较新旧解法差异。`,
        "medium",
        "先判断哪些中间量可以复用。",
        "参考答案：先复用原题中前半段推理，再补出新的目标求解步骤。",
      ),
      makeExercise(
        mistake,
        "同类变式 3 · 逆向思考",
        `生成一道更强调思维迁移的逆向题，让${studentHint}先判断条件是否充分，再决定列式方式。`,
        "hard",
        "先从结论反推需要的条件。",
        "参考答案：先写出结论成立的条件，再验证已知信息是否完整。",
      ),
    ];
  }

  if (mistake.subject === "英语") {
    return [
      makeExercise(
        mistake,
        "语法巩固练习",
        `根据${studentHint}的当前水平，围绕 ${knowledge} 生成 4 个句子改写题和 1 个选择题。`,
        "easy",
        "先锁定句子主干，再处理时态和从句结构。",
        "参考答案：关注时态、主谓一致和逻辑连接。",
      ),
      makeExercise(
        mistake,
        "阅读定位练习",
        `生成一段短文，继续考察 ${knowledge}，要求学生先定位再作答。`,
        "medium",
        "先圈关键词，再回文定位。",
        "参考答案：结合关键词和上下文完成判断。",
      ),
    ];
  }

  return [
    makeExercise(
      mistake,
      "练习建议卡",
      `围绕 ${knowledge} 再做 3 道不同表述方式的练习，并记录每题错因。`,
      "easy",
      "先复用原题思路，再比较新题差异。",
      "参考答案：完成后对照原错题总结变化点。",
    ),
  ];
}

