import { useMemo, useState, useEffect } from "react";

export function DateNav({ selectedDate, onSelect, entries }) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentDate(new Date());
      },
      60 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  const recentDates = useMemo(() => {
    const dates = [];
    const now = currentDate;
    for (let i = 0; i < 5; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  }, [currentDate]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (dateStr === today) return "сегодня";
    if (dateStr === yesterdayStr) return "вчера";

    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  };

  const hasEntry = (date) => entries.some((entry) => entry.date === date);

  const handleDateSelect = (dateStr) => {
    onSelect(dateStr);
    setShowCalendar(false);
  };

  const getMonthDates = () => {
    const now = new Date(selectedDate);
    const year = now.getFullYear();
    const month = now.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split("T")[0];
      days.push(dateStr);
    }

    return days;
  };

  const getFirstDayOffset = () => {
    const now = new Date(selectedDate);
    const year = now.getFullYear();
    const month = now.getMonth();
    return (new Date(year, month, 1).getDay() + 6) % 7;
  };

  return (
    <div className="w-full mb-10">
      <div className="flex gap-2 mb-4">
        <div className="flex gap-2 overflow-x-auto flex-1">
          {recentDates.map((date) => {
            const isSelected = selectedDate === date;
            const hasEntryForDate = hasEntry(date);

            return (
              <button
                key={date}
                onClick={() => onSelect(date)}
                className={`
                  px-5 py-2.5 text-base transition-all relative font-medium whitespace-nowrap
                  ${
                    isSelected
                      ? "bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900"
                      : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-700"
                  }
                `}
              >
                {formatDate(date)}
                {hasEntryForDate && (
                  <span
                    className={`
                    absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full
                    ${isSelected ? "bg-white dark:bg-stone-900" : "bg-stone-500 dark:bg-stone-400"}
                  `}
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="px-5 py-2.5 text-base border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors font-medium whitespace-nowrap"
        >
          📅
        </button>
      </div>

      {showCalendar && (
        <div className="border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
          <div className="border-b border-stone-200 dark:border-stone-700 p-4 flex justify-between items-center bg-stone-50 dark:bg-stone-800">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() - 1);
                onSelect(newDate.toISOString().split("T")[0]);
              }}
              className="px-3 py-1 border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              ←
            </button>
            <span className="text-base font-medium text-stone-800 dark:text-stone-200">
              {new Date(selectedDate).toLocaleDateString("ru-RU", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setMonth(newDate.getMonth() + 1);
                onSelect(newDate.toISOString().split("T")[0]);
              }}
              className="px-3 py-1 border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              →
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs text-stone-400 dark:text-stone-500 py-2 font-medium"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array(getFirstDayOffset())
                .fill(null)
                .map((_, i) => (
                  <div key={`empty-${i}`} className="p-2" />
                ))}

              {getMonthDates().map((dateStr) => {
                const date = new Date(dateStr);
                const isSelected = selectedDate === dateStr;
                const hasEntryForDate = hasEntry(dateStr);

                return (
                  <button
                    key={dateStr}
                    onClick={() => handleDateSelect(dateStr)}
                    className={`
                      p-2 text-center text-sm transition-all relative
                      ${
                        isSelected
                          ? "bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900"
                          : "text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                      }
                      ${hasEntryForDate && !isSelected ? "font-semibold" : ""}
                    `}
                  >
                    {date.getDate()}
                    {hasEntryForDate && (
                      <span
                        className={`
                        absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full
                        ${isSelected ? "bg-white dark:bg-stone-900" : "bg-stone-500 dark:bg-stone-400"}
                      `}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
