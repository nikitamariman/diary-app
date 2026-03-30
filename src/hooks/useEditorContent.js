/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from "react";

export function useEditorContent({ selectedDate, getEntry, undoDelete }) {
  const [editingContent, setEditingContent] = useState("");
  const isUndoingRef = useRef(false);

  useEffect(() => {
    if (!isUndoingRef.current) {
      const entry = getEntry(selectedDate);
      setEditingContent(entry ? entry.content : "");
    }
  }, [selectedDate, getEntry]);

  const handleUndo = async () => {
    const restored = await undoDelete();
    if (restored && restored.date === selectedDate) {
      setEditingContent(restored.content);
    } else {
      setTimeout(() => {
        const entry = getEntry(selectedDate);
        setEditingContent(entry ? entry.content : "");
      }, 100);
    }
  };

  return { editingContent, setEditingContent, handleUndo };
}