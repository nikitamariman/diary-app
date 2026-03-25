import { useState } from "react";

export function Auth({ onSignUp, onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = isLogin
      ? await onSignIn(email, password)
      : await onSignUp(email, password);

    if (result.error) {
      setMessage(result.error.message);
    } else if (!isLogin && !result.error) {
      setMessage("Проверьте почту для подтверждения регистрации");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-stone-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-stone-800 dark:text-stone-100">
            мысли
          </h1>
          <p className="text-stone-400 dark:text-stone-500 text-sm mt-2">
            {isLogin ? "войдите в свой дневник" : "создайте новый аккаунт"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-stone-400"
            required
          />
          <input
            type="password"
            placeholder="пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:border-stone-400"
            required
          />

          {message && (
            <div className="p-3 text-sm text-center text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : isLogin ? "войти" : "зарегистрироваться"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-sm text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
        >
          {isLogin ? "нет аккаунта? создайте" : "уже есть аккаунт? войдите"}
        </button>
      </div>
    </div>
  );
}
