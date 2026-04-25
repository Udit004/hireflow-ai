export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType = "mcq" | "code" | "scenario";

export interface TestGenerationRequest {
  job_description: string;
  role_title: string;
  question_count: number;
  difficulty: Difficulty;
}

export interface TestQuestion {
  question_type: QuestionType;
  question: string;
  options: string[] | null;
  expected_answer: string;
  difficulty: Difficulty;
}

export interface TestGenerationResponse {
  role_title: string;
  summary: string;
  total_questions: number;
  questions: TestQuestion[];
}

export const DEFAULT_FORM_STATE: TestGenerationRequest = {
  job_description:
    "We are hiring a backend engineer who can build secure FastAPI services, work with APIs, and reason about scalable systems.",
  role_title: "Backend Engineer",
  question_count: 10,
  difficulty: "medium",
};
