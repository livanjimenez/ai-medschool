import { FlaskConical, BookOpen, Brain, Atom } from 'lucide-react';

const PROMPTS = [
  {
    icon: FlaskConical,
    label: 'Biochemistry',
    text: 'Explain the steps of glycolysis and what is the net ATP yield?',
  },
  {
    icon: Atom,
    label: 'General Chemistry',
    text: "What is Le Chatelier's principle and how does it apply to equilibrium?",
  },
  {
    icon: Brain,
    label: 'Psych / Soc',
    text: 'What is the difference between classical and operant conditioning?',
  },
  {
    icon: BookOpen,
    label: 'CARS',
    text: 'What strategies should I use when approaching a CARS passage I find confusing?',
  },
];

interface StarterPromptsProps {
  onSelect: (prompt: string) => void;
}

export default function StarterPrompts({ onSelect }: StarterPromptsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-6 py-12 gap-8">
      {/* Hero */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-xl font-bold text-violet-400">M</span>
        </div>
        <h1 className="text-xl font-semibold text-zinc-100">
          MCAT Study Assistant
        </h1>
        <p className="text-sm text-zinc-500 max-w-sm">
          Ask any MCAT question or paste a problem. You can also attach an image
          of a practice question.
        </p>
      </div>

      {/* Starter cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {PROMPTS.map(({ icon: Icon, label, text }) => (
          <button
            key={label}
            onClick={() => onSelect(text)}
            className="group flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-600 hover:bg-zinc-800/70 p-4 text-left transition-colors"
          >
            <Icon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 mt-0.5 shrink-0 transition-colors" />
            <div>
              <p className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300 mb-1 transition-colors">
                {label}
              </p>
              <p className="text-xs text-zinc-500 group-hover:text-zinc-400 leading-relaxed transition-colors line-clamp-2">
                {text}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
