import { Quiz, QuizDetails, QuizFormData } from '@/types/quiz';

export async function fetchQuizzes(): Promise<Quiz[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch quizzes: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch error:', error.message);
      throw new Error('Failed to fetch quizzes');
    }

    throw new Error('An unknown error occurred');
  }
}

export async function deleteQuiz(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error('Failed to delete quiz');
  }

  return await res.json();
}

export async function createQuiz(data: QuizFormData): Promise<QuizDetails> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create quiz');
    }

    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch error:', error.message);
      throw new Error('Failed to create quiz');
    }

    throw new Error('An unknown error occurred');
  }
}

export async function fetchQuizById(id: string): Promise<QuizDetails> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch quizzes: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Fetch error:', error.message);
      throw new Error('Failed to fetch quizzes');
    }

    throw new Error('An unknown error occurred');
  }
}
