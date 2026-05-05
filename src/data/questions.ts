import type { Question, Category } from '../types';

const categories: { name: Category; count: number }[] = [
  { name: 'CS', count: 50 },
  { name: 'Maths', count: 25 },
  { name: 'Aptitude', count: 20 },
  { name: 'English', count: 10 },
  { name: 'GK', count: 5 },
];

const generateQuestions = (): Question[] => {
  const allQuestions: Question[] = [];
  let idCounter = 1;

  categories.forEach((cat) => {
    for (let i = 1; i <= cat.count; i++) {
      allQuestions.push({
        id: `q${idCounter}`,
        category: cat.name,
        question: `Sample ${cat.name} Question ${i}: What is the correct answer for this conceptual problem related to ${cat.name}?`,
        options: [
          `Option A for ${cat.name} ${i}`,
          `Option B for ${cat.name} ${i}`,
          `Option C for ${cat.name} ${i}`,
          `Option D for ${cat.name} ${i}`,
        ],
        correctAnswer: Math.floor(Math.random() * 4),
      });
      idCounter++;
    }
  });

  return allQuestions;
};

export const questions: Question[] = generateQuestions();
