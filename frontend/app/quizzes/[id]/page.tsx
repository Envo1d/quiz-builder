'use client';

import { fetchQuizById } from '@/services/quiz.service';
import { QuizDetails } from '@/types/quiz';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function QuizDetailsPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<QuizDetails | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await fetchQuizById(id as string);
        setQuiz(data);
      } catch {
        setError('Failed to load quiz details.');
      }
    };

    if (id) loadQuiz();
  }, [id]);

  if (error) {
    return (
      <div className="p-8 sm:p-12 max-w-4xl mx-auto">
        <p className="text-red-600 bg-red-100 p-4 rounded">{error}</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-8 sm:p-12 max-w-4xl mx-auto">
        <p className="text-gray-500">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="p-8 sm:p-12 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">{quiz.title}</h1>
        <button
          onClick={() => router.push('/quizzes')}
          className="text-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded hover:cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {quiz.questions.length === 0 ? (
        <p className="text-gray-600">No questions added yet.</p>
      ) : (
        <div className="space-y-6">
          {quiz.questions.map((q, index) => (
            <div key={q.id} className="border rounded-xl p-6 shadow">
              <h2 className="text-lg font-semibold mb-2">
                {index + 1}. {q.title}
              </h2>

              {q.type === 'BOOLEAN' && (
                <div>
                  <p className="text-gray-700 mb-2">Type: Boolean</p>
                  <ul className="list-disc pl-5 text-gray-700">
                    {q.options.map((opt) => (
                      <li key={opt.id}>
                        {opt.text}
                        {opt.isCorrect && (
                          <span className="ml-2 text-green-600 font-medium">✓ correct</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {q.type === 'INPUT' && (
                <div>
                  <p className="text-gray-700">Type: Input</p>
                  <p className="text-gray-700">
                    Correct answer: <span className="text-green-600">{q.correctAnswer}</span>
                  </p>
                </div>
              )}

              {q.type === 'CHECKBOX' && (
                <div>
                  <p className="text-gray-700 mb-2">Options:</p>
                  <ul className="list-disc pl-5 text-gray-700">
                    {q.options.map((opt) => (
                      <li key={opt.id}>
                        {opt.text}
                        {opt.isCorrect && (
                          <span className="ml-2 text-green-600 font-medium">✓ correct</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
