/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useDiary } from "./hooks/useDiary";
import { useTheme } from "./hooks/useTheme";
import { Header } from "./components/Header";
import { DateNav } from "./components/DateNav";
import { Editor } from "./components/Editor";
import { Stats } from "./components/Stats";
import { Auth } from "./components/Auth";

function App() {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const {
    entries,
    loading: diaryLoading,
    getEntry,
    saveEntry,
    deleteEntry,
    undoDelete,
    showUndo,
    undoTimeLeft,
    restoredDate,
  } = useDiary(user);
  const { isDark, toggleTheme } = useTheme();

  const [editingContent, setEditingContent] = useState("");

  useEffect(() => {
    const entry = getEntry(selectedDate);
    setEditingContent(entry ? entry.content : "");
  }, [selectedDate, entries]);

  useEffect(() => {
    if (restoredDate === selectedDate) {
      const entry = getEntry(selectedDate);
      setEditingContent(entry ? entry.content : "");
    }
  }, [restoredDate, selectedDate, getEntry]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSave = async () => {
    if (editingContent.trim()) {
      await saveEntry(selectedDate, editingContent);
    }
  };

  const handleDelete = async () => {
    await deleteEntry(selectedDate);
    setEditingContent("");
  };

  const handleUndo = async () => {
    await undoDelete();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-stone-950 flex items-center justify-center">
        <div className="text-stone-500">загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onSignUp={signUp} onSignIn={signIn} />;
  }

  if (diaryLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-stone-950 flex items-center justify-center">
        <div className="text-stone-500">загрузка записей...</div>
      </div>
    );
  }

  const currentEntry = getEntry(selectedDate);

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 transition-colors">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="w-full">
          <Header
            isDark={isDark}
            onToggleTheme={toggleTheme}
            user={user}
            onSignOut={signOut}
          />
          <DateNav
            selectedDate={selectedDate}
            onSelect={handleDateChange}
            entries={entries}
          />
          <Editor
            date={selectedDate}
            content={editingContent}
            onChange={setEditingContent}
            onSave={handleSave}
            onDelete={handleDelete}
            hasEntry={!!currentEntry}
            showUndo={showUndo}
            onUndo={handleUndo}
            undoTimeLeft={undoTimeLeft}
          />
          <Stats entries={entries} />
        </div>
      </div>
    </div>
  );
}

export default App;