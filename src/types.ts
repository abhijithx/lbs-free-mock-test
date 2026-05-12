export type Category = 'CS' | 'Maths' | 'Aptitude' | 'English' | 'GK';

export interface UserData {
  name: string;
  phone: string;
}

export interface Question {
  id: string;
  questionNumber: number;
  category: Category;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
}

export interface TestResult {
  userData: UserData;
  totalScore: number;
  totalQuestions: number;
  categoryScores: Record<Category, number>;
  categoryTotals: Record<Category, number>;
  answers: Record<string, number>;
  markedForReview: string[];
  timeTaken: number; // seconds taken
  createdAt: string; // ISO string for safe JSON serialization
}
