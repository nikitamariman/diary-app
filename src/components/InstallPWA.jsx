import { useState, useEffect } from "react";

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("Пользователь установил приложение");
        }
        setDeferredPrompt(null);
        setShowInstall(false);
      });
    }
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 px-6 py-3 shadow-lg flex items-center gap-4">
        <span className="text-sm">Установите приложение</span>
        <button
          onClick={handleInstall}
          className="text-sm underline hover:no-underline font-medium"
        >
          установить
        </button>
      </div>
    </div>
  );
}
