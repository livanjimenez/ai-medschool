import { Badge } from '@/components/ui/badge';

const SUBJECT_STYLES: Record<string, string> = {
  Biology:
    'bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/20',
  Biochemistry:
    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
  'General Chemistry':
    'bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/20',
  'Organic Chemistry':
    'bg-violet-500/15 text-violet-400 border-violet-500/30 hover:bg-violet-500/20',
  Physics:
    'bg-orange-500/15 text-orange-400 border-orange-500/30 hover:bg-orange-500/20',
  CARS: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20',
  'Psychology/Sociology':
    'bg-pink-500/15 text-pink-400 border-pink-500/30 hover:bg-pink-500/20',
};

const FALLBACK_STYLE =
  'bg-zinc-500/15 text-zinc-400 border-zinc-500/30 hover:bg-zinc-500/20';

interface SubjectBadgeProps {
  subject: string;
}

export default function SubjectBadge({ subject }: SubjectBadgeProps) {
  const style = SUBJECT_STYLES[subject] ?? FALLBACK_STYLE;
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium px-2 py-0.5 ${style}`}
    >
      {subject}
    </Badge>
  );
}
