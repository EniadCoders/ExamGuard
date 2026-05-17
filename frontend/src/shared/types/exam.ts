export type QuestionType = "mcq" | "text" | "code";
export type Language = "java" | "python" | "cpp" | "javascript" | "c";

export const LANGUAGE_LABELS: Record<Language, string> = {
  java: "Java",
  python: "Python",
  cpp: "C++",
  javascript: "JavaScript",
  c: "C",
};

export const LANGUAGE_MONACO: Record<Language, string> = {
  java: "java",
  python: "python",
  cpp: "cpp",
  javascript: "javascript",
  c: "c",
};

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: number;
  type: "mcq";
  text: string;
  points: number;
  options: MCQOption[];
  /** Si `true`, la question accepte plusieurs réponses (cases à cocher). */
  multiple?: boolean;
}

export interface TextQuestion {
  id: number;
  type: "text";
  text: string;
  points: number;
  placeholder?: string;
  minWords?: number;
}

export interface CodeQuestion {
  id: number;
  type: "code";
  text: string;
  points: number;
  language: Language;
  starterCode: string;
}

export type Question = MCQQuestion | TextQuestion | CodeQuestion;

/** Une seule option pour un MCQ simple, un tableau pour un MCQ multi. */
export type MCQAnswer = string | string[];
export type TextAnswer = string;
export interface CodeAnswer {
  code: string;
  output: string;
  hasRun: boolean;
  isRunning: boolean;
  error?: string;
}

export type Answer = MCQAnswer | TextAnswer | CodeAnswer;

export const TYPE_LABELS: Record<QuestionType, string> = {
  mcq: "QCM",
  text: "Texte",
  code: "Code",
};

export const TYPE_COLORS: Record<QuestionType, string> = {
  mcq: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  text: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  code: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

export const TYPE_DOT: Record<QuestionType, string> = {
  mcq: "bg-blue-400",
  text: "bg-purple-400",
  code: "bg-cyan-400",
};
