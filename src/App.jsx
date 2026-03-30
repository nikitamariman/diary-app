import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useDiary } from "./hooks/useDiary";
import { useTheme } from "./hooks/useTheme";
import { useColorScheme } from "./hooks/useThemes";
import { useFontSize } from "./hooks/useFontSize";
import { Header } from "./components/Header";
import { DateNav } from "./components/DateNav";
import { Editor } from "./components/Editor";
import { Stats } from "./components/Stats";
import { Auth } from "./components/Auth";
import { getLocalDate } from "./utils/date";
import { useEditorContent } from "./hooks/useEditorContent";
import { InstallPWA } from "./components/InstallPWA";
import { Footer } from "./components/Footer";

function App() {
  const [selectedDate, setSelectedDate] = useState(getLocalDate);
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
  } = useDiary(user);
  const { isDark, toggleTheme } = useTheme();
  const { colorScheme, setColorScheme, scheme, colorSchemes } =
    useColorScheme();
  const { fontSize, setFontSize, currentFontSize } = useFontSize();
  const { editingContent, setEditingContent, handleUndo } = useEditorContent({
    selectedDate,
    getEntry,
    undoDelete,
  });

  const handleExportMarkdown = () => {
    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    let markdown = `# Дневник мыслей\n\n`;
    markdown += `**Пользователь:** ${user.email}\n`;
    markdown += `**Дата экспорта:** ${new Date().toLocaleString("ru-RU")}\n\n`;
    markdown += `---\n\n`;

    sortedEntries.forEach((entry) => {
      const date = new Date(entry.date);
      const formattedDate = date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      markdown += `## ${formattedDate}\n\n`;
      markdown += `${entry.content || "*пусто*"}\n\n`;
      markdown += `---\n\n`;
    });

    markdown += `\n*Всего записей: ${entries.length}*\n`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diary-export-${getLocalDate()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (authLoading) return <LoadingScreen text="загрузка..." />;
  if (!user) return <Auth onSignUp={signUp} onSignIn={signIn} />;
  if (diaryLoading) return <LoadingScreen text="загрузка записей..." />;

  return (
    <div
      className={`min-h-screen ${scheme.bg} ${scheme.darkBg} transition-colors`}
    >
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="w-full">
          <Header
            isDark={isDark}
            onToggleTheme={toggleTheme}
            user={user}
            onSignOut={signOut}
            onExport={handleExportMarkdown}
            entries={entries}
            onSelectDate={setSelectedDate}
            colorScheme={colorScheme}
            onColorSchemeChange={setColorScheme}
            colorSchemes={colorSchemes}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
          />
          <DateNav
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            entries={entries}
          />
          <Editor
            date={selectedDate}
            content={editingContent}
            onChange={setEditingContent}
            onSave={(content) => saveEntry(selectedDate, content)}
            onDelete={() =>
              deleteEntry(selectedDate).then(() => setEditingContent(""))
            }
            hasEntry={!!getEntry(selectedDate)}
            showUndo={showUndo}
            onUndo={handleUndo}
            undoTimeLeft={undoTimeLeft}
            fontSize={currentFontSize}
          />
          <Stats entries={entries} />
          <Footer />
          <InstallPWA />
        </div>
      </div>
    </div>
  );
}

const LoadingScreen = ({ text }) => (
  <div className="min-h-screen bg-white dark:bg-stone-950 flex items-center justify-center">
    <div className="text-stone-500">{text}</div>
  </div>
);

export default App;
