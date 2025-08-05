'use client';

import { QuizCard } from '@/components/QuizCard';
import { deleteQuiz, fetchQuizzes } from '@/services/quiz.service';
import { Quiz } from '@/types/quiz';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  const loadQuizzes = async () => {
    try {
      const data = await fetchQuizzes();
      setQuizzes(data);
    } catch {
      setError('Failed to load quizzes');
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch {
      alert('Failed to delete quiz');
    }
  };

  return (
    <div className="p-8 sm:p-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">All Quizzes</h1>
        <button
          onClick={() => router.push('/')}
          className="text-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded hover:cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded">Failed to load quizzes: {error}</p>
      )}
      {quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} {...quiz} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
