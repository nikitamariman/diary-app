import { useState, useEffect } from "react";

const fontSizes = {
  small: { name: "Маленький", value: "14px" },
  medium: { name: "Средний", value: "16px" },
  large: { name: "Большой", value: "18px" },
  xl: { name: "Очень большой", value: "20px" },
};

export function useFontSize() {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("font-size");
    return saved || "medium";
  });

  useEffect(() => {
    localStorage.setItem("font-size", fontSize);
  }, [fontSize]);

  const currentFontSize = fontSizes[fontSize];

  return { fontSize, setFontSize, currentFontSize, fontSizes };
}