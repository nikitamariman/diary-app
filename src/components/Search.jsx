import { useState } from "react";

export function Search({ entries, onSelectDate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim()) {
      const filtered = entries.filter((entry) =>
        entry.content?.toLowerCase().includes(value.toLowerCase()),
      );
      setResults(filtered.slice(0, 10));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (date) => {
    onSelectDate(date);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="🔍 поиск по записям..."
          className="w-full sm:w-64 px-4 py-2 text-sm border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500"
        />
        {query && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-lg z-20">
          {results.map((entry) => (
            <button
              key={entry.date}
              onClick={() => handleSelect(entry.date)}
              className="w-full text-left px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-700 border-b border-stone-100 dark:border-stone-700 last:border-0"
            >
              <div className="text-xs text-stone-400 dark:text-stone-500">
                {new Date(entry.date).toLocaleDateString("ru-RU")}
              </div>
              <div className="text-sm text-stone-700 dark:text-stone-300 truncate">
                {entry.content?.slice(0, 80)}...
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 px-4 py-2 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-sm">
          ничего не найдено
        </div>
      )}
    </div>
  );
}
