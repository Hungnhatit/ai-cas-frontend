'use client'
import { Button } from '@/components/ui/button';
import { Clock, User, Menu } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showTimer?: boolean;
  timeRemaining?: number;
  onMenuClick?: () => void;
}

export default function Header({ title = "Competency Assessment", showTimer, timeRemaining, onMenuClick }: HeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {showTimer && timeRemaining !== undefined && (
          <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-lg">
            <Clock className="h-4 w-4 text-red-600" />
            <span className="text-red-600 font-mono font-medium">
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 text-gray-600">
          <User className="h-4 w-4" />
          <span className="text-sm">Test Taker</span>
        </div>
      </div>
    </header>
  );
}