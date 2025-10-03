'use client'
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileText, Clock, BarChart3, X } from 'lucide-react';

interface SidebarProps {
  currentPage?: 'tests' | 'test' | 'results';
  isOpen?: boolean;
  onClose?: () => void;
  questionNavigation?: {
    totalQuestions: number;
    currentQuestion: number;
    answeredQuestions: number[];
    onQuestionSelect: (index: number) => void;
  };
}

export default function Sidebar({ 
  currentPage = 'tests', 
  isOpen = true, 
  onClose,
  questionNavigation 
}: SidebarProps) {
  const navItems = [
    { id: 'tests', label: 'Tests', icon: FileText, href: '/' },
    { id: 'test', label: 'Current Test', icon: Clock, href: '/test' },
    { id: 'results', label: 'Results', icon: BarChart3, href: '/results' }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 ease-in-out",
        "w-64 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Navigation</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <a href={item.href}>
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </a>
              </Button>
            );
          })}
        </nav>

        {/* Question Navigation for Test Page */}
        {questionNavigation && currentPage === 'test' && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: questionNavigation.totalQuestions }, (_, index) => {
                const isAnswered = questionNavigation.answeredQuestions.includes(index);
                const isCurrent = index === questionNavigation.currentQuestion;
                
                return (
                  <Button
                    key={index}
                    variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 text-xs",
                      isCurrent && "ring-2 ring-blue-500 ring-offset-1"
                    )}
                    onClick={() => questionNavigation.onQuestionSelect(index)}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>Answered:</span>
                <span>{questionNavigation.answeredQuestions.length}/{questionNavigation.totalQuestions}</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}