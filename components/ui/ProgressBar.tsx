import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{label || 'Progress'}</span>
        <span>{current}/{total} ({percentage}%)</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}