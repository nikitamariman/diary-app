export function Stats({ entries }) {
  const totalEntries = entries.filter((e) => e.content.trim()).length;

  const getStreak = () => {
    if (totalEntries === 0) return 0;

    const dates = entries
      .map((e) => e.date)
      .sort()
      .reverse();
    let streak = 0;
    const now = new Date();
    let currentDate = new Date(now);

    for (let i = 0; i < dates.length; i++) {
      const dateStr = currentDate.toISOString().split("T")[0];
      if (dates[i] === dateStr) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  return (
    <div className="grid grid-cols-2 gap-4 mt-8">
      <div className="border border-stone-200 dark:border-stone-700 p-4 bg-white dark:bg-stone-900">
        <div className="text-3xl font-light text-stone-800 dark:text-stone-100">
          {totalEntries}
        </div>
        <div className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-wider mt-1">
          записей
        </div>
      </div>
      <div className="border border-stone-200 dark:border-stone-700 p-4 bg-white dark:bg-stone-900">
        <div className="text-3xl font-light text-stone-800 dark:text-stone-100">
          {getStreak()}
        </div>
        <div className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-wider mt-1">
          дней подряд
        </div>
      </div>
    </div>
  );
}
