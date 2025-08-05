import { PrismaClient, QuestionType } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const quizzes = [
    {
      title: 'JavaScript Basics',
      questions: [
        {
          title: 'Is JavaScript a statically typed language?',
          type: QuestionType.BOOLEAN,
          options: [
            { text: 'True', isCorrect: false },
            { text: 'False', isCorrect: true },
          ],
        },
        {
          title: 'Name a JavaScript Frontend framework',
          type: QuestionType.INPUT,
          correctAnswer: 'Next.js',
        },
        {
          title: 'Which are JavaScript data types?',
          type: QuestionType.CHECKBOX,
          options: [
            { text: 'String', isCorrect: true },
            { text: 'Boolean', isCorrect: true },
            { text: 'ArrayList', isCorrect: false },
          ],
        },
      ],
    },
    {
      title: 'TypeScript Fundamentals',
      questions: [
        {
          title: 'Is TypeScript a superset of JavaScript?',
          type: QuestionType.BOOLEAN,
          options: [
            { text: 'True', isCorrect: true },
            { text: 'False', isCorrect: false },
          ],
        },
        {
          title: 'What keyword is used to define types in TypeScript?',
          type: QuestionType.INPUT,
          correctAnswer: 'type',
        },
        {
          title: 'Select the valid TypeScript types',
          type: QuestionType.CHECKBOX,
          options: [
            { text: 'string', isCorrect: true },
            { text: 'integer', isCorrect: false },
            { text: 'boolean', isCorrect: true },
            { text: 'number', isCorrect: true },
          ],
        },
      ],
    },
    {
      title: 'React Quiz',
      questions: [
        {
          title: 'Is React a frontend library?',
          type: QuestionType.BOOLEAN,
          options: [
            { text: 'True', isCorrect: true },
            { text: 'False', isCorrect: false },
          ],
        },
        {
          title: 'Name the React hook for managing state',
          type: QuestionType.INPUT,
          correctAnswer: 'useState',
        },
        {
          title: 'Which are valid React hooks?',
          type: QuestionType.CHECKBOX,
          options: [
            { text: 'useState', isCorrect: true },
            { text: 'useFetch', isCorrect: false },
            { text: 'useEffect', isCorrect: true },
            { text: 'useReducer', isCorrect: true },
          ],
        },
      ],
    },
  ];

  for (const quizData of quizzes) {
    await prisma.quiz.create({
      data: {
        title: quizData.title,
        questions: {
          create: quizData.questions.map((q) => ({
            title: q.title,
            type: q.type,
            correctAnswer: q.correctAnswer,
            options: q.options
              ? {
                  create: q.options,
                }
              : undefined,
          })),
        },
      },
    });
  }

  console.log('Seed completed with multiple quizzes.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
