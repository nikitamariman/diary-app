/* eslint-disable react-hooks/refs */
import { useState, useRef, useEffect } from "react";

export function Editor({
  date,
  content,
  onChange,
  onSave,
  onDelete,
  hasEntry,
  showUndo,
  onUndo,
  undoTimeLeft,
  fontSize,
}) {
  const [saved, setSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [isAutosave, setIsAutosave] = useState(() => {
    try {
      const savedStatus = localStorage.getItem("diary_autosave");
      return savedStatus !== null ? JSON.parse(savedStatus) : true;
    } catch {
      return true;
    }
  });

  const timeoutRef = useRef(null);
  const lastSavedContent = useRef(content);
  const prevDateRef = useRef(date);

  useEffect(() => {
    localStorage.setItem("diary_autosave", JSON.stringify(isAutosave));
  }, [isAutosave]);

  if (prevDateRef.current !== date) {
    lastSavedContent.current = content;
    prevDateRef.current = date;
    setIsDirty(false);
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleKeyDown = (evt) => {
    if (evt.ctrlKey && evt.key === "Enter") {
      handleSave();
    }
  };

  const handleSave = () => {
    if (content.trim() && isDirty) {
      onSave(content);
      lastSavedContent.current = content;
      setIsDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleChange = (newContent) => {
    onChange(newContent);
    setIsDirty(newContent !== lastSavedContent.current);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isAutosave) {
      timeoutRef.current = setTimeout(() => {
        if (newContent.trim() && newContent !== lastSavedContent.current) {
          onSave(newContent);
          lastSavedContent.current = newContent;
          setIsDirty(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      }, 15000);
    }
  };

  const handleDelete = () => {
    if (showConfirm) {
      onDelete();
      setShowConfirm(false);
      lastSavedContent.current = "";
      setIsDirty(false);
    } else {
      setShowConfirm(true);
    }
  };

  const handleUndo = () => {
    onUndo();
    setTimeout(() => {
      lastSavedContent.current = content;
      setIsDirty(false);
    }, 50);
  };

  return (
    <div className="w-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
      <div className="border-b border-stone-200 dark:border-stone-700 px-6 py-4 bg-stone-50 dark:bg-stone-800 flex justify-between items-center min-h-[73px]">
        <span className="text-sm text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
          {formatDate(date)}
        </span>
        <div className="flex gap-3 items-center">
          {hasEntry && !showUndo && (
            <div className="flex gap-2 items-center">
              {showConfirm ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="text-sm px-3 py-1 bg-red-600 text-white"
                  >
                    да
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="text-sm px-3 py-1 border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700"
                  >
                    нет
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleDelete}
                  className="text-sm text-stone-400 dark:text-stone-500 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                >
                  удалить
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="запиши свои мысли..."
        style={{ fontSize: fontSize?.value || "16px" }}
        className="w-full min-h-125 p-6 text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-900 resize-none focus:outline-none font-mono leading-relaxed justify-text"
      />

      <div className="border-t border-stone-200 dark:border-stone-700 px-6 py-4 flex justify-between items-center bg-stone-50 dark:bg-stone-800">
        <div className="flex gap-6 items-center">
          <div className="text-sm text-stone-400 dark:text-stone-500 font-mono">
            {content.length} символов
          </div>
          <div className="w-32">
            {isDirty ? (
              <div className="text-xs text-amber-600 dark:text-amber-500 whitespace-nowrap">
                ● не сохранено
              </div>
            ) : (
              saved && (
                <div className="text-xs text-green-600 dark:text-green-500 whitespace-nowrap">
                  ✓ сохранено
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <div className="w-24 text-right">
            <button
              onClick={() => setIsAutosave(!isAutosave)}
              className={`text-[11px] uppercase tracking-widest font-bold transition-colors ${
                isAutosave
                  ? "text-green-600 dark:text-green-500 hover:text-green-700"
                  : "text-stone-400 dark:text-stone-500 hover:text-stone-600"
              }`}
            >
              авто: {isAutosave ? "вкл" : "выкл"}
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={!content.trim() || !isDirty}
            className={`
              px-5 py-2 text-base transition-colors font-medium
              ${
                content.trim() && isDirty
                  ? "bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-300"
                  : "bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed opacity-50"
              }
            `}
          >
            сохранить
          </button>
        </div>
      </div>

      {showUndo && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 px-6 py-3 shadow-lg flex items-center gap-4">
            <span className="text-sm">запись удалена</span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center">
                <span className="text-sm font-mono font-medium">
                  {undoTimeLeft}
                </span>
              </div>
              <button
                onClick={handleUndo}
                className="text-sm underline hover:no-underline font-medium"
              >
                отменить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
