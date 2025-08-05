import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface QuizCardProps {
  id: string;
  title: string;
  question_count: number;
  onDelete: (id: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ id, title, question_count, onDelete }) => {
  return (
    <div className="rounded-xl border p-6 shadow">
      <div className="flex justify-between items-start mb-2">
        <Link href={`/quizzes/${id}`} className="text-xl font-semibold hover:underline">
          {title}
        </Link>
        <button
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700 text-sm cursor-pointer mt-1"
          aria-label="Delete quiz"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400">
        {question_count} {question_count === 1 ? 'question' : 'questions'}
      </p>
    </div>
  );
};
