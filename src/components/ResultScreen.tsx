import { RotateCcw, Trophy, Target, TrendingUp, CheckCircle, XCircle } from "lucide-react";

interface ResultScreenProps {
  score: number;
  total: number;
  skipped: number;
  onRestart: () => void;
}

export default function ResultScreen({ score, total, skipped, onRestart }: ResultScreenProps) {
  const answered = total - skipped;
  const wrong = answered - score;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const { label, color, bgColor, borderColor, barColor } = getGrade(percentage);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Score card */}
      <div className={`rounded-2xl border-2 ${borderColor} ${bgColor} p-8 text-center mb-5`}>
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${barColor} bg-opacity-10`}>
            <Trophy size={28} className={color} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-1">{label}</h2>
        <p className="text-slate-500 text-sm mb-6">Here's how you performed</p>

        {/* Big score */}
        <div className="flex items-end justify-center gap-1 mb-2">
          <span className={`text-6xl font-black ${color}`}>{score}</span>
          <span className="text-2xl text-slate-400 font-semibold mb-2">/{total}</span>
        </div>
        <div className="text-slate-500 text-sm mb-6">{percentage}% Score</div>

        {/* Percentage bar */}
        <div className="w-full bg-white rounded-full h-3 border border-slate-100 overflow-hidden mb-6">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 border border-slate-100">
            <div className="flex justify-center mb-1">
              <CheckCircle size={18} className="text-emerald-500" />
            </div>
            <div className="text-xl font-bold text-slate-800">{score}</div>
            <div className="text-xs text-slate-400 font-medium">Correct</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-100">
            <div className="flex justify-center mb-1">
              <XCircle size={18} className="text-red-400" />
            </div>
            <div className="text-xl font-bold text-slate-800">{wrong}</div>
            <div className="text-xs text-slate-400 font-medium">Wrong</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-100">
            <div className="flex justify-center mb-1">
              <Target size={18} className="text-amber-400" />
            </div>
            <div className="text-xl font-bold text-slate-800">{skipped}</div>
            <div className="text-xs text-slate-400 font-medium">Skipped</div>
          </div>
        </div>
      </div>

      {/* Performance message */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
        <div className="flex items-start gap-3">
          <TrendingUp size={18} className="text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Performance Insight</p>
            <p className="text-sm text-slate-500 leading-relaxed">{getInsight(percentage, skipped)}</p>
          </div>
        </div>
      </div>

      {/* Restart button */}
      <button
        onClick={onRestart}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <RotateCcw size={18} />
        Restart Test
      </button>
    </div>
  );
}

function getGrade(percentage: number) {
  if (percentage >= 90)
    return {
      label: "Excellent!",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      barColor: "bg-emerald-500",
    };
  if (percentage >= 70)
    return {
      label: "Good Job!",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      barColor: "bg-blue-500",
    };
  if (percentage >= 50)
    return {
      label: "Keep Practicing",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      barColor: "bg-amber-500",
    };
  return {
    label: "Needs Improvement",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    barColor: "bg-red-500",
  };
}

function getInsight(percentage: number, skipped: number): string {
  if (percentage >= 90) return "Outstanding performance! You have a strong grasp of the concepts. Keep up the excellent work.";
  if (percentage >= 70) {
    if (skipped > 0) return `Good score! You skipped ${skipped} question(s). Try answering all questions next time to push your score higher.`;
    return "Good performance! Review the questions you missed and revisit those concepts for a perfect score.";
  }
  if (percentage >= 50) return "You're on the right track. Focus on revising the weak areas and attempt this test again. Consistent practice will improve your score.";
  return "Don't be discouraged! Review the study material thoroughly and practice regularly. Each attempt helps you learn more.";
}
