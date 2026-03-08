/**
 * QuizSection — Multiple-choice quiz component for the Learn page.
 * Each quiz has 3-5 questions. Progress is stored in localStorage.
 * Shows a completion badge when all questions are answered correctly.
 */
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number; // index of correct answer
}

interface QuizSectionProps {
  sectionId: string;
  title: string;
  questions: QuizQuestion[];
}

export function QuizSection({ sectionId, title, questions }: QuizSectionProps) {
  const { lang } = useLanguage();
  const storageKey = `quiz_${sectionId}`;
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch { return {}; }
  });
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(answers));
  }, [answers, storageKey]);

  const correctCount = questions.filter((q, i) => answers[i] === q.correct).length;
  const allAnswered = Object.keys(answers).length === questions.length;
  const allCorrect = correctCount === questions.length;

  const handleAnswer = (qIndex: number, optIndex: number) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleCheck = () => setShowResults(true);
  const handleReset = () => { setAnswers({}); setShowResults(false); };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-xl border border-primary/20 bg-primary/[0.03] p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm flex items-center gap-2">
          📝 {title}
          {allCorrect && showResults && <span className="text-[10px] px-2 py-0.5 rounded-full bg-chart-2/20 text-chart-2 font-bold">✓ {lang === "de" ? "Bestanden" : "Passed"}</span>}
        </h4>
        {showResults && (
          <span className="text-xs text-muted-foreground">{correctCount}/{questions.length} {lang === "de" ? "richtig" : "correct"}</span>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={qi} className="space-y-2">
            <p className="text-sm font-medium">{qi + 1}. {q.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {q.options.map((opt, oi) => {
                const selected = answers[qi] === oi;
                const isCorrect = q.correct === oi;
                let cls = "text-left rounded-lg px-3 py-2 text-xs border transition-all ";
                if (showResults) {
                  if (isCorrect) cls += "border-chart-2/50 bg-chart-2/10 text-chart-2";
                  else if (selected && !isCorrect) cls += "border-destructive/50 bg-destructive/10 text-destructive";
                  else cls += "border-border/40 text-muted-foreground";
                } else {
                  cls += selected ? "border-primary bg-primary/10 text-primary font-medium" : "border-border/40 text-muted-foreground hover:border-primary/30 hover:bg-primary/5";
                }
                return (
                  <button key={oi} onClick={() => handleAnswer(qi, oi)} className={cls}>
                    <span className="flex items-center gap-2">
                      {showResults && isCorrect && <CheckCircle className="h-3.5 w-3.5 shrink-0" />}
                      {showResults && selected && !isCorrect && <XCircle className="h-3.5 w-3.5 shrink-0" />}
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        {!showResults ? (
          <Button onClick={handleCheck} disabled={!allAnswered} size="sm" className="gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" />{lang === "de" ? "Antworten prüfen" : "Check Answers"}
          </Button>
        ) : (
          <Button onClick={handleReset} variant="outline" size="sm" className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />{lang === "de" ? "Nochmal versuchen" : "Try Again"}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
