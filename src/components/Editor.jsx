import { useState } from "react";

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
}) {
  const [saved, setSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    if (content.trim()) {
      onSave();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDelete = () => {
    if (showConfirm) {
      onDelete();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <div className="w-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
      <div className="border-b border-stone-200 dark:border-stone-700 px-6 py-4 bg-stone-50 dark:bg-stone-800 flex justify-between items-center min-h-[73px]">
        <span className="text-sm text-stone-500 dark:text-stone-400 uppercase tracking-wider font-medium">
          {formatDate(date)}
        </span>
        <div className="flex gap-3 items-center">
          {saved && (
            <span className="text-sm text-stone-500 dark:text-stone-400">
              ✓ сохранено
            </span>
          )}
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
                    className="text-sm px-3 py-1 border border-stone-300 dark:border-stone-600"
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
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="запиши свои мысли..."
        className="w-full min-h-125 p-6 text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-900 resize-none focus:outline-none font-mono text-base leading-relaxed justify-text"
      />

      <div className="border-t border-stone-200 dark:border-stone-700 px-6 py-4 flex justify-between items-center bg-stone-50 dark:bg-stone-800">
        <div className="text-sm text-stone-400 dark:text-stone-500 font-mono">
          {content.length} символов
        </div>
        <button
          onClick={handleSave}
          disabled={!content.trim()}
          className={`
            px-5 py-2 text-base transition-colors font-medium
            ${
              content.trim()
                ? "bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-300"
                : "bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed"
            }
          `}
        >
          сохранить
        </button>
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
                onClick={onUndo}
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
