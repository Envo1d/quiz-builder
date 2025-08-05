import z from 'zod';

export type Quiz = {
  id: string;
  title: string;
  question_count: number;
};

type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
};

type Question = {
  id: string;
  title: string;
  type: string;
  correctAnswer: string;
  quizId: string;
  options: Option[];
};

export type QuizDetails = {
  id: string;
  title: string;
  questions: Question[];
};

const optionSchema = z.object({
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean().optional(),
});

const questionSchema = z.object({
  title: z.string().min(1, 'Question title is required'),
  type: z.enum(['INPUT', 'CHECKBOX', 'BOOLEAN']),
  correctAnswer: z.string().optional(),
  options: z.array(optionSchema).optional(),
});

export const quizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  questions: z.array(questionSchema).min(1, 'Question is required'),
});

export type QuizFormData = z.infer<typeof quizSchema>;
