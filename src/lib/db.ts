import Dexie, { type Table } from "dexie";
import type {
  Assessment,
  DailyAssignment,
  ImageAsset,
  KnowledgePoint,
  MistakeRecord,
  StudentProfile,
  Tag,
} from "@/types/models";

export class MistakeDB extends Dexie {
  students!: Table<StudentProfile, string>;
  mistakes!: Table<MistakeRecord, string>;
  assignments!: Table<DailyAssignment, string>;
  assessments!: Table<Assessment, string>;
  tags!: Table<Tag, string>;
  knowledgePoints!: Table<KnowledgePoint, string>;
  images!: Table<ImageAsset, string>;

  constructor() {
    super("mistake-record-db");

    this.version(2).stores({
      students: "id, name, grade, createdAt, updatedAt",
      mistakes:
        "id, studentId, subject, masteryStatus, createdAt, updatedAt, lastReviewedAt, sourceScene, errorType, *tags, *knowledgePoints",
      assignments: "id, studentId, date, subject, status, updatedAt, *targetKnowledgePoints, *relatedMistakeIds",
      assessments: "id, studentId, date, subject, updatedAt, *relatedMistakeIds",
      tags: "id, name",
      knowledgePoints: "id, name, subject",
      images: "id, createdAt, mimeType",
    });
  }
}

export const db = new MistakeDB();
