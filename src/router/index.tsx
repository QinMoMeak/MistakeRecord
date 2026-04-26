import { createHashRouter } from "react-router-dom";
import { App } from "@/App";
import { AssessmentEditorPage } from "@/pages/AssessmentEditorPage";
import { AssessmentsPage } from "@/pages/AssessmentsPage";
import { AssignmentEditorPage } from "@/pages/AssignmentEditorPage";
import { AssignmentsPage } from "@/pages/AssignmentsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ExercisesPage } from "@/pages/ExercisesPage";
import { MistakeDetailPage } from "@/pages/MistakeDetailPage";
import { MistakeEditorPage } from "@/pages/MistakeEditorPage";
import { MistakesPage } from "@/pages/MistakesPage";
import { StudentDetailPage } from "@/pages/StudentDetailPage";
import { StudentEditorPage } from "@/pages/StudentEditorPage";
import { StudentsPage } from "@/pages/StudentsPage";
import { TaxonomyPage } from "@/pages/TaxonomyPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "students", element: <StudentsPage /> },
      { path: "students/new", element: <StudentEditorPage /> },
      { path: "students/:id", element: <StudentDetailPage /> },
      { path: "students/:id/edit", element: <StudentEditorPage /> },
      { path: "mistakes", element: <MistakesPage /> },
      { path: "mistakes/new", element: <MistakeEditorPage /> },
      { path: "mistakes/:id", element: <MistakeDetailPage /> },
      { path: "mistakes/:id/edit", element: <MistakeEditorPage /> },
      { path: "mistakes/:id/exercises", element: <ExercisesPage /> },
      { path: "assignments", element: <AssignmentsPage /> },
      { path: "assignments/new", element: <AssignmentEditorPage /> },
      { path: "assignments/:id", element: <AssignmentEditorPage /> },
      { path: "assessments", element: <AssessmentsPage /> },
      { path: "assessments/new", element: <AssessmentEditorPage /> },
      { path: "assessments/:id", element: <AssessmentEditorPage /> },
      { path: "taxonomy", element: <TaxonomyPage /> },
    ],
  },
]);
