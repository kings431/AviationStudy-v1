export interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  _id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  students: number;
  price: string;
  level: string;
  quizzes: Quiz[];
}