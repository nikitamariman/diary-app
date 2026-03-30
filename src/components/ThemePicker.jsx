import { useState } from "react";

const themeColors = {
  light: "bg-white border-stone-200",
  dark: "bg-stone-900 border-stone-700",
  sepia: "bg-amber-100 border-amber-200",
  forest: "bg-emerald-100 border-emerald-200",
  ocean: "bg-blue-100 border-blue-200",
  lavender: "bg-purple-100 border-purple-200",
};

const themeNames = {
  light: "☀️ Светлая",
  dark: "🌙 Тёмная",
  sepia: "📜 Сепия",
  forest: "🌲 Лесная",
  ocean: "🌊 Океан",
  lavender: "🌸 Лаванда",
};

export function ThemePicker({ currentTheme, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
        title="Выбрать тему"
      >
        🎨
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-lg z-20">
          {Object.entries(themeNames).map(([key, name]) => (
            <button
              key={key}
              onClick={() => {
                onSelect(key);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-2 ${
                currentTheme === key
                  ? "bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                  : "text-stone-700 dark:text-stone-300"
              }`}
            >
              <div className={`w-4 h-4 border ${themeColors[key]}`} />
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
