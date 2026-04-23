import { useEffect, useRef, useState } from "react";
import { Clock, SkipForward, BookOpen, ChevronRight } from "lucide-react";
import type { Question } from "../data/questions";

interface QuizCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (correct: boolean) => void;
  onSkip: () => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"];
const TIMER_SECONDS = 120;

export default function QuizCard({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  onSkip,
}: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [showExplanation, setShowExplanation] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const answered = selected !== null;
  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    setSelected(null);
    setTimeLeft(TIMER_SECONDS);
    setShowExplanation(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current!);
      clearTimeout(autoAdvanceRef.current!);
    };
  }, [question]);

  function handleTimeUp() {
    setSelected("__timeout__");
    autoAdvanceRef.current = setTimeout(() => onAnswer(false), 1500);
  }

  function handleSelect(optionIndex: number) {
    if (answered) return;
    clearInterval(timerRef.current!);

    const selectedLetter = OPTION_LABELS[optionIndex].toLowerCase();
    setSelected(selectedLetter);

    const correct = selectedLetter === question.answer;
    autoAdvanceRef.current = setTimeout(() => onAnswer(correct), 1500);
  }

  function getOptionStyle(optionIndex: number): string {
    const letter = OPTION_LABELS[optionIndex].toLowerCase();
    const base =
      "w-full text-left px-5 py-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 flex items-center gap-3 group";

    if (!answered) {
      return `${base} border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 hover:shadow-md cursor-pointer text-slate-700`;
    }

    if (letter === question.answer) {
      return `${base} border-emerald-400 bg-emerald-50 text-emerald-800 cursor-default`;
    }

    if (letter === selected) {
      return `${base} border-red-400 bg-red-50 text-red-800 cursor-default`;
    }

    return `${base} border-slate-100 bg-slate-50 text-slate-400 cursor-default`;
  }

  function getOptionBadgeStyle(optionIndex: number): string {
    const letter = OPTION_LABELS[optionIndex].toLowerCase();
    const base =
      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-200";

    if (!answered) {
      return `${base} bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600`;
    }

    if (letter === question.answer) {
      return `${base} bg-emerald-400 text-white`;
    }

    if (letter === selected) {
      return `${base} bg-red-400 text-white`;
    }

    return `${base} bg-slate-200 text-slate-400`;
  }

  const timerColor =
    timeLeft > 15 ? "text-slate-600" : timeLeft > 8 ? "text-amber-500" : "text-red-500";

  const timerBarColor =
    timeLeft > 15 ? "bg-blue-500" : timeLeft > 8 ? "bg-amber-400" : "bg-red-500";

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-blue-500" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Week {question.week}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 text-sm font-semibold ${timerColor}`}>
          <Clock size={15} />
          <span>{timeLeft}s</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-400 font-medium">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Timer bar */}
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
          <div
            className={`h-full ${timerBarColor} rounded-full transition-all duration-1000 ease-linear`}
            style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-4">
        <p className="text-slate-800 text-base font-semibold leading-relaxed mb-6">
          {question.q}
        </p>

        <div className="space-y-3">
          {question.options.map((option, i) => (
            <button
              key={i}
              className={getOptionStyle(i)}
              onClick={() => handleSelect(i)}
              disabled={answered}
            >
              <span className={getOptionBadgeStyle(i)}>{OPTION_LABELS[i]}</span>
              <span className="flex-1">{option}</span>
              {answered && OPTION_LABELS[i].toLowerCase() === question.answer && (
                <span className="text-emerald-500 text-xs font-bold ml-auto">Correct</span>
              )}
              {answered &&
                OPTION_LABELS[i].toLowerCase() === selected &&
                selected !== question.answer && (
                  <span className="text-red-400 text-xs font-bold ml-auto">Wrong</span>
                )}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {answered && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
          <button
            className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            onClick={() => setShowExplanation((v) => !v)}
          >
            <span>View Explanation</span>
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 ${showExplanation ? "rotate-90" : ""}`}
            />
          </button>
          {showExplanation && (
            <div className="px-5 pb-4 pt-1 border-t border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed">{question.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Skip button */}
      {!answered && (
        <div className="flex justify-end">
          <button
            onClick={onSkip}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
          >
            <SkipForward size={15} />
            Skip Question
          </button>
        </div>
      )}
    </div>
  );
}
