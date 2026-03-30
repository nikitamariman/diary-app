import { useState, useEffect } from "react";

const colorSchemes = {
  sepia: {
    name: "Сепия",
    bg: "bg-amber-50",
    darkBg: "dark:bg-amber-950",
    card: "bg-amber-100",
    border: "border-amber-200",
    text: "text-amber-900",
    textSecondary: "text-amber-700",
    button: "bg-amber-800",
  },
  forest: {
    name: "Лесная",
    bg: "bg-emerald-50",
    darkBg: "dark:bg-emerald-950",
    card: "bg-emerald-100",
    border: "border-emerald-200",
    text: "text-emerald-900",
    textSecondary: "text-emerald-700",
    button: "bg-emerald-800",
  },
  ocean: {
    name: "Океан",
    bg: "bg-blue-50",
    darkBg: "dark:bg-blue-950",
    card: "bg-blue-100",
    border: "border-blue-200",
    text: "text-blue-900",
    textSecondary: "text-blue-700",
    button: "bg-blue-800",
  },
  lavender: {
    name: "Лаванда",
    bg: "bg-purple-50",
    darkBg: "dark:bg-purple-950",
    card: "bg-purple-100",
    border: "border-purple-200",
    text: "text-purple-900",
    textSecondary: "text-purple-700",
    button: "bg-purple-800",
  },
  neutral: {
    name: "Нейтральная",
    bg: "bg-stone-50",
    darkBg: "dark:bg-stone-950",
    card: "bg-stone-100",
    border: "border-stone-200",
    text: "text-stone-800",
    textSecondary: "text-stone-600",
    button: "bg-stone-800",
  },
};

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState(() => {
    const saved = localStorage.getItem("color-scheme");
    return saved || "neutral";
  });

  useEffect(() => {
    localStorage.setItem("color-scheme", colorScheme);
  }, [colorScheme]);

  const scheme = colorSchemes[colorScheme];

  return { colorScheme, setColorScheme, scheme, colorSchemes };
}