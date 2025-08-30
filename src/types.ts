export interface QuestionsResponse {
  [key: string]: string; // e.g., "q1": "What is the main type of data you want to store?"
}

export interface AnswersResponse {
  [key: string]: string[]; // e.g., "q1": ["Structured (tables, rows, columns)", "Semi-structured (JSON, flexible fields)", ...]
}

export interface Question {
  id: string;
  text: string;
  choices: string[];
}

export interface Answer {
  questionId: string;
  selectedChoices: string[];
}

export interface Recommendation {
  name: string;
  score: number;
  explanation: string;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  query_summary: string;
}
