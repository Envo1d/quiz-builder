'use client';

import { createQuiz } from '@/services/quiz.service';
import { QuizFormData, quizSchema } from '@/types/quiz';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

export default function CreateQuizPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    resetField,
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: QuizFormData) => {
    console.log('test');

    try {
      setError('');
      const res = await createQuiz(data);
      setSuccess('Quiz created successfully!');
      reset();
      setTimeout(() => router.push(`/quizzes/${res.id}`), 500);
    } catch (e) {
      setError((e as Error).message || 'Failed to create quiz');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Create Quiz</h1>
        <button
          onClick={() => router.push('/')}
          className="text-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded hover:cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-medium">Quiz Title</label>
          <input
            type="text"
            {...register('title')}
            className="w-full mt-1 p-2 border rounded bg-gray-800"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => {
            const type = watch(`questions.${index}.type`);

            return (
              <div key={field.id} className="border rounded p-4 relative">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm hover:cursor-pointer"
                >
                  ✕
                </button>

                <label className="block font-medium">Question Title</label>
                <input
                  type="text"
                  {...register(`questions.${index}.title`)}
                  className="w-full mt-1 p-2 border rounded mb-2 bg-gray-800"
                />
                {errors.questions?.[index]?.title && (
                  <p className="text-red-500 text-sm">{errors.questions[index]?.title?.message}</p>
                )}

                <label className="block font-medium mt-2">Type</label>
                <Controller
                  control={control}
                  name={`questions.${index}.type`}
                  render={({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => {
                        const newType = e.target.value;
                        field.onChange(newType);
                        resetField(`questions.${index}.options`, { defaultValue: [] });
                      }}
                      className="w-full mt-1 p-2 border rounded bg-gray-800"
                    >
                      <option value="INPUT">Input</option>
                      <option value="CHECKBOX">Checkbox</option>
                      <option value="BOOLEAN">Boolean</option>
                    </select>
                  )}
                />

                {type === 'INPUT' && (
                  <>
                    <label className="block font-medium mt-4">Correct Answer</label>
                    <input
                      type="text"
                      {...register(`questions.${index}.correctAnswer`)}
                      className="w-full mt-1 p-2 border rounded mb-2 bg-gray-800"
                    />
                  </>
                )}

                {type === 'BOOLEAN' && (
                  <Controller
                    name={`questions.${index}.options`}
                    control={control}
                    render={({ field: { value = [], onChange } }) => {
                      const handleSelectCorrect = (selectedIndex: number) => {
                        const updated = [0, 1].map((i) => ({
                          text: i === 0 ? 'True' : 'False',
                          isCorrect: i === selectedIndex,
                        }));
                        onChange(updated);
                      };

                      return (
                        <div className="space-y-2 mt-4">
                          <label className="block font-medium">Options</label>

                          {[0, 1].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                              <input
                                type="text"
                                readOnly
                                value={i === 0 ? 'True' : 'False'}
                                className="flex-1 p-2 border rounded"
                              />
                              <label className="flex items-center gap-1 text-sm">
                                <input
                                  type="checkbox"
                                  checked={value?.[i]?.isCorrect || false}
                                  onChange={() => handleSelectCorrect(i)}
                                />
                                Correct
                              </label>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                )}

                {type === 'CHECKBOX' && (
                  <Controller
                    control={control}
                    name={`questions.${index}.options`}
                    render={({ field: { value = [], onChange } }) => {
                      return (
                        <div className="mt-4 space-y-3">
                          <label className="block font-medium">Options</label>
                          {value.map((opt, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => {
                                  const updated = [...value];
                                  updated[optIndex].text = e.target.value;
                                  onChange(updated);
                                }}
                                placeholder="Option text"
                                className="flex-1 p-2 border rounded"
                              />
                              <label className="flex items-center gap-1 text-sm">
                                <input
                                  type="checkbox"
                                  checked={opt.isCorrect || false}
                                  onChange={(e) => {
                                    const updated = [...value];
                                    updated[optIndex].isCorrect = e.target.checked;
                                    onChange(updated);
                                  }}
                                />
                                Correct
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...value];
                                  updated.splice(optIndex, 1);
                                  onChange(updated);
                                }}
                                className="text-red-500"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => onChange([...value, { text: '', isCorrect: false }])}
                            className="text-blue-500 hover:underline text-sm hover:cursor-pointer"
                          >
                            + Add Option
                          </button>
                        </div>
                      );
                    }}
                  />
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={() =>
              append({
                title: '',
                type: 'INPUT',
              })
            }
            className="text-blue-600 hover:underline hover:cursor-pointer"
          >
            + Add Question
          </button>
        </div>

        {errors.title && <div>{errors.title.message}</div>}
        {errors.questions && <div>{errors.questions.message}</div>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 hover:cursor-pointer"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
}
