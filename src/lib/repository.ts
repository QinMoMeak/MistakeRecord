import { db } from "@/lib/db";
import {
  sampleAssessments,
  sampleAssignments,
  sampleImages,
  sampleKnowledgePoints,
  sampleMistakes,
  sampleStudents,
  sampleTags,
} from "@/data/sampleData";
import type {
  AppExportPayload,
  Assessment,
  DailyAssignment,
  ImageAsset,
  KnowledgePoint,
  MistakeRecord,
  StudentProfile,
  Tag,
} from "@/types/models";

export async function bootstrapDatabase() {
  const count = await db.students.count();
  if (count > 0) return;

  await db.transaction("rw", [db.students, db.mistakes, db.assignments, db.assessments, db.tags, db.knowledgePoints, db.images], async () => {
      await db.students.bulkPut(sampleStudents);
      await db.tags.bulkPut(sampleTags);
      await db.knowledgePoints.bulkPut(sampleKnowledgePoints);
      await db.images.bulkPut(sampleImages);
      await db.mistakes.bulkPut(sampleMistakes);
      await db.assignments.bulkPut(sampleAssignments);
      await db.assessments.bulkPut(sampleAssessments);
    });
}

export async function getAllData() {
  const [students, mistakes, assignments, assessments, tags, knowledgePoints, images] = await Promise.all([
    db.students.toArray(),
    db.mistakes.toArray(),
    db.assignments.toArray(),
    db.assessments.toArray(),
    db.tags.toArray(),
    db.knowledgePoints.toArray(),
    db.images.toArray(),
  ]);

  return { students, mistakes, assignments, assessments, tags, knowledgePoints, images };
}

export async function saveStudent(record: StudentProfile) {
  await db.students.put(record);
  return record;
}

export async function saveMistake(record: MistakeRecord) {
  await db.mistakes.put(record);
  return record;
}

export async function saveAssignment(record: DailyAssignment) {
  await db.assignments.put(record);
  return record;
}

export async function saveAssessment(record: Assessment) {
  await db.assessments.put(record);
  return record;
}

export async function deleteStudents(ids: string[]) {
  await db.transaction("rw", db.students, db.mistakes, db.assignments, db.assessments, async () => {
    await db.students.bulkDelete(ids);
    await Promise.all([
      db.mistakes.where("studentId").anyOf(ids).delete(),
      db.assignments.where("studentId").anyOf(ids).delete(),
      db.assessments.where("studentId").anyOf(ids).delete(),
    ]);
  });
}

export async function deleteMistakes(ids: string[]) {
  await db.mistakes.bulkDelete(ids);
}

export async function deleteAssignments(ids: string[]) {
  await db.assignments.bulkDelete(ids);
}

export async function deleteAssessments(ids: string[]) {
  await db.assessments.bulkDelete(ids);
}

export async function saveTag(tag: Tag) {
  await db.tags.put(tag);
}

export async function deleteTag(id: string) {
  await db.tags.delete(id);
}

export async function saveKnowledgePoint(item: KnowledgePoint) {
  await db.knowledgePoints.put(item);
}

export async function deleteKnowledgePoint(id: string) {
  await db.knowledgePoints.delete(id);
}

export async function saveImages(images: ImageAsset[]) {
  await db.images.bulkPut(images);
}

export async function getExportPayload(): Promise<AppExportPayload> {
  const snapshot = await getAllData();
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    ...snapshot,
  };
}

export async function importPayload(payload: AppExportPayload, mode: "merge" | "overwrite") {
  if (mode === "overwrite") {
    await db.transaction("rw", [db.students, db.mistakes, db.assignments, db.assessments, db.tags, db.knowledgePoints, db.images], async () => {
        await Promise.all([
          db.students.clear(),
          db.mistakes.clear(),
          db.assignments.clear(),
          db.assessments.clear(),
          db.tags.clear(),
          db.knowledgePoints.clear(),
          db.images.clear(),
        ]);

        await db.students.bulkPut(payload.students);
        await db.mistakes.bulkPut(payload.mistakes);
        await db.assignments.bulkPut(payload.assignments);
        await db.assessments.bulkPut(payload.assessments);
        await db.tags.bulkPut(payload.tags);
        await db.knowledgePoints.bulkPut(payload.knowledgePoints);
        await db.images.bulkPut(payload.images);
      });
    return;
  }

  await db.transaction("rw", [db.students, db.mistakes, db.assignments, db.assessments, db.tags, db.knowledgePoints, db.images], async () => {
      await db.students.bulkPut(payload.students);
      await db.mistakes.bulkPut(payload.mistakes);
      await db.assignments.bulkPut(payload.assignments);
      await db.assessments.bulkPut(payload.assessments);
      await db.tags.bulkPut(payload.tags);
      await db.knowledgePoints.bulkPut(payload.knowledgePoints);
      await db.images.bulkPut(payload.images);
    });
}
