import { useState, useRef, useEffect } from "react";
import { Search } from "./Search";

const fontSizes = {
  small: { name: "Маленький", value: "14px" },
  medium: { name: "Средний", value: "16px" },
  large: { name: "Большой", value: "18px" },
  xl: { name: "Очень большой", value: "20px" },
};

export function Header({
  isDark,
  onToggleTheme,
  user,
  onSignOut,
  onExport,
  entries,
  onSelectDate,
  colorScheme,
  onColorSchemeChange,
  colorSchemes,
  fontSize,
  onFontSizeChange,
}) {
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isFontOpen, setIsFontOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const colorRef = useRef(null);
  const fontRef = useRef(null);

  const handleColorClick = () => {
    setIsColorOpen(!isColorOpen);
    setIsFontOpen(false);
  };

  const handleFontClick = () => {
    setIsFontOpen(!isFontOpen);
    setIsColorOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorRef.current && !colorRef.current.contains(event.target)) {
        setIsColorOpen(false);
      }
      if (fontRef.current && !fontRef.current.contains(event.target)) {
        setIsFontOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full border-b border-stone-200 dark:border-stone-700 pb-8 mb-10">
      {/* Десктопная версия */}
      <div className="hidden sm:flex justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-light text-stone-800 dark:text-stone-100 tracking-tight">
            мысли
          </h1>
          <p className="text-stone-400 dark:text-stone-500 text-sm mt-2">
            {user?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Search entries={entries} onSelectDate={onSelectDate} />
          <button
            onClick={onExport}
            className="px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
            title="Экспорт в Markdown"
          >
            📥
          </button>

          <div className="relative" ref={fontRef}>
            <button
              onClick={handleFontClick}
              className="px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
              title="Размер шрифта"
            >
              Aa
            </button>
            {isFontOpen && (
              <div className="absolute right-0 mt-2 w-40 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-lg z-20">
                {Object.entries(fontSizes).map(([key, size]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onFontSizeChange(key);
                      setIsFontOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-stone-100 dark:hover:bg-stone-700 ${
                      fontSize === key
                        ? "bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                        : "text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    <span style={{ fontSize: size.value }}>{size.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={colorRef}>
            <button
              onClick={handleColorClick}
              className="px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
              title="Цветовая схема"
            >
              🎨
            </button>
            {isColorOpen && (
              <div className="absolute right-0 mt-2 w-48 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 shadow-lg z-20">
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onColorSchemeChange(key);
                      setIsColorOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-2 ${
                      colorScheme === key
                        ? "bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                        : "text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 border ${scheme.card} ${scheme.border}`}
                    />
                    {scheme.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onToggleTheme}
            className="p-2 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={isDark ? "Светлая тема" : "Тёмная тема"}
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
          <button
            onClick={onSignOut}
            className="px-4 py-2 text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
            title="Выйти"
          >
            🚪
          </button>
        </div>
      </div>

      {/* Мобильная версия */}
      <div className="sm:hidden">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-light text-stone-800 dark:text-stone-100 tracking-tight">
              мысли
            </h1>
            <p className="text-stone-400 dark:text-stone-500 text-xs mt-1">
              {user?.email}
            </p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 border border-stone-200 dark:border-stone-700"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-5 h-5 text-stone-800 dark:text-stone-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-stone-800 dark:text-stone-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="flex flex-col gap-2 mb-4">
            <Search entries={entries} onSelectDate={onSelectDate} />
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={onExport}
                className="px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
              >
                📥 Экспорт
              </button>
              <div ref={fontRef}>
                <button
                  onClick={handleFontClick}
                  className="px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
                >
                  Aa
                </button>
                {isFontOpen && (
                  <div className="w-full flex flex-wrap gap-1 justify-center mt-2">
                    {Object.entries(fontSizes).map(([key, size]) => (
                      <button
                        key={key}
                        onClick={() => {
                          onFontSizeChange(key);
                          setIsFontOpen(false);
                        }}
                        className={`px-3 py-1 text-sm border border-stone-200 dark:border-stone-700 ${
                          fontSize === key
                            ? "bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900"
                            : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400"
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div ref={colorRef}>
                <button
                  onClick={handleColorClick}
                  className="px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
                >
                  🎨 Цвет
                </button>
                {isColorOpen && (
                  <div className="w-full flex flex-wrap gap-1 justify-center mt-2">
                    {Object.entries(colorSchemes).map(([key, scheme]) => (
                      <button
                        key={key}
                        onClick={() => {
                          onColorSchemeChange(key);
                          setIsColorOpen(false);
                        }}
                        className={`px-3 py-1 text-sm border border-stone-200 dark:border-stone-700 ${
                          colorScheme === key
                            ? "bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900"
                            : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400"
                        }`}
                      >
                        {scheme.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={onToggleTheme}
                className="px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
              >
                {isDark ? "☀️ Светлая" : "🌙 Тёмная"}
              </button>
              <button
                onClick={onSignOut}
                className="px-3 py-2 text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-400"
              >
                🚪 Выйти
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
