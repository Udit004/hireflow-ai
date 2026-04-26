export type Difficulty = "easy" | "medium" | "hard";

export type QuestionType = "mcq" | "code" | "scenario";
export type TestStatus = "draft" | "published" | "archived";

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

export interface SavedTestResponse {
  id: string;
  created_by_uid: string;
  role_title: string;
  difficulty: Difficulty;
  status: TestStatus;
  question_count: number;
  job_description: string;
  summary: string;
  total_questions: number;
  questions: TestQuestion[];
  settings: Record<string, unknown>;
  public_slug: string | null;
  created_at: string;
  published_at: string | null;
}

export interface PublishTestResponse {
  test_id: string;
  status: TestStatus;
  public_slug: string;
  published_at: string;
  public_url: string;
}

export interface RecruiterAttemptListItem {
  attempt_id: string;
  test_id: string;
  candidate_email: string;
  score: number;
  started_at: string | null;
  submitted_at: string;
}

export interface PublicTestQuestion {
  question_type: QuestionType;
  question: string;
  options: string[] | null;
  difficulty: Difficulty;
}

export interface PublicTestResponse {
  test_id: string;
  role_title: string;
  difficulty: Difficulty;
  total_questions: number;
  questions: PublicTestQuestion[];
  settings: Record<string, unknown>;
}

export interface AttemptAnswer {
  question_index: number;
  answer: string;
}

export interface SubmitAttemptRequest {
  candidate_email: string;
  answers: AttemptAnswer[];
  started_at?: string;
}

export interface SubmitAttemptResponse {
  attempt_id: string;
  test_id: string;
  score: number;
  submitted_at: string;
}

export const DEFAULT_FORM_STATE: TestGenerationRequest = {
  job_description:
    "We are hiring a backend engineer who can build secure FastAPI services, work with APIs, and reason about scalable systems.",
  role_title: "Backend Engineer",
  question_count: 10,
  difficulty: "medium",
};
