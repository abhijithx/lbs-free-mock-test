export type Category = 'CS' | 'Maths' | 'Aptitude' | 'English' | 'GK';

export interface UserData {
  name: string;
  phone: string;
}

export interface Question {
  id: string;
  category: Category;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TestResult {
  userData: UserData;
  totalScore: number;
  categoryScores: Record<Category, number>;
  answers: Record<string, number>;
  markedForReview: string[];
  createdAt: Date;
}
