export function Header({ isDark, onToggleTheme, user, onSignOut }) {
  return (
    <div className="w-full border-b border-stone-200 dark:border-stone-700 pb-8 mb-10 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-light text-stone-800 dark:text-stone-100 tracking-tight">
          мысли
        </h1>
        <p className="text-stone-400 dark:text-stone-500 text-sm mt-2">
          {user?.email}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSignOut}
          className="px-4 py-2 text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
        >
          выйти
        </button>
        <button
          onClick={onToggleTheme}
          className="p-2 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          {isDark ? (
            <svg
              className="w-5 h-5 text-stone-600 dark:text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-stone-600 dark:text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
