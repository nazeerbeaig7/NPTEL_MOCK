import { useState } from "react";
import { BookOpen, Zap, ChevronRight, BarChart2 } from "lucide-react";
import { questions } from "./data/questions";
import QuizCard from "./components/QuizCard";
import ResultScreen from "./components/ResultScreen";

type AppState = "home" | "quiz" | "result";

export default function App() {
  const [appState, setAppState] = useState<AppState>("home");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [skipped, setSkipped] = useState(0);

  function startQuiz() {
    setCurrentQuestion(0);
    setScore(0);
    setSkipped(0);
    setAppState("quiz");
  }

  function handleAnswer(correct: boolean) {
    if (correct) setScore((s) => s + 1);
    goNext();
  }

  function handleSkip() {
    setSkipped((s) => s + 1);
    goNext();
  }

  function goNext() {
    const next = currentQuestion + 1;
    if (next >= questions.length) {
      setAppState("result");
    } else {
      setCurrentQuestion(next);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen size={15} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">NPTEL Mock Test</span>
          </div>
          {appState === "quiz" && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <BarChart2 size={14} className="text-blue-500" />
              <span>
                Score: <span className="text-blue-600">{score}</span>
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        {appState === "home" && <HomeScreen onStart={startQuiz} />}
        {appState === "quiz" && (
          <QuizCard
            key={currentQuestion}
            question={questions[currentQuestion]}
            questionIndex={currentQuestion}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onSkip={handleSkip}
          />
        )}
        {appState === "result" && (
          <ResultScreen
            score={score}
            total={questions.length}
            skipped={skipped}
            onRestart={startQuiz}
          />
        )}
      </main>

      <footer className="py-4 text-center text-xs text-slate-400">
        NPTEL Practice Platform &mdash; For educational use
      </footer>
    </div>
  );
}

function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="w-full max-w-lg mx-auto text-center">
      {/* Hero icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <BookOpen size={36} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
            <Zap size={12} className="text-white" />
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
        NPTEL Mock Test
      </h1>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
        Practice NPTEL course questions with instant feedback, timers, and detailed explanations.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Questions", value: questions.length },
          { label: "Timer", value: "120s" },
          { label: "Weeks", value: "1–5" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="text-2xl font-black text-blue-600 mb-0.5">{value}</div>
            <div className="text-xs text-slate-400 font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Features list */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8 text-left space-y-3">
        {[
          "Instant answer feedback with color highlights",
          "120-second countdown timer per question",
          "Skip questions you're unsure about",
          "Detailed explanations for every answer",
          "Final score with performance insights",
        ].map((feature) => (
          <div key={feature} className="flex items-center gap-2.5 text-sm text-slate-600">
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>
            {feature}
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 text-base"
      >
        Start Mock Test
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
