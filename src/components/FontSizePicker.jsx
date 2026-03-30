import { useState } from "react";

const fontSizes = {
  small: { name: "Маленький", value: "text-sm", editor: "text-sm", px: "14px" },
  medium: {
    name: "Средний",
    value: "text-base",
    editor: "text-base",
    px: "16px",
  },
  large: { name: "Большой", value: "text-lg", editor: "text-lg", px: "18px" },
  xl: {
    name: "Очень большой",
    value: "text-xl",
    editor: "text-xl",
    px: "20px",
  },
};

export function FontSizePicker({ fontSize, onFontSizeChange }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
        title="Размер шрифта"
      >
        Aa
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-lg z-20">
          {Object.entries(fontSizes).map(([key, size]) => (
            <button
              key={key}
              onClick={() => {
                onFontSizeChange(key);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-700 ${
                fontSize === key
                  ? "bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                  : "text-stone-700 dark:text-stone-300"
              }`}
            >
              <span className={size.value}>{size.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
