import Link from 'next/link';

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="row-start-1 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">QUIZ BUILDER</h1>
      </header>

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/quizzes"
            className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition text-lg font-medium"
          >
            All Quizzes
          </Link>
          <Link
            href="/create"
            className="px-6 py-3 rounded-full border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition text-lg font-medium"
          >
            Create Quiz
          </Link>
        </div>
      </main>
    </div>
  );
}
